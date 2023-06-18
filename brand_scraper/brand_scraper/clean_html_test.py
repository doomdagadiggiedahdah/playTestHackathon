import requests
from utils import clean_html

url = "https://www.redbull.com/us-en/energydrink/company-profile"
page = requests.get(url)

cleaned = clean_html(page.text)
print(cleaned)
