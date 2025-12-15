import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Location, Route } from '../../types';

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  locations: Location[];
  routes?: Route[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export const SupplyChainMap: React.FC<MapProps> = ({
  locations,
  routes = [],
  center = [39.8283, -98.5795],
  zoom = 4,
  height = '400px',
}) => {
  const getMarkerColor = (type: string) => {
    const typeColors: Record<string, string> = {
      warehouse: 'blue',
      supplier: 'red',
      customer: 'green',
      distribution_center: 'purple',
    };
    return typeColors[type] || 'blue';
  };

  const createCustomIcon = (color: string) => {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }} className="rounded-lg">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={createCustomIcon(getMarkerColor(location.type))}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-bold">{location.name}</h3>
              <p className="text-gray-600">{location.type}</p>
              {location.capacity && (
                <p className="text-gray-600">
                  Capacity: {location.currentLoad}/{location.capacity}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {routes.map((route) => (
        <React.Fragment key={route.id}>
          {route.stops.length > 1 && (
            <Polyline
              positions={route.stops.map((stop) => [stop.lat, stop.lng])}
              color="blue"
              weight={2}
              opacity={0.7}
              dashArray="5, 10"
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{route.name}</h3>
                  <p>Distance: {route.distance.toFixed(2)} km</p>
                  <p>Cost: ${route.cost.toFixed(2)}</p>
                  <p>Carbon: {route.carbonFootprint.toFixed(2)} kg CO2</p>
                </div>
              </Popup>
            </Polyline>
          )}
        </React.Fragment>
      ))}
    </MapContainer>
  );
};
