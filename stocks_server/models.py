from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import Identity
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
import oracledb
import os
from dotenv import load_dotenv #For retrieving the SECRETS
from sqlalchemy.pool import NullPool

db = SQLAlchemy()

class USERS(db.Model):
    __tablename__ = 'USERS'
    USER_ID = db.Column(db.Integer, Identity(start=1, cycle=False), primary_key=True)
    USERNAME = db.Column(db.String(100), nullable=False)
    PASSWORD = db.Column(db.String(100), nullable=False)

    stocks = relationship("STOCKS", back_populates="user")

    def dict(self):
        return {
            'user_id': self.USER_ID,
            'username': self.USERNAME,
            'password': self.PASSWORD
        }
    
    def check(username, password):
        try:
            # Try to find an existing record
            user = USERS.query.filter_by(USERNAME=username, PASSWORD=password).first()  #remember this password is already hashed
            return user
        
        except:
            raise("MODELS: Error in user check")

    def create(username, password):
        new_user = USERS(USERNAME=username, PASSWORD=password) #pw must be already hashed
        db.session.commit()
        return new_user
    
class STOCKS(db.Model):
    __tablename__ = 'STOCKS'
    STOCK_ID = db.Column(db.Integer, Identity(start=1, cycle=False), primary_key=True)
    USER_ID = db.Column(db.Integer, ForeignKey('USERS.USER_ID'), nullable=False)
    SYMBOL = db.Column(db.String(100), nullable=False)
    QUANTITY = db.Column(db.Integer, nullable=False)

    user = relationship("USERS", back_populates="stocks")

    def dict(self):
        return {
            'stock_id': self.STOCK_ID,
            'user_id': self.USER_ID,
            'symbol': self.SYMBOL,
            'quantity':self.QUANTITY
        }
    
    def check(username, symbol):
        try:
            user = USERS.query.filter_by(USERNAME=username).first()
            if user:
                return STOCKS.query.filter_by(USER_ID =user.USER_ID, SYMBOL=symbol).first()
        except:
            raise Exception("error in stock check")
        
    def add(username, symbol, quantity):
        print("Add>>>>>")
        print(username, symbol, quantity)
        print("<<<<<Add")
        try:
            user = USERS.query.filter_by(USERNAME=username).first()
            if user:
                #create new:
                new = STOCKS(USER_ID = user.USER_ID, SYMBOL=symbol, QUANTITY=quantity)
                db.session.add(new)
                db.session.commit()

                return STOCKS.check(username, symbol)    #then return the newly added stock
        except:
            db.session.rollback()
            raise Exception("error while adding new stock")
    
    def modify(username, symbol, quantity):
        print("Modify>>>>>")
        print(username, symbol, quantity)
        print("<<<<<Modify")
        try:
            user = USERS.query.filter_by(USERNAME=username).first()
            if user:
                stock_to_modify = STOCKS.query.filter_by(USER_ID = user.USER_ID, SYMBOL=symbol).first()
                stock_to_modify.QUANTITY=quantity
                db.session.add(stock_to_modify)
                db.session.commit()
        except:
            db.session.rollback()
            raise Exception(f"error modifying stock {symbol} for user {username}")
        
    def delete(username, symbol):
        print("Delete>>>>>")
        print(username, symbol)
        print("<<<<<Delete")
        try:
            user = USERS.query.filter_by(USERNAME=username).first()
            if user:
                stock = STOCKS.query.filter_by(USER_ID=user.USER_ID, SYMBOL=symbol).first()
                db.session.delete(stock)
                db.session.commit()
        except:
            db.session.rollback()
            print(f"Error deleting stock {symbol} for user {username}")
        
def config_flask_db(app):
    #database setup:
    load_dotenv()
    try:
        oci_username = os.getenv("DB_NAME")
        oci_password = os.getenv("DB_PASSWORD")
        dsn = '(description= (retry_count=10)(retry_delay=2)(address=(protocol=tcps)(port=1522)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=gb9d3cf06fca1a2_capdb3_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'

        pool = oracledb.create_pool(user=oci_username, password=oci_password, dsn=dsn)
        #database with flask setup:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'oracle+oracledb://'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
            'creator': pool.acquire,
            'poolclass': NullPool
        }
        app.config['SQLALCHEMY_ECHO'] = True
        db.init_app(app)
        with app.app_context():
            db.create_all()

    except:
        raise ConnectionError("MODELS: Error establishing connection to database.")

def get_portfolio(username:str) -> dict:
        try:
            user = USERS.query.filter_by(USERNAME=username).first()
            if user:
                all_stocks = STOCKS.query.filter_by(USER_ID =user.USER_ID).all()  #with all i get the whole result of the query not just one
                composition = {}
                for stock in all_stocks:   #i also know that this list has dicts in the format {'stock': 'AAPL', 'quant': 11}
                    composition[stock.SYMBOL]=stock.QUANTITY
                return composition
        except:
            raise Exception(f"error getting stocks for {username}") 

    
