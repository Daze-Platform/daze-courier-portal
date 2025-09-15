import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Navigation, Phone, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import margaritaMamasLogo from "@/assets/margarita-mamas-logo.png";
import sunsetGrillLogo from "@/assets/sunset-grill-logo.png";
import oceanBreezeLogo from "@/assets/ocean-breeze-logo.png";

const DeliveryTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Mock order data - in real app would fetch based on orderId
  const order = {
    orderId: "#867899",
    restaurant: "Margarita Mama's",
    deliveryAddress: "Room N°12 - Marina Bay Hotel",
    customerLocation: {
      lat: 1.2840,
      lng: 103.8607,
      address: "Room N°12, Marina Bay Hotel, 10 Bayfront Ave, Singapore 018956"
    },
    restaurantLocation: {
      lat: 1.2876,
      lng: 103.8545,
      address: "Margarita Mama's, 3 Temasek Blvd, Singapore 038983"
    },
    deliveryTime: "July 21, 11:36AM",
    deliveryType: "Room Delivery",
    customer: {
      name: "Gretche Bergson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      phone: "+65 9123 4567"
    },
    items: [
      {
        name: "1x Fried Rice",
        price: 13.90,
        modifications: "Choice of Protein: Chicken ($2.00)"
      },
      {
        name: "2x Ham & Cheese Croissant", 
        price: 22.00,
        modifications: "Extra slices of cheese ($1.00)"
      }
    ],
    specialNotes: "Make sure to include free samples on every Order.",
    total: 39.90
  };

  const getRestaurantLogo = (restaurantName: string) => {
    switch (restaurantName.toLowerCase()) {
      case "margarita mama's":
        return margaritaMamasLogo;
      case "sunset grill":
        return sunsetGrillLogo;
      case "ocean breeze café":
        return oceanBreezeLogo;
      default:
        return null;
    }
  };

  // Initialize geolocation tracking
  useEffect(() => {
    if (isTracking && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setCurrentLocation(newLocation);
          
          // Update map with current location
          if (map.current) {
            // Remove existing courier marker
            const existingMarker = document.querySelector('.courier-marker');
            if (existingMarker) {
              existingMarker.remove();
            }

            // Add new courier marker
            new mapboxgl.Marker({ color: '#29b6f6' })
              .setLngLat(newLocation)
              .setPopup(new mapboxgl.Popup().setHTML('<div>Your Current Location</div>'))
              .addTo(map.current);

            // Center map on current location
            map.current.flyTo({
              center: newLocation,
              zoom: 15,
              duration: 1000
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [isTracking]);

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [order.customerLocation.lng, order.customerLocation.lat],
      zoom: 14,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add customer marker
    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([order.customerLocation.lng, order.customerLocation.lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${order.customer.name}</h3>
            <p class="text-sm text-gray-600">${order.customerLocation.address}</p>
          </div>
        `)
      )
      .addTo(map.current);

    // Add restaurant marker
    new mapboxgl.Marker({ color: '#10b981' })
      .setLngLat([order.restaurantLocation.lng, order.restaurantLocation.lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${order.restaurant}</h3>
            <p class="text-sm text-gray-600">${order.restaurantLocation.address}</p>
          </div>
        `)
      )
      .addTo(map.current);

    // Fit map to show both locations
    const bounds = new mapboxgl.LngLatBounds()
      .extend([order.customerLocation.lng, order.customerLocation.lat])
      .extend([order.restaurantLocation.lng, order.restaurantLocation.lat]);
    
    map.current.fitBounds(bounds, { padding: 50 });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const handleStartTracking = () => {
    setIsTracking(true);
  };

  const handleCompleteDelivery = () => {
    navigate(`/order/${orderId}?completed=true`);
  };

  const restaurantLogo = getRestaurantLogo(order.restaurant);

  if (!mapboxToken) {
    return (
      <>
        <UnifiedHeader />
        <DesktopSidebar />
        
        <div className="min-h-screen bg-background lg:ml-64 pt-4">
          <div className="container mx-auto px-4 py-6 space-y-6 lg:px-8 lg:py-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/order/${orderId}`)}
                className="flex-shrink-0"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Delivery Tracking</h1>
                <p className="text-muted-foreground lg:text-lg">Set up mapping to start navigation</p>
              </div>
            </div>

            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Mapbox Setup Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To use the interactive map for delivery tracking, please enter your Mapbox public token.
                </p>
                <p className="text-sm text-muted-foreground">
                  Get your token at: <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
                  <Input
                    id="mapbox-token"
                    type="text"
                    placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSI..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full"
                  disabled={!mapboxToken}
                  onClick={() => setMapboxToken(mapboxToken)}
                >
                  Start Navigation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UnifiedHeader />
      <DesktopSidebar />

      <div className="min-h-screen bg-background lg:ml-64 pt-4">
        <div className="container mx-auto px-4 py-6 space-y-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/order/${orderId}`)}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Delivery in Progress</h1>
              <p className="text-muted-foreground lg:text-lg">Navigate to customer location</p>
            </div>
            <Badge className="bg-primary text-white">
              In Progress
            </Badge>
          </div>

          {/* Main Content - Map and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Map Section */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div ref={mapContainer} className="h-96 lg:h-[500px] rounded-lg" />
                </CardContent>
              </Card>
              
              {!isTracking && (
                <Button 
                  className="w-full"
                  onClick={handleStartTracking}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Start GPS Tracking
                </Button>
              )}
            </div>

            {/* Order Details Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Delivery For</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={order.customer.avatar} />
                      <AvatarFallback>GB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Delivery Address:</p>
                    <p className="text-sm text-muted-foreground">{order.customerLocation.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Restaurant Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Order from {order.restaurant}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-sm">
                      {restaurantLogo ? (
                        <img src={restaurantLogo} alt={`${order.restaurant} logo`} className="h-8 w-8 object-contain" />
                      ) : (
                        <div className="h-8 w-8 bg-accent rounded-full" />
                      )}
                    </div>
                    <Badge className="bg-accent text-white font-medium border-0">
                      {order.deliveryType}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-foreground text-sm">{item.name}</p>
                            <p className="font-semibold text-foreground text-sm">${item.price}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.modifications}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.specialNotes && (
                    <div className="bg-warning/10 rounded-lg p-3 mt-4">
                      <div className="flex items-start gap-2">
                        <span className="text-warning text-sm">📝</span>
                        <div>
                          <p className="font-medium text-foreground text-sm">Special Notes</p>
                          <p className="text-xs text-muted-foreground">{order.specialNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Complete Delivery Button */}
              <Button 
                className="w-full bg-success hover:bg-success/90 text-white font-medium"
                onClick={handleCompleteDelivery}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Delivery
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryTracking;