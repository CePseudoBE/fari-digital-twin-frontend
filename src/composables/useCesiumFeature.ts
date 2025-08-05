import { inject, type Ref, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import * as Cesium from 'cesium';
import { useLayerStore } from '@/stores/layers';
import type { CesiumEntityConfig, CesiumFeatureType } from '@/types/cesium';

export interface UseCesiumFeatureOptions<
  TData,
  TParsed extends CesiumFeatureType[],
> {
  queryKey: string[];
  fetchFn: () => Promise<TData>;
  parser: (data: TData) => TParsed;
  layerId: string;
  entityConfigFn: (item: TParsed[0]) => CesiumEntityConfig;
  enabled?: Ref<boolean> | (() => boolean);
  staleTime?: number;
  cacheTime?: number;
  refetchInterval?: number;
}

export function useCesiumFeature<TData, TParsed extends CesiumFeatureType[]>({
  queryKey,
  fetchFn,
  parser,
  layerId,
  entityConfigFn,
  enabled = () => true,
  staleTime = 1000 * 60 * 60, // 1 hour
  cacheTime = 1000 * 60 * 120, // 2 hours
  refetchInterval,
}: UseCesiumFeatureOptions<TData, TParsed>) {
  // Inject Cesium viewer (should be provided by a parent component)
  const viewer = inject<Ref<Cesium.Viewer | null>>('cesiumViewer');

  // Use layer store to get visibility state
  const layerStore = useLayerStore();

  // Dynamic visibility check
  const isVisible = (): boolean => {
    return layerStore.isLayerVisible(layerId);
  };

  // Query configuration
  const queryEnabled =
    typeof enabled === 'function' ? enabled : () => enabled.value ?? true;

  // Use TanStack Query for data fetching with caching
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchFn,
    select: parser,
    staleTime,
    gcTime: cacheTime, // Updated from cacheTime to gcTime for newer versions
    retry: 2,
    enabled: queryEnabled,
    refetchInterval,
    refetchOnWindowFocus: false,
  });

  // Watch for changes in data, visibility, and viewer instance
  watch(
    [data, () => isVisible(), () => viewer?.value],
    ([newData, visible, viewerInstance]) => {
      if (!viewerInstance || !newData) return;

      try {
        // Suspend events for performance during bulk operations
        viewerInstance.entities.suspendEvents();

        // Remove existing entities for this layer
        const existingEntities = viewerInstance.entities.values.filter(
          entity =>
            entity.id &&
            typeof entity.id === 'string' &&
            entity.id.startsWith(`${layerId}-`)
        );

        existingEntities.forEach(entity => {
          viewerInstance.entities.remove(entity);
        });

        // Add new entities if layer is visible
        if (visible && Array.isArray(newData)) {
          newData.forEach((item, index) => {
            try {
              const entityConfig = entityConfigFn(item);
              const { id, ...restConfig } = entityConfig;
              const entity = viewerInstance.entities.add({
                id: id || `${layerId}-${item.id || index}`,
                ...restConfig,
              });

              // Add custom properties for identification
              (entity as any).layerId = layerId;
              (entity as any).featureData = item;
            } catch (entityError) {
              console.warn(
                `Failed to create entity for ${layerId}:`,
                entityError,
                item
              );
            }
          });
        }

        // Resume events and request render
        viewerInstance.entities.resumeEvents();
        viewerInstance.scene.requestRender();
      } catch (error) {
        console.error(`Error updating layer ${layerId}:`, error);
      }
    },
    { immediate: true }
  );

  // Utility functions
  const toggleVisibility = () => {
    layerStore.toggleLayer(layerId);
  };

  const getEntitiesForLayer = (): Cesium.Entity[] => {
    if (!viewer?.value) return [];

    return viewer.value.entities.values.filter(
      entity =>
        entity.id &&
        typeof entity.id === 'string' &&
        entity.id.startsWith(`${layerId}-`)
    );
  };

  const zoomToLayer = () => {
    if (!viewer?.value) return;

    const entities = getEntitiesForLayer();
    if (entities.length > 0) {
      viewer.value.zoomTo(entities);
    }
  };

  const getLayerBounds = (): Cesium.Rectangle | null => {
    const entities = getEntitiesForLayer();
    if (entities.length === 0) return null;

    const positions = entities
      .map(entity => entity.position?.getValue(Cesium.JulianDate.now()))
      .filter((pos): pos is Cesium.Cartesian3 => pos !== undefined);

    if (positions.length === 0) return null;

    const cartographics = positions.map(pos =>
      Cesium.Cartographic.fromCartesian(pos)
    );

    const west = Math.min(...cartographics.map(c => c.longitude));
    const east = Math.max(...cartographics.map(c => c.longitude));
    const south = Math.min(...cartographics.map(c => c.latitude));
    const north = Math.max(...cartographics.map(c => c.latitude));

    return new Cesium.Rectangle(west, south, east, north);
  };

  return {
    // Query state
    data,
    isLoading,
    isError,
    error,
    refetch,

    // Layer state
    isVisible: () => isVisible(),
    toggleVisibility,

    // Utility functions
    getEntitiesForLayer,
    zoomToLayer,
    getLayerBounds,

    // Layer info
    layerId,
  };
}
