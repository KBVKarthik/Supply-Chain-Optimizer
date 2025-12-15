import React, { useEffect, useState } from 'react';
import { useDataStore } from '@/services/dataStore';
import { improveRoute, calculateRouteMetrics, calculateRouteCost, calculateCarbonEmissions } from '@/utils/routeOptimization';
import { SupplyChainMap } from '@/components/map/SupplyChainMap';
import { ChartContainer, Table, Badge, MetricCard } from '@/components/shared/index';
import { Route } from '@/types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Navigation, Zap, Leaf, DollarSign } from 'lucide-react';

export const RouteOptimizationPage: React.FC = () => {
  const store = useDataStore();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [optimizedRoutes, setOptimizedRoutes] = useState<Route[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!store.locations.length) {
      store.initialize();
    }
    setMounted(true);

    // Generate sample routes from warehouse to customers
    const warehouses = store.locations.filter((l: any) => l.type === 'warehouse');
    const customers = store.locations.filter((l: any) => l.type === 'customer');

    if (warehouses.length > 0 && customers.length > 0) {
      const newRoutes: Route[] = [];

      for (const warehouse of warehouses) {
        // Create routes from each warehouse to nearby customers
        const relevantCustomers = customers.slice(0, 2);
        const stops = [warehouse, ...relevantCustomers];

        const { distance, time } = calculateRouteMetrics(stops);
        const cost = calculateRouteCost(distance);
        const carbonFootprint = calculateCarbonEmissions(distance);

        newRoutes.push({
          id: `route-${warehouse.id}`,
          name: `${warehouse.name} to Customers`,
          stops,
          distance,
          estimatedTime: time,
          cost,
          carbonFootprint,
          orders: store.orders.slice(0, 3),
        });
      }

      setRoutes(newRoutes);
      if (newRoutes.length > 0) {
        setSelectedRoute(newRoutes[0]);
      }

      // Optimize routes
      const optimized = newRoutes.map((route) => {
        const optimizedStops = improveRoute(route.stops, 50);
        const { distance, time } = calculateRouteMetrics(optimizedStops);
        return {
          ...route,
          stops: optimizedStops,
          distance,
          estimatedTime: time,
          cost: calculateRouteCost(distance),
          carbonFootprint: calculateCarbonEmissions(distance),
        };
      });

      setOptimizedRoutes(optimized);
    }
  }, [store]);

  if (!mounted) return <div className="p-6">Loading...</div>;

  // Prepare comparison data
  const comparisonData = routes.map((route, idx) => ({
    name: `Route ${idx + 1}`,
    original: route.distance,
    optimized: optimizedRoutes[idx]?.distance || 0,
    originalCost: route.cost,
    optimizedCost: optimizedRoutes[idx]?.cost || 0,
  }));

  const savingsData = comparisonData.map((item) => ({
    name: item.name,
    distanceSavings: item.original - item.optimized,
    costSavings: item.originalCost - item.optimizedCost,
    carbonSavings: ((item.original - item.optimized) / item.original) * 100,
  }));

  const totalStats = {
    originalDistance: routes.reduce((sum, r) => sum + r.distance, 0),
    optimizedDistance: optimizedRoutes.reduce((sum, r) => sum + r.distance, 0),
    originalCost: routes.reduce((sum, r) => sum + r.cost, 0),
    optimizedCost: optimizedRoutes.reduce((sum, r) => sum + r.cost, 0),
    originalCarbon: routes.reduce((sum, r) => sum + r.carbonFootprint, 0),
    optimizedCarbon: optimizedRoutes.reduce((sum, r) => sum + r.carbonFootprint, 0),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Route Optimization</h1>
      <p className="text-gray-600 mb-8">Optimize delivery routes to reduce costs and emissions</p>

      {/* Key Savings Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Distance Saved"
          value={`${(totalStats.originalDistance - totalStats.optimizedDistance).toFixed(0)} km`}
          change={Math.round(
            ((totalStats.originalDistance - totalStats.optimizedDistance) / totalStats.originalDistance) * 100
          )}
          icon={<Navigation />}
          color="blue"
        />
        <MetricCard
          title="Cost Reduction"
          value={`$${(totalStats.originalCost - totalStats.optimizedCost).toFixed(0)}`}
          change={Math.round(
            ((totalStats.originalCost - totalStats.optimizedCost) / totalStats.originalCost) * 100
          )}
          icon={<DollarSign />}
          color="green"
        />
        <MetricCard
          title="Carbon Reduction"
          value={`${(totalStats.originalCarbon - totalStats.optimizedCarbon).toFixed(0)} kg CO2`}
          change={Math.round(
            ((totalStats.originalCarbon - totalStats.optimizedCarbon) / totalStats.originalCarbon) * 100
          )}
          icon={<Leaf />}
          color="green"
        />
        <MetricCard
          title="Efficiency Gain"
          value={`${(
            ((totalStats.originalDistance - totalStats.optimizedDistance) / totalStats.originalDistance) *
            100
          ).toFixed(1)}%`}
          icon={<Zap />}
          color="yellow"
        />
      </div>

      {/* Route Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedRoute ? selectedRoute.name : 'Select a route'}
              </h3>
            </div>
            <SupplyChainMap
              locations={selectedRoute?.stops || []}
              routes={selectedRoute ? [selectedRoute] : []}
              height="400px"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Routes</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {optimizedRoutes.map((route, _idx) => (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`w-full p-3 rounded text-left transition-colors ${
                  selectedRoute?.id === route.id
                    ? 'bg-blue-100 border-l-4 border-blue-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <p className="font-medium text-gray-800">{route.name}</p>
                <p className="text-sm text-gray-600">{route.stops.length} stops</p>
                <div className="flex gap-2 mt-2">
                  <Badge label={`${route.distance.toFixed(0)} km`} color="blue" size="sm" />
                  <Badge label={`$${route.cost.toFixed(0)}`} color="green" size="sm" />
                  <Badge label={`${route.carbonFootprint.toFixed(0)} kg CO2`} color="yellow" size="sm" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer title="Distance Optimization">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="original" fill="#ef4444" name="Original" />
              <Bar dataKey="optimized" fill="#10b981" name="Optimized" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Savings Achieved">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="distanceSavings"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Distance (km)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="carbonSavings"
                stroke="#10b981"
                strokeWidth={2}
                name="Carbon (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Detailed Route Information */}
      {selectedRoute && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Details: {selectedRoute.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-gray-600 text-sm">Total Distance</p>
              <p className="text-2xl font-bold text-blue-600">{selectedRoute.distance.toFixed(2)} km</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-gray-600 text-sm">Estimated Time</p>
              <p className="text-2xl font-bold text-green-600">{selectedRoute.estimatedTime.toFixed(1)} hrs</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded">
              <p className="text-gray-600 text-sm">Total Cost</p>
              <p className="text-2xl font-bold text-yellow-600">${selectedRoute.cost.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-red-50 rounded">
              <p className="text-gray-600 text-sm">Carbon Emissions</p>
              <p className="text-2xl font-bold text-red-600">{selectedRoute.carbonFootprint.toFixed(1)} kg</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Route Stops</h4>
            <Table
              headers={['Stop #', 'Location', 'Type', 'Coordinates']}
              rows={selectedRoute.stops.map((stop, idx) => [
                idx + 1,
                stop.name,
                stop.type.replace('_', ' '),
                `${stop.lat.toFixed(2)}, ${stop.lng.toFixed(2)}`,
              ])}
            />
          </div>
        </div>
      )}
    </div>
  );
};
