import os
import operator
import numpy as np
import math


MAX_ITERATIONS = 1000

def clus_means (data, k):

    centroids = []
    centroids = rand_centroids(data, centroids, k)

    old_centroids = [[] for i in range(k)]
    clusters =  [[] for i in range(k)]

    iterations = 0

    while not (has_converged(centroids,old_centroids,iterations)):
        iterations +=1

        clusters = euclidean_distance(data,centroids, clusters)

        #Cluster filled when empty with a single point randomly (no 0 means, ERROR)
        index = 0
        for cluster in clusters:
            old_centroids[index] = centroids[index]
            centroids[index] = np.mean(cluster, axis=0) .tolist()
            index += 1



    return (centroids, clusters)

#converged cluster status
def has_converged(centroids, old_centroids, iterations)
    if iterations > MAX_ITERATIONS:
        return True
    return old_centroids == centroids


#rand centroids
def rand_centroids(data , centroids, k):
    for cluster in range(0, k):
        rand_number = np.random.randint(0, len(0), size = 1)
        centroids.append(data[rand_number])
    return centroids



#Distance between point and provided centroids
def euclidean_distance(data, centroids, clusters):
    for instance in data:
        min_distance = float("inf")
        index = 0
        for centroid in centroids:
            distance = math.sqrt((centroid[0] - instance[0]) * (centroid[0] - instance[0]) + (centroid[1] - instance[1]) * (centroid[1] - instance[1]))
            if (distance < min_distance):
                min_distance = distance
                cen_index = index
            index += 1

        clusters[cen_index].append(instance)


    for cluster in clusters:
        if not cluster:
            clusters.append(data[np.random.randint(0, len(data), size = 1)])

    return  clusters

