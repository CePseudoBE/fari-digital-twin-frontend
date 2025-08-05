import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export interface LayerState {
  // Transport layers
  showStibStopsLayer: Ref<boolean>;
  showSncbStationsLayer: Ref<boolean>;
  showTecStopsLayer: Ref<boolean>;
  showDeLijnStopsLayer: Ref<boolean>;
  
  // Mobility layers
  showBoltVehiclesLayer: Ref<boolean>;
  showLimeVehiclesLayer: Ref<boolean>;
  showDottVehiclesLayer: Ref<boolean>;
  showPonyVehiclesLayer: Ref<boolean>;
  showBrusselsBikesLayer: Ref<boolean>;
  
  // Environment layers
  showAirQualityLayer: Ref<boolean>;
  showCommunitySensorsLayer: Ref<boolean>;
  
  // Traffic layers
  showTelraamSensorsLayer: Ref<boolean>;
  
  // Aviation layers
  showOpenskyAircraftLayer: Ref<boolean>;
  
  // Infrastructure layers
  showInfrabelLayer: Ref<boolean>;
  showSibelgaLayer: Ref<boolean>;
  
  // Urban issues
  showFixMyStreetLayer: Ref<boolean>;
  
  // Energy
  showEnergyLayer: Ref<boolean>;

  // Actions
  toggleStibStopsLayer: () => void;
  toggleSncbStationsLayer: () => void;
  toggleTecStopsLayer: () => void;
  toggleDeLijnStopsLayer: () => void;
  toggleBoltVehiclesLayer: () => void;
  toggleLimeVehiclesLayer: () => void;
  toggleDottVehiclesLayer: () => void;
  togglePonyVehiclesLayer: () => void;
  toggleBrusselsBikesLayer: () => void;
  toggleAirQualityLayer: () => void;
  toggleCommunitySensorsLayer: () => void;
  toggleTelraamSensorsLayer: () => void;
  toggleOpenskyAircraftLayer: () => void;
  toggleInfrabelLayer: () => void;
  toggleSibelgaLayer: () => void;
  toggleFixMyStreetLayer: () => void;
  toggleEnergyLayer: () => void;

  // Utility methods
  toggleLayer: (layerId: string) => void;
  isLayerVisible: (layerId: string) => boolean;
  enableAllLayers: () => void;
  disableAllLayers: () => void;
  getLayerGroups: () => Record<string, { name: string; layers: string[] }>;
}

