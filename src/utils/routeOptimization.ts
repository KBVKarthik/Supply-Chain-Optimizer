import { Location, Route, Order } from '../types';

// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Nearest neighbor heuristic for route optimization
export const optimizeRoute = (
  startLocation: Location,
  locations: Location[]
): Location[] => {
  const unvisited = [...locations];
  const route: Location[] = [startLocation];
  let current = startLocation;

  while (unvisited.length > 0) {
    let nearest = unvisited[0];
    let minDistance = calculateDistance(
      current.lat,
      current.lng,
      nearest.lat,
      nearest.lng
    );

    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(
        current.lat,
        current.lng,
        unvisited[i].lat,
        unvisited[i].lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = unvisited[i];
      }
    }

    route.push(nearest);
    current = nearest;
    unvisited.splice(unvisited.indexOf(nearest), 1);
  }

  return route;
};

// Calculate total route distance and time
export const calculateRouteMetrics = (
  route: Location[]
): { distance: number; time: number } => {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += calculateDistance(
      route[i].lat,
      route[i].lng,
      route[i + 1].lat,
      route[i + 1].lng
    );
  }
  // Assume average speed of 60 km/h
  const time = totalDistance / 60;
  return { distance: totalDistance, time };
};

// Estimate route cost based on distance and fuel consumption
export const calculateRouteCost = (distance: number): number => {
  // Assume $0.5 per km
  return distance * 0.5;
};

// Calculate carbon emissions
export const calculateCarbonEmissions = (
  distance: number,
  vehicleType: string = 'truck'
): number => {
  // Typical emissions: truck 0.5 kg CO2/km
  const emissionFactor = vehicleType === 'truck' ? 0.5 : 0.2;
  return distance * emissionFactor;
};

// Multi-stop route optimization with 2-opt improvement
export const improveRoute = (
  route: Location[],
  maxIterations: number = 100
): Location[] => {
  let bestRoute = [...route];
  let bestDistance = calculateRouteMetrics(bestRoute).distance;
  let improved = true;
  let iterations = 0;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 1; i < bestRoute.length - 1; i++) {
      for (let k = i + 1; k < bestRoute.length; k++) {
        const newRoute = [...bestRoute];
        // Reverse the section between i and k
        newRoute.splice(i, k - i, ...newRoute.slice(i, k).reverse());

        const newDistance = calculateRouteMetrics(newRoute).distance;
        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
  }

  return bestRoute;
};
