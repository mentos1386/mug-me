import urllib, json
import os
from clus_means import clus_means

AUTH_KEY = 'AIzaSyCIL4iv4nUrjD8ZhnzayE3G_4aOK0xNas8'


def find_shops(origin, destination, new_destination=None):
    json_data = find_path(origin, destination)
    if json_data == "No walking path found!":
        print(json_data)
        return

    # Calculating the distance using mid points
    distance = json_data["routes"][0]["legs"][0]["distance"]["value"]

    decoded_poly = decode(json_data["routes"][0]["overview_polyline"]["points"])

    if len(decoded_poly) == 0:
        return []

    mid_points = decoded_poly[(int)(len(decoded_poly) / 2)]
    rad = distance * (3 / 2)
    lats = mid_points[1]
    longs = mid_points[0]

    # Start the google api for locations/places
    open_shops = google_place(lats, longs, rad)

    longs_lats = []
    for shop in open_shops["results"]:
        longs_lats.append(place_details(shop["place_id"]))

        # Clustering the data for the mean
        waypoint_limit = 24
        clus = min(int(len(longs_lats) / 3), waypoint_limit)
        centroids, clusters = clus_means(longs_lats, clus)
        return centroids


# Calculate the shortest path
def find_path(origin, destination):
    my_url = ('https://maps.googleapis.com/maps/api/directions/json'
              '?origin=place_id:%s'
              '&destination=place_id:%s'
              '&mode=walking'
              '&key=%s') % (origin, destination, AUTH_KEY)

    # fetching results (json)
    resp = urllib.urlopen(my_url)
    json_raw = resp.read()
    json_data = json.loads(json_raw)
    stat = str((json_data["status"]))
    no_data = "ZERO_RESULTS"
    if (stat == no_data):
        return ("No walking path found!")
    return json_data


# Decoding the points
def decode(points_str):
    co_chunks = [[]]

    # 5 binary chunks for co-ordinate reprisentation
    for chars in points_str:
        val = ord(chars) - 63

        split_char = not (val & 0x20)
        val &= 0x1F
        co_chunks[-1].append(val)

        if split_char:
            co_chunks.append([])
    del co_chunks[-1]

    co_ordinates = []

    for co_chunk in co_chunks:

        co_ordinate_single = 0

        for i, chunk in enumerate(co_chunk):
            co_ordinate_single |= chunk << (i * 5)

        # Negative co-ordinates have 1 added (two's complement)
        if co_ordinate_single & 0x1:
            co_ordinates = -co_ordinates
        co_ordinate_single >>= 1
        co_ordinate_single /= 100000.0
        co_ordinates.append(co_ordinate_single)

        # 1D to 2D converted list with offsets
        point = []
        past_x = 0
        past_y = 0

        for i in xrange(0, len(co_ordinates) - 1, 2):
            if co_ordinates[i] == 0 and co_ordinates[i + 1] == 0:
                continue

            past_x += co_ordinates[i + 1]
            past_y += co_ordinates[i]
            point.append((round(past_x, 6), round(past_y, 6)))

        return point


# Fetch currently open stores in the region
def google_place(lats, longs, rad):
    LOCATION = str(lats) + ", " + str(longs)
    RADIUS = rad
    my_url = ('https://maps.googleapis.com/maps/api/place/nearbysearch/json'
              '?location=%s'
              '&radius=%s'
              '&types=restaurant'
              '&opennow=true'
              '&key=%s') % (LOCATION, RADIUS, AUTH_KEY)

    # fetching results (json)
    resp = urllib.urlopen(my_url)
    json_raw = resp.read()
    json_data = json.loads(json_raw)
    return json_data


# Fetch details on the queried place
def place_details(place_id):
    PLACE_ID = place_id
    my_url = ('https://maps.googleapis.com/maps/api/place/details/json'
              '?placeid=%s'
              '&key=%s') % (PLACE_ID, AUTH_KEY)

    # fetching results (json)
    resp = urllib.urlopen(my_url)
    json_raw = resp.read()
    json_data = json.loads(json_raw)

    return json_data["result"]["geometry"]["location"]["lat"], json_data["result"]["geometry"]["location"]["lng"]


# Fetch new waypoints provided the respective paths
def new_path(origin, destination, centroid_str):
    my_url = ('https://maps.googleapis.com/maps/api/directions/json'
              '?origin=place_id:%s'
              '&destination=place_id:%s'
              '&mode=walking'
              '&waypoints=optimize:true|%s'
              '&key=%s') % (origin, destination, centroid_str, AUTH_KEY)
    print my_url

    # fetching results (json)
    resp = urllib.urlopen(my_url)
    json_raw = resp.read()
    json_data = json.loads(json_raw)
    stat = str((json_data["status"]))
    no_data = "ZERO_RESULTS"
    if (stat == no_data):
        return ("No walking path found!")
    return json_data

# Fetch crimes in the region
def crime_place(northeast_cords, southwest_cords):
    northeast = ','.join([
        str(northeast_cords['lat']),
        str(northeast_cords['lng']),
        ])
    northwest = ','.join([
        str(northeast_cords['lat']),
        str(southwest_cords['lng']),
        ])
    southwest = ','.join([
        str(southwest_cords['lat']),
        str(southwest_cords['lng'])
        ])
    southeast = ','.join([
        str(southwest_cords['lat']),
        str(northeast_cords['lng']),
        ])

    LOCATION = ':'.join([ northeast, northwest, southwest, southeast ])
    my_url = ('https://data.police.uk/api/crimes-street/all-crime?poly=%s&date=2017-01') % (LOCATION)

    # fetching results (json)
    resp = urllib.urlopen(my_url)
    json_raw = resp.read()

    if json_raw == "":
        return {}
    json_data = json.loads(json_raw)
    return json_data
