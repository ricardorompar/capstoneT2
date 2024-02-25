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

def get_last_weekday():
    #this function retrieves the last weekday date to use it in the api call. Return has format "YYYY-MM-DD"
    today = date.today()
    if today.weekday()==0:  #if today is monday
        delta = timedelta(days=3)
    elif today.weekday()==6: #if today is sunday:
        delta = timedelta(days=2)
    else:   #any other day of the week
        delta = timedelta(days=1)
    return (today-delta).strftime("%Y-%m-%d")

@app.route("/api/portfolio")
def get_portfolio():
    userId = "user1" #change for different users
    list_values = {}    #This dictionary will store the stock and last closing value like "STOCK":"123.45"
    user_portfolio = get_user_list(user_id=userId)
    for stock in user_portfolio:
        #make the requests to the API and return the last closing value:
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={API_KEY}"
        r = requests.get(url)
        data = r.json()
        #I only want the last closing value, so:
        lcv = data["Time Series (Daily)"][get_last_weekday()]["4. close"]  #i know that there is the last closing value
        list_values[stock] = lcv
    return jsonify(list_values)

@app.route("/api/portfolio/<stock>")
def get_stock_value(stock):
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={API_KEY}"
    r = requests.get(url)
    data = r.json()
    series = data['Time Series (Daily)']
    #lets use the last 30 days:
    start_date = (date.today()-timedelta(days=30)).strftime("%Y-%m-%d")
    end_date = date.today().strftime("%Y-%m-%d")
    filtered_data = {date: details for date, details in series.items() if start_date <= date <= end_date}   #this is from Percy's code
    past_stock={}
    past_stock["symbol"]=stock
    past_stock["values_daily"]=filtered_data
    return jsonify(past_stock)

if __name__ == "__main__":
    app.run(debug = True)