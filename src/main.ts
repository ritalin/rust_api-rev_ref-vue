import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vueDebounce from 'vue-debounce'

createApp(App)
    .use(createPinia())
    .directive('debounce', vueDebounce({ lock: true }))
    .mount('#app')
