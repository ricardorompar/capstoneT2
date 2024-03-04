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
with open("user_database.json", 'r') as db:
        db_dict = json.load(db)

def get_user_list(user_id):
    #this function returns the list of symbols for a specific user
    try:
        return db_dict[user_id]
    except KeyError:
        print("User not found in database.")

def get_last_weekday()->str:
    #this function retrieves the last weekday date to use it in the api call. Return has format "YYYY-MM-DD"
    today = date.today()
    if today.weekday()% 6==0:  #this if encapsulates the 2 days (0 and 6) in a single line. Ricardo did this on his own during class
        deltas = {0:3, 6:2} #this dict establishes the amount of days to be subtracted (other than 1) form the current date
        delta = timedelta(deltas[today.weekday()])
    else:   #any other day of the week
        delta = timedelta(days=1)
    return (today-delta).strftime("%Y-%m-%d")

def get_API_daily(stock:str, key:str)->dict:
    try:
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={key}"
        r = requests.get(url)
        data = r.json()
        return data
    except:
        print("Error fetching data from AlphaVantage API")
        return {}

@app.route("/api/portfolio")
def get_portfolio() -> json:
    userId = "user1" #change for different users
    list_values = {}    #This dictionary will store the stock and last closing value like "STOCK":"123.45"
    user_portfolio = get_user_list(user_id=userId)
    for stock in user_portfolio:
        #make the requests to the API and return the last closing value:
        data = get_API_daily(stock, API_KEY)
        #I only want the last closing value, so:
        try:
            lcv = data["Time Series (Daily)"][get_last_weekday()]["4. close"]  #i know that there is the last closing value
        except:
            print("Error in data")
            lcv = {}
        list_values[stock] = lcv
    return jsonify(list_values)

@app.route("/api/portfolio/<stock>")
def get_stock_value(stock: str) -> json:
    data = get_API_daily(stock, API_KEY)
    try:
        series = data['Time Series (Daily)']
    except:
        print("Error in data")
        series = {}
    #lets use the last 30 days:
    start_date = (date.today()-timedelta(days=30)).strftime("%Y-%m-%d")
    end_date = date.today().strftime("%Y-%m-%d")
    filtered_data = {date: details for date, details in series.items() if start_date <= date <= end_date}   #this is from Percy's code
    past_stock={}
    past_stock["symbol"]=stock
    past_stock["values_daily"]=filtered_data
    return jsonify(past_stock)

if __name__ == "__main__":
    app.run()


#rr