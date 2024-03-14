from flask import Flask, jsonify
import requests
import os
from flask_cors import CORS
from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool
import oracledb
from dotenv import load_dotenv #For retrieving the SECRETS

load_dotenv()
oci_username = os.getenv("DB_NAME")
oci_password = os.getenv("DB_PASSWORD")
dsn = '(description= (retry_count=10)(retry_delay=2)(address=(protocol=tcps)(port=1522)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=gb9d3cf06fca1a2_capdb3_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'

pool = oracledb.create_pool(user=oci_username, password=oci_password, dsn=dsn)
engine = create_engine("oracle+oracledb://", creator=pool.acquire, poolclass=NullPool, future=True, echo=True)

def check_user(username, password):
    sql_sentence = text('''
        SELECT username, password 
        FROM CAPSTONE.USERS u
        WHERE u.USERNAME = :username AND u.PASSWORD = :password;
    ''')
    try:
        with engine.connect() as connection:
            print(sql_sentence)
            user = connection.execute(sql_sentence, {"username":username, "password":password}).mappings().fetchone()
            if user:
                {"username": user["username"],
                "password": user["id"]}
            else:
                return {}
    except:
        print("Error connecting to Oracle DB")
        return{"error":"connection to DB failed"}

if __name__ == "__main__":
    print(os.getenv("DB_NAME"), os.getenv("DB_PASSWORD"))
    check_user('testUser', '8cb2237d0679ca88db6464eac60da96345513964')

