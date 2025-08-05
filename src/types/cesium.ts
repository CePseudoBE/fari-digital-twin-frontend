import type * as Cesium from 'cesium';

// Base interface pour toutes les features Cesium
export interface CesiumFeature {
  id: string;
  name?: string;
  description?: string;
  position: {
    longitude: number;
    latitude: number;
    altitude?: number;
  };
  properties?: Record<string, any>;
}

// Extensions pour différents types de features
export interface CesiumPointFeature extends CesiumFeature {
  type: 'point';
  style?: {
    color?: string;
    pixelSize?: number;
    outlineColor?: string;
    outlineWidth?: number;
  };
}

export interface CesiumBillboardFeature extends CesiumFeature {
  type: 'billboard';
  image: string;
  style?: {
    scale?: number;
    pixelOffset?: [number, number];
    eyeOffset?: [number, number, number];
  };
}

export interface CesiumModelFeature extends CesiumFeature {
  type: 'model';
  modelUrl: string;
  style?: {
    scale?: number;
    minimumPixelSize?: number;
    maximumScale?: number;
  };
}

export interface CesiumPolylineFeature extends CesiumFeature {
  type: 'polyline';
  positions: Array<{
    longitude: number;
    latitude: number;
    altitude?: number;
  }>;
  style?: {
    width?: number;
    color?: string;
    clampToGround?: boolean;
  };
}

// Union type pour tous les types de features
export type CesiumFeatureType = 
  | CesiumPointFeature 
  | CesiumBillboardFeature 
  | CesiumModelFeature 
  | CesiumPolylineFeature;

// Configuration pour la création d'entités Cesium
export interface CesiumEntityConfig {
  id: string;
  position?: Cesium.Cartesian3;
  point?: Cesium.PointGraphics.ConstructorOptions;
  billboard?: Cesium.BillboardGraphics.ConstructorOptions;
  model?: Cesium.ModelGraphics.ConstructorOptions;
  polyline?: Cesium.PolylineGraphics.ConstructorOptions;
  label?: Cesium.LabelGraphics.ConstructorOptions;
  description?: string;
}

// Response types pour les APIs
export interface TransportStop extends CesiumFeature {
  stopId: string;
  stopName: string;
  routes: string[];
  accessibility?: boolean;
}

export interface TrafficSensor extends CesiumFeature {
  sensorId: string;
  sensorType: string;
  lastReading?: number;
  status: 'active' | 'inactive' | 'maintenance';
}

// Interfaces pour les réponses API spécifiques 
export interface StibApiResponse {
  stops: Array<{
    stop_id: string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    routes: string[];
    wheelchair_accessible?: boolean;
  }>;
  meta?: {
    total: number;
    updated: string;
  };
}

export interface TelraamApiResponse {
  sensors: Array<{
    sensor_id: string;
    sensor_name: string;
    lat: number;
    lng: number;
    car_count_hour?: number;
    bike_count_hour?: number;
    pedestrian_count_hour?: number;
    status: string;
  }>;
}