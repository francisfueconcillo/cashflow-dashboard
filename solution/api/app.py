import os
from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

MONGODB_BASE_URL=os.environ.get('MONGODB_BASE_URL')
MONGODB_DB_NAME=os.environ.get('MONGODB_DB_NAME')

# Define the MongoDB connection
client = MongoClient(MONGODB_BASE_URL)
db = client[MONGODB_DB_NAME]
companies_collection = db['companies']
transactions_collection = db['transactions']



# GET /companies/?q=xxx
@app.route('/companies', methods=['GET'])
def get_companies():
    q = request.args.get('q')
    query = {}
    
    if q is not None:
        query = { 'name': { '$regex': q, '$options': "i" } }

    try:
        results = list(companies_collection.find(query).limit(50))

        # Convert results to JSON
        json_results = [{ 
            'id': str(doc['id']), 
            'name': doc['name'],
            'address': doc['address'],
            'value': str(doc['id']),
            'label':  doc['name'],
        } for doc in results]

        return jsonify(json_results)
    
    except Exception as e:
        return str(e)

# GET /totals/?currency=eur&company_id=xx
@app.route('/totals')
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
            }
        ]
        
        results = list(transactions_collection.aggregate(pipeline))

        json_results = [{ 
            'id': str(doc['_id']), 
            'total_debits': doc['total_debits'],
            'total_credits': doc['total_credits'],
            'profit_loss': round(doc['total_credits'] - doc['total_debits'], 4),
        } for doc in results]

        return jsonify(json_results)
        

    except Exception as e:
        return str(e)

# GET /transactions/?currency=eur&agg=day&&company=xx   (aggregation = day|month|country, default: month)
@app.route('/transactions')
def get_transactions():
    return 'Transactions'

@app.route('/profit-loss')
def get_profit_loss():
    return 'Profit Loss'

if __name__ == '__main__':
    app.run(host='0.0.0.0')



# API Endpoint
# 1. GET /companies, GET /companies/?q=xxx
# 2. GET /totals/?currency=eur&company=xx
# 3. GET /transactions/?currency=eur&agg=day&&company=xx   (aggregation = day|month|country, default: month)
# 3. GET /profit-loss/?currency=eur&company=xx  


