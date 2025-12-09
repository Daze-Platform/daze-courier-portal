import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Type definitions for resort data
export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: [number, number][];
}

export type GeoJSONGeometry = GeoJSONPoint | GeoJSONPolygon | GeoJSONLineString;

export type AmenityType = 
  | 'pool' 
  | 'lounger' 
  | 'umbrella' 
  | 'cabana' 
  | 'bar' 
  | 'restroom' 
  | 'beach_zone'
  | 'walkway'
  | 'entrance';

export type AmenityStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface Resort {
  id: string;
  name: string;
  address: string | null;
  center_lng: number;
  center_lat: number;
  default_zoom: number;
  min_zoom: number;
  max_zoom: number;
  bounds: number[] | null; // [west, south, east, north]
  map_style: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ResortAmenity {
  id: string;
  resort_id: string;
  type: AmenityType;
  label: string;
  geometry: GeoJSONGeometry;
  properties: Record<string, unknown>;
  status: AmenityStatus;
  section: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliveryStation {
  id: string;
  resort_id: string;
  name: string;
  location: GeoJSONPoint;
  serves_areas: string[];
  is_active: boolean;
  operating_hours: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Fetch single resort by ID
export const useResort = (resortId: string | undefined) => {
  return useQuery({
    queryKey: ['resort', resortId],
    queryFn: async () => {
      if (!resortId) return null;
      
      const { data, error } = await supabase
        .from('resorts')
        .select('*')
        .eq('id', resortId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Resort | null;
    },
    enabled: !!resortId,
  });
};

// Fetch all resorts
export const useResorts = () => {
  return useQuery({
    queryKey: ['resorts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resorts')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Resort[];
    },
  });
};

// Fetch first/default resort (for single-resort apps)
export const useDefaultResort = () => {
  return useQuery({
    queryKey: ['default-resort'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resorts')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as Resort | null;
    },
  });
};

// Fetch amenities for a resort
export const useResortAmenities = (resortId: string | undefined, options?: {
  type?: AmenityType | AmenityType[];
  section?: string;
  activeOnly?: boolean;
}) => {
  return useQuery({
    queryKey: ['resort-amenities', resortId, options],
    queryFn: async () => {
      if (!resortId) return [];
      
      let query = supabase
        .from('resort_amenities')
        .select('*')
        .eq('resort_id', resortId)
        .order('sort_order');
      
      if (options?.activeOnly !== false) {
        query = query.eq('is_active', true);
      }
      
      if (options?.type) {
        if (Array.isArray(options.type)) {
          query = query.in('type', options.type);
        } else {
          query = query.eq('type', options.type);
        }
      }
      
      if (options?.section) {
        query = query.eq('section', options.section);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data ?? []) as unknown as ResortAmenity[];
    },
    enabled: !!resortId,
  });
};

// Fetch delivery stations for a resort
export const useDeliveryStations = (resortId: string | undefined, options?: {
  servesArea?: string;
  activeOnly?: boolean;
}) => {
  return useQuery({
    queryKey: ['delivery-stations', resortId, options],
    queryFn: async () => {
      if (!resortId) return [];
      
      let query = supabase
        .from('delivery_stations')
        .select('*')
        .eq('resort_id', resortId);
      
      if (options?.activeOnly !== false) {
        query = query.eq('is_active', true);
      }
      
      if (options?.servesArea) {
        query = query.contains('serves_areas', [options.servesArea]);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data ?? []) as unknown as DeliveryStation[];
    },
    enabled: !!resortId,
  });
};

// Combined hook for all resort map data
export const useResortMapData = (resortId: string | undefined) => {
  const resort = useResort(resortId);
  const amenities = useResortAmenities(resortId);
  const stations = useDeliveryStations(resortId);

  return {
    resort: resort.data,
    amenities: amenities.data ?? [],
    stations: stations.data ?? [],
    isLoading: resort.isLoading || amenities.isLoading || stations.isLoading,
    error: resort.error || amenities.error || stations.error,
  };
};

// Find amenity by label (for delivery addresses like "A1", "Beach-3")
export const findAmenityByLabel = (
  amenities: ResortAmenity[],
  label: string
): ResortAmenity | undefined => {
  const normalizedLabel = label.toLowerCase().trim();
  return amenities.find(
    (a) => a.label.toLowerCase().trim() === normalizedLabel
  );
};

// Parse delivery address to find matching amenity
export const parseDeliveryAddress = (
  address: string,
  amenities: ResortAmenity[]
): { amenity: ResortAmenity | undefined; section: string } => {
  // Try to extract amenity label from address (e.g., "Beach - Umbrella B7" -> "B7")
  const patterns = [
    /lounger\s*([A-Z]\d+)/i,
    /umbrella\s*([A-Z]?\d+)/i,
    /cabana\s*([A-Z]?\d+)/i,
    /([A-Z]\d+)/i, // Simple pattern like "A1", "B7"
    /Beach-(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = address.match(pattern);
    if (match) {
      const label = match[1] || match[0];
      const amenity = findAmenityByLabel(amenities, label);
      if (amenity) {
        return { amenity, section: amenity.section || 'Unknown' };
      }
    }
  }

  // Determine section from address keywords
  let section = 'Pool Deck';
  if (address.toLowerCase().includes('beach')) {
    section = 'Beachfront';
  } else if (address.toLowerCase().includes('room')) {
    section = 'Room';
  }

  return { amenity: undefined, section };
};

// Get coordinates from amenity geometry
export const getAmenityCoordinates = (
  amenity: ResortAmenity
): { lng: number; lat: number } | null => {
  const { geometry } = amenity;
  
  if (geometry.type === 'Point') {
    return {
      lng: geometry.coordinates[0],
      lat: geometry.coordinates[1],
    };
  }
  
  // For polygons, return centroid
  if (geometry.type === 'Polygon') {
    const coords = geometry.coordinates[0];
    const sumLng = coords.reduce((sum, c) => sum + c[0], 0);
    const sumLat = coords.reduce((sum, c) => sum + c[1], 0);
    return {
      lng: sumLng / coords.length,
      lat: sumLat / coords.length,
    };
  }
  
  // For linestrings, return midpoint
  if (geometry.type === 'LineString') {
    const midIndex = Math.floor(geometry.coordinates.length / 2);
    return {
      lng: geometry.coordinates[midIndex][0],
      lat: geometry.coordinates[midIndex][1],
    };
  }
  
  return null;
};
