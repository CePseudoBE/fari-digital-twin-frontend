import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import AssetLibrary from '../views/libraries/AssetLibrary.vue';
import MapLibrary from '../views/libraries/MapLibrary.vue';
import TilesetLibrary from '../views/libraries/TilesetLibrary.vue';
import DemoView from '../views/DemoView.vue';
import HomePage from '../views/HomePage.vue';
import LibraryLayout from '../components/LibraryLayout.vue';
import ApiDocView from '@/views/ApiDocView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'FARI Digital Twin - Home',
    },
  },
  {
    path: '/doc',
    name: 'API Documentation',
    component: ApiDocView,
    meta: {
      title: 'API Documentation',
    },
  },
  {
    path: '/library',
    component: LibraryLayout,
    meta: {
      title: 'Asset Library',
    },
    children: [
      {
        path: 'assets',
        name: 'AssetLibrary',
        component: AssetLibrary,
        meta: {
          title: 'Asset Library - 3D Assets',
        },
      },
      {
        path: 'maps',
        name: 'MapLibrary',
        component: MapLibrary,
        meta: {
          title: 'Asset Library - Maps',
        },
      },
      {
        path: 'tilesets',
        name: 'TilesetLibrary',
        component: TilesetLibrary,
        meta: {
          title: 'Asset Library - Tilesets',
        },
      },
      {
        path: 'demo',
        name: 'Demo',
        component: DemoView,
        meta: {
          title: 'Demo',
        },
      },
      {
        path: '',
        redirect: { name: 'AssetLibrary' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: { name: 'Home' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards for title updates
router.beforeEach(to => {
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }
});

export default router;
