import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

import cp_functions #custom module

app = Flask(__name__)
CORS(app)

@app.route("/api/portfolio")
def create_portfolio() -> json:
    userId = request.args.get("userId", "user1")
        
    # userId = "user1" #change for different users
    portfolio = {}    #This dictionary has the response from this endpoint as specified in the doesign
    portfolio["username"] = userId  #first item username
    total_port_val = 0
    user_portfolio = cp_functions.get_user_list(user_id=userId)
    portfolio["portfolio"] = {} #another empty dict
    for stock, num_stocks in user_portfolio.items():
        #make the requests to the API and return the last closing value:
        data = cp_functions.get_past_vals(stock, "min60")
        #I only want the last closing value, so:
        try:
            last_close = cp_functions.get_last_close(data) #by default last value
        except:
            print("Error in data")
            last_close = float("nan") #error

        total_port_val += num_stocks*last_close    #compute total portfolio value: sum (num of stocks) x (last close)

        portfolio["portfolio"][stock] = {
            "num_stocks": num_stocks,
            "last_close": round(last_close, 2)
        }
    portfolio["total_port_val"] = round(total_port_val, 2)
    return jsonify(portfolio)

@app.route("/api/portfolio/<stock>", methods=['GET'])
def get_stock_value(stock: str) -> json:
    interval = request.args.get("interval", "daily") #this takes the query params. It turns out it is very simple. BY DEFAULT IS DAILY
    start_date = request.args.get("start_date", "2024-02-06")   #by default last month
    end_date = request.args.get("end_date", "2024-03-06")   #by default today
    #inspo from https://stackoverflow.com/questions/11774265/how-do-you-access-the-query-string-in-flask-routes
    
    series = cp_functions.get_past_vals(stock, interval)  #by default it takes the daily values
    past_stock={}
    past_stock["symbol"]=stock
    try:
        #lets use the last 20 values
        # past_stock[f"values_{interval}"]=filter_amount(series, 20)
        past_stock[f"values_{interval}"]= cp_functions.filter_by_date(series, start_date, end_date)   #now filtering by dates
        return jsonify(past_stock)
    
    except:
        print("Error in data")
        return {}
    

if __name__ == "__main__":
    #app.run() #for production
    app.run(debug=True)   #for development


#rr