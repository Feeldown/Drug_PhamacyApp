import requests
import json
import urllib3

# Disable SSL verification warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def count_drug_names():
    url = "https://www.yaandyou.net/auto-complete.php"
    params = {"keyword": ""}  # Empty keyword to get all results
    
    try:
        response = requests.get(url, params=params, verify=False)
        response.raise_for_status()
        
        # Try to parse the response as JSON
        data = response.json()
        
        # Count the number of items
        count = len(data) if isinstance(data, list) else 0
        
        print(f"Total number of drug names found: {count}")
        
        # Optionally save the names to a file
        with open("drug_names.txt", "w", encoding="utf-8") as f:
            if isinstance(data, list):
                for item in data:
                    f.write(f"{item}\n")
        
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
    except json.JSONDecodeError:
        print("Error: Could not parse the response as JSON")

if __name__ == "__main__":
    count_drug_names() 