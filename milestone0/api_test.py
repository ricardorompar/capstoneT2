import requests
import os
from dotenv import load_dotenv #For retrieving the api key

# Load the environment variables from the .env file
load_dotenv()
API_KEY = os.getenv("ALPHA_VANTAGE_KEY")
stock = "MSFT"
# replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={API_KEY}"
r = requests.get(url)
data = r.json()

print(data["Time Series (Daily)"]['2024-02-23'])