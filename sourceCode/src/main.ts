import 'uno.css'
import '@unocss/reset/tailwind.css'
import 'element-plus/dist/index.css'
import './assets/css/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'

createApp(App)
.use(ElementPlus)
.mount('#app')
