import React, { useEffect, useState } from 'react';
import { useDataStore } from '@/services/dataStore';
import { SupplyChainMap } from '@/components/map/SupplyChainMap';
import { MetricCard, ChartContainer, Table, Badge } from '@/components/shared/index';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, Truck, DollarSign, AlertTriangle, Leaf } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const store = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!store.locations.length) {
      store.initialize();
    }
    setMounted(true);
  }, [store]);

  if (!mounted || !store.metrics) return <div className="p-6">Loading...</div>;

  // Prepare chart data
  const inventoryTrendData = [
    { month: 'Jan', value: store.metrics.totalInventoryValue * 0.8 },
    { month: 'Feb', value: store.metrics.totalInventoryValue * 0.85 },
    { month: 'Mar', value: store.metrics.totalInventoryValue * 0.9 },
    { month: 'Apr', value: store.metrics.totalInventoryValue * 0.88 },
    { month: 'May', value: store.metrics.totalInventoryValue },
  ];

  const costBreakdown = [
    { name: 'Logistics', value: store.metrics.totalLogisticsCost * 0.4 },
    { name: 'Inventory', value: store.metrics.totalInventoryValue * 0.3 },
    { name: 'Warehousing', value: store.metrics.networkCost * 0.2 },
    { name: 'Admin', value: store.metrics.totalLogisticsCost * 0.1 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const locationStats = store.locations.map((loc: any) => ({
    name: loc.name.split(' - ')[0],
    capacity: loc.capacity || 0,
    utilization: loc.currentLoad || 0,
    type: loc.type,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Supply Chain Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Inventory Value"
          value={`$${(store.metrics.totalInventoryValue / 1000).toFixed(1)}K`}
          change={-5}
          icon={<Package />}
          color="blue"
        />
        <MetricCard
          title="On-Time Delivery Rate"
          value={`${(store.metrics.onTimeDeliveryRate * 100).toFixed(1)}%`}
          change={8}
          icon={<Truck />}
          color="green"
        />
        <MetricCard
          title="Total Logistics Cost"
          value={`$${(store.metrics.totalLogisticsCost / 1000).toFixed(1)}K`}
          change={3}
          icon={<DollarSign />}
          color="yellow"
        />
        <MetricCard
          title="Inventory Turnover"
          value={store.metrics.inventoryTurnover.toFixed(2)}
          change={12}
          icon={<TrendingUp />}
          color="green"
        />
        <MetricCard
          title="Supplier Performance"
          value={`${store.metrics.supplierPerformanceScore.toFixed(1)}/100`}
          change={-2}
          icon={<AlertTriangle />}
          color="blue"
        />
        <MetricCard
          title="Carbon Footprint"
          value={`${store.metrics.carbonFootprint.toFixed(0)} kg CO2`}
          change={-15}
          icon={<Leaf />}
          color="green"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer title="Inventory Trend (Last 5 Months)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={inventoryTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Cost Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: any) =>
                  `${name}: $${(value / 1000).toFixed(1)}K`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdown.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Map and Location Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Supply Chain Network</h3>
          </div>
          <SupplyChainMap locations={store.locations} height="400px" />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Summary</h3>
          <div className="space-y-3">
            {locationStats.map((loc: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium text-gray-700">{loc.name}</p>
                <p className="text-xs text-gray-600 mb-2">
                  <Badge
                    label={loc.type.replace('_', ' ')}
                    color={
                      loc.type === 'warehouse'
                        ? 'blue'
                        : loc.type === 'supplier'
                          ? 'red'
                          : 'green'
                    }
                    size="sm"
                  />
                </p>
                {loc.capacity > 0 && (
                  <div>
                    <p className="text-xs text-gray-600">
                      {((loc.utilization / loc.capacity) * 100).toFixed(0)}% utilized
                    </p>
                    <div className="bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(loc.utilization / loc.capacity) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <Table
          headers={['Order ID', 'Product', 'Quantity', 'Status', 'Cost', 'Expected Delivery']}
          rows={store.orders.slice(0, 5).map((order: any) => {
            const product = store.products.find((p: any) => p.id === order.productId);
            return [
              order.id,
              product?.name || 'Unknown',
              order.quantity,
              order.status.replace('_', ' '),
              `$${order.cost.toFixed(2)}`,
              new Date(order.expectedDelivery).toLocaleDateString(),
            ];
          })}
        />
      </div>
    </div>
  );
};
