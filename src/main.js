import { createApp } from 'vue'
import App from './App.vue'

require('./assets/scripts/lazyLoadImages.js')
require('./assets/scripts/sidebarHover.js')

createApp(App).mount('#app')
