<template>
  <div class="cesium-map-container">
    <!-- Cesium Viewer Container -->
    <div ref="cesiumContainer" class="cesium-viewer"></div>

    <!-- Layer Controls -->
    <div class="layer-controls">
      <h3>Data Layers</h3>

      <!-- Transport Layers -->
      <div class="layer-group">
        <h4>Public Transport</h4>
        <label>
          <input
            :checked="layerStore.showStibStopsLayer"
            type="checkbox"
            @change="layerStore.toggleStibStopsLayer"
          />
          STIB Stops
          <span v-if="stibLoading" class="loading">⟳</span>
        </label>

        <label>
          <input
            :checked="layerStore.showSncbStationsLayer"
            type="checkbox"
            @change="layerStore.toggleSncbStationsLayer"
          />
          SNCB Stations
          <span v-if="sncbLoading" class="loading">⟳</span>
        </label>
      </div>

      <!-- Mobility Layers -->
      <div class="layer-group">
        <h4>Shared Mobility</h4>
        <label>
          <input
            :checked="layerStore.showBrusselsBikesLayer"
            type="checkbox"
            @change="layerStore.toggleBrusselsBikesLayer"
          />
          Brussels Bikes
          <span v-if="bikesLoading" class="loading">⟳</span>
        </label>

        <label>
          <input
            :checked="layerStore.showBoltVehiclesLayer"
            type="checkbox"
            @change="layerStore.toggleBoltVehiclesLayer"
          />
          Bolt Vehicles
          <span v-if="boltLoading" class="loading">⟳</span>
        </label>
      </div>

      <!-- Environment Layers -->
      <div class="layer-group">
        <h4>Environment</h4>
        <label>
          <input
            :checked="layerStore.showAirQualityLayer"
            type="checkbox"
            @change="layerStore.toggleAirQualityLayer"
          />
          Air Quality
          <span v-if="airQualityLoading" class="loading">⟳</span>
        </label>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="hasErrors" class="error-panel">
      <h4>Connection Issues:</h4>
      <ul>
        <li v-if="stibError">STIB: {{ stibError.message }}</li>
        <li v-if="sncbError">SNCB: {{ sncbError.message }}</li>
        <li v-if="bikesError">Brussels Bikes: {{ bikesError.message }}</li>
        <li v-if="boltError">Bolt: {{ boltError.message }}</li>
        <li v-if="airQualityError">
          Air Quality: {{ airQualityError.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Stores
import { useLayerStore } from '@/stores/layers';

// Layer composables
import {
  useSncbStations,
  useStibStops,
} from '@/composables/layers/useTransportLayers';
import {
  useBoltVehicles,
  useBrusselsBikes,
} from '@/composables/layers/useMobilityLayers';
import { useAirQualityStations } from '@/composables/layers/useEnvironmentLayers';

// Template refs
const cesiumContainer = ref<HTMLDivElement>();
const viewer = ref<Cesium.Viewer | null>(null);

// Store
const layerStore = useLayerStore();

// Layer composables - these handle all the data fetching and Cesium entity management
const {
  isLoading: stibLoading,
  isError: stibHasError,
  error: stibError,
} = useStibStops();
const {
  isLoading: sncbLoading,
  isError: sncbHasError,
  error: sncbError,
} = useSncbStations();
const {
  isLoading: bikesLoading,
  isError: bikesHasError,
  error: bikesError,
} = useBrusselsBikes();
const {
  isLoading: boltLoading,
  isError: boltHasError,
  error: boltError,
} = useBoltVehicles();
const {
  isLoading: airQualityLoading,
  isError: airQualityHasError,
  error: airQualityError,
} = useAirQualityStations();

// Computed for error handling
const hasErrors = computed(
  () =>
    stibHasError.value ||
    sncbHasError.value ||
    bikesHasError.value ||
    boltHasError.value ||
    airQualityHasError.value
);

// Cesium setup
const initializeCesium = () => {
  if (!cesiumContainer.value) return;

  viewer.value = new Cesium.Viewer(cesiumContainer.value, {
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,
    sceneModePicker: true,
    navigationHelpButton: false,
    infoBox: true,
    selectionIndicator: true,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
  });

  // Set initial camera position (Brussels)
  viewer.value.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(4.3517, 50.8503, 15000), // Brussels overview
    orientation: {
      heading: 0.0,
      pitch: -Cesium.Math.PI_OVER_TWO * 0.5,
      roll: 0.0,
    },
  });

  // Provide viewer to child composables
  provide('cesiumViewer', viewer);
};

// Lifecycle
onMounted(() => {
  initializeCesium();
});

onBeforeUnmount(() => {
  if (viewer.value) {
    viewer.value.destroy();
    viewer.value = null;
  }
});
</script>

<style scoped>
.cesium-map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.cesium-viewer {
  width: 100%;
  height: 100%;
}

.layer-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(48, 51, 107, 0.8);
  color: white;
  padding: 15px;
  border-radius: 5px;
  min-width: 200px;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
}

.layer-controls h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 8px;
}

.layer-group {
  margin-bottom: 15px;
}

.layer-group h4 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.layer-controls label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.layer-controls label:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.layer-controls input[type='checkbox'] {
  margin-right: 8px;
  accent-color: #3b82f6;
}

.loading {
  margin-left: auto;
  animation: spin 1s linear infinite;
  color: #3b82f6;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-panel {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  padding: 10px;
  border-radius: 5px;
  max-width: 300px;
  backdrop-filter: blur(10px);
}

.error-panel h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.error-panel ul {
  margin: 0;
  padding-left: 15px;
  font-size: 12px;
}

.error-panel li {
  margin-bottom: 4px;
}
</style>
