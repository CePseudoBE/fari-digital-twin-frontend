<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
  >
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-white">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"
      ></div>
      <div class="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
          <h1
            class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Digital Twin Demos
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Explore interactive demonstrations of Brussels' digital twin with
            real-time data layers, 3D visualizations, and smart city insights
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <button
              class="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 hover:scale-105"
              @click="scrollToExamples"
            >
              Explore Demos
            </button>
            <button
              class="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors duration-200"
              @click="openInteractiveMap"
            >
              Interactive Map <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Examples Grid -->
    <div
      ref="examplesSection"
      class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8"
    >
      <div class="mx-auto max-w-2xl text-center mb-16">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Featured Demonstrations
        </h2>
        <p class="mt-4 text-lg text-gray-600">
          Each demo showcases different aspects of the digital twin ecosystem
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="example in examples"
          :key="example.id"
          class="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl hover:ring-blue-300 hover:-translate-y-1 flex flex-col"
        >
          <!-- Preview Image/Icon -->
          <div
            class="aspect-video w-full overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 relative"
          >
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-6xl opacity-80">{{ example.icon }}</div>
            </div>
            <!-- Category Badge -->
            <div class="absolute top-4 left-4">
              <span
                :class="getCategoryBadgeClass(example.category)"
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              >
                {{ example.category }}
              </span>
            </div>
            <!-- Data Sources Count -->
            <div
              class="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1"
            >
              <span class="text-white text-xs font-medium">
                {{ getActiveLayersCount(example) }} layers
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex flex-col flex-1">
            <div class="flex items-center justify-between mb-3">
              <h3
                class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200"
              >
                {{ example.name }}
              </h3>
              <div class="flex items-center space-x-1">
                <div
                  v-for="n in 5"
                  :key="n"
                  :class="
                    n <= example.complexity ? 'bg-yellow-400' : 'bg-gray-200'
                  "
                  class="w-1 h-1 rounded-full"
                ></div>
              </div>
            </div>

            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              {{ example.description }}
            </p>

            <!-- Data Source Tags -->
            <div class="flex flex-wrap gap-2 mb-6 flex-1">
              <span
                v-for="source in example.dataSources"
                :key="source"
                :class="getDataSourceClass(source)"
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset h-fit"
              >
                {{ source }}
              </span>
            </div>

            <!-- Action Button -->
            <button
              class="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 mt-auto"
              @click="openExample(example)"
            >
              <span>Launch Demo</span>
              <svg
                class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Map Section -->
    <div class="bg-gray-900 text-white">
      <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to explore more?
          </h2>
          <p class="mt-4 text-lg text-gray-300">
            Access the full interactive map with all available data layers and
            real-time information
          </p>
          <div class="mt-8">
            <RouterLink
              class="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:scale-105"
              to="/library"
            >
              <span>Open Interactive Map</span>
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Example Modal -->
    <ExampleViewer
      v-if="selectedExample"
      :example="selectedExample"
      @close="selectedExample = null"
    />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import ExampleViewer from '../components/ExampleViewer.vue';

const router = useRouter();
const selectedExample = ref(null);
const examplesSection = ref<HTMLElement>();

