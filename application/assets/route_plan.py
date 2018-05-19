from collections import namedtuple
from geopy import point .distance

# working key
API_KEY = 'AIzaSyCIL4iv4nUrjD8ZhnzayE3G_4aOK0xNas8'
MAX_STEPS = 6  #MAYBE 5? NOT SURE ;)

FROM = (LONG, LAT)
TO = (LONG, LAT)

WAYPOINTS = [((LONG, LAT), INDEX),
            ((LONG, LAT), INDEX),
            ((LONG, LAT), INDEX),
            ((LONG, LAT), INDEX)]

class waypoint(namedtuple('waypoint', 'pat area')):
    def closet(self, graph):
        valid_nodes = self.closer_nodes(graph)
