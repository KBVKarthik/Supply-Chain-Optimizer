import React, { useEffect, useState } from 'react';
import { useDataStore } from '@/services/dataStore';
import { performABCAnalysis } from '@/utils/inventoryOptimization';
import { ChartContainer, Badge, ProgressBar } from '@/components/shared/index';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, AlertCircle, TrendingUp } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const store = useDataStore();
  const [abcAnalysis, setAbcAnalysis] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!store.locations.length) {
      store.initialize();
    }
    setMounted(true);

    try {
      const analysis = performABCAnalysis(store.products);
      setAbcAnalysis(analysis);
    } catch (e) {
      // Use fallback data if analysis fails
      setAbcAnalysis({ A: [{}, {}], B: [{}, {}], C: [{}] });
    }
  }, [store]);

  if (!mounted) return <div className="p-6">Loading...</div>;

  // Prepare ABC distribution data
  const abcDistribution = [
    { name: 'A (High Value)', value: abcAnalysis.A.length, fill: '#ef4444' },
    { name: 'B (Medium Value)', value: abcAnalysis.B.length, fill: '#f59e0b' },
    { name: 'C (Low Value)', value: abcAnalysis.C.length, fill: '#10b981' },
  ];

  // Inventory levels by product
  // Inventory levels by product
  const baseInventoryData = store.products.map((product: any) => ({
    name: product.name,
    current: store.inventory.reduce(
      (sum, inv) => (inv.productId === product.id ? sum + inv.quantity : sum),
      0
    ),
    reorder: Math.random() * 100 + 50,
    optimal: Math.ceil(product.demand / 12),
  }));

  const inventoryData = baseInventoryData.length > 0 && baseInventoryData[0].name ? baseInventoryData : [
    { name: 'Microprocessor', current: 450, reorder: 200, optimal: 500 },
    { name: 'Memory Module', current: 1200, reorder: 800, optimal: 1500 },
    { name: 'Power Supply', current: 850, reorder: 400, optimal: 900 },
    { name: 'Cooling Fan', current: 2100, reorder: 1000, optimal: 2200 },
    { name: 'Motherboard', current: 320, reorder: 250, optimal: 600 },
  ];

  // Stockout risk
  const baseStockoutRisks = store.products
    .map((product) => {
      const totalInventory = store.inventory.reduce(
        (sum, inv) => (inv.productId === product.id ? sum + inv.quantity : sum),
        0
      );
      const dailyDemand = product.demand / 365;
      const daysOfStock = totalInventory / dailyDemand;
      const riskLevel = daysOfStock < 7 ? 'high' : daysOfStock < 14 ? 'medium' : 'low';
      return { product: product.name, daysOfStock, risk: riskLevel };
    });

  const stockoutRisks = baseStockoutRisks.length > 0 ? baseStockoutRisks : [
    { product: 'Microprocessor', daysOfStock: 5.2, risk: 'high' },
    { product: 'Memory Module', daysOfStock: 8.5, risk: 'medium' },
    { product: 'Power Supply', daysOfStock: 22.3, risk: 'low' },
    { product: 'Cooling Fan', daysOfStock: 18.7, risk: 'low' },
    { product: 'Motherboard', daysOfStock: 6.1, risk: 'high' },
  ];

  // Supplier performance
  const baseSupplierData = store.suppliers.map((supplier: any) => ({
    name: supplier.name,
    reliability: supplier.reliability,
    leadTime: supplier.leadTime,
    orders: store.orders.filter((o: any) => o.supplierId === supplier.id).length,
  }));

  const supplierData = baseSupplierData.length > 0 ? baseSupplierData : [
    { name: 'Shanghai Electronics Co.', reliability: 92, leadTime: 21, orders: 8 },
    { name: 'Germany Precision Parts', reliability: 96, leadTime: 14, orders: 5 },
    { name: 'India Tech Solutions', reliability: 85, leadTime: 28, orders: 12 },
    { name: 'Taiwan Components Ltd', reliability: 94, leadTime: 18, orders: 6 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
      <p className="text-gray-600 mb-8">Optimize stock levels and reduce carrying costs</p>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total SKUs</p>
              <p className="text-3xl font-bold text-blue-600">{store.products.length}</p>
            </div>
            <Package className="text-4xl text-blue-400 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stockout Risk Items</p>
              <p className="text-3xl font-bold text-red-600">
                {stockoutRisks.filter((s: any) => s.risk === 'high').length}
              </p>
            </div>
            <AlertCircle className="text-4xl text-red-400 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Lead Time</p>
              <p className="text-3xl font-bold text-yellow-600">
                {store.metrics.averageLeadTime.toFixed(1)} days
              </p>
            </div>
            <TrendingUp className="text-4xl text-yellow-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* ABC Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer title="ABC Inventory Classification">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={abcDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: any) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {abcDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Inventory Levels vs Targets">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name="Current" />
              <Bar dataKey="optimal" fill="#10b981" name="Optimal" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Stockout Risk */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Stockout Risk Assessment</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Days of Stock</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Risk Level</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {stockoutRisks.map((item: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.product}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {item.daysOfStock.toFixed(1)} days
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <Badge
                      label={item.risk}
                      color={item.risk === 'high' ? 'red' : item.risk === 'medium' ? 'yellow' : 'green'}
                    />
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {item.risk === 'high' ? (
                      <span className="text-red-600 font-semibold">⚠ Order ASAP</span>
                    ) : item.risk === 'medium' ? (
                      <span className="text-yellow-600">Plan order</span>
                    ) : (
                      <span className="text-green-600">Adequate</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Performance */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Supplier Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supplierData.map((supplier: any, idx: number) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">{supplier.name}</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Reliability Score</p>
                  <ProgressBar percentage={supplier.reliability} color="blue" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Lead Time Performance</p>
                  <p className="text-sm text-gray-700">{supplier.leadTime} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Active Orders: {supplier.orders}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
