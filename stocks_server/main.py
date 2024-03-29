import json
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import cp_functions as cp #custom module
import models as md

#flask setup:
app = Flask(__name__)
# CORS(app, supports_credentials=True)    #needed for handling data from forms
CORS(app, supports_credentials=True, resources={r"/*" : {"origins" : "*"}})
app.config["SECRET_KEY"] = cp.get_flask_secret()
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SESSION_COOKIE_SECURE'] = True

#database setup:
md.config_flask_db(app)

#ENDPOINTS
@app.route("/api/portfolio")
def create_portfolio() -> json:
    user = request.args.get("user", "testUser")

    portfolio = {}    #This dictionary has the response from this endpoint as specified in the doesign
    portfolio["username"] = user  #first item username
    total_port_val = 0
    user_portfolio = md.get_portfolio(username=user)
    portfolio["portfolio"] = {} #another empty dict
    for stock, num_stocks in user_portfolio.items():
        #make the requests to the API and return the last closing value:
        data = cp.get_past_vals(stock, "min60")
        #I only want the last closing value, so:
        try:
            last_close = cp.get_last_close(data) #by default last value
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
    
    series = cp.get_past_vals(stock, interval)  #by default it takes the daily values
    past_stock={}
    past_stock["symbol"]=stock
    try:
        past_stock[f"values_{interval}"]=cp.filter_amount(series, 30)   #filter by amount of values
        #past_stock[f"values_{interval}"]= cp.filter_by_date(series, start_date, end_date)   #filter by date
        return jsonify(past_stock)
    except:
        print("Error in data")
        return {}

@app.route("/api/update_user", methods=['POST'])
def add_stock():
    print("debugging--------------------------------------------------------------------------------------------")
    try:
        data = request.json
        action = data["action"]
        user = data['user']
        symbol = data['symbol']
        quantity = data['quantity']
        if action == "modify":
            md.STOCKS.modify(username=user, symbol=symbol,quantity=quantity)
        elif action == "remove":
            md.STOCKS.delete(username=user, symbol=symbol)
        elif action == "add":
            md.STOCKS.add(username=user, symbol=symbol, quantity=quantity)
        print('Modifying with values:',action,user,symbol,quantity)
        return {'message':'stocks updated successfully'}, 203
    except:
        print('Error updating user informaton.')
        return {'message':'error updating user information'}, 400

@app.route("/logout", methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message':'user logged out successfully'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    if md.USERS.check(username, cp.hasher(password)):
        session.permanent = True #this makes it permanent
        session.modified = True
        session['username'] = username
        print(f"debugging: session {session['username']}--------------------------------------------------------------------------------------------")
        return jsonify({'username':session['username'], 'message': 'Logged in successfully'}), 200
    else:
        return jsonify({'message': 'Authentication failed'}), 401

@app.route('/is_logged_in', methods=['GET'])
def login_check():
    print(f"debugging: session {session['username']}--------------------------------------------------------------------------------------------")
    if "username" in session:
        return jsonify({'username':session['username'], "logged_in":True}), 200
    else:
        return jsonify({'username':None, "logged_in":False})

if __name__ == "__main__":
    #app.run() #for production
    app.run(debug=True)   #for development


#rr