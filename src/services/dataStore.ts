import { create } from 'zustand';
import {
  Location,
  Supplier,
  Product,
  Inventory,
  Order,
  SupplyChainMetrics,
  CustomerNeed,
  TechnicalRequirement,
  Recommendation,
  RiskAssessment,
} from '../types';
import { initializeMockData } from './mockData';

interface DataStore {
  // Data
  locations: Location[];
  suppliers: Supplier[];
  products: Product[];
  inventory: Inventory[];
  orders: Order[];
  metrics: SupplyChainMetrics;
  customerNeeds: CustomerNeed[];
  technicalRequirements: TechnicalRequirement[];
  recommendations: Recommendation[];
  risks: RiskAssessment[];

  // Actions
  initialize: () => void;
  updateMetrics: (metrics: SupplyChainMetrics) => void;
  updateInventory: (inventory: Inventory[]) => void;
  updateOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateRecommendations: (recommendations: Recommendation[]) => void;
  updateRisks: (risks: RiskAssessment[]) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  // Initial state
  locations: [],
  suppliers: [],
  products: [],
  inventory: [],
  orders: [],
  metrics: {
    totalInventoryValue: 0,
    inventoryTurnover: 0,
    onTimeDeliveryRate: 0,
    orderFulfillmentRate: 0,
    supplierPerformanceScore: 0,
    totalLogisticsCost: 0,
    averageLeadTime: 0,
    networkCost: 0,
    carbonFootprint: 0,
    warehouseUtilization: 0,
  },
  customerNeeds: [],
  technicalRequirements: [],
  recommendations: [],
  risks: [],

  // Actions
  initialize: () => {
    const data = initializeMockData();
    set(data);
  },

  updateMetrics: (metrics) => set({ metrics }),
  updateInventory: (inventory) => set({ inventory }),
  updateOrders: (orders) => set({ orders }),
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
  updateRecommendations: (recommendations) => set({ recommendations }),
  updateRisks: (risks) => set({ risks }),
}));

