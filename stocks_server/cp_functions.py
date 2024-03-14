'''
This module is needed in order to make the code cleaner and more readable. 
All the functions to do stuff like hashing passwords and such will be here
I'll try to keep all the requests to the server in the main.py function and other stuff here
'''

import hashlib
import requests
import os
import json
from dotenv import load_dotenv #For retrieving the api key
from datetime import date, timedelta, datetime
import hashlib

# Load the environment variables from the .env file
load_dotenv()
def get_API_key():
    return os.getenv("ALPHA_VANTAGE_KEY")
API_KEY = get_API_key()

def get_flask_secret():
    return os.getenv("FLASK_SECRET")

#INTERACTING WITH THE DATABASE:
def hasher(string:str):
    hash = hashlib.sha1()
    hash.update(string.encode())
    return hash.hexdigest()

#testUser2 has password '9a23b6d49aa244b7b0db52949c0932c365ec8191' the hashed version of testPass

def hasher(string:str):
    hash = hashlib.sha1()
    hash.update(string.encode())
    return hash.hexdigest()

def check_user(username:str, password:str) -> bool:
    #this function returns true if the user is found in the database, false otherwise. REMEMBER THE PASSWORD MUST BE HASHED
    password=hasher(password)
    try:
        url = f"https://gb9d3cf06fca1a2-capstoneadw.adb.eu-madrid-1.oraclecloudapps.com/ords/capstone/users/{username}/{password}/"
        r = requests.get(url)
        data = r.json()
        data = data["items"]    #the format that oracle uses is a list of dicts called "items"
        if data:    #if its NOT an empty list means the user was found in the DB
            return True
        else:
            return False
    except:
        print("Error connecting to Oracle database")
        return False

def user_stocks(username:str) -> dict:
    #this function gets the stocks belonging to a user
    try:
        url = f"https://gb9d3cf06fca1a2-capstoneadw.adb.eu-madrid-1.oraclecloudapps.com/ords/capstone/user_stocks/{username}/"
        r = requests.get(url)
        data = r.json()
        data = data["items"]    #the format that oracle uses is a list of dicts called "items"
        composition = {}
        for stock in data:   #i also know that this list has dicts in the format {'stock': 'AAPL', 'quant': 11}
            composition[stock["stock"]]=stock["quant"]
        return composition
    except:
        print("Error connecting to Oracle database")
        return {}

def total_port_value(portfolio:dict)->float:
    #this function computes the total portfolio value
    pass
        
def get_last_close(time_series:dict) -> float:
    '''
    This function takes the time series from get_past_vals and outputs the last closing value of the serues
    '''
    try:
        keys = list(time_series.keys()) #get all the keys (date-time strings) and convert them to a list
        keys.sort() #sort in chronological order to get the very last values
        last_values = time_series[keys[-1]] # i know this is a dict that will have a key "4. close"
        return float(last_values["4. close"])
    except:
        print("Error getting time series from AV API response.")
        return float("nan")

def filter_amount(time_series:dict, size:int) -> dict:
    '''
    This function takes the same time series and outputs a smaller one containing only the amount of entries
    specified. If its a daily series it takes only the info from the past {size} days.
    '''
    try:
        keys = list(time_series.keys()) #get all the keys (date-time strings) and convert them to a list
        keys = keys[:size]  #take only the {size} first values
        response = {key: time_series[key] for key in keys}    #beautiful dictionary comprehension
        return response
    except:
        print("Error getting time series from AV API response.")
        return float("nan")

def filter_by_date(time_series:dict, start_date:str, end_date:str) -> dict:
    '''
    This takes the API response and cuts it from the start to the end dates
    '''
    start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    filtered_dict = {}
    try:
        for date_str, values in time_series.items():
            dates = datetime.strptime(date_str, "%Y-%m-%d").date()
            if start_date <= dates <= end_date:
                filtered_dict[date_str] = values
    except:
        print("Error in filtering data by dates. Maybe not using correct time interval?")
    
    return filtered_dict


def get_past_vals(stock:str, interval:str="daily") -> dict:
    '''
    This function gets the desired interval as a parameter: monthly, weekly, daily, min60, min30, min5, min1
    from that i just build the query parameters for the AV API and then I build my url
    i think this will be useful for selecting the interval of the past values
    '''
    global API_KEY  #i'll use the global variable instead
    if interval == "monthly":   #every month
        query_params = f"function=TIME_SERIES_MONTHLY&symbol={stock}&apikey={API_KEY}"
        series_name = "Monthly Time Series"
    elif interval == "weekly":  #every week
        query_params = f"function=TIME_SERIES_WEEKLY&symbol={stock}&apikey={API_KEY}"
        series_name = "Weekly Time Series"
    elif interval == "daily": #every day (by default)
        query_params = f"function=TIME_SERIES_DAILY&symbol={stock}&apikey={API_KEY}"
        series_name = "Time Series (Daily)"
    elif interval == "min60":   #every hour
        query_params = f"function=TIME_SERIES_INTRADAY&symbol={stock}&interval=60min&apikey={API_KEY}"
        series_name =  "Time Series (60min)"
    elif interval == "min30":   #every 30 minutes
        query_params = f"function=TIME_SERIES_INTRADAY&symbol={stock}&interval=30min&apikey={API_KEY}"
        series_name =  "Time Series (30min)"
    elif interval == "min5":   #every 5 minutes
        query_params = f"function=TIME_SERIES_INTRADAY&symbol={stock}&interval=5min&apikey={API_KEY}"
        series_name =  "Time Series (5min)"
    elif interval == "min1":   #every 1 minute
        query_params = f"function=TIME_SERIES_INTRADAY&symbol={stock}&interval=1min&apikey={API_KEY}"
        series_name =  "Time Series (1min)"
    #now i can build my api call with the full url:
    try:
        
        url = f"https://www.alphavantage.co/query?{query_params}"
        r = requests.get(url)
        data = r.json()
        #i want to get rid of the metadata included in the json and only return the time series. That's what i use the series_name variable for:
        return data[series_name]
    except:
        print("Error fetching data from AlphaVantage API")
        return {}


#for debugging:
if __name__ == "__main__":
    print(hasher("12345"))
    print(check_user("testUser", "1234"))
#rr