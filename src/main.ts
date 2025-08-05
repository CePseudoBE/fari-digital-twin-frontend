import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import './style.css';
import App from './App.vue';
import router from './router';

// Create app instance
const app = createApp(App);

// Create Pinia store
const pinia = createPinia();

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  console.error('Error info:', info);
  console.error('Component instance:', instance);
};

// Install plugins
app.use(pinia);
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes default
        gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  },
});
app.use(router);

// Mount app
app.mount('#app');
