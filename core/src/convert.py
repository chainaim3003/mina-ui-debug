
# Load JSON file
import json
import pandas as pd

# Load JSON data from file
with open("D:\\chainaimlabs\\actus live server\\RiskProver_Prabakaran_4thfeb\\scf-main\\scf-rwa\\zkapps\\scf-rwa-recursion\\src\\response.json", "r") as file:
    data = json.load(file)

if isinstance(data, list):
    # If it's a list, assume each item is a separate contract with events
    all_events = []
    for contract in data:
        if "events" in contract:
            all_events.extend(contract["events"])  # Collect all events
else:
    # If it's a dictionary, extract the events normally
    all_events = data.get("events", [])

# Convert to DataFrame
df = pd.DataFrame(all_events)

# Save to CSV
df.to_csv("output.csv", index=False)

# Save to Excel
df.to_excel("output.xlsx", index=False)

print("Conversion successful! Files saved as 'output.csv' and 'output.xlsx'.")

