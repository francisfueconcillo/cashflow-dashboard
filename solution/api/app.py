import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

MONGODB_BASE_URL=os.environ.get('MONGODB_BASE_URL')
MONGODB_DB_NAME=os.environ.get('MONGODB_DB_NAME')

# Define the MongoDB connection
client = MongoClient(MONGODB_BASE_URL)
db = client[MONGODB_DB_NAME]
companies_collection = db['companies']
transactions_collection = db['transactions']



# GET /companies/?q=xxx
@app.route('/companies', methods=['GET', 'OPTIONS'])
def get_companies():
    q = request.args.get('q')
    query = {}
    
    

    try:
        if q is not None:
            query = { 'name': { '$regex': q, '$options': "i" } }
        else:
            query = {}

        results = list(companies_collection.find(query).limit(50).sort('name', 1))

        # Convert results to JSON
        json_results = [{ 
            'id': str(doc['id']), 
            'name': doc['name'],
            'address': doc['address'],
            'ibans': doc['ibans'],
            'value': str(doc['id']),
            'label':  doc['name'],
        } for doc in results]

        return jsonify(json_results)
    
    except Exception as e:
        return str(e)

# GET /totals/?currency=eur&company_id=xx
@app.route('/totals', methods=['GET', 'OPTIONS'])
def get_totals():
    currency = request.args.get('currency')
    company_id = request.args.get('company_id')

    if currency is None:
        currency = 'USD'
    
    try:
        if company_id is None:
            raise Exception('company_id parameter is required.')
        
        amount_field = '$amount_usd' if currency == 'USD' else '$amount_eur'
    
        pipeline = [
            { 
                '$match': { 
                    'company_id': { '$eq': int(company_id) }, 
                } 
            }, { 
                '$group': { 
                    '_id': int(company_id), 
                    'total_debits': { '$sum': { '$cond': [{ '$eq': ["$transaction_type", 'debit'] }, amount_field, 0] } },
                    'total_credits': { '$sum': { '$cond': [{ '$eq': ["$transaction_type", 'credit'] }, amount_field, 0] } },
                } 
            }, {
                '$addFields': {
                    'profit_loss': { "$subtract": ["$total_credits", "$total_debits"] },
                }
            }
        ]
        
        results = list(transactions_collection.aggregate(pipeline))
        return jsonify(results)
        

    except Exception as e:
        return str(e)

# GET /transactions/?currency=eur&agg=day&&company_id=xx   (aggregation = day|month|country, default: month)
@app.route('/transactions', methods=['GET', 'OPTIONS'])
def get_transactions():
    currency = request.args.get('currency')
    company_id = request.args.get('company_id')
    aggregate = request.args.get('agg')

    if currency is None:
        currency = 'USD'
    if aggregate is None:
        aggregate = 'month'

    try:
        if company_id is None:
            raise Exception('company_id parameter is required.')
        
        amount_field = '$amount_usd' if currency == 'USD' else '$amount_eur'

        if aggregate == 'month':
            pipeline = [
                { 
                    '$match': { 
                        'company_id': { '$eq': int(company_id) }, 
                    } 
                }, {
                    "$group": {
                        "_id": {
                            "year": { "$year": "$timestamp" },
                            "month": { "$month": "$timestamp" }
                        },
                        'total_debits': { '$sum': { '$cond': [{ '$eq': ["$transaction_type", 'debit'] }, amount_field, 0] } },
                        'total_credits': { '$sum': { '$cond': [{ '$eq': ["$transaction_type", 'credit'] }, amount_field, 0] } },
                    }
                }, {
                    "$project": {
                        "year": "$_id.year",
                        "month": "$_id.month",
                        'total_debits': 1,
                        'total_credits': 1,
                        "profit_loss": { "$subtract": ["$total_credits", "$total_debits"] }
                    }
                }, {
                    "$sort": { "year": 1, "month": 1 }
                }
            ]

        if aggregate == 'day':
            pipeline = [
                { 
                    '$match': { 
                        'company_id': { '$eq': int(company_id) }, 
                    } 
                }, {
                    "$group": {
                        "_id": {
                            "year": { "$year": "$timestamp" },
                            "month": { "$month": "$timestamp" },
                            "day": { "$dayOfMonth": "$timestamp" }
                        },
                        'total_debits': { '$sum': { '$cond': [{ '$eq': ["$transaction_type", 'debit'] }, amount_field, 0] } },
                        'total_credits': { '$sum': { '$cond': [{ '$eq': ["$transaction_type", 'credit'] }, amount_field, 0] } },
                    }
                }, {
                    "$project": {
                        "year": "$_id.year",
                        "month": "$_id.month",
                        "day": "$_id.day",
                        'total_debits': 1,
                        'total_credits': 1,
                        "profit_loss": { "$subtract": ["$total_credits", "$total_debits"] }
                    }
                }, {
                    "$sort": { "year": 1, "month": 1, "month": 1 }
                }
            ]

        if aggregate == 'country':
            pipeline = [{ 
                    '$match': { 
                        'company_id': { '$eq': int(company_id) }, 
                    } 
                }, {
                    '$group': {
                        '_id': '$country_code',
                        'transaction_count': { '$sum': 1 }  # Count number of transactions in each group
                    }
                }, {
                    "$project": {
                        "country": "$_id",
                        "transaction_count": 1,
                    }
                }, {
                    '$sort': {
                        'transaction_count': -1
                    }
                }
            ]

        results = list(transactions_collection.aggregate(pipeline))
        return jsonify(results)

    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(host='0.0.0.0')

# API Endpoint
# 1. GET /companies, GET /companies/?q=xxx
# 2. GET /totals/?currency=eur&company=xx
# 3. GET /transactions/?currency=eur&agg=day&&company=xx   (aggregation = day|month|country, default: month)


