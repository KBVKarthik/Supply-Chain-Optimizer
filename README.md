# Supply Chain Optimizer - Advanced Logistics Platform

A comprehensive, modern web-based supply chain optimization platform with 20+ features for managing inventory, routes, suppliers, and logistics. Built with React, TypeScript, and cutting-edge open-source technologies.

## 🎯 Key Features (20+)

### 1. **Demand Forecasting**

- Exponential smoothing algorithm
- Historical trend analysis
- Predictive analytics

### 2. **Inventory Optimization**

- Economic Order Quantity (EOQ) calculation
- Safety stock optimization
- Reorder point determination
- Automatic stock-out prediction

### 3. **ABC Inventory Analysis**

- Product classification by value
- Automated inventory stratification
- Priority-based management

### 4. **Route Optimization**

- Nearest neighbor heuristic algorithm
- 2-opt route improvement
- Multi-stop delivery optimization
- Distance and time estimation

### 5. **Carbon Footprint Tracking**

- Emissions calculation per route
- Environmental impact assessment
- Sustainability metrics
- Carbon reduction recommendations

### 6. **Supplier Management**

- Multi-criteria supplier selection
- Reliability scoring (0-100)
- Lead time tracking
- Cost-benefit analysis
- Supplier performance monitoring

### 7. **House of Quality (HoQ)**

- Customer need prioritization
- Technical requirement mapping
- Relationship matrix analysis
- Quality-driven optimization

### 8. **Real-time Dashboard**

- KPI visualization
- Supply chain network overview
- Live inventory tracking
- Order status monitoring

### 9. **Cost Analysis & Optimization**

- Logistics cost breakdown
- Total cost of ownership (TCO)
- Cost reduction recommendations
- Budget impact analysis

### 10. **Geospatial Mapping**

- Interactive supply chain network map
- Location tracking (warehouses, suppliers, customers)
- Route visualization
- Distance-based analysis

### 11. **Performance Metrics Dashboard**

- On-time delivery rate
- Order fulfillment rate
- Inventory turnover
- Supplier performance score
- Warehouse utilization
- Network cost metrics

### 12. **Risk Assessment & Mitigation**

- Supplier concentration risk
- Stockout risk analysis
- Transportation disruption risk
- Quality risk assessment
- Demand volatility analysis
- Probability-Impact matrix

### 13. **Automated Recommendations Engine**

- Supplier consolidation recommendations
- Inventory level optimization
- Lead time reduction strategies
- Warehouse consolidation plans
- Delivery performance improvements
- Cost optimization opportunities

### 14. **Action Plan Generation**

- Prioritized implementation roadmaps
- Timeline estimation
- ROI calculations
- Resource allocation
- Status tracking

### 15. **Warehouse Management**

- Capacity utilization tracking
- Multi-warehouse coordination
- Consolidation analysis
- Distribution center optimization

### 16. **Logistics Network Optimization**

- Network design analysis
- Hub-and-spoke evaluation
- Distribution channel optimization
- Cost efficiency metrics

### 17. **Data Visualization**

- Interactive charts (Bar, Line, Pie, Scatter)
- Real-time data updates
- Customizable dashboards
- Export capabilities

### 18. **Trend Analysis**

- Historical pattern recognition
- Forecasting accuracy metrics
- Seasonal trend detection
- Year-over-year comparisons

### 19. **Compliance & Quality Control**

- Quality metrics tracking
- Compliance requirements
- Audit trails (mock)
- Standard adherence monitoring

### 20. **Advanced Analytics**

- Predictive analytics
- What-if scenario planning
- Optimization algorithms
- Statistical analysis tools

### 21. **Sustainability Reporting**

- Carbon emissions tracking
- Green supplier identification
- Environmental KPIs
- Sustainability recommendations

### 22. **Capacity Planning**

- Demand-supply matching
- Resource allocation optimization
- Bottleneck identification
- Capacity forecasting

## 🛠 Tech Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (utility-first CSS)
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Leaflet + React-Leaflet** - Interactive mapping
- **Zustand** - State management
- **Lucide React** - Beautiful icons

### Backend/Data

- **In-Memory Storage** - Zustand store with mock data
- **No Database** - All data cached in memory (as requested)
- **Mock Data Generator** - Realistic supply chain data

### Algorithm Libraries

- **Custom Algorithms** - Route optimization, inventory algorithms
- **OpenStreetMap** - Map data provider (free)

## 📋 Algorithms Implemented

### Route Optimization

```typescript
- Nearest Neighbor Heuristic: O(n²) complexity
- 2-Opt Local Search: Iterative route improvement
- Haversine Distance Formula: Accurate distance calculation
- Multi-stop optimization with cost and time estimation
```

### Inventory Management

```typescript
- Economic Order Quantity (EOQ)
- Safety Stock Calculation (with service levels)
- Reorder Point Determination
- Demand Forecasting (Exponential Smoothing)
- ABC Analysis (Pareto Principle)
```

### Quality Management

