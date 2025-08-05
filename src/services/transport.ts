import { apiClient } from '@/lib/api';
import type { CesiumPointFeature, StibApiResponse } from '@/types/cesium';

// ============= STIB SERVICE =============

export async function fetchStibStops(): Promise<StibApiResponse> {
  const response = await apiClient.get('/stib-collector/');
  return response.data;
}

export function parseStibStops(data: StibApiResponse): CesiumPointFeature[] {
  return data.stops.map(stop => ({
    id: `stib-stop-${stop.stop_id}`,
    name: stop.stop_name,
    type: 'point' as const,
    position: {
      longitude: stop.stop_lon,
      latitude: stop.stop_lat,
    },
    properties: {
      stopId: stop.stop_id,
      routes: stop.routes,
      accessibility: stop.wheelchair_accessible ?? false,
      source: 'stib',
    },
    style: {
      color: '#1E40AF', // Blue for STIB
      pixelSize: 8,
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
    },
  }));
}

// ============= SNCB SERVICE =============

export async function fetchSncbStations(): Promise<any> {
  const response = await apiClient.get('/sncb-collector/');
  return response.data;
}

export function parseSncbStations(data: any): CesiumPointFeature[] {
  return (
    data.stations?.map((station: any) => ({
      id: `sncb-station-${station.station_id}`,
      name: station.station_name,
      type: 'point' as const,
      position: {
        longitude: station.longitude,
        latitude: station.latitude,
      },
      properties: {
        stationId: station.station_id,
        stationType: station.station_type,
        source: 'sncb',
      },
      style: {
        color: '#DC2626', // Red for SNCB
        pixelSize: 10,
        outlineColor: '#FFFFFF',
        outlineWidth: 2,
      },
    })) ?? []
  );
}

// ============= DE LIJN SERVICE =============

export async function fetchDeLijnStops(): Promise<any> {
  const response = await apiClient.get('/delijn-collector/');
  return response.data;
}

export function parseDeLijnStops(data: any): CesiumPointFeature[] {
  return (
    data.stops?.map((stop: any) => ({
      id: `delijn-stop-${stop.stop_id}`,
      name: stop.stop_name,
      type: 'point' as const,
      position: {
        longitude: stop.longitude,
        latitude: stop.latitude,
      },
      properties: {
        stopId: stop.stop_id,
        lines: stop.lines,
        source: 'delijn',
      },
      style: {
        color: '#059669', // Green for De Lijn
        pixelSize: 8,
        outlineColor: '#FFFFFF',
        outlineWidth: 2,
      },
    })) ?? []
  );
}
