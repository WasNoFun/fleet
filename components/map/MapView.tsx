import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Van, Route, Coordinates } from '@/types';
import { useEffect, useRef } from 'react';

interface MapViewProps {
  vans: Van[];
  routes: Route[];
  onVanPress?: (van: Van) => void;
  onRoutePress?: (route: Route) => void;
  selectedVanId?: string;
  selectedRouteId?: string;
}

export function MapView({ vans, routes, onVanPress, onRoutePress, selectedVanId, selectedRouteId }: MapViewProps) {
  const webViewRef = useRef<WebView>(null);

  // Function to send data to the WebView
  const sendDataToMap = () => {
    const mapData = {
      vans: vans.map(van => ({
        id: van.id,
        name: van.name,
        coordinates: van.coordinates,
        isSelected: van.id === selectedVanId,
      })),
      routes: routes.map(route => ({
        id: route.id,
        name: route.name,
        startCoordinates: route.startCoordinates,
        endCoordinates: route.endCoordinates,
        isSelected: route.id === selectedRouteId,
      })),
    };

    webViewRef.current?.injectJavaScript(`
      updateMapData(${JSON.stringify(mapData)});
      true;
    `);
  };

  // Update map when data changes
  useEffect(() => {
    sendDataToMap();
  }, [vans, routes, selectedVanId, selectedRouteId]);

  // HTML content for the map
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Initialize map
          const map = L.map('map').setView([37.7749, -122.4194], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          let markers = {};
          let polylines = {};

          function updateMapData(data) {
            // Clear existing markers and routes
            Object.values(markers).forEach(marker => marker.remove());
            Object.values(polylines).forEach(polyline => polyline.remove());
            markers = {};
            polylines = {};

            // Add van markers
            data.vans.forEach(van => {
              const marker = L.marker([van.coordinates.latitude, van.coordinates.longitude], {
                title: van.name
              });
              
              marker.bindPopup(van.name);
              marker.on('click', () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'vanClick',
                  vanId: van.id
                }));
              });
              
              if (van.isSelected) {
                marker.openPopup();
              }
              
              marker.addTo(map);
              markers[van.id] = marker;
            });

            // Add route lines
            data.routes.forEach(route => {
              const polyline = L.polyline([
                [route.startCoordinates.latitude, route.startCoordinates.longitude],
                [route.endCoordinates.latitude, route.endCoordinates.longitude]
              ], {
                color: route.isSelected ? '#3B82F6' : '#9CA3AF',
                weight: route.isSelected ? 4 : 2
              });
              
              polyline.bindPopup(route.name);
              polyline.on('click', () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'routeClick',
                  routeId: route.id
                }));
              });
              
              if (route.isSelected) {
                polyline.openPopup();
              }
              
              polyline.addTo(map);
              polylines[route.id] = polyline;
            });
          }
        </script>
      </body>
    </html>
  `;

  // Handle messages from WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'vanClick' && onVanPress) {
        const van = vans.find(v => v.id === data.vanId);
        if (van) onVanPress(van);
      } else if (data.type === 'routeClick' && onRoutePress) {
        const route = routes.find(r => r.id === data.routeId);
        if (route) onRoutePress(route);
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  if (Platform.OS === 'web') {
    // For web platform, we'll use react-leaflet
    const { MapContainer, TileLayer, Marker, Polyline, Popup } = require('react-leaflet');
    
    return (
      <MapContainer
        center={[37.7749, -122.4194]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        
        {vans.map(van => (
          <Marker
            key={van.id}
            position={[van.coordinates.latitude, van.coordinates.longitude]}
            eventHandlers={{
              click: () => onVanPress?.(van)
            }}
          >
            <Popup>{van.name}</Popup>
          </Marker>
        ))}
        
        {routes.map(route => (
          <Polyline
            key={route.id}
            positions={[
              [route.startCoordinates.latitude, route.startCoordinates.longitude],
              [route.endCoordinates.latitude, route.endCoordinates.longitude]
            ]}
            pathOptions={{
              color: route.id === selectedRouteId ? '#3B82F6' : '#9CA3AF',
              weight: route.id === selectedRouteId ? 4 : 2
            }}
            eventHandlers={{
              click: () => onRoutePress?.(route)
            }}
          >
            <Popup>{route.name}</Popup>
          </Polyline>
        ))}
      </MapContainer>
    );
  }

  // For native platforms, use WebView with Leaflet
  return (
    <WebView
      ref={webViewRef}
      source={{ html: mapHTML }}
      onMessage={handleMessage}
      style={{ flex: 1 }}
    />
  );
}