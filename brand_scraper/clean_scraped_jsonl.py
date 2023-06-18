import json

# Initialize an empty dictionary to store the aggregated keywords and their frequencies
keywords_freq = {}

scraped_jsonl_fn = "brand_keywords.jsonl"
# Read and process the JSONL file
with open(scraped_jsonl_fn, 'r') as file:
    for line in file:
        # Load the line as a JSON object
        data = json.loads(line)

        # Iterate through the "brand_keywords" list
        for entry in data['brand_keywords']:
            keyword = entry['keyword']
            frequency = entry['frequency']

            # Aggregate the keyword frequencies
            if keyword in keywords_freq:
                keywords_freq[keyword] += frequency
            else:
                keywords_freq[keyword] = frequency

# Sort the keywords by frequency in descending order
sorted_keywords = sorted(keywords_freq.items(), key=lambda x: x[1], reverse=True)

# Convert the sorted dictionary into a list
result = [k for k, _ in sorted_keywords]
print(result)

# Save resulting list to cleaned_brand_keywords.json
json_fn = "cleaned_brand_keywords2.json"
with open(json_fn, 'w') as file:
    json.dump(result, file)