import { NextRequest, NextResponse } from 'next/server';

interface HealthCenter {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface RouteInfo {
  route_polyline?: string;
  error?: string;
}

async function getNearestHealthCenters(latitude: number, longitude: number): Promise<HealthCenter[] | { error: string }> {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!googleMapsApiKey) {
    return { error: 'Google Maps API key not configured' };
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital&keyword=public%20health%20center&key=${googleMapsApiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results || [];
    
    if (results.length === 0) {
      return { error: 'No health centers found nearby' };
    }
    
    return results.slice(0, 5).map((place: any) => ({
      name: place.name,
      address: place.vicinity || 'No address available',
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    }));
  } catch (error) {
    console.error('Error fetching health centers:', error);
    return { error: 'Failed to fetch health centers' };
  }
}

async function getRoute(startLat: number, startLon: number, endLat: number, endLon: number): Promise<RouteInfo> {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!googleMapsApiKey) {
    return { error: 'Google Maps API key not configured' };
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLon}&destination=${endLat},${endLon}&mode=driving&key=${googleMapsApiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      return { error: 'No route found' };
    }
    
    return {
      route_polyline: data.routes[0].overview_polyline.points,
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return { error: 'Failed to fetch route' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude } = await request.json();
    
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const healthCenters = await getNearestHealthCenters(latitude, longitude);
    
    if ('error' in healthCenters) {
      return NextResponse.json(healthCenters, { status: 400 });
    }

    // Get route to the first health center
    const firstCenter = healthCenters[0];
    const route = await getRoute(latitude, longitude, firstCenter.latitude, firstCenter.longitude);

    return NextResponse.json({
      nearest_health_centers: healthCenters,
      route: route,
    });

  } catch (error) {
    console.error('Error in /api/health-centers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
