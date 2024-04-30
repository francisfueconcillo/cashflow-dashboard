# MongoDB as broker and result backend
broker_url = 'mongodb://mongo:27017/celery'
result_backend = 'mongodb://mongo:27017/celery_results'

# Other Celery configuration settings can be added here
# For example:
# task_routes = {
#     'tasks.script1': {'queue': 'script1_queue'},
#     'tasks.script2': {'queue': 'script2_queue'},
#     'tasks.script3': {'queue': 'script3_queue'},
# }