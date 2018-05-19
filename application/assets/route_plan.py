from collections import namedtuple
from geopy import point, distance


API_KEY = 'AIzaSyAi48pPuajuZgZTb9NvqZofvMZt3eepmlg'
MAX_STEPS = 6  #MAYBE 5? NOT SURE ;)

FROM = (LATS, LONGS)
TO = (LATS, LONGS)

WAYPOINTS = [((LATS, LONGS), INDEX),
            ((LATS, LONGS), INDEX),
            ((LATS, LONGS), INDEX),
            ((LATS, LONGS), INDEX)]

class waypoint(namedtuple('waypoint', 'pat area')):

    def closet(self, graph):
        valid_nodes = self.closer_nodes(graph)
        optimal_distance = None
        optimal = None

        for other in valid_nodes:
            dist = distance.distance(self.pat, other.pat).meters
            if not optimal_distance or dist <  optimal_distance:
                optimal_distance = dist
                optimal = other

        return optimal

    def near_nodes(self, graph):
        lat = sorted([self.area[0]])
        long

