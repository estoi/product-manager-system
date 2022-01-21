import { createApp } from 'vue'
import Particles from 'particles.vue3';
import App from './App.vue'
import router from '@/router';

import '@/styles/index.less'

import 'ant-design-vue/dist/antd.css';

const app = createApp(App);

app.use(router)

app.use(Particles)

app.mount('#app')