export const useLayerStore = defineStore('layers', (): LayerState => {
  // Transport layers
  const showStibStopsLayer = ref(true);
  const showSncbStationsLayer = ref(true);
  const showTecStopsLayer = ref(false);
  const showDeLijnStopsLayer = ref(false);
  
  // Mobility layers
  const showBoltVehiclesLayer = ref(false);
  const showLimeVehiclesLayer = ref(false);
  const showDottVehiclesLayer = ref(false);
  const showPonyVehiclesLayer = ref(false);
  const showBrusselsBikesLayer = ref(true);
  
  // Environment layers
  const showAirQualityLayer = ref(true);
  const showCommunitySensorsLayer = ref(false);
  
  // Traffic layers
  const showTelraamSensorsLayer = ref(false);
  
  // Aviation layers
  const showOpenskyAircraftLayer = ref(false);
  
  // Infrastructure layers
  const showInfrabelLayer = ref(false);
  const showSibelgaLayer = ref(false);
  
  // Urban issues
  const showFixMyStreetLayer = ref(false);
  
  // Energy
  const showEnergyLayer = ref(false);

  // Individual toggle functions
  const toggleStibStopsLayer = () => { showStibStopsLayer.value = !showStibStopsLayer.value; };
  const toggleSncbStationsLayer = () => { showSncbStationsLayer.value = !showSncbStationsLayer.value; };
  const toggleTecStopsLayer = () => { showTecStopsLayer.value = !showTecStopsLayer.value; };
  const toggleDeLijnStopsLayer = () => { showDeLijnStopsLayer.value = !showDeLijnStopsLayer.value; };
  const toggleBoltVehiclesLayer = () => { showBoltVehiclesLayer.value = !showBoltVehiclesLayer.value; };
  const toggleLimeVehiclesLayer = () => { showLimeVehiclesLayer.value = !showLimeVehiclesLayer.value; };
  const toggleDottVehiclesLayer = () => { showDottVehiclesLayer.value = !showDottVehiclesLayer.value; };
  const togglePonyVehiclesLayer = () => { showPonyVehiclesLayer.value = !showPonyVehiclesLayer.value; };
  const toggleBrusselsBikesLayer = () => { showBrusselsBikesLayer.value = !showBrusselsBikesLayer.value; };
  const toggleAirQualityLayer = () => { showAirQualityLayer.value = !showAirQualityLayer.value; };
  const toggleCommunitySensorsLayer = () => { showCommunitySensorsLayer.value = !showCommunitySensorsLayer.value; };
  const toggleTelraamSensorsLayer = () => { showTelraamSensorsLayer.value = !showTelraamSensorsLayer.value; };
  const toggleOpenskyAircraftLayer = () => { showOpenskyAircraftLayer.value = !showOpenskyAircraftLayer.value; };
  const toggleInfrabelLayer = () => { showInfrabelLayer.value = !showInfrabelLayer.value; };
  const toggleSibelgaLayer = () => { showSibelgaLayer.value = !showSibelgaLayer.value; };
  const toggleFixMyStreetLayer = () => { showFixMyStreetLayer.value = !showFixMyStreetLayer.value; };
  const toggleEnergyLayer = () => { showEnergyLayer.value = !showEnergyLayer.value; };

  // Map layer IDs to their refs for dynamic access
  const layerMap = {
    'stib-stops': showStibStopsLayer,
    'sncb-stations': showSncbStationsLayer,
    'tec-stops': showTecStopsLayer,
    'delijn-stops': showDeLijnStopsLayer,
    'bolt-vehicles': showBoltVehiclesLayer,
    'lime-vehicles': showLimeVehiclesLayer,
    'dott-vehicles': showDottVehiclesLayer,
    'pony-vehicles': showPonyVehiclesLayer,
    'brussels-bikes': showBrusselsBikesLayer,
    'air-quality': showAirQualityLayer,
    'community-sensors': showCommunitySensorsLayer,
    'telraam-sensors': showTelraamSensorsLayer,
    'opensky-aircraft': showOpenskyAircraftLayer,
    'infrabel': showInfrabelLayer,
    'sibelga': showSibelgaLayer,
    'fixmystreet': showFixMyStreetLayer,
    'energy': showEnergyLayer,
  };

  // Utility functions
  const toggleLayer = (layerId: string) => {
    const layerRef = layerMap[layerId as keyof typeof layerMap];
    if (layerRef) {
      layerRef.value = !layerRef.value;
    }
  };

  const isLayerVisible = (layerId: string): boolean => {
    const layerRef = layerMap[layerId as keyof typeof layerMap];
    return layerRef?.value ?? false;
  };

  const enableAllLayers = () => {
    Object.values(layerMap).forEach(layerRef => {
      layerRef.value = true;
    });
  };

  const disableAllLayers = () => {
    Object.values(layerMap).forEach(layerRef => {
      layerRef.value = false;
    });
  };

  const getLayerGroups = () => ({
    transport: {
      name: 'Public Transport',
      layers: ['stib-stops', 'sncb-stations', 'tec-stops', 'delijn-stops']
    },
    mobility: {
      name: 'Shared Mobility',
      layers: ['bolt-vehicles', 'lime-vehicles', 'dott-vehicles', 'pony-vehicles', 'brussels-bikes']
    },
    environment: {
      name: 'Environment',
      layers: ['air-quality', 'community-sensors']
    },
    traffic: {
      name: 'Traffic',
      layers: ['telraam-sensors']
    },
    aviation: {
      name: 'Aviation',
      layers: ['opensky-aircraft']
    },
    infrastructure: {
      name: 'Infrastructure',
      layers: ['infrabel', 'sibelga']
    },
    urban: {
      name: 'Urban Issues',
      layers: ['fixmystreet']
    },
    energy: {
      name: 'Energy',
      layers: ['energy']
    }
  });

  return {
    // State
    showStibStopsLayer,
    showSncbStationsLayer,
    showTecStopsLayer,
    showDeLijnStopsLayer,
    showBoltVehiclesLayer,
    showLimeVehiclesLayer,
    showDottVehiclesLayer,
    showPonyVehiclesLayer,
    showBrusselsBikesLayer,
    showAirQualityLayer,
    showCommunitySensorsLayer,
    showTelraamSensorsLayer,
    showOpenskyAircraftLayer,
    showInfrabelLayer,
    showSibelgaLayer,
    showFixMyStreetLayer,
    showEnergyLayer,

    // Actions
    toggleStibStopsLayer,
    toggleSncbStationsLayer,
    toggleTecStopsLayer,
    toggleDeLijnStopsLayer,
    toggleBoltVehiclesLayer,
    toggleLimeVehiclesLayer,
    toggleDottVehiclesLayer,
    togglePonyVehiclesLayer,
    toggleBrusselsBikesLayer,
    toggleAirQualityLayer,
    toggleCommunitySensorsLayer,
    toggleTelraamSensorsLayer,
    toggleOpenskyAircraftLayer,
    toggleInfrabelLayer,
    toggleSibelgaLayer,
    toggleFixMyStreetLayer,
    toggleEnergyLayer,

    // Utilities
    toggleLayer,
    isLayerVisible,
    enableAllLayers,
    disableAllLayers,
    getLayerGroups,
  };
});