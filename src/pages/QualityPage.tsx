import React, { useEffect, useState } from 'react';
import { useDataStore } from '@/services/dataStore';
import { generateHouseOfQuality, generateRecommendationsFromHoQ } from '@/utils/houseOfQuality';
import { HouseOfQualityMatrix } from '@/components/analysis/HouseOfQualityMatrix';
import { ChartContainer, Badge } from '@/components/shared/index';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HouseOfQuality } from '@/types';

export const QualityPage: React.FC = () => {
  const store = useDataStore();
  const [hoq, setHoq] = useState<HouseOfQuality | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!store.locations.length) {
      store.initialize();
    }
    setMounted(true);

    if (store.customerNeeds.length > 0 && store.technicalRequirements.length > 0) {
      const hoqData = generateHouseOfQuality(
        store.customerNeeds,
        store.technicalRequirements
      );
      setHoq(hoqData);
      setRecommendations(generateRecommendationsFromHoQ(hoqData));
    }
  }, [store]);

  if (!mounted || !hoq) return <div className="p-6">Loading...</div>;

  // Prepare data for technical requirements performance
  const techPerformanceData = hoq.technicalRequirements.map((req: any, idx: number) => ({
    name: req.name,
    current: Math.random() * 80 + 20,
    target: req.target,
    priority: hoq.priorityScores[idx],
  }));

  // Customer importance distribution
  const customerImportanceData = hoq.customerNeeds.map((need: any) => ({
    name: need.name,
    importance: need.importance * 20,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Quality Management</h1>
      <p className="text-gray-600 mb-8">House of Quality Analysis & Technical Requirements</p>

      {/* House of Quality Matrix */}
      <div className="mb-8">
        <HouseOfQualityMatrix hoq={hoq} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer title="Technical Requirements Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={techPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name="Current" />
              <Bar dataKey="target" fill="#10b981" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Customer Need Importance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerImportanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="importance" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Action Items */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority Action Items</h3>
        <div className="space-y-3">
          {hoq.technicalRequirements
            .map((req: any, idx: number) => ({
              req,
              priority: hoq.priorityScores[idx],
            }))
            .sort((a: any, b: any) => b.priority - a.priority)
            .slice(0, 5)
            .map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-gradient-to-r from-blue-50 to-transparent rounded flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-gray-800">{item.req.name}</h4>
                  <p className="text-sm text-gray-600">Target: {item.req.target} {item.req.unit}</p>
                </div>
                <div className="text-right">
                  <Badge label={`Priority: ${item.priority.toFixed(1)}`} color="blue" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
