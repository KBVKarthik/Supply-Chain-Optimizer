import {
  Location,
  Supplier,
  Product,
  Inventory,
  Order,
  SupplyChainMetrics,
  CustomerNeed,
  TechnicalRequirement,
} from '../types';

// Generate mock locations
export const generateMockLocations = (): Location[] => {
  const locations: Location[] = [
    {
      id: 'loc-001',
      name: 'Main Warehouse - New York',
      lat: 40.7128,
      lng: -74.006,
      type: 'warehouse',
      capacity: 50000,
      currentLoad: 35000,
    },
    {
      id: 'loc-002',
      name: 'Distribution Center - Los Angeles',
      lat: 34.0522,
      lng: -118.2437,
      type: 'distribution_center',
      capacity: 30000,
      currentLoad: 22000,
    },
    {
      id: 'loc-003',
      name: 'Supplier - Shanghai',
      lat: 31.2304,
      lng: 121.4737,
      type: 'supplier',
      capacity: 100000,
      currentLoad: 75000,
    },
    {
      id: 'loc-004',
      name: 'Supplier - Germany',
      lat: 52.52,
      lng: 13.405,
      type: 'supplier',
      capacity: 80000,
      currentLoad: 60000,
    },
    {
      id: 'loc-005',
      name: 'Customer Hub - Chicago',
      lat: 41.8781,
      lng: -87.6298,
      type: 'customer',
    },
    {
      id: 'loc-006',
      name: 'Customer Hub - Houston',
      lat: 29.7604,
      lng: -95.3698,
      type: 'customer',
    },
    {
      id: 'loc-007',
      name: 'Regional Warehouse - Atlanta',
      lat: 33.749,
      lng: -84.388,
      type: 'warehouse',
      capacity: 25000,
      currentLoad: 18000,
    },
    {
      id: 'loc-008',
      name: 'Supplier - India',
      lat: 28.6139,
      lng: 77.209,
      type: 'supplier',
      capacity: 60000,
      currentLoad: 40000,
    },
  ];
  return locations;
};

// Generate mock suppliers
export const generateMockSuppliers = (locations: Location[]): Supplier[] => {
  const supplierLocations = locations.filter((l) => l.type === 'supplier');

  return [
    {
      id: 'sup-001',
      name: 'Global Electronics Supply Co.',
      location: supplierLocations[0],
      leadTime: 14,
      reliabilityScore: 92,
      costPerUnit: 25,
      capacity: 100000,
      minOrderQuantity: 500,
      carbonEmissions: 2.5,
    },
    {
      id: 'sup-002',
      name: 'Premium Manufacturing Ltd.',
      location: supplierLocations[1],
      leadTime: 21,
      reliabilityScore: 88,
      costPerUnit: 22,
      capacity: 80000,
      minOrderQuantity: 300,
      carbonEmissions: 2.1,
    },
    {
      id: 'sup-003',
      name: 'Quick Supply Solutions',
      location: supplierLocations[2],
      leadTime: 7,
      reliabilityScore: 85,
      costPerUnit: 28,
      capacity: 60000,
      minOrderQuantity: 200,
      carbonEmissions: 2.8,
    },
    {
      id: 'sup-004',
      name: 'Eco-Friendly Components Inc.',
      location: supplierLocations[3],
      leadTime: 10,
      reliabilityScore: 94,
      costPerUnit: 26,
      capacity: 70000,
      minOrderQuantity: 400,
      carbonEmissions: 1.5,
    },
  ];
};

// Generate mock products
export const generateMockProducts = (suppliers: Supplier[]): Product[] => {
  const products: Product[] = [
    {
      id: 'prod-001',
      name: 'Microprocessor Unit',
      sku: 'MPU-001',
      demand: 5000,
      supplier: suppliers[0],
      safetyStock: 500,
      unitCost: 25,
      shelfLife: 365,
      weight: 0.05,
      volume: 0.001,
    },
    {
      id: 'prod-002',
      name: 'Memory Module (16GB)',
      sku: 'MEM-016',
      demand: 3000,
      supplier: suppliers[1],
      safetyStock: 300,
      unitCost: 22,
      shelfLife: 730,
      weight: 0.1,
      volume: 0.002,
    },
    {
      id: 'prod-003',
      name: 'Power Supply Unit',
      sku: 'PSU-500',
      demand: 2000,
      supplier: suppliers[2],
      safetyStock: 200,
      unitCost: 28,
      shelfLife: 365,
      weight: 1.5,
      volume: 0.05,
    },
    {
      id: 'prod-004',
      name: 'Cooling Fan Assembly',
      sku: 'FAN-120',
      demand: 4500,
      supplier: suppliers[3],
      safetyStock: 450,
      unitCost: 12,
      shelfLife: 1095,
      weight: 0.3,
      volume: 0.008,
    },
    {
      id: 'prod-005',
      name: 'Motherboard',
      sku: 'MBD-ATX',
      demand: 1500,
      supplier: suppliers[0],
      safetyStock: 150,
      unitCost: 80,
      shelfLife: 365,
      weight: 0.5,
      volume: 0.015,
    },
  ];
  return products;
};

