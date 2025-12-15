import { Product, Inventory, Supplier } from '../types';

// Economic Order Quantity (EOQ) calculation
export const calculateEOQ = (
  annualDemand: number,
  orderingCost: number,
  holdingCost: number
): number => {
  return Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
};

// Reorder Point calculation
export const calculateReorderPoint = (
  averageDailyDemand: number,
  leadTimeDays: number,
  safetyStock: number
): number => {
  return averageDailyDemand * leadTimeDays + safetyStock;
};

// Safety Stock calculation using service level
export const calculateSafetyStock = (
  standardDeviation: number,
  serviceLevel: number,
  leadTimeDays: number
): number => {
  // Z-score for common service levels
  const zScores: Record<number, number> = {
    0.9: 1.28,
    0.95: 1.645,
    0.99: 2.33,
  };
  const zScore = zScores[serviceLevel] || 1.645;
  return zScore * standardDeviation * Math.sqrt(leadTimeDays);
};

// Demand forecasting using simple exponential smoothing
export const forecastDemand = (
  historicalData: number[],
  periods: number,
  alpha: number = 0.3
): number[] => {
  const forecast: number[] = [];
  let S = historicalData[0];

  for (let i = 0; i < periods; i++) {
    forecast.push(S);
    if (i < historicalData.length - 1) {
      S = alpha * historicalData[i + 1] + (1 - alpha) * S;
    }
  }

  return forecast;
};

// ABC Analysis for inventory classification
export const performABCAnalysis = (
  products: Product[]
): { A: Product[]; B: Product[]; C: Product[] } => {
  const sorted = [...products].sort(
    (a, b) => b.demand * b.unitCost - a.demand * a.unitCost
  );
  const total = sorted.reduce((sum, p) => sum + p.demand * p.unitCost, 0);

  let cumulativeValue = 0;
  const A: Product[] = [];
  const B: Product[] = [];
  const C: Product[] = [];

  for (const product of sorted) {
    cumulativeValue += product.demand * product.unitCost;
    const percentage = (cumulativeValue / total) * 100;

    if (percentage <= 80) {
      A.push(product);
    } else if (percentage <= 95) {
      B.push(product);
    } else {
      C.push(product);
    }
  }

  return { A, B, C };
};

// Calculate optimal warehouse inventory levels
export const optimizeInventoryLevels = (
  products: Product[],
  warehouses: number
): Record<string, number> => {
  const levels: Record<string, number> = {};

  for (const product of products) {
    const eoq = calculateEOQ(product.demand, 50, 0.25 * product.unitCost);
    const safetyStock = calculateSafetyStock(
      product.demand * 0.2,
      0.95,
      product.supplier.leadTime
    );
    const reorderPoint = calculateReorderPoint(
      product.demand / 365,
      product.supplier.leadTime,
      safetyStock
    );

    levels[product.id] = Math.ceil(
      (eoq / 2 + safetyStock + reorderPoint) / warehouses
    );
  }

  return levels;
};

// Calculate inventory turnover ratio
export const calculateInventoryTurnover = (
  cogs: number,
  averageInventoryValue: number
): number => {
  return averageInventoryValue > 0 ? cogs / averageInventoryValue : 0;
};

// Predict stockouts
export const predictStockouts = (
  inventory: Inventory[],
  demandForecast: Record<string, number[]>
): string[] => {
  const stockouts: string[] = [];

  for (const item of inventory) {
    const forecast = demandForecast[item.productId] || [0];
    const nextDemand = forecast[0] || 0;

    if (item.quantity < nextDemand) {
      stockouts.push(item.productId);
    }
  }

  return stockouts;
};

// Supplier selection optimization
export const selectOptimalSupplier = (
  suppliers: Supplier[],
  requiredQuantity: number,
  weights = {
    cost: 0.4,
    reliability: 0.3,
    leadTime: 0.2,
    carbonEmissions: 0.1,
  }
): Supplier => {
  let bestSupplier = suppliers[0];
  let bestScore = -Infinity;

  for (const supplier of suppliers) {
    if (supplier.capacity < requiredQuantity) continue;

    const costScore = 1 - supplier.costPerUnit / Math.max(...suppliers.map(s => s.costPerUnit));
    const reliabilityScore = supplier.reliabilityScore / 100;
    const leadTimeScore = 1 - supplier.leadTime / Math.max(...suppliers.map(s => s.leadTime));
    const emissionScore = 1 - supplier.carbonEmissions / Math.max(...suppliers.map(s => s.carbonEmissions));

    const totalScore =
      costScore * weights.cost +
      reliabilityScore * weights.reliability +
      leadTimeScore * weights.leadTime +
      emissionScore * weights.carbonEmissions;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestSupplier = supplier;
    }
  }

  return bestSupplier;
};
