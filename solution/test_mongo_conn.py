from pymongo import MongoClient

# MongoDB connection string
mongo_uri = 'mongodb://mongo:27017/cashflow'

try:
    # Connect to MongoDB
    client = MongoClient(mongo_uri)

    # Check if connected
    db_names = client.list_database_names()
    print("Connected to MongoDB")
    print("Available databases:", db_names)

except Exception as e:
    print("Failed to connect to MongoDB:", e)
