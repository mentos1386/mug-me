from flask import render_template, make_response, request, current_app, jsonify
import route_plan
from location_request import *


def index():
    return render_template('index.html', title="MugMe")


def search1():
    origin = request.args.get('origin', "", type=str)
    destination = request.args.get('destination', "", type=str)
    origin_geog = place_details(origin)
    destination_geog = place_details(destination)

    shops = find_shops(origin, destination)
    waypoint = route_plan.optimal_path(shops, origin_geog, destination_geog)

    print 'Waypoints: ' + str(waypoint)
    path = new_path(origin, destination, waypoint)

    print 'Paths: ' + str(path)

    return jsonify(path)


def search2():
    origin = request.args.get('origin', "", type=str)
    destination = request.args.get('destination', "", type=str)

    path = find_shops(origin, destination)

    return jsonify(find_shops(origin, destination).new_path)
