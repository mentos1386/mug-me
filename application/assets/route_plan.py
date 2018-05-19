from collections import namedtuple
from geopy import Point, distance

# working key
API_KEY = 'AIzaSyCIL4iv4nUrjD8ZhnzayE3G_4aOK0xNas8'
MAX_STEPS = 6  # MAYBE 5? NOT SURE ;)

FROM = (LATS, LkONGS)
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
            if not optimal_distance or dist < optimal_distance:
                optimal_distance = dist
                optimal = other

        return optimal

    def near_nodes(self, graph):
        lats = sorted([self.area[0].latitdue, self.area[1].latitdue])
        longs = sorted([self.area[0].longitude, self.area[1].longitude])

        def inside(pot):
            return ((lats[0] - 0.1 <= pot.latitude <= lats[1] + 0.01) and (
                        longs[0] - 0.1 <= pot.longitude <= longs[1] + 0.01))

        nodes = [node for node in graph if inside(node.pot)]

        return nodes


def optimal_path(nodes, origin, dest):
    nodes = [Point(lats, longs) for lats, longs in nodes]
    origin = Point(origin)
    dest = Point(dest)

    waypoint_collec = [waypoint(origin, (origin, dest))]
    waypoint_collec += [waypoint(node, (origin, dest)) for node in nodes]

    to_dest = waypoint(dest, (origin, dest))

    waypoint.append(to_dest)
    begin, remaining = waypoint[0], waypoint[1:]
    path = []

    # Check for the rang to see if its the nearest to the start point
    for i in range(MAX_STEPS):
        nearer = begin.nearest(remaining)
        if nearer is None:
            break

        path.append(nearer)
        remaining = [pot for pot in remaining if pot != nearer]
        begin = nearer

    # Does the path provide the correct destination?
    if to_dest in path:
        path.remove(to_dest)

    return '|'.join(["via:{},{}".format(pot.pot.latitude, pot.pot.longitude) for pot in path])


def main():
    longs_lats = [Point(pot[0]) for pot in WAYPOINTS]
    path = optimal_path(longs_lats, Point(FROM), Point(TO))
    print(path)


if __name__ == '__main__':
    main()
