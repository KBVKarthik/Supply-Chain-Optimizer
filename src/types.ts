export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'warehouse' | 'supplier' | 'customer' | 'distribution_center';
  capacity?: number;
  currentLoad?: number;
}

export interface Supplier {
  id: string;
  name: string;
  location: Location;
  leadTime: number; // in days
  reliabilityScore: number; // 0-100
  costPerUnit: number;
  capacity: number;
  minOrderQuantity: number;
  carbonEmissions: number; // kg CO2 per unit
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  demand: number;
  supplier: Supplier;
  safetyStock: number;
  unitCost: number;
  shelfLife: number; // in days
  weight: number; // kg
  volume: number; // m³
}

export interface Inventory {
  productId: string;
  warehouseId: string;
  quantity: number;
  lastUpdated: Date;
  reorderPoint: number;
  optimalOrderQuantity: number;
}

export interface Order {
  id: string;
  productId: string;
  supplierId: string;
  quantity: number;
  orderDate: Date;
  expectedDelivery: Date;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  cost: number;
}

export interface Route {
  id: string;
  name: string;
  stops: Location[];
  distance: number; // km
  estimatedTime: number; // hours
  cost: number;
  carbonFootprint: number; // kg CO2
  orders: Order[];
}

export interface SupplyChainMetrics {
  totalInventoryValue: number;
  inventoryTurnover: number;
  onTimeDeliveryRate: number;
  orderFulfillmentRate: number;
  supplierPerformanceScore: number;
  totalLogisticsCost: number;
  averageLeadTime: number;
  networkCost: number;
  carbonFootprint: number;
  warehouseUtilization: number;
}

export interface HouseOfQuality {
  technicalRequirements: TechnicalRequirement[];
  customerNeeds: CustomerNeed[];
  relationshipMatrix: number[][];
  priorityScores: number[];
}

export interface TechnicalRequirement {
  id: string;
  name: string;
  unit: string;
  target: number;
  weight: number;
}

export interface CustomerNeed {
  id: string;
  name: string;
  importance: number; // 1-5
  weight: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  estimatedSavings: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
  timelineWeeks: number;
}

export interface ActionPlan {
  id: string;
  title: string;
  recommendations: Recommendation[];
  timeline: string;
  estimatedROI: number;
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
}

export interface RiskAssessment {
  id: string;
  category: string;
  description: string;
  probability: number; // 0-1
  impact: number; // 0-1
  riskScore: number;
  mitigation: string;
}
