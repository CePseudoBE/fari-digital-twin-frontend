import { apiClient } from '@/lib/api';
import type { CesiumPointFeature, TelraamApiResponse } from '@/types/cesium';

// ============= SHARED MOBILITY SERVICES =============

export async function fetchBoltVehicles(): Promise<any> {
  const response = await apiClient.get('/bolt-geofence-collector/');
  return response.data;
}

export function parseBoltVehicles(data: any): CesiumPointFeature[] {
  return (
    data.vehicles?.map((vehicle: any) => ({
      id: `bolt-vehicle-${vehicle.vehicle_id}`,
      name: `Bolt ${vehicle.vehicle_type}`,
      type: 'point' as const,
      position: {
        longitude: vehicle.longitude,
        latitude: vehicle.latitude,
      },
      properties: {
        vehicleId: vehicle.vehicle_id,
        vehicleType: vehicle.vehicle_type,
        batteryLevel: vehicle.battery_level,
        source: 'bolt',
      },
      style: {
        color: '#10B981', // Green for available vehicles
        pixelSize: 6,
        outlineColor: '#FFFFFF',
        outlineWidth: 1,
      },
    })) ?? []
  );
}

export async function fetchLimeVehicles(): Promise<any> {
  const response = await apiClient.get('/lime-collector/');
  return response.data;
}

export function parseLimeVehicles(data: any): CesiumPointFeature[] {
  return (
    data.vehicles?.map((vehicle: any) => ({
      id: `lime-vehicle-${vehicle.vehicle_id}`,
      name: `Lime ${vehicle.vehicle_type}`,
      type: 'point' as const,
      position: {
        longitude: vehicle.longitude,
        latitude: vehicle.latitude,
      },
      properties: {
        vehicleId: vehicle.vehicle_id,
        vehicleType: vehicle.vehicle_type,
        batteryLevel: vehicle.battery_level,
        source: 'lime',
      },
      style: {
        color: '#EAB308', // Yellow for Lime
        pixelSize: 6,
        outlineColor: '#FFFFFF',
        outlineWidth: 1,
      },
    })) ?? []
  );
}

// ============= TRAFFIC MONITORING =============

export async function fetchTelraamSensors(): Promise<TelraamApiResponse> {
  const response = await apiClient.get('/telraam-collector/');
  return response.data;
}

export function parseTelraamSensors(
  data: TelraamApiResponse
): CesiumPointFeature[] {
  return data.sensors.map(sensor => ({
    id: `telraam-sensor-${sensor.sensor_id}`,
    name: sensor.sensor_name,
    type: 'point' as const,
    position: {
      longitude: sensor.lng,
      latitude: sensor.lat,
    },
    properties: {
      sensorId: sensor.sensor_id,
      carCountHour: sensor.car_count_hour,
      bikeCountHour: sensor.bike_count_hour,
      pedestrianCountHour: sensor.pedestrian_count_hour,
      status: sensor.status,
      source: 'telraam',
    },
    style: {
      color: sensor.status === 'active' ? '#8B5CF6' : '#6B7280', // Purple for active, gray for inactive
      pixelSize: 8,
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
    },
  }));
}

// ============= BRUSSELS MOBILITY =============

export async function fetchBrusselsBikes(): Promise<any> {
  const response = await apiClient.get('/brussels-collector/');
  return response.data;
}

export function parseBrusselsBikes(data: any): CesiumPointFeature[] {
  return (
    data.stations?.map((station: any) => ({
      id: `brussels-bike-${station.station_id}`,
      name: station.name,
      type: 'point' as const,
      position: {
        longitude: station.longitude,
        latitude: station.latitude,
      },
      properties: {
        stationId: station.station_id,
        availableBikes: station.available_bikes,
        availableDocks: station.available_docks,
        totalDocks: station.total_docks,
        status: station.status,
        source: 'brussels-bikes',
      },
      style: {
        color: station.available_bikes > 0 ? '#059669' : '#DC2626', // Green if bikes available, red if empty
        pixelSize: 8,
        outlineColor: '#FFFFFF',
        outlineWidth: 2,
      },
    })) ?? []
  );
}
