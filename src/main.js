import './index.css'

import { registerPlugins } from '@/plugins';

import App from './App.vue';

import { createApp } from 'vue';
import store from '@/store/store.js';
import VueObserveVisibility from 'vue3-observe-visibility';

const app = createApp(App);

registerPlugins(app);
app.use(store);
app.use(VueObserveVisibility);
app.mount('#app');
