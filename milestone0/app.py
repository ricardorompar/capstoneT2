import json
import requests
import pandas as pd
import os
from dotenv import load_dotenv #For retrieving the api key

# Load the environment variables from the .env file
load_dotenv()

key = os.getenv("ALPHA_VANTAGE_KEY")

start_date = "2024-02-15"
end_date = "2024-02-29"
tickerlist = ['AAPL', 'IBM', 'MSFT', 'GOOGL', 'AMZN']

datalist = []

username = input('Enter username: ')
password = input('Enter password: ')

print("*" * 100)
print(f"Welcome " + username + "!")
print("")
print("")
print("Your portfolio")
for ticker in range(len(tickerlist)):
    print(f"{ticker + 1}  {tickerlist[ticker]}")
print("")
print("")
print("*" * 100)


selection = input("Enter the number or ticker of the stock you want to see: ")
start_date = input("Enter the start date (YYYY-MM-DD): ")
end_date = input("Enter the end date (YYYY-MM-DD): ")

print("*" * 100)
if selection.isdigit():
    print(f"Stock details for {tickerlist[int(selection) - 1]}")
else:
    print(f"Stock details for {selection}")

print(f"Start date: {start_date}")
print(f"End date: {end_date}")

if selection.isdigit():
    ticker = tickerlist[int(selection) - 1]
else:
    ticker = selection

url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ ticker + '&apikey=' + key
r = requests.get(url)
data = r.json()

series = data['Time Series (Daily)']

filtered_data = {date: details for date, details in series.items() if start_date <= date <= end_date}
# print(filtered_data)




df = pd.DataFrame.from_dict(filtered_data, orient='index')


# Convert the index to datetime
df.index = pd.to_datetime(df.index)

# Optionally, you can rename columns to remove the numbers and spaces for easier access
df.columns = [col.split(' ')[1] for col in df.columns]

# Show the DataFrame
print(df)
#


'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=9UGF0RQFVARJPFAD'