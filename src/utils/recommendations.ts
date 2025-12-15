import {
  Location,
  Supplier,
  Product,
  Inventory,
  Order,
  SupplyChainMetrics,
  Recommendation,
  RiskAssessment,
} from '../types';
import { calculateDistance } from './routeOptimization';
import { selectOptimalSupplier } from './inventoryOptimization';

// Generate comprehensive supply chain recommendations
export const generateRecommendations = (
  suppliers: Supplier[],
  products: Product[],
  inventories: Inventory[],
  orders: Order[],
  metrics: SupplyChainMetrics
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Supplier consolidation recommendation
  if (suppliers.length > 5) {
    recommendations.push({
      id: 'rec-001',
      title: 'Supplier Consolidation',
      description: 'Reduce supplier base by consolidating with top-performing suppliers to improve negotiating power and reduce overhead',
      impact: 'high',
      category: 'supplier_management',
      estimatedSavings: metrics.totalLogisticsCost * 0.1,
      implementationDifficulty: 'medium',
      timelineWeeks: 12,
    });
  }

  // Inventory optimization recommendation
  if (metrics.inventoryTurnover < 4) {
    recommendations.push({
      id: 'rec-002',
      title: 'Inventory Optimization',
      description: 'Implement ABC analysis and reduce safety stock levels for C-category items',
      impact: 'high',
      category: 'inventory_management',
      estimatedSavings: metrics.totalInventoryValue * 0.15,
      implementationDifficulty: 'easy',
      timelineWeeks: 4,
    });
  }

  // Lead time reduction
  if (metrics.averageLeadTime > 7) {
    recommendations.push({
      id: 'rec-003',
      title: 'Lead Time Reduction',
      description: 'Implement just-in-time procurement and express shipping for critical items',
      impact: 'medium',
      category: 'procurement',
      estimatedSavings: metrics.totalLogisticsCost * 0.08,
      implementationDifficulty: 'hard',
      timelineWeeks: 16,
    });
  }

  // Carbon footprint reduction
  if (metrics.carbonFootprint > 1000) {
    recommendations.push({
      id: 'rec-004',
      title: 'Sustainability Initiative',
      description: 'Shift to eco-friendly suppliers and consolidate shipments to reduce carbon emissions',
      impact: 'medium',
      category: 'sustainability',
      estimatedSavings: metrics.carbonFootprint * 0.3,
      implementationDifficulty: 'medium',
      timelineWeeks: 20,
    });
  }

  // Warehouse utilization
  if (metrics.warehouseUtilization < 0.7) {
    recommendations.push({
      id: 'rec-005',
      title: 'Warehouse Consolidation',
      description: 'Consolidate warehouse network to improve utilization and reduce fixed costs',
      impact: 'high',
      category: 'warehouse_management',
      estimatedSavings: metrics.networkCost * 0.2,
      implementationDifficulty: 'hard',
      timelineWeeks: 24,
    });
  }

  // On-time delivery
  if (metrics.onTimeDeliveryRate < 0.95) {
    recommendations.push({
      id: 'rec-006',
      title: 'Delivery Performance',
      description: 'Implement predictive delivery tracking and buffer inventory for high-demand regions',
      impact: 'medium',
      category: 'logistics',
      estimatedSavings: products.length * 100,
      implementationDifficulty: 'medium',
      timelineWeeks: 8,
    });
  }

  // Demand forecasting
  recommendations.push({
    id: 'rec-007',
    title: 'Advanced Forecasting',
    description: 'Implement machine learning-based demand forecasting to improve accuracy',
    impact: 'high',
    category: 'planning',
    estimatedSavings: metrics.totalInventoryValue * 0.1,
    implementationDifficulty: 'hard',
    timelineWeeks: 12,
  });

  // Cost optimization
  if (metrics.totalLogisticsCost > 100000) {
    recommendations.push({
      id: 'rec-008',
      title: 'Logistics Cost Optimization',
      description: 'Renegotiate carrier contracts and implement load optimization algorithms',
      impact: 'medium',
      category: 'logistics',
      estimatedSavings: metrics.totalLogisticsCost * 0.12,
      implementationDifficulty: 'medium',
      timelineWeeks: 10,
    });
  }

  return recommendations.slice(0, 10);
};

// Generate risk assessments
export const generateRiskAssessments = (
  suppliers: Supplier[],
  metrics: SupplyChainMetrics
): RiskAssessment[] => {
  const risks: RiskAssessment[] = [];

  // Supplier concentration risk
  const topSupplierShare = suppliers.length > 0 ? 1 / suppliers.length : 1;
  risks.push({
    id: 'risk-001',
    category: 'supplier_risk',
    description: 'High concentration on limited suppliers',
    probability: topSupplierShare > 0.3 ? 0.8 : 0.3,
    impact: 0.9,
    riskScore: (topSupplierShare > 0.3 ? 0.8 : 0.3) * 0.9,
    mitigation: 'Diversify supplier base and establish backup suppliers',
  });

  // Inventory stockout risk
  risks.push({
    id: 'risk-002',
    category: 'inventory_risk',
    description: 'High risk of stockouts',
    probability: metrics.averageLeadTime > 7 ? 0.6 : 0.2,
    impact: 0.8,
    riskScore: (metrics.averageLeadTime > 7 ? 0.6 : 0.2) * 0.8,
    mitigation: 'Increase safety stock levels and improve demand forecasting',
  });

  // Transportation disruption
  risks.push({
    id: 'risk-003',
    category: 'logistics_risk',
    description: 'Transportation network disruption',
    probability: 0.3,
    impact: 0.7,
    riskScore: 0.3 * 0.7,
    mitigation: 'Establish alternative transportation routes and carriers',
  });

  // Quality risk
  const avgReliability =
    suppliers.reduce((sum, s) => sum + s.reliabilityScore, 0) / suppliers.length;
  risks.push({
    id: 'risk-004',
    category: 'quality_risk',
    description: 'Supplier quality issues',
    probability: avgReliability < 85 ? 0.5 : 0.15,
    impact: 0.6,
    riskScore: (avgReliability < 85 ? 0.5 : 0.15) * 0.6,
    mitigation: 'Implement strict quality control and supplier audits',
  });

  // Demand volatility
  risks.push({
    id: 'risk-005',
    category: 'demand_risk',
    description: 'Unexpected demand fluctuations',
    probability: 0.4,
    impact: 0.7,
    riskScore: 0.4 * 0.7,
    mitigation: 'Implement flexible capacity and collaborative forecasting',
  });

  return risks;
};

// Generate action plan items
export const generateActionPlanItems = (recommendations: Recommendation[]) => {
  return recommendations
    .sort((a, b) => {
      const impactWeight = { high: 3, medium: 2, low: 1 };
      return impactWeight[b.impact] - impactWeight[a.impact];
    })
    .slice(0, 5);
};