// Generate mock inventory
export const generateMockInventory = (
  products: Product[],
  warehouses: Location[]
): Inventory[] => {
  const inventories: Inventory[] = [];
  const warehouseList = warehouses.filter((l) => l.type === 'warehouse');

  for (const product of products) {
    for (const warehouse of warehouseList) {
      inventories.push({
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: Math.floor(Math.random() * 2000) + 500,
        lastUpdated: new Date(),
        reorderPoint: product.safetyStock * 2,
        optimalOrderQuantity: Math.ceil(product.demand / 12),
      });
    }
  }

  return inventories;
};

// Generate mock orders
export const generateMockOrders = (
  products: Product[],
  suppliers: Supplier[]
): Order[] => {
  const orders: Order[] = [];
  const baseDate = new Date();

  for (let i = 0; i < 20; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const orderDate = new Date(
      baseDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );
    const deliveryDate = new Date(
      orderDate.getTime() + product.supplier.leadTime * 24 * 60 * 60 * 1000
    );

    orders.push({
      id: `order-${i + 1}`,
      productId: product.id,
      supplierId: product.supplier.id,
      quantity: Math.floor(Math.random() * 1000) + 100,
      orderDate,
      expectedDelivery: deliveryDate,
      status: ['pending', 'in_transit', 'delivered', 'cancelled'][
        Math.floor(Math.random() * 4)
      ] as any,
      cost: Math.random() * 50000 + 5000,
    });
  }

  return orders;
};

// Generate mock metrics
export const generateMockMetrics = (
  products: Product[],
  inventories: Inventory[],
  orders: Order[]
): SupplyChainMetrics => {
  const totalInventoryValue = inventories.reduce(
    (sum, inv) => {
      const product = products.find((p) => p.id === inv.productId);
      return sum + (product ? inv.quantity * product.unitCost : 0);
    },
    0
  );

  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const onTimeOrders = deliveredOrders.filter((o) => o.expectedDelivery >= new Date());
  const onTimeDeliveryRate =
    deliveredOrders.length > 0 ? onTimeOrders.length / deliveredOrders.length : 0;

  const totalLogisticsCost = orders.reduce((sum, o) => sum + o.cost, 0);
  const avgLeadTime =
    products.reduce((sum, p) => sum + p.supplier.leadTime, 0) / products.length;

  return {
    totalInventoryValue,
    inventoryTurnover: totalLogisticsCost / (totalInventoryValue || 1),
    onTimeDeliveryRate,
    orderFulfillmentRate: 0.92,
    supplierPerformanceScore: 89.5,
    totalLogisticsCost,
    averageLeadTime: avgLeadTime,
    networkCost: totalLogisticsCost * 1.2,
    carbonFootprint: orders.length * 50 + Math.random() * 500,
    warehouseUtilization: 0.75,
  };
};

// Generate customer needs for HoQ
export const generateCustomerNeeds = (): CustomerNeed[] => {
  return [
    { id: 'cn-001', name: 'Fast Delivery', importance: 5, weight: 0 },
    { id: 'cn-002', name: 'Low Cost', importance: 4, weight: 0 },
    { id: 'cn-003', name: 'Product Quality', importance: 5, weight: 0 },
    { id: 'cn-004', name: 'Reliable Supply', importance: 5, weight: 0 },
    { id: 'cn-005', name: 'Environmental Responsibility', importance: 3, weight: 0 },
  ];
};

// Generate technical requirements for HoQ
export const generateTechnicalRequirements = (): TechnicalRequirement[] => {
  return [
    { id: 'tr-001', name: 'Lead Time', unit: 'days', target: 7, weight: 0 },
    { id: 'tr-002', name: 'Inventory Turnover', unit: 'times/year', target: 8, weight: 0 },
    { id: 'tr-003', name: 'On-Time Delivery Rate', unit: '%', target: 98, weight: 0 },
    { id: 'tr-004', name: 'Supplier Reliability', unit: '%', target: 95, weight: 0 },
    { id: 'tr-005', name: 'Carbon Emissions', unit: 'kg CO2/unit', target: 2, weight: 0 },
    {
      id: 'tr-006',
      name: 'Order Accuracy',
      unit: '%',
      target: 99.5,
      weight: 0,
    },
  ];
};

// Initialize all mock data
export const initializeMockData = () => {
  const locations = generateMockLocations();
  const suppliers = generateMockSuppliers(locations);
  const products = generateMockProducts(suppliers);
  const warehouses = locations.filter(
    (l) => l.type === 'warehouse' || l.type === 'distribution_center'
  );
  const inventory = generateMockInventory(products, warehouses);
  const orders = generateMockOrders(products, suppliers);
  const metrics = generateMockMetrics(products, inventory, orders);
  const customerNeeds = generateCustomerNeeds();
  const technicalRequirements = generateTechnicalRequirements();

  return {
    locations,
    suppliers,
    products,
    inventory,
    orders,
    metrics,
    customerNeeds,
    technicalRequirements,
  };
};
