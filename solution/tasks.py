# from celery import Celery

# app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

# @app.task
# def task_one():
#     # Your task implementation
#     pass

# @app.task
# def task_two():
#     # Your task implementation
#     pass

# @app.task
# def task_three():
#     # Your task implementation
#     pass


from celery import Celery
from celery.schedules import crontab

from datetime import datetime


# Create Celery application
app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

# Define Celery tasks
@app.task
def return_current_time_10():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return current_time

@app.task
def return_current_time_20():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return current_time

@app.task
def return_current_time_30():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return current_time

# Configure Celery
app.conf.beat_schedule = {
    'return-current-time-10-seconds': {
        'task': 'tasks.return_current_time_10',
        'schedule': 10.0,
    },
    'return-current-time-20-seconds': {
        'task': 'tasks.return_current_time_20',
        'schedule': 20.0,
    },
    'return-current-time-30-seconds': {
        'task': 'tasks.return_current_time_30',
        'schedule': 30.0,
    },
}

if __name__ == '__main__':
    app.start()
