

import os
import requests
from requests import get
from celery import Celery
from celery.schedules import crontab
from pymongo import MongoClient
from datetime import datetime

SYSTEMS_API_BASE_URL=os.environ.get('SYSTEMS_API_BASE_URL')
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
companies = db['companies']
process = db['process']

def track_last_record(recordType, _id, ts):
    last_record_processed = {
        'type': recordType,
        'id': _id,
        'timestamp': ts
    }
        
    process.insert_one(last_record_processed)
    return last_record_processed


def get_last_record(recordType):
    
    try:
        last_record = process.find({'type': recordType}).sort('_id', -1).limit(1)
        for record in last_record:
            return record
        return None
    except Exception as e:
        return None

@app.task
def process_companies():
    
    last_record = get_last_record('company')
    if (last_record is not None):
        url = '%s/companies?limit=%s&after-id=%d' % (SYSTEMS_API_BASE_URL, BATCH_SIZE, last_record['id'])
    else:
        url = '%s/companies?limit=%s' % (SYSTEMS_API_BASE_URL, BATCH_SIZE)
        
    response = requests.get(url)

    if response.status_code == 200:
        companies_data = response.json()
        count = len(companies_data)
        if (count):
            companies.insert_many(companies_data)
            last_record = track_last_record('company', companies_data[-1]['id'], datetime.now().isoformat() + 'Z')
            return('%d companies inserted. Last Company ID: %d' % (count, last_record['id']))
        else:
            return('No new company. Last Company ID: ' + str(last_record['id']))
             
    else:
        return('Failed to fetch data from the Cash Flow API.')


# Configure Celery
app.conf.beat_schedule = {
    'process_companies': {
        'task': 'tasks.process_companies',
        'schedule': crontab(minute=0, hour=0),  # once a day, every midnight
    },
    # 'return-current-time-20-seconds': {
    #     'task': 'tasks.return_current_time_20',
    #     'schedule': 20.0,
    # },
    # 'return-current-time-30-seconds': {
    #     'task': 'tasks.return_current_time_30',
    #     'schedule': 30.0,
    # },
}




if __name__ == '__main__':
    app.start()
