

import os
import requests
from requests import get
from celery import Celery
from celery.schedules import crontab
from pymongo import MongoClient
from datetime import datetime, timedelta

from utils import *

CELERY_BROKER_URL=os.environ.get('CELERY_BROKER_URL')
CELERY_BACKEND_URL=os.environ.get('CELERY_BACKEND_URL')
MONGODB_BASE_URL=os.environ.get('MONGODB_BASE_URL')
MONGODB_DB_NAME=os.environ.get('MONGODB_DB_NAME')
BATCH_SIZE=os.environ.get('BATCH_SIZE')

# Create Celery application
app = Celery('tasks', broker=CELERY_BROKER_URL, backend=CELERY_BACKEND_URL)

# Define the MongoDB connection
client = MongoClient(MONGODB_BASE_URL)
db = client[MONGODB_DB_NAME]
companies_collection = db['companies']
process_collection = db['process']
exchange_rates_collection = db['exchange_rates']
transactions_collection = db['transactions']

# Calls GET /companies and store it in "companies" collection.
# The "ibans" field is converted from string to list
# Processes records by BATCH_SIZE
@app.task
def process_companies():
    
    last_record = get_last_record_processed('company', process_collection)
    
    query_params = '?limit=%s' % (BATCH_SIZE)
    
    if (last_record is not None):
        query_params = '%s&after-id=%s' % (query_params, str(last_record['id']))

    try:
        companies_data = get_request('/companies', query_params)
        count = len(companies_data)
        if (count):
            for company in companies_data:
                company['ibans'] = eval(company['ibans'])

            companies_collection.insert_many(companies_data)
            company_id = companies_data[-1]['id']
            save_last_record_processed(
                'company', 
                company_id, 
                datetime.now().isoformat() + 'Z',
                process_collection
            )
            return('%d new companies inserted successfully. Last Company ID processed: %d' % (count, company_id))
        else:
            return('No new company to process. Last Company ID processed: ' + str(last_record['id']))
    except (
        requests.exceptions.Timeout, 
        requests.exceptions.HTTPError, 
        requests.exceptions.RequestException
    ) as e:
        return('Error:', e)

    

# Calls GET /exchange-rates to get the latest rates
@app.task
def process_exchange_rates():
    exchange_rates = get_request('/exchange-rates')
    save_last_exchange_rates(
        exchange_rates, 
        datetime.now().isoformat() + 'Z',
        exchange_rates_collection
    )
    return exchange_rates




# collection: transactions
# fields: 
# - company_id   --- get from companies collection where payer/receiver iban exists in companies.ibans
# - transaction_id 
# - amount_raw   --- transaction.amount
# - currency_raw  --- transaction.currency
# - amount_usd   --- convert  amount_raw to usd based on usd_rate of currency_raw, on time of processing. (use exchange_rate collection)
# - amount_eur --- convert  amount_raw to eur based on eur_rate of currency_raw, on time of processing. (use exchange_rate collection)
# - usd_rate  --- usd_rate on time of processing
# - eur_rate  --- eur_rate on time of processing
# - country_code   -- 2-digit country code for payer/receiver
# - payment_type  --- either 'swift' or 'sepa'
# - transaction_type --- debit/credit

# NOTE - each raw transaction will create 2 entries in transactions table

@app.task
def process_swift_trans():
    exchange_rates = get_last_exchange_rates(exchange_rates_collection)
    
    if exchange_rates is None:
        raise Exception("No exchange_rates found.")
        
    last_record = get_last_record_processed('swift_trans', process_collection)
    
    query_params = '?limit=%s' % (BATCH_SIZE)
    
    if last_record is not None:
        query_params = '%s&after-id=%s' % (query_params, last_record['id'])
        
    try:
        transactions_data = get_request('/transactions/swift', query_params)
        count = len(transactions_data)        
        
        if count:
            for transaction in transactions_data:
                save_transaction(
                    transaction, 
                    exchange_rates, 
                    transactions_collection, 
                    companies_collection,
                    payment_type='swift'
                )
            
            save_last_record_processed(
                'swift_trans', 
                transactions_data[-1]['id'],
                transactions_data[-1]['timestamp'],
                process_collection
            )
            return('Processed %s Swift Transactions.' % len(transactions_data))
        else:
            return('No Swift Transactions.')
    
    except (
        requests.exceptions.Timeout, 
        requests.exceptions.HTTPError, 
        requests.exceptions.RequestException
    ) as e:
        return('Error:', e)

@app.task
def process_sepa_trans():
    exchange_rates = get_last_exchange_rates(exchange_rates_collection)
    
    if exchange_rates is None:
        raise Exception("No exchange_rates found.")
        
    last_record = get_last_record_processed('sepa_trans', process_collection)
    
    query_params = '?limit=%s' % (BATCH_SIZE)
    
    if last_record is not None:
        query_params = '%s&after-id=%s' % (query_params, last_record['id'])
        
        
    try:
        transactions_data = get_request('/transactions/sepa', query_params)
        count = len(transactions_data)        
        
        if count:
            for transaction in transactions_data:
                save_transaction(
                    transaction, 
                    exchange_rates, 
                    transactions_collection, 
                    companies_collection,
                    payment_type='sepa'
                )
            
            save_last_record_processed(
                'sepa_trans', 
                transactions_data[-1]['id'],
                transactions_data[-1]['timestamp'],
                process_collection
            )
            return('Processed %s SEPA Transactions.' % len(transactions_data))
        else:
            return('No SEPA Transactions.')
    
    except (
        requests.exceptions.Timeout, 
        requests.exceptions.HTTPError, 
        requests.exceptions.RequestException
    ) as e:
        return('Error:', e)
    

# Configure Celery
app.conf.beat_schedule = {
    'process_companies': {
        'task': 'tasks.process_companies',
        'schedule': crontab(minute=0, hour=0),  # once a day, every midnight
        # 'schedule': 10.0,
    },
    'process_exchange_rates': {
        'task': 'tasks.process_exchange_rates',
         'schedule': crontab(minute=0, hour=0),
        #  'schedule': 10.0,
    },
    'process_swift_trans': {
        'task': 'tasks.process_swift_trans',
        'schedule': 60.0,   # every 60 seconds
    },
    'process_sepa_trans': {
        'task': 'tasks.process_sepa_trans',
        'schedule': 60.0,   # every 60 seconds
    },
}

if __name__ == '__main__':
    app.start()
