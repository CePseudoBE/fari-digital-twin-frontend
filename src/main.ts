import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';

// Global error handler
const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  console.error('Error info:', info);
  console.error('Component instance:', instance);
};

app.use(router);
app.mount('#app');