// Modern demo examples with real-world use cases
const examples = ref([
  {
    id: 'complete-city',
    name: 'Complete Smart City',
    description: 'A comprehensive view of the smart city including buildings, urban infrastructure, and environmental assets. Features all available 3D tilesets with interactive building information.',
    icon: '🏙️',
    category: 'Analytics',
    complexity: 5,
    dataSources: ['Buildings', 'Trees', 'EV Chargers', 'Lampposts'],
    layers: [
      {
        id: 'basemap',
        name: 'Base Map Layer',
        type: 'basemap',
        enabled: true,
      },
      {
        id: 'buildings',
        name: 'Building Tileset',
        type: 'tileset',
        url: 'https://digitaltwin.s3.gra.io.cloud.ovh.net/tileset_manager/2025-06-18_20-47-13/tileset.json',
        enabled: true,
      },
      {
        id: 'trees',
        name: 'Tree Tileset',
        type: 'tileset',
        url: 'https://digitaltwin.s3.gra.io.cloud.ovh.net/tileset_manager/2025-07-10_14-31-18/tiles/tileset.json',
        enabled: true,
      },
      {
        id: 'evchargers',
        name: 'EV Charger Tileset',
        type: 'tileset',
        url: 'https://digitaltwin.s3.gra.io.cloud.ovh.net/tileset_manager/2025-06-19_14-19-30/tiles/tileset.json',
        enabled: true,
      },
      {
        id: 'lampposts',
        name: 'Lamppost Tileset',
        type: 'tileset',
        url: 'https://digitaltwin.s3.gra.io.cloud.ovh.net/tileset_manager/2025-06-20_09-25-48/tiles/tileset.json',
        enabled: true,
      },
    ],
    features: [
      'Interactive 3D buildings',
      'Urban vegetation mapping',
      'EV infrastructure',
      'Smart lighting network',
    ],
  },
  {
    id: 'urban-infrastructure',
    name: 'Urban Infrastructure',
    description: 'Focus on essential city infrastructure including buildings, electric vehicle charging stations, and urban lighting systems for smart city management.',
    icon: '⚡',
    category: 'Energy',
    complexity: 4,
    dataSources: ['Buildings', 'EV Chargers', 'Street Lighting'],
    layers: [
      {
        id: 'basemap',
        name: 'Base Map Layer',
        type: 'basemap',
        enabled: true,
      },
      {
        id: 'buildings',
        name: 'Building Tileset',
        type: 'tileset',
        url: 'https://digitaltwin.s3.gra.io.cloud.ovh.net/tileset_manager/2025-06-18_20-47-13/tileset.json',
        enabled: true,
      },
      {
        id: 'evchargers',
        name: 'EV Charger Tileset',
        type: 'tileset',
        url: 'https://digitaltwin.s3.gra.io.cloud.ovh.net/tileset_manager/2025-06-19_14-19-30/tiles/tileset.json',
        enabled: true,
      },
      {
        id: 'lampposts',
        name: 'Lamppost Tileset',
        type: 'tileset',
        url: 'https://digitaltwin.s3.gra.io.cloud.ovh.net/tileset_manager/2025-06-20_09-25-48/tiles/tileset.json',
        enabled: true,
      },
    ],
    features: [
      'Building analysis',
      'EV charging network',
      'Smart lighting system',
      'Infrastructure optimization',
    ],
  },
  {
    id: 'smart-mobility',
    name: 'Smart Mobility Hub',
    description:
      "Real-time visualization of Brussels' transportation ecosystem including public transport, shared mobility, and traffic flow analysis.",
    icon: '🚊',
    category: 'Mobility',
    complexity: 4,
    dataSources: ['STIB', 'SNCB', 'Shared Bikes', 'Traffic Sensors'],
    layers: [
      { id: 'stib-stops', enabled: true, name: 'STIB Stops', type: 'data' },
      { id: 'sncb-stations', enabled: true, name: 'SNCB Stations', type: 'data' },
      { id: 'brussels-bikes', enabled: true, name: 'Brussels Bikes', type: 'data' },
      { id: 'telraam-sensors', enabled: true, name: 'Traffic Sensors', type: 'data' },
    ],
    features: [
      'Real-time arrivals',
      'Bike availability',
      'Traffic patterns',
      'Route optimization',
    ],
  },
  {
    id: 'environmental-monitoring',
    name: 'Environmental Intelligence',
    description:
      'Monitor air quality, community sensors, and environmental health across Brussels with live data visualization and trend analysis.',
    icon: '🌱',
    category: 'Environment',
    complexity: 3,
    dataSources: ['Air Quality', 'Community Sensors', 'Weather Data'],
    layers: [
      { id: 'air-quality', enabled: true, name: 'Air Quality', type: 'data' },
      { id: 'community-sensors', enabled: true, name: 'Community Sensors', type: 'data' },
    ],
    features: [
      'Air quality index',
      'Pollution hotspots',
      'Sensor networks',
      'Health recommendations',
    ],
  },
  {
    id: 'emergency-response',
    name: 'Emergency Response Network',
    description:
      'Critical infrastructure monitoring and emergency response coordination with real-time alerts and resource management.',
    icon: '🚨',
    category: 'Safety',
    complexity: 4,
    dataSources: ['Emergency Services', 'Infrastructure', 'Communication'],
    layers: [
      { id: 'emergency-services', enabled: true, name: 'Emergency Services', type: 'data' },
      { id: 'critical-infrastructure', enabled: true, name: 'Critical Infrastructure', type: 'data' },
    ],
    features: [
      'Response times',
      'Resource allocation',
      'Risk assessment',
      'Communication hubs',
    ],
  },
  {
    id: 'citizen-engagement',
    name: 'Citizen Engagement Platform',
    description:
      'Interactive platform for citizen feedback, urban issues reporting, and community participation in city development.',
    icon: '👥',
    category: 'Community',
    complexity: 3,
    dataSources: ['Citizen Reports', 'Social Data', 'Feedback Systems'],
    layers: [
      { id: 'citizen-reports', enabled: true, name: 'Citizen Reports', type: 'data' },
      { id: 'community-projects', enabled: true, name: 'Community Projects', type: 'data' },
    ],
    features: [
      'Issue reporting',
      'Community feedback',
      'Participation tracking',
      'Transparency tools',
    ],
  },
]);

// Helper functions
const getCategoryBadgeClass = (category: string) => {
  const classes: Record<string, string> = {
    Mobility: 'bg-blue-100 text-blue-800',
    Environment: 'bg-green-100 text-green-800',
    Analytics: 'bg-purple-100 text-purple-800',
    Safety: 'bg-red-100 text-red-800',
    Energy: 'bg-yellow-100 text-yellow-800',
    Community: 'bg-pink-100 text-pink-800',
  };
  return classes[category] || 'bg-gray-100 text-gray-800';
};

const getDataSourceClass = (source: string) => {
  const classes: Record<string, string> = {
    STIB: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    SNCB: 'bg-red-50 text-red-700 ring-red-600/20',
    'Shared Bikes': 'bg-green-50 text-green-700 ring-green-600/20',
    'Traffic Sensors': 'bg-purple-50 text-purple-700 ring-purple-600/20',
    'Air Quality': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    'Community Sensors': 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
    'Weather Data': 'bg-sky-50 text-sky-700 ring-sky-600/20',
  };
  return classes[source] || 'bg-gray-50 text-gray-700 ring-gray-600/20';
};

const getActiveLayersCount = (example: any) => {
  return (
    example.layers?.filter((layer: any) => layer.enabled).length ||
    example.dataSources?.length ||
    0
  );
};

const scrollToExamples = async () => {
  await nextTick();
  examplesSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const openInteractiveMap = () => {
  router.push('/library');
};

const openExample = (example: any) => {
  selectedExample.value = example;
};
</script>
