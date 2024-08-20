import { createApp } from 'vue' // Importing createApp function from Vue
import App from './App.vue' // Importing the root component
import router from './router' // Importing Vue Router instance
import PrimeVue from 'primevue/config' // Importing PrimeVue configuration
import VueLazyload from 'vue-lazyload' // Importing VueLazyload
import 'primevue/resources/themes/saga-blue/theme.css' // Importing PrimeVue theme CSS
import 'primeicons/primeicons.css' // Importing PrimeIcons CSS
import store from './store' // Importing Vuex store instance

const app = createApp(App) // Creating a Vue application instance

// Using Vue Router instance
app.use(router)
// Using VueLazyload
app.use(VueLazyload)
// Using PrimeVue configuration
app.use(PrimeVue)
// Using Vuex store instance
app.use(store)

// Mounting the Vue application to the #app element in the DOM
app.mount('#app')
