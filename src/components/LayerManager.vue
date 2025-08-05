<template>
  <div class="layer-manager">
    <div class="layer-manager-header">
      <h3>Layer Manager</h3>
      <div class="global-controls">
        <button @click="layerStore.enableAllLayers" class="btn-primary">
          Show All
        </button>
        <button @click="layerStore.disableAllLayers" class="btn-secondary">
          Hide All
        </button>
      </div>
    </div>

    <div class="layer-groups">
      <div 
        v-for="(group, groupKey) in layerGroups" 
        :key="groupKey"
        class="layer-group"
      >
        <div class="group-header">
          <h4>{{ group.name }}</h4>
          <button 
            @click="toggleGroup(group.layers)"
            class="toggle-group-btn"
          >
            {{ isGroupVisible(group.layers) ? '−' : '+' }}
          </button>
        </div>
        
        <div class="group-layers" :class="{ collapsed: !isGroupVisible(group.layers) }">
          <div
            v-for="layerId in group.layers"
            :key="layerId"
            class="layer-item"
          >
            <label class="layer-label">
              <input
                type="checkbox"
                :checked="layerStore.isLayerVisible(layerId)"
                @change="layerStore.toggleLayer(layerId)"
              />
              <span class="layer-name">{{ getLayerDisplayName(layerId) }}</span>
              <span 
                v-if="getLayerStatus(layerId)"
                :class="['status', getLayerStatus(layerId)]"
              >
                {{ getLayerStatusText(layerId) }}
              </span>
            </label>
            
            <div class="layer-actions">
              <button 
                @click="zoomToLayer(layerId)"
                class="action-btn"
                title="Zoom to layer"
              >
                🎯
              </button>
              <button 
                @click="refreshLayer(layerId)"
                class="action-btn"
                title="Refresh layer"
              >
                🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Layer Statistics -->
    <div class="layer-stats">
      <div class="stat">
        <span class="stat-label">Active Layers:</span>
        <span class="stat-value">{{ activeLayersCount }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Total Entities:</span>
        <span class="stat-value">{{ totalEntitiesCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';
import * as Cesium from 'cesium';
import { useLayerStore } from '@/stores/layers';

// Store
const layerStore = useLayerStore();

// Inject Cesium viewer
const viewer = inject<Ref<Cesium.Viewer | null>>('cesiumViewer');

// Get layer groups
const layerGroups = layerStore.getLayerGroups();

// Computed properties
const activeLayersCount = computed(() => {
  return Object.keys(layerGroups).reduce((count, groupKey) => {
    const group = layerGroups[groupKey];
    return count + group.layers.filter(layerId => layerStore.isLayerVisible(layerId)).length;
  }, 0);
});

const totalEntitiesCount = computed(() => {
  if (!viewer?.value) return 0;
  return viewer.value.entities.values.length;
});

// Helper functions
const getLayerDisplayName = (layerId: string): string => {
  const names: Record<string, string> = {
    'stib-stops': 'STIB Bus Stops',
    'sncb-stations': 'SNCB Train Stations',
    'tec-stops': 'TEC Bus Stops',
    'delijn-stops': 'De Lijn Bus Stops',
    'bolt-vehicles': 'Bolt Scooters',
    'lime-vehicles': 'Lime Scooters',
    'dott-vehicles': 'Dott Scooters',
    'pony-vehicles': 'Pony Scooters',
    'brussels-bikes': 'Brussels Bike Stations',
    'air-quality': 'Air Quality Stations',
    'community-sensors': 'Community Sensors',
    'telraam-sensors': 'Traffic Sensors',
    'opensky-aircraft': 'Aircraft',
    'infrabel': 'Railway Infrastructure',
    'sibelga': 'Gas Infrastructure',
    'fixmystreet': 'Urban Issues',
    'energy': 'Energy Data',
  };
  return names[layerId] || layerId;
};

const getLayerStatus = (layerId: string): string | null => {
  // This would be enhanced to check actual layer loading states
  // For now, return null (no status)
  return null;
};

const getLayerStatusText = (layerId: string): string => {
  const status = getLayerStatus(layerId);
  switch (status) {
    case 'loading': return '⟳';
    case 'error': return '⚠️';
    case 'success': return '✓';
    default: return '';
  }
};

const isGroupVisible = (layerIds: string[]): boolean => {
  return layerIds.some(layerId => layerStore.isLayerVisible(layerId));
};

const toggleGroup = (layerIds: string[]) => {
  const anyVisible = isGroupVisible(layerIds);
  layerIds.forEach(layerId => {
    if (anyVisible) {
      // Hide all if any are visible
      if (layerStore.isLayerVisible(layerId)) {
        layerStore.toggleLayer(layerId);
      }
    } else {
      // Show all if none are visible
      if (!layerStore.isLayerVisible(layerId)) {
        layerStore.toggleLayer(layerId);
      }
    }
  });
};

const zoomToLayer = (layerId: string) => {
  if (!viewer?.value) return;
  
  const entities = viewer.value.entities.values.filter(entity =>
    entity.id && typeof entity.id === 'string' && entity.id.startsWith(`${layerId}-`)
  );
  
  if (entities.length > 0) {
    viewer.value.zoomTo(entities);
  }
};

const refreshLayer = (layerId: string) => {
  // This would trigger a refetch of the specific layer data
  // Implementation depends on how you want to expose refetch functions
  console.log(`Refreshing layer: ${layerId}`);
};
</script>

<style scoped>
.layer-manager {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
  max-height: 80vh;
  overflow-y: auto;
  min-width: 280px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.layer-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E2E8F0;
}

.layer-manager-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1E293B;
}

.global-controls {
  display: flex;
  gap: 8px;
}

.btn-primary, .btn-secondary {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3B82F6;
  color: white;
}

.btn-primary:hover {
  background: #2563EB;
}

.btn-secondary {
  background: #E2E8F0;
  color: #475569;
}

.btn-secondary:hover {
  background: #CBD5E1;
}

.layer-group {
  margin-bottom: 16px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
}

.group-header h4 {
  margin: 0;
  font-size: 14px;
  color: #374151;
  font-weight: 600;
}

.toggle-group-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  color: #6B7280;
}

.toggle-group-btn:hover {
  background: #F3F4F6;
}

.group-layers {
  padding-left: 12px;
  transition: all 0.3s ease;
}

.group-layers.collapsed {
  max-height: 0;
  overflow: hidden;
  padding: 0;
}

.layer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #F1F5F9;
}

.layer-item:last-child {
  border-bottom: none;
}

.layer-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.layer-label input[type="checkbox"] {
  margin-right: 8px;
  accent-color: #3B82F6;
}

.layer-name {
  font-size: 13px;
  color: #475569;
}

.status {
  margin-left: 8px;
  font-size: 12px;
}

.status.loading {
  color: #3B82F6;
  animation: spin 1s linear infinite;
}

.status.error {
  color: #DC2626;
}

.status.success {
  color: #059669;
}

.layer-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #F3F4F6;
}

.layer-stats {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #E2E8F0;
}

.stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
}

.stat-label {
  color: #6B7280;
}

.stat-value {
  font-weight: 600;
  color: #374151;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>