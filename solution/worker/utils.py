import os
import requests

SYSTEMS_API_BASE_URL=os.environ.get('SYSTEMS_API_BASE_URL')

def get_request(endpoint, query_params=None):
    if query_params is None:
        url = '%s%s' % (SYSTEMS_API_BASE_URL, endpoint)
    else:
        url = '%s%s%s' % (SYSTEMS_API_BASE_URL, endpoint, query_params)
        
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful
        data = response.json()  # Parse the JSON response
        return data
    except requests.exceptions.Timeout as e:
        # Timeout error
        print("Request timed out!")
        raise e
    except requests.exceptions.HTTPError as e:
        # HTTP error
        print("HTTP error:", e)
        raise e
    except requests.exceptions.RequestException as e:
        # Other errors
        print("Error:", e)
        raise e
    
def save_last_record_processed(recordType, id, ts, process_collection):
    last_record_processed = {
        'type': recordType,
        'id': id,
        'timestamp': ts
    }
        
    process_collection.insert_one(last_record_processed)
    
def get_last_record_processed(recordType, process_collection):
    
    try:
        last_record = process_collection.find({'type': recordType}).sort('_id', -1).limit(1)
        for record in last_record:
            return record
        return None
    except Exception as e:
        return None
    

def get_last_exchange_rates(exchange_rates_collection):
    try:
        last_record = exchange_rates_collection.find({}).sort('_id', -1).limit(1)
        for record in last_record:
            return record['rates']
        return None
    except Exception as e:
        return None

def save_last_exchange_rates(rates, ts, exchange_rates_collection):
    last_record_processed = {
        'timestamp': ts,
        'rates': rates
    }
    exchange_rates_collection.insert_one(last_record_processed)

def create_companies_collection_index(companies_collection):    
    if 'ibans_1' not in companies_collection.index_information():
        companies_collection.create_index([('ibans', 1)])
    if 'name_text' not in companies_collection.index_information():
        companies_collection.create_index([("name", "text")])


def get_company_by_iban(iban, companies_collection):
    query = {'ibans': {'$in': [iban]}}
    companies = companies_collection.find(query)
    for company in companies:
        return company
    
def save_transaction(transaction, exchange_rates, transactions_collection, companies_collection, payment_type='sepa'):
    payerKey = 'payer'
    receiverKey = 'receiver'
    
    if payment_type=='swift':
        payerKey = 'sender'
        receiverKey = 'beneficiary'
        
    # process payer
    company = get_company_by_iban(transaction[payerKey], companies_collection)
    
    rates = [item for item in exchange_rates if item['currency'] == transaction['currency']]

    # NOTE: if no exchange rates available for a given transaction, we make them 1:1 with usd and euro
    if len(rates):
        rates = rates[0]
    else: 
        rates = { 'usd_rate': 1, 'eur_rate': 1 }
        
    if company is not None:
        record = {
            'company_id': company['id'], 
            'transaction_id': transaction['id'],
            'amount_raw': transaction['amount'],
            'currency_raw': transaction['currency'],
            'amount_usd': round(transaction['amount'] * rates['usd_rate'], 4) ,
            'amount_eur': round(transaction['amount'] * rates['eur_rate'], 4),
            'usd_rate': rates['usd_rate'],
            'eur_rate': rates['eur_rate'],
            'country_code': transaction[payerKey][:2],
            'payment_type': payment_type,
            'transaction_type': 'debit'
        }

        transactions_collection.insert_one(record)
    
    # process receiver
    company = get_company_by_iban(transaction[receiverKey], companies_collection)
    if company is not None:
        record = {
            'company_id': company['id'], 
            'transaction_id': transaction['id'],
            'amount_raw': transaction['amount'],
            'currency_raw': transaction['currency'],
            'amount_usd': round(transaction['amount'] * rates['usd_rate'], 4),
            'amount_eur': round(transaction['amount'] * rates['eur_rate'], 4),
            'usd_rate': rates['usd_rate'],
            'eur_rate': rates['eur_rate'],
            'country_code': transaction[receiverKey][:2],
            'payment_type': payment_type,
            'transaction_type': 'credit'
        }

        transactions_collection.insert_one(record)