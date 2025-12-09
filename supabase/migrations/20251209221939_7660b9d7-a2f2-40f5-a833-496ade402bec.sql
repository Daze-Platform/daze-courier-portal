-- Create enum for amenity types
CREATE TYPE public.amenity_type AS ENUM (
  'pool', 
  'lounger', 
  'umbrella', 
  'cabana', 
  'bar', 
  'restroom', 
  'beach_zone',
  'walkway',
  'entrance'
);

-- Create enum for amenity status
CREATE TYPE public.amenity_status AS ENUM (
  'available',
  'occupied',
  'reserved',
  'maintenance'
);

-- Create resorts table
CREATE TABLE public.resorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  center_lng DOUBLE PRECISION NOT NULL,
  center_lat DOUBLE PRECISION NOT NULL,
  default_zoom DOUBLE PRECISION DEFAULT 17.5,
  min_zoom DOUBLE PRECISION DEFAULT 16,
  max_zoom DOUBLE PRECISION DEFAULT 21,
  bounds JSONB, -- GeoJSON BBox: [west, south, east, north]
  map_style TEXT DEFAULT 'mapbox://styles/mapbox/satellite-streets-v12',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create resort_amenities table for storing GeoJSON features
CREATE TABLE public.resort_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resort_id UUID NOT NULL REFERENCES public.resorts(id) ON DELETE CASCADE,
  type amenity_type NOT NULL,
  label TEXT NOT NULL, -- e.g., "A1", "Umbrella 12", "Pool Bar"
  geometry JSONB NOT NULL, -- GeoJSON Point or Polygon
  properties JSONB DEFAULT '{}', -- Additional properties like section, capacity
  status amenity_status DEFAULT 'available',
  section TEXT, -- e.g., "Pool Deck A", "Beachfront"
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create delivery_stations table
CREATE TABLE public.delivery_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resort_id UUID NOT NULL REFERENCES public.resorts(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Pool Bar", "Beachfront Bar"
  location JSONB NOT NULL, -- GeoJSON Point
  serves_areas TEXT[] DEFAULT '{}', -- e.g., ["pool", "beach"]
  is_active BOOLEAN DEFAULT true,
  operating_hours JSONB DEFAULT '{}', -- e.g., {"open": "10:00", "close": "22:00"}
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_resort_amenities_resort_id ON public.resort_amenities(resort_id);
CREATE INDEX idx_resort_amenities_type ON public.resort_amenities(type);
CREATE INDEX idx_resort_amenities_section ON public.resort_amenities(section);
CREATE INDEX idx_resort_amenities_geometry ON public.resort_amenities USING GIN(geometry);
CREATE INDEX idx_delivery_stations_resort_id ON public.delivery_stations(resort_id);
CREATE INDEX idx_delivery_stations_serves_areas ON public.delivery_stations USING GIN(serves_areas);

-- Enable RLS
ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resort_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_stations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access for all (couriers need to see resort data)
CREATE POLICY "Anyone can view resorts"
  ON public.resorts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view resort amenities"
  ON public.resort_amenities FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view delivery stations"
  ON public.delivery_stations FOR SELECT
  USING (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_resorts_updated_at
  BEFORE UPDATE ON public.resorts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resort_amenities_updated_at
  BEFORE UPDATE ON public.resort_amenities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_stations_updated_at
  BEFORE UPDATE ON public.delivery_stations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();