```typescript
- House of Quality (QFD) implementation
- Relationship matrix analysis
- Priority scoring algorithms
- Customer need mapping
```

### Risk Assessment

```typescript
- Probability-Impact risk matrix
- Risk score calculation
- Mitigation strategy generation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

```bash
# Navigate to project directory
cd Supply-Chain-Optimizer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

The application will be available at `http://localhost:5173`

## 📊 Data Structure

All data is stored in-memory using Zustand store. The data includes:

- **Locations**: Warehouses, suppliers, customers, distribution centers
- **Suppliers**: With reliability scores, lead times, costs, capacity
- **Products**: With SKUs, demand, costs, shelf life
- **Inventory**: Quantities by warehouse, reorder points
- **Orders**: Status tracking, cost, delivery dates
- **Metrics**: KPIs and performance indicators

### Mock Data Features

- 8 global locations (US, Asia, Europe)
- 4 suppliers with varying characteristics
- 5 products across different categories
- 20+ sample orders
- Realistic metrics and performance data

## 🎨 UI/UX Features

### Design System

- **Color Palette**: Blue, Green, Red, Yellow, Purple gradients
- **Typography**: Clear hierarchy with responsive fonts
- **Layout**: Grid-based responsive design
- **Cards**: Metric cards with gradients and icons
- **Charts**: Interactive with hover tooltips
- **Maps**: Zoomable with location markers

### Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Touch-friendly interface

### Navigation

- Top navigation bar with links
- Mobile hamburger menu
- Active route highlighting
- Breadcrumb support

## 📈 Key Dashboards

### 1. **Main Dashboard**

- KPI cards (Inventory, Delivery, Logistics, Turnover, Performance, Carbon)
- Inventory trend chart
- Cost breakdown pie chart
- Supply chain network map
- Recent orders table

### 2. **Route Optimization**

- Distance and cost savings metrics
- Route comparison charts
- Interactive map with routes
- Detailed route information
- Stop-by-stop breakdown

### 3. **Quality Management**

- House of Quality matrix
- Technical requirements performance
- Customer importance distribution
- Quality recommendations
- Priority action items

### 4. **Recommendations**

- Impact-based recommendations (High/Medium/Low)
- Risk assessment matrix
- Potential savings by category
- Detailed recommendation details
- Risk mitigation strategies

### 5. **Inventory Management**

- ABC classification
- Inventory level visualization
- Stockout risk assessment
- Supplier performance tracking
- Lead time analysis

## 🔐 Data Privacy & Security

- **No External APIs**: All processing is local
- **No Data Transmission**: Everything stays in-browser
- **Mock Data Only**: No real sensitive data
- **In-Memory Storage**: Data cleared on page refresh
- **Open Source Only**: No paid or proprietary dependencies

## ⚙️ Configuration

### Customization Options

Edit configuration in component files:

```typescript
// Supply chain network center (lat, lng)
center: [39.8283, -98.5795];

// Map zoom level
zoom: 4;

// Optimization iterations
maxIterations: 100;

// Service level for safety stock
serviceLevel: 0.95;
```

## 🧮 Supported Calculations

### Cost Metrics

- Total Inventory Value
- Logistics Costs
- Network Costs
- Carrying Costs
- Ordering Costs

### Performance Metrics

- On-Time Delivery Rate (%)
- Order Fulfillment Rate (%)
- Inventory Turnover Ratio
- Supplier Performance Score (0-100)
- Warehouse Utilization (%)

### Environmental Metrics

- Carbon Footprint (kg CO2)
- Emissions per Unit
- Route Carbon Intensity
- Sustainability Index

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Use Cases

1. **Small to Medium Enterprises (SMEs)**

   - Optimize local delivery routes
   - Manage supplier relationships
   - Control inventory costs

2. **Distribution Networks**

   - Multi-warehouse management
   - Supply chain visibility
   - Route planning

3. **E-commerce Operations**

   - Demand forecasting
   - Inventory optimization
   - Delivery route optimization

4. **Logistics Companies**

   - Customer delivery optimization
   - Carbon tracking
   - Cost reduction initiatives

5. **Manufacturing**
   - Supplier management
   - Component scheduling
   - Quality optimization

## 🔄 Data Flow

```
Mock Data Generator
        ↓
   In-Memory Store (Zustand)
        ↓
   React Components
        ↓
   Algorithms & Analysis
        ↓
   Interactive Dashboards
```

## 🚧 Future Enhancements

- Real database integration (PostgreSQL)
- User authentication system
- Advanced ML predictions
- Multi-user collaboration
- API integration for real suppliers
- Mobile app version
- Advanced simulation models
- Blockchain-based supply chain tracking

## 📄 License

This project is provided as-is for supply chain optimization purposes.

## 🤝 Contributing

Contributions welcome! Please ensure all technologies are open-source and free.

## 📞 Support

For questions or issues with the Supply Chain Optimizer, please refer to the inline code documentation.

---

**Built with ❤️ for supply chain professionals**
Optimizing logistics, reducing costs, improving sustainability.
