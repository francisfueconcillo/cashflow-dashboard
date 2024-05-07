
from datetime import datetime

def convert_isodate_str_to_datetime(iso_date_str):
    date_str_no_milli = iso_date_str.split('.')[0]
    return datetime.fromisoformat(date_str_no_milli)