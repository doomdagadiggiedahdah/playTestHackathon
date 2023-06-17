import requests
from bs4 import BeautifulSoup

# Send a GET request to the website
url = "https://www.redbull.com/us-en/"  # Replace with the URL of the website you want to scrape
response = requests.get(url)

# Create a Beautiful Soup object from the response text
soup = BeautifulSoup(response.text, "html.parser")

# Find all the text on the page
text = soup.get_text()

# Print the extracted text
print(text)
