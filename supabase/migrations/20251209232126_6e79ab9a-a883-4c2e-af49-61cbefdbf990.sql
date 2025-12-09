-- Add map_style_url column to resorts table for custom Mapbox Studio styles
ALTER TABLE public.resorts 
ADD COLUMN map_style_url text;

-- Add a comment explaining the column
COMMENT ON COLUMN public.resorts.map_style_url IS 'Custom Mapbox Studio style URL for this resort. If set, this style will be used instead of the default.';