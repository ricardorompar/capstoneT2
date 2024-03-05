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

def get_last_value(data:dict) -> float:
    try:
        time_series = data["Time Series (1min)"]
        keys = list(time_series.keys()) #get all the keys (date-time strings) and convert them to a list
        keys.sort() #sort in chronological order to get the very last value
        last_values = time_series[keys[-1]] # i know this is a dict that will have a key "4. close"
        return float(last_values["4. close"])
    except:
        print("Error getting time series from AV API response.")
        return float("nan")

def get_API_daily(stock:str, key:str)->dict:
    try:
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={key}"
        r = requests.get(url)
        data = r.json()
        return data
    except:
        print("Error fetching data from AlphaVantage API")
        return {}

def get_API_1min(stock:str, key:str)->dict:
    try:
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={stock}&interval=1min&apikey={key}"
        r = requests.get(url)
        data = r.json()
        return data
    except:
        print("Error fetching data from AlphaVantage API")
        return {}

@app.route("/api/portfolio")
def create_portfolio() -> json:
    userId = "user1" #change for different users
    portfolio = {}    #This dictionary has the response from this endpoint as specified in the doesign
    portfolio["username"] = userId  #first item username
    total_port_val = 0
    user_portfolio = get_user_list(user_id=userId)

    for stock, num_stocks in user_portfolio.items():
        #make the requests to the API and return the last closing value:
        data = get_API_1min(stock, API_KEY)
        #I only want the last closing value, so:
        try:
            last_close = get_last_value(data)
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
    data = get_API_daily(stock, API_KEY)
    try:
        series = data['Time Series (Daily)']
        #lets use the last 30 days:
        start_date = (date.today()-timedelta(days=30)).strftime("%Y-%m-%d")
        end_date = date.today().strftime("%Y-%m-%d")
        filtered_data = {date: details for date, details in series.items() if start_date <= date <= end_date}
        past_stock={}
        past_stock["symbol"]=stock
        past_stock["values_daily"]=filtered_data
        return jsonify(past_stock)
    
    except:
        print("Error in data")
        return {}
    

if __name__ == "__main__":
    #app.run() #for production
    app.run(debug=True)   #for development


#rr