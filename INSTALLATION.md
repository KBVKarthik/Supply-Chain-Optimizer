# Supply Chain Optimizer - Installation & Setup Guide

## Quick Start

### Prerequisites

- **Node.js**: Version 16 or higher
- **npm** or **yarn**: Package managers (comes with Node.js)
- **Git**: For version control

### System Requirements

- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: ~500MB for node_modules
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

---

## Installation Steps

### 1. **Navigate to Project Directory**

If you're already in the workspace folder:

```bash
cd Supply-Chain-Optimizer
```

Or from desktop:

```bash
cd "K Bhavani Venkata Karthik/Supply-Chain-Optimizer"
```

### 2. **Install Dependencies**

```bash
npm install
```

This will install all required packages:

- React & React DOM
- React Router for navigation
- TypeScript for type safety
- Tailwind CSS for styling
- Recharts for visualizations
- Leaflet for mapping
- Zustand for state management
- And more...

**Installation time**: 2-5 minutes (depends on internet speed)

### 3. **Start Development Server**

```bash
npm run dev
```

Expected output:

```
  VITE v5.0.7  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 4. **Open in Browser**

Navigate to: **http://localhost:5173/**

The application should load with:

- 🎨 Modern gradient UI
- 📊 Interactive dashboards
- 🗺️ Supply chain network map
- 📈 Real-time charts

---

## Running the Application

### Development Mode (Current)

```bash
npm run dev
```

- Hot module replacement (HMR)
- Real-time code updates
- Development debugging
- Source maps

### Production Build

```bash
npm run build
```

- Creates optimized build in `dist/` folder
- Minified code
- ~200KB total bundle size
- Ready for deployment

### Preview Production Build

```bash
npm run preview
```

- Tests production build locally
- Performance validation
- Pre-deployment testing

---

## Features Overview

After launching, explore these main sections:

### 📊 **Dashboard** (Home)

- KPI metrics with color-coded cards
- Inventory trend analysis
- Cost breakdown
- Supply chain network map
- Recent orders

### 🚚 **Route Optimization**

- Multi-stop route planning
- Haversine distance calculations
- 2-opt route improvement
- Cost & carbon savings
- Interactive route map

### 📦 **Inventory Management**

- ABC classification (Pareto analysis)
- Economic Order Quantity (EOQ)
- Stockout risk assessment
- Supplier performance
- Safety stock optimization

### ✅ **Quality Management**

- House of Quality matrix
- Customer needs vs. technical requirements
- Priority scoring
- Performance tracking
- Quality recommendations

### 💡 **Recommendations**

- AI-powered optimization suggestions
- Risk assessment matrix
- Action plan generation
- Potential savings calculation
- Implementation timeline

---

## Project Structure

```
Supply-Chain-Optimizer/
├── src/
│   ├── components/          # React components
│   │   ├── shared/         # Reusable UI components
│   │   ├── map/            # Map components
│   │   └── analysis/       # Analysis components
│   ├── pages/              # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── RouteOptimizationPage.tsx
│   │   ├── InventoryPage.tsx
│   │   ├── QualityPage.tsx
│   │   └── RecommendationsPage.tsx
│   ├── services/           # Business logic
│   │   ├── mockData.ts     # Mock data generator
│   │   └── dataStore.ts    # Zustand store
│   ├── utils/              # Utility functions
│   │   ├── routeOptimization.ts
│   │   ├── inventoryOptimization.ts
│   │   ├── houseOfQuality.ts
│   │   └── recommendations.ts
│   ├── types.ts            # TypeScript interfaces
│   ├── index.css           # Global styles
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── package.json            # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
├── vite.config.ts         # Vite config
├── postcss.config.js      # PostCSS config
└── index.html             # HTML entry point
```

---

## Configuration

### Modify Settings

#### 1. **Map Center** (src/components/map/SupplyChainMap.tsx)

```typescript
const center: [number, number] = [39.8283, -98.5795]; // Change to your region
```

#### 2. **Optimization Iterations** (src/utils/routeOptimization.ts)

```typescript
const maxIterations = 100; // Increase for better optimization
```

#### 3. **Service Level** (src/utils/inventoryOptimization.ts)

```typescript
const serviceLevel = 0.95; // 95% availability (or 0.99 for 99%)
```

#### 4. **Cost Per KM** (src/utils/routeOptimization.ts)

```typescript
const costPerKm = 0.5; // Adjust to your actual cost
```

---

## Data Management

### Mock Data

All data is generated on startup in `src/services/mockData.ts`:

- 8 locations (warehouses, suppliers, customers)
- 4 suppliers with different characteristics
- 5 products with demand patterns
- 20+ sample orders
- Realistic metrics

### Using Your Own Data

To replace mock data:

1. Edit `src/services/mockData.ts`
2. Modify the `generateMock*` functions
3. Or import from CSV/JSON files

Example:

```typescript
export const generateMockLocations = (): Location[] => {
  // Replace with your actual data
  return [
    { id: 'loc-001', name: 'Your Warehouse', lat: 40.7128, lng: -74.006, ... }
  ];
};
```

---

## Troubleshooting

### Issue: Port 5173 Already in Use

```bash
# Use a different port
npm run dev -- --port 3000
```

### Issue: Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Map Not Loading

- Check internet connection (OpenStreetMap requires it)
- Clear browser cache
- Ensure Leaflet CSS is loaded (check index.html)

### Issue: Slow Performance

- Close other browser tabs
- Clear browser cache
- Update Node.js to latest version
- Run `npm run build` to check for warnings

---

## Building for Deployment

### Create Production Build

```bash
npm run build
```

### Deploy to Cloud

- **Netlify**: Drag & drop the `dist/` folder
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Use GitHub Actions
- **Traditional Server**: Copy `dist/` contents to web server

### Environment Optimization

```bash
# Build with size analysis
npm run build
```

---

## Development Tips

### Hot Reload

Changes to files automatically reload in browser (HMR).

### Debugging

- Open DevTools: `F12` or `Ctrl+Shift+I`
- Check Console for errors
- Use React DevTools extension

### Code Navigation

- **Ctrl/Cmd + Click** on component names to jump to definition
- **Ctrl/Cmd + Shift + F** to search in all files
- **Ctrl/Cmd + P** to quick-open files

---

## Performance Optimization

### Bundle Size

- Current: ~200KB (gzipped)
- Main libraries: React, Recharts, Leaflet
- Tailwind CSS: Purged to only used styles

### Runtime Performance

- Zustand for minimal re-renders
- React.memo for chart components
- Lazy routing ready
- Efficient algorithms

---

## Browser Developer Tools

### React DevTools

Install extension to inspect components:

- Chrome: Search "React DevTools"
- Firefox: Search "React DevTools"

### Console Commands

```javascript
// In browser console
// Access application data
// Example: window.__STORE__ (if exposed)
```

---

## Additional Resources

### Documentation Files

- **README.md** - Overview and features
- **FEATURES.md** - Complete 45+ feature list
- **INSTALLATION.md** - This file

### Dependencies Docs

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Leaflet](https://leafletjs.com)
- [React Router](https://reactrouter.com)
- [TypeScript](https://www.typescriptlang.org)

### External Services Used

- **OpenStreetMap** - Free mapping (local first, optional)
- **Leaflet** - Open-source map library

---

## Next Steps

1. ✅ Start the dev server
2. ✅ Explore the dashboard
3. ✅ Review feature pages
4. ✅ Examine the code structure
5. ✅ Customize with your data
6. ✅ Deploy to production

---

## Support & Help

### Check Logs

- Browser console (F12 → Console tab)
- Terminal output when running `npm run dev`
- Check `dist/` folder after build

### Common Issues

- Node version mismatch → Update Node.js
- Missing node_modules → Run `npm install`
- Port conflicts → Change port or kill process
- Map not showing → Check internet connection

---

## Security Notes

✅ **No external data transmission**
✅ **No authentication required (local only)**
✅ **No database connectivity**
✅ **All calculations local**
✅ **Mock data only**

---

## License & Attribution

This project uses only open-source, free technologies:

- React (MIT)
- TypeScript (Apache 2.0)
- Tailwind CSS (MIT)
- Recharts (MIT)
- Leaflet (BSD)
- OpenStreetMap (ODbL)

---

**Setup complete! Ready to optimize your supply chain! 🚀**

For questions, refer to the inline code documentation and component comments.
