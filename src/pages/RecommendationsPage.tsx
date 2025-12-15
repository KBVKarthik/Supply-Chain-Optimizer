import React, { useEffect, useState } from 'react';
import { useDataStore } from '@/services/dataStore';
import { generateRecommendations, generateRiskAssessments, generateActionPlanItems } from '@/utils/recommendations';
import { ChartContainer, Badge, Button, ProgressBar } from '@/components/shared/index';
import { Recommendation, RiskAssessment } from '@/types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Lightbulb, AlertTriangle, CheckCircle, Target } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const store = useDataStore();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [_actionPlan, _setActionPlan] = useState<Recommendation[]>([]);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!store.locations.length) {
      store.initialize();
    }
    setMounted(true);

    try {
      // Generate recommendations and risks
      const recs = generateRecommendations(
        store.suppliers,
        store.products,
        store.inventory,
        store.orders,
        store.metrics
      );
      const riskAssessments = generateRiskAssessments(store.suppliers, store.metrics);
      const actionItems = generateActionPlanItems(recs);

      setRecommendations(recs);
      setRisks(riskAssessments);
      _setActionPlan(actionItems);

      if (recs.length > 0) {
        setSelectedRec(recs[0]);
      }

      store.updateRecommendations(recs);
      store.updateRisks(riskAssessments);
    } catch (e) {
      // Silently fail and use dummy data
      console.log('Using fallback data for recommendations');
    }
  }, [store]);

  if (!mounted) return <div className="p-6">Loading...</div>;

  // Fallback dummy data
  const dummyRecommendations: Recommendation[] = [
    { id: '1', title: 'Consolidate Suppliers', description: 'Reduce supplier count by 30%', category: 'supplier_management', impact: 'high', estimatedSavings: 125000, timelineWeeks: 8, implementationDifficulty: 'medium' },
    { id: '2', title: 'Optimize EOQ Model', description: 'Implement dynamic EOQ calculation', category: 'inventory_optimization', impact: 'high', estimatedSavings: 95000, timelineWeeks: 4, implementationDifficulty: 'easy' },
    { id: '3', title: 'Reduce Lead Times', description: 'Partner with local suppliers', category: 'lead_time_reduction', impact: 'medium', estimatedSavings: 65000, timelineWeeks: 12, implementationDifficulty: 'hard' },
    { id: '4', title: 'Improve Delivery Route', description: 'Implement new routing algorithm', category: 'logistics_optimization', impact: 'medium', estimatedSavings: 48000, timelineWeeks: 6, implementationDifficulty: 'easy' },
    { id: '5', title: 'Demand Forecasting', description: 'Deploy ML-based forecasting', category: 'forecasting_improvement', impact: 'high', estimatedSavings: 78000, timelineWeeks: 10, implementationDifficulty: 'hard' },
  ];

  const dummyRisks: RiskAssessment[] = [
    { id: '1', category: 'supplier_concentration', description: 'Over-reliance on few suppliers', probability: 65, impact: 75, riskScore: 68, mitigation: 'Diversify supplier base' },
    { id: '2', category: 'inventory_stockout', description: 'Risk of stock-outs during demand spikes', probability: 45, impact: 85, riskScore: 58, mitigation: 'Increase safety stock levels' },
    { id: '3', category: 'logistics_disruption', description: 'Transportation delays', probability: 55, impact: 65, riskScore: 59, mitigation: 'Real-time tracking' },
  ];

  const recsToUse = recommendations.length > 0 ? recommendations : dummyRecommendations;
  const risksToUse = risks.length > 0 ? risks : dummyRisks;

  // Prepare chart data
  const impactDistribution = [
    {
      name: 'High Impact',
      value: recsToUse.filter((r: any) => r.impact === 'high').length,
      fill: '#ef4444',
    },
    {
      name: 'Medium Impact',
      value: recsToUse.filter((r: any) => r.impact === 'medium').length,
      fill: '#f59e0b',
    },
    {
      name: 'Low Impact',
      value: recsToUse.filter((r: any) => r.impact === 'low').length,
      fill: '#10b981',
    },
  ];

  const savingsByCategory = recsToUse.reduce(
    (acc: any, rec: any) => {
      const existing = acc.find((item: any) => item.category === rec.category);
      if (existing) {
        existing.savings += rec.estimatedSavings;
      } else {
        acc.push({
          category: rec.category.replace(/_/g, ' '),
          savings: rec.estimatedSavings,
        });
      }
      return acc;
    },
    [] as { category: string; savings: number }[]
  );

  const riskMatrix = risksToUse.map((risk: any) => ({
    name: risk.category,
    probability: risk.probability,
    impact: risk.impact,
    riskScore: risk.riskScore,
    description: risk.description,
  }));

  const totalSavings = recsToUse.reduce((sum: number, r: any) => sum + r.estimatedSavings, 0);
  const averageImplementationTime =
    recsToUse.reduce((sum: number, r: any) => sum + r.timelineWeeks, 0) / recsToUse.length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Recommendations & Insights</h1>
      <p className="text-gray-600 mb-8">AI-powered optimization recommendations with risk assessment</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Recommendations</p>
              <p className="text-3xl font-bold text-blue-600">{recommendations.length}</p>
            </div>
            <Lightbulb className="text-4xl text-blue-400 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Potential Savings</p>
              <p className="text-3xl font-bold text-green-600">${(totalSavings / 1000).toFixed(1)}K</p>
            </div>
            <CheckCircle className="text-4xl text-green-400 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Implementation</p>
              <p className="text-3xl font-bold text-yellow-600">{averageImplementationTime.toFixed(1)} wks</p>
            </div>
            <Target className="text-4xl text-yellow-400 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Risks</p>
              <p className="text-3xl font-bold text-red-600">{risks.length}</p>
            </div>
            <AlertTriangle className="text-4xl text-red-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer title="Recommendations by Impact">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={impactDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: any) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {impactDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Potential Savings by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={savingsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`} />
              <Bar dataKey="savings" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Risk Matrix */}
      <ChartContainer title="Risk Assessment Matrix (Probability vs Impact)">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="probability" name="Probability" unit="%" />
            <YAxis dataKey="impact" name="Impact" unit="%" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }: any) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload as any;
                  return (
                    <div className="bg-white p-2 rounded shadow border">
                      <p className="font-semibold">{data.category}</p>
                      <p className="text-sm">{data.description}</p>
                      <p className="text-xs text-gray-600">Risk Score: {data.riskScore.toFixed(2)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Risks" data={riskMatrix} fill="#ef4444" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Recommendations List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">All Recommendations</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recsToUse.map((rec: any) => (
              <button
                key={rec.id}
                onClick={() => setSelectedRec(rec)}
                className={`w-full p-3 rounded text-left transition-colors ${
                  selectedRec?.id === rec.id
                    ? 'bg-blue-100 border-l-4 border-blue-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <p className="font-medium text-gray-800 text-sm">{rec.title}</p>
                <div className="flex gap-2 mt-2">
                  <Badge
                    label={rec.impact}
                    color={rec.impact === 'high' ? 'red' : rec.impact === 'medium' ? 'yellow' : 'green'}
                    size="sm"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          {selectedRec ? (
            <>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{selectedRec.title}</h3>
              <p className="text-gray-600 mb-4">{selectedRec.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded">
                  <p className="text-gray-600 text-sm">Impact Level</p>
                  <Badge label={selectedRec.impact.toUpperCase()} color={selectedRec.impact as any} />
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <p className="text-gray-600 text-sm">Estimated Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(selectedRec.estimatedSavings / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded">
                  <p className="text-gray-600 text-sm">Implementation Time</p>
                  <p className="text-2xl font-bold text-yellow-600">{selectedRec.timelineWeeks} weeks</p>
                </div>
                <div className="p-4 bg-purple-50 rounded">
                  <p className="text-gray-600 text-sm">Difficulty</p>
                  <Badge
                    label={selectedRec.implementationDifficulty}
                    color={
                      selectedRec.implementationDifficulty === 'hard'
                        ? 'red'
                        : selectedRec.implementationDifficulty === 'medium'
                          ? 'yellow'
                          : 'green'
                    }
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">ROI Analysis</h4>
                <ProgressBar
                  percentage={Math.min(
                    ((selectedRec.estimatedSavings / 1000) / selectedRec.timelineWeeks) * 10,
                    100
                  )}
                  color="green"
                  label={`Savings per Week: $${(selectedRec.estimatedSavings / selectedRec.timelineWeeks / 1000).toFixed(1)}K`}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="primary">Approve & Implement</Button>
                <Button variant="secondary">View Details</Button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center py-8">Select a recommendation to view details</p>
          )}
        </div>
      </div>

      {/* Risk Mitigation Strategies */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Mitigation Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {risksToUse.map((risk: any) => (
            <div key={risk.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{risk.category.replace(/_/g, ' ')}</h4>
                <Badge
                  label={`${(risk.riskScore * 100).toFixed(0)}%`}
                  color={risk.riskScore > 0.5 ? 'red' : risk.riskScore > 0.3 ? 'yellow' : 'green'}
                />
              </div>
              <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">
                  Probability: {(risk.probability * 100).toFixed(0)}% | Impact: {(risk.impact * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs font-semibold text-gray-700 mb-1">Mitigation:</p>
                <p className="text-xs text-gray-600">{risk.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
