import { apiClient } from '@/lib/api';
import type { CesiumPointFeature } from '@/types/cesium';

// ============= AIR QUALITY SERVICE =============

export async function fetchAirQualityStations(): Promise<any> {
  const response = await apiClient.get('/air-quality-collector/');
  return response.data;
}

export function parseAirQualityStations(data: any): CesiumPointFeature[] {
  return (
    data.stations?.map((station: any) => ({
      id: `air-quality-${station.station_id}`,
      name: station.station_name,
      type: 'point' as const,
      position: {
        longitude: station.longitude,
        latitude: station.latitude,
      },
      properties: {
        stationId: station.station_id,
        pm25: station.pm25,
        pm10: station.pm10,
        no2: station.no2,
        o3: station.o3,
        so2: station.so2,
        lastUpdated: station.last_updated,
        airQualityIndex: station.aqi,
        source: 'air-quality',
      },
      style: getAirQualityColor(station.aqi),
    })) ?? []
  );
}

function getAirQualityColor(aqi: number) {
  // Air Quality Index color coding
  if (aqi <= 50)
    return {
      color: '#10B981',
      pixelSize: 8,
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
    }; // Good - Green
  if (aqi <= 100)
    return {
      color: '#F59E0B',
      pixelSize: 8,
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
    }; // Moderate - Yellow
  if (aqi <= 150)
    return {
      color: '#F97316',
      pixelSize: 8,
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
    }; // Unhealthy for sensitive - Orange
  if (aqi <= 200)
    return {
      color: '#EF4444',
      pixelSize: 8,
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
    }; // Unhealthy - Red
  if (aqi <= 300)
    return {
      color: '#8B5CF6',
      pixelSize: 8,
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
    }; // Very unhealthy - Purple
  return {
    color: '#7C2D12',
    pixelSize: 8,
    outlineColor: '#FFFFFF',
    outlineWidth: 2,
  }; // Hazardous - Maroon
}

// ============= COMMUNITY SENSORS =============

export async function fetchCommunitySensors(): Promise<any> {
  const response = await apiClient.get('/sensors-collector/');
  return response.data;
}

export function parseCommunitySensors(data: any): CesiumPointFeature[] {
  return (
    data.sensors?.map((sensor: any) => ({
      id: `community-sensor-${sensor.sensor_id}`,
      name: sensor.sensor_name || `Sensor ${sensor.sensor_id}`,
      type: 'point' as const,
      position: {
        longitude: sensor.longitude,
        latitude: sensor.latitude,
      },
      properties: {
        sensorId: sensor.sensor_id,
        sensorType: sensor.sensor_type,
        temperature: sensor.temperature,
        humidity: sensor.humidity,
        pressure: sensor.pressure,
        lastReading: sensor.last_reading,
        status: sensor.status,
        source: 'community-sensors',
      },
      style: {
        color: sensor.status === 'active' ? '#06B6D4' : '#6B7280', // Cyan for active, gray for inactive
        pixelSize: 6,
        outlineColor: '#FFFFFF',
        outlineWidth: 1,
      },
    })) ?? []
  );
}
