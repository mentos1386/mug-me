import urllib, json
import os
from clus_means import clus_means

AUTH_KEY = os.getenv('AUTH_KEY')

def find_shops(origin, destination, new_destination = None):
    json_data = find_direct(origin, destination)
    if json_data == "No walking path found!":
        print(json_data)
        return

    distance = json_data["routes"][0]["legs"][0]["distance"]["value"]

    decoded_poly = decode(json_data["routes"][0][over])