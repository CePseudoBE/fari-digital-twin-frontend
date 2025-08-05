import * as Cesium from 'cesium';
import { useCesiumFeature } from '@/composables/useCesiumFeature';
import {
  fetchBoltVehicles,
  fetchBrusselsBikes,
  fetchLimeVehicles,
  fetchTelraamSensors,
  parseBoltVehicles,
  parseBrusselsBikes,
  parseLimeVehicles,
  parseTelraamSensors,
} from '@/services/mobility';
import type { CesiumEntityConfig, CesiumPointFeature } from '@/types/cesium';

// ============= BOLT VEHICLES =============

export function useBoltVehicles() {
  return useCesiumFeature({
    queryKey: ['mobility', 'bolt-vehicles'],
    fetchFn: fetchBoltVehicles,
    parser: parseBoltVehicles,
    layerId: 'bolt-vehicles',
    entityConfigFn: (vehicle: CesiumPointFeature): CesiumEntityConfig => ({
      id: vehicle.id,
      position: Cesium.Cartesian3.fromDegrees(
        vehicle.position.longitude,
        vehicle.position.latitude,
        vehicle.position.altitude || 0
      ),
      point: {
        pixelSize: vehicle.style?.pixelSize || 6,
        color: Cesium.Color.fromCssColorString(
          vehicle.style?.color || '#10B981'
        ),
        outlineColor: Cesium.Color.fromCssColorString(
          vehicle.style?.outlineColor || '#FFFFFF'
        ),
        outlineWidth: vehicle.style?.outlineWidth || 1,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      description: `
        <div class="cesium-infoBox-description">
          <h3>Bolt ${vehicle.properties?.vehicleType}</h3>
          <p><strong>Vehicle ID:</strong> ${vehicle.properties?.vehicleId}</p>
          <p><strong>Battery:</strong> ${vehicle.properties?.batteryLevel || 'N/A'}%</p>
          <p><strong>Type:</strong> ${vehicle.properties?.vehicleType}</p>
          <p><strong>Source:</strong> Bolt</p>
        </div>
      `,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes - vehicles move frequently
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 minutes
  });
}

// ============= LIME VEHICLES =============

export function useLimeVehicles() {
  return useCesiumFeature({
    queryKey: ['mobility', 'lime-vehicles'],
    fetchFn: fetchLimeVehicles,
    parser: parseLimeVehicles,
    layerId: 'lime-vehicles',
    entityConfigFn: (vehicle: CesiumPointFeature): CesiumEntityConfig => ({
      id: vehicle.id,
      position: Cesium.Cartesian3.fromDegrees(
        vehicle.position.longitude,
        vehicle.position.latitude,
        vehicle.position.altitude || 0
      ),
      point: {
        pixelSize: vehicle.style?.pixelSize || 6,
        color: Cesium.Color.fromCssColorString(
          vehicle.style?.color || '#EAB308'
        ),
        outlineColor: Cesium.Color.fromCssColorString(
          vehicle.style?.outlineColor || '#FFFFFF'
        ),
        outlineWidth: vehicle.style?.outlineWidth || 1,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      description: `
        <div class="cesium-infoBox-description">
          <h3>Lime ${vehicle.properties?.vehicleType}</h3>
          <p><strong>Vehicle ID:</strong> ${vehicle.properties?.vehicleId}</p>
          <p><strong>Battery:</strong> ${vehicle.properties?.batteryLevel || 'N/A'}%</p>
          <p><strong>Type:</strong> ${vehicle.properties?.vehicleType}</p>
          <p><strong>Source:</strong> Lime</p>
        </div>
      `,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 minutes
  });
}

// ============= BRUSSELS BIKES =============

export function useBrusselsBikes() {
  return useCesiumFeature({
    queryKey: ['mobility', 'brussels-bikes'],
    fetchFn: fetchBrusselsBikes,
    parser: parseBrusselsBikes,
    layerId: 'brussels-bikes',
    entityConfigFn: (station: CesiumPointFeature): CesiumEntityConfig => ({
      id: station.id,
      position: Cesium.Cartesian3.fromDegrees(
        station.position.longitude,
        station.position.latitude,
        station.position.altitude || 0
      ),
      point: {
        pixelSize: station.style?.pixelSize || 8,
        color: Cesium.Color.fromCssColorString(
          station.style?.color || '#059669'
        ),
        outlineColor: Cesium.Color.fromCssColorString(
          station.style?.outlineColor || '#FFFFFF'
        ),
        outlineWidth: station.style?.outlineWidth || 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: `${station.properties?.availableBikes || 0}`,
        font: '10pt Arial',
        pixelOffset: new Cesium.Cartesian2(0, 0),
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        scale: 0.8,
      },
      description: `
        <div class="cesium-infoBox-description">
          <h3>${station.name}</h3>
          <p><strong>Available Bikes:</strong> ${station.properties?.availableBikes || 0}</p>
          <p><strong>Available Docks:</strong> ${station.properties?.availableDocks || 0}</p>
          <p><strong>Total Docks:</strong> ${station.properties?.totalDocks || 0}</p>
          <p><strong>Status:</strong> ${station.properties?.status || 'Unknown'}</p>
          <p><strong>Source:</strong> Brussels Mobility</p>
        </div>
      `,
    }),
    staleTime: 1000 * 60 * 2, // 2 minutes - bike availability changes quickly
    refetchInterval: 1000 * 60 * 3, // Refresh every 3 minutes
  });
}

// ============= TELRAAM TRAFFIC SENSORS =============

export function useTelraamSensors() {
  return useCesiumFeature({
    queryKey: ['traffic', 'telraam-sensors'],
    fetchFn: fetchTelraamSensors,
    parser: parseTelraamSensors,
    layerId: 'telraam-sensors',
    entityConfigFn: (sensor: CesiumPointFeature): CesiumEntityConfig => ({
      id: sensor.id,
      position: Cesium.Cartesian3.fromDegrees(
        sensor.position.longitude,
        sensor.position.latitude,
        sensor.position.altitude || 0
      ),
      point: {
        pixelSize: sensor.style?.pixelSize || 8,
        color: Cesium.Color.fromCssColorString(
          sensor.style?.color || '#8B5CF6'
        ),
        outlineColor: Cesium.Color.fromCssColorString(
          sensor.style?.outlineColor || '#FFFFFF'
        ),
        outlineWidth: sensor.style?.outlineWidth || 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: sensor.name || '',
        font: '10pt Arial',
        pixelOffset: new Cesium.Cartesian2(0, -25),
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false,
      },
      description: `
        <div class="cesium-infoBox-description">
          <h3>${sensor.name}</h3>
          <p><strong>Sensor ID:</strong> ${sensor.properties?.sensorId}</p>
          <p><strong>Cars/hour:</strong> ${sensor.properties?.carCountHour || 'N/A'}</p>
          <p><strong>Bikes/hour:</strong> ${sensor.properties?.bikeCountHour || 'N/A'}</p>
          <p><strong>Pedestrians/hour:</strong> ${sensor.properties?.pedestrianCountHour || 'N/A'}</p>
          <p><strong>Status:</strong> ${sensor.properties?.status || 'Unknown'}</p>
          <p><strong>Source:</strong> Telraam</p>
        </div>
      `,
    }),
    staleTime: 1000 * 60 * 15, // 15 minutes - traffic data updates periodically
    refetchInterval: 1000 * 60 * 30, // Refresh every 30 minutes
  });
}
