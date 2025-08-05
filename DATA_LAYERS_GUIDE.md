# 🌍 Digital Twin Data Layers - Guide d'utilisation

Cette architecture offre une solution **modulaire**, **type-safe** et **performante** pour gérer les données en temps réel du jumeau numérique de Bruxelles.

## 🚀 Utilisation simple

### Usage basique dans un composant

```vue
<template>
  <div>
    <!-- Affichage automatique sur Cesium -->
    <CesiumMap />
    
    <!-- Contrôles des layers -->
    <button @click="toggleStibStops">
      Toggle STIB Stops
      <span v-if="stibLoading">⟳</span>
    </button>
  </div>
</template>

<script setup>
import { useStibStops } from '@/composables/layers/useTransportLayers';
import { useLayerStore } from '@/stores/layers';

// Données automatiquement synchronisées avec Cesium
const { isLoading: stibLoading } = useStibStops();
const { toggleStibStopsLayer } = useLayerStore();
</script>
```

### Gestion globale des layers

```typescript
// Store centralisé pour tous les layers
const layerStore = useLayerStore();

// Toggle any layer
layerStore.toggleLayer('stib-stops');

// Bulk operations
layerStore.enableAllLayers();
layerStore.disableAllLayers();

// Check visibility
const isVisible = layerStore.isLayerVisible('stib-stops');
```

## 🏗️ Architecture

### 1. **Services Framework-Agnostic**
```typescript
// ✅ Pure functions, réutilisables partout
export async function fetchStibStops(): Promise<StibApiResponse> {
  const response = await apiClient.get('/stib-collector/');
  return response.data;
}

export function parseStibStops(data: StibApiResponse): CesiumPointFeature[] {
  return data.stops.map(stop => ({
    id: `stib-stop-${stop.stop_id}`,
    type: 'point',
    position: { longitude: stop.stop_lon, latitude: stop.stop_lat },
    style: { color: '#1E40AF', pixelSize: 8 }
  }));
}
```

### 2. **Store Pinia Centralisé**
```typescript
// ✅ État global type-safe pour tous les layers
const layerStore = useLayerStore();

// Accès direct à tous les layers
layerStore.showStibStopsLayer.value; // Réactif
layerStore.toggleStibStopsLayer(); // Action
```

### 3. **Composable Générique**
```typescript
// ✅ Un composable pour tous les types de layers
export function useCesiumFeature<TData, TParsed>({
  queryKey: ['stib', 'stops'],
  fetchFn: fetchStibStops,
  parser: parseStibStops,
  layerId: 'stib-stops',
  entityConfigFn: (stop) => ({ /* Cesium config */ }),
  staleTime: 30 * 60 * 1000, // 30 min cache
}) {
  // ✅ Gestion automatique :
  // - Fetching avec cache (TanStack Query)
  // - Synchronisation avec Cesium viewer
  // - Gestion de la visibilité (Pinia store)
  // - Error handling
  // - Loading states
}
```

## 📊 Layers disponibles

### Transport Public
```typescript
const { isLoading, error, data } = useStibStops();     // STIB bus stops
const { } = useSncbStations();   // SNCB train stations
const { } = useDeLijnStops();    // De Lijn bus stops
```

### Mobilité Partagée
```typescript
const { } = useBoltVehicles();   // Bolt scooters
const { } = useLimeVehicles();   // Lime scooters
const { } = useBrusselsBikes();  // Brussels bike stations
```

### Environnement
```typescript
const { } = useAirQualityStations();  // Air quality monitoring
const { } = useCommunitySensors();    // Community sensors
```

### Trafic
```typescript
const { } = useTelraamSensors();  // Traffic counting sensors
```

## 🎛️ Features avancées

### Cache intelligent (TanStack Query)
```typescript
// ✅ Cache automatique par type de donnée
{
  staleTime: 30 * 60 * 1000,        // Transport stops: 30min
  staleTime: 5 * 60 * 1000,         // Vehicles: 5min
  staleTime: 60 * 60 * 1000,        // Air quality: 1h
  refetchInterval: 5 * 60 * 1000,   // Auto-refresh véhicules
}
```

### Error handling robuste
```typescript
const { isError, error } = useStibStops();

if (isError.value) {
  console.log(error.value.message); // Message d'erreur localisé
}
```

### Utilities Cesium
```typescript
const stibLayer = useStibStops();

// Zoom to layer
stibLayer.zoomToLayer();

// Get entities
const entities = stibLayer.getEntitiesForLayer();

// Get bounds
const bounds = stibLayer.getLayerBounds();
```

## 🎨 Customisation

### Créer un nouveau layer

1. **Service**
```typescript
// services/myService.ts
export async function fetchMyData(): Promise<MyApiResponse> {
  return apiClient.get('/my-endpoint').then(r => r.data);
}

export function parseMyData(data: MyApiResponse): CesiumPointFeature[] {
  return data.items.map(item => ({
    id: `my-layer-${item.id}`,
    type: 'point',
    position: { longitude: item.lng, latitude: item.lat },
    style: { color: '#FF6B6B', pixelSize: 10 }
  }));
}
```

2. **Composable**
```typescript
// composables/layers/useMyLayer.ts
export function useMyLayer() {
  return useCesiumFeature({
    queryKey: ['my-service'],
    fetchFn: fetchMyData,
    parser: parseMyData,
    layerId: 'my-layer',
    entityConfigFn: (item) => ({
      id: item.id,
      position: Cesium.Cartesian3.fromDegrees(
        item.position.longitude,
        item.position.latitude
      ),
      point: {
        pixelSize: item.style.pixelSize,
        color: Cesium.Color.fromCssColorString(item.style.color),
      },
    }),
  });
}
```

3. **Store** (ajouter au store layers)
```typescript
const showMyLayer = ref(false);
const toggleMyLayer = () => { showMyLayer.value = !showMyLayer.value; };
```

## 🔥 Avantages de cette architecture

### ✅ **Type Safety**
- TypeScript strict sur toute la chaîne
- Interfaces clairement définies
- Détection d'erreurs à la compilation

### ✅ **Performance**
- Cache intelligent avec TanStack Query
- Rendu optimisé avec Cesium
- Lazy loading des données

### ✅ **Modulaire**
- Services réutilisables (React, Angular, etc.)
- Composables Vue découplés
- Store centralisé mais flexible

### ✅ **Developer Experience**
- Auto-completion partout
- Gestion d'erreurs centralisée
- Loading states automatiques
- Hot reload sur les changements

### ✅ **Maintenance**
- Code découplé et testable
- Standards cohérents
- Documentation TypeScript intégrée

## 📈 Monitoring et debug

```typescript
// Debug layer state
console.log('Active layers:', layerStore.getLayerGroups());

// Monitor query cache
import { useQueryClient } from '@tanstack/vue-query';
const queryClient = useQueryClient();
console.log('Cache state:', queryClient.getQueryCache());

// Cesium entities count
console.log('Total entities:', viewer.entities.values.length);
```

---

**Cette architecture te permet de "vibe coder" tout en maintenant une qualité professionnelle !** 🚀

Chaque nouveau layer suit le même pattern : **Service → Composable → Usage**. Simple, prévisible et extensible.