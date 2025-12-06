import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CandidateLocation } from '@/types/project';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapViewProps {
  candidates: CandidateLocation[];
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedPosition?: { lat: number; lng: number } | null;
  interactive?: boolean;
}

function LocationSelector({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView({ candidates, onLocationSelect, selectedPosition, interactive = false }: MapViewProps) {
  // Default center (Madrid) if no candidates
  const defaultCenter: [number, number] = [40.416775, -3.703790];
  
  // Use first candidate as center if available, or selected position
  const center: [number, number] = selectedPosition 
    ? [selectedPosition.lat, selectedPosition.lng]
    : candidates.length > 0 && candidates[0].coordinates
      ? [candidates[0].coordinates.lat, candidates[0].coordinates.lng]
      : defaultCenter;

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Existing Candidates */}
      {candidates.map((candidate) => (
        candidate.coordinates && (
          <Marker 
            key={candidate.id} 
            position={[candidate.coordinates!.lat, candidate.coordinates!.lng]}
            icon={icon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm">{candidate.name}</h3>
                <p className="text-xs text-slate-600">{candidate.address}</p>
                <p className="text-xs font-semibold mt-1">{candidate.monthlyRent}€/mes</p>
              </div>
            </Popup>
          </Marker>
        )
      ))}

      {/* Interactive Selection Marker */}
      {interactive && onLocationSelect && (
        <>
          <LocationSelector onSelect={onLocationSelect} />
          {selectedPosition && (
            <Marker position={[selectedPosition.lat, selectedPosition.lng]} icon={icon} opacity={0.7}>
               <Popup>Ubicación seleccionada</Popup>
            </Marker>
          )}
        </>
      )}
    </MapContainer>
  );
}
