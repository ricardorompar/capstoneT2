import json
import requests
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv #For retrieving the api key
from datetime import date, timedelta

# Load the environment variables from the .env file
load_dotenv()
API_KEY = os.getenv("ALPHA_VANTAGE_KEY")

app = Flask(__name__)
CORS(app)

#read the user database and store in a dictionary:
with open("user_database.json", 'r') as file:
        dict_db = json.load(file)

def get_user_list(user_id):
    #this function returns the list of symbols for a specific user
    try:
        return dict_db[user_id]
    except KeyError:
        print("User not found in database.")

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

#example: 
@app.route("/api/portfolio")
def create_portfolio() -> json:
    userId = request.args.get("userId")
    # userId = "user1" #change for different users
    portfolio = {}    #This dictionary has the response from this endpoint as specified in the doesign
    portfolio["username"] = userId  #first item username
    total_port_val = 0
    user_portfolio = get_user_list(user_id=userId)

    for stock, num_stocks in user_portfolio.items():
        #make the requests to the API and return the last closing value:
        # data = get_API_1min(stock, API_KEY)
        data = get_past_vals(stock, "min60")
        #I only want the last closing value, so:
        try:
            last_close = get_last_close(data) #by default last value
        except:
            print("Error in data")
            last_close = float("nan") #error

        total_port_val += num_stocks*last_close    #compute total portfolio value: sum (num of stocks) x (last close)

        portfolio[stock] = {
            "num_stocks": num_stocks,
            "last_close": round(last_close, 2)
        }
    portfolio["total_port_val"] = round(total_port_val, 2)
    return jsonify(portfolio)

@app.route("/api/portfolio/<stock>")
def get_stock_value(stock: str) -> json:
    interval = request.args.get("interval") #this takes the query params. It turns out it is very simple
    # amount = request.args.get("amount")
    #inspo from https://stackoverflow.com/questions/11774265/how-do-you-access-the-query-string-in-flask-routes
    
    series = get_past_vals(stock, interval)  #by default it takes the daily values
    past_stock={}
    past_stock["symbol"]=stock
    try:
        #lets use the last 20 values
        past_stock[f"values_{interval}"]=filter_amount(series, 20)
        # past_stock[f"values_{interval}"]=filter_amount(series, int(amount))
        return jsonify(past_stock)
    
    except:
        print("Error in data")
        return {}
    

if __name__ == "__main__":
    #app.run() #for production
    app.run(debug=True)   #for development


#rr