<template>
  <!-- Main container for the application -->
  <div class="container">
    <!-- Sidebar component -->
    <SidebarComponent/>
    <!-- Main content area -->
    <div class="main">
      <!-- Header component -->
      <HeaderComponent/>
      <!-- Center container for the main content -->
      <div class="center-container">
        <!-- Error modal component, shown when showError is true -->
        <ErrorModal :show="showError" :message="errorMessage" @close="clearError"/>
        <!-- Router view for displaying the current route's component -->
        <router-view v-slot="{ Component }">
          <!-- Transition wrapper for route transitions -->
          <transition :name="transitionName">
            <!-- Dynamic component for the current route's component -->
            <component :is="Component" :key="$route.fullPath"/>
          </transition>
        </router-view>
      </div>
      <!-- Speed insights and inject components -->
      <SpeedInsights/>
      <inject/>
      <!-- Footer component -->
      <FooterComponent/>
    </div>
  </div>
</template>

<script>
// Importing necessary components and modules
import SidebarComponent from './components/base/SidebarComponent.vue'
import HeaderComponent from './components/base/HeaderComponent.vue'
import FooterComponent from './components/base/FooterComponent.vue'
import ErrorModal from './components/base/ErrorModal.vue'
import {EventBus} from "@/event-bus.js";
import {SpeedInsights} from '@vercel/speed-insights/vue'
import {inject} from "@vercel/analytics"

export default {
  // Component name
  name: 'App',
  // Components used in this component
  components: {
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    ErrorModal,
    SpeedInsights,
    inject
  },
  // Data properties for this component
  data() {
    return {
      showError: false, // Whether to show the error modal
      errorMessage: '', // The error message to display in the modal
      direction: 'forward' // The direction of the route transition
    }
  },
  // Lifecycle hook: created
  created() {
    // Listen for 'show-error' events on the event bus
    EventBus.on('show-error', message => {
      // When a 'show-error' event is received, show the error modal with the received message
      this.errorMessage = message;
      this.showError = true;
    });
  },
  // Computed properties for this component
  computed: {
    // Compute the transition name based on the direction of the route transition
    transitionName() {
      return this.direction === 'forward' ? 'slide-left' : 'slide-right';
    }
  },
  // Watchers for this component
  watch: {
    // Watch for changes to the route
    $route(to, from) {
      // Compute the indices of the current and previous routes in the route array
      const toIndex = ['/', '/custom-list-manager/custom-list-manager', '/custom-list-manager/anilist-login', '/custom-list-manager/list-manager', '/custom-list-manager/update', '/custom-list-manager/work-in-progress'].indexOf(to.path);
      const fromIndex = ['/', '/custom-list-manager/custom-list-manager', '/custom-list-manager/anilist-login', '/custom-list-manager/list-manager', '/custom-list-manager/update', '/custom-list-manager/work-in-progress'].indexOf(from.path);
      // Set the direction of the route transition based on the comparison of the indices
      this.direction = toIndex > fromIndex ? 'forward' : 'backward';
    }
  },
  // Methods for this component
  methods: {
    // Method to clear the error and hide the error modal
    clearError() {
      this.errorMessage = '';
      this.showError = false;
      // Stop listening for 'show-error' events on the event bus
      EventBus.off('show-error');
    },
  }
}
</script>

<style>
/* Show scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  display: block;
}

/* Show scrollbar for IE, Edge and Firefox */
html {
  scrollbar-width: auto;
  -ms-overflow-style: auto;
}

body, html {
  height: 100%;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1b1d25;
}

::-webkit-scrollbar-thumb {
  background: #66fcf1;
  border-radius: 5px;
}

body {
  margin: 0;
  font-family: "Helvetica Neue", sans-serif;
  background-color: #1b1d25;
}

body,
.center-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: #c5c6c7;
}

.container, #app {
  display: flex;
  flex: 1 0 auto;
  position: relative;
}

.main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}

.container, .main {
  width: 100vw;
  min-height: 100vh;
}

.main-content {
  grid-column: 2;
  grid-row: 2;
}

p {
  margin-bottom: 20px;
  font-size: 1.2em;
  padding: 10px 20px;
}

.center-container {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
}

h1 {
  color: #66fcf1;
  font-size: 2.5em;
}

.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 1s ease-in-out;
  position: absolute;
}

.slide-left-enter-from, .slide-right-leave-to {
  transform: translateX(100vw);
}

.slide-left-leave-to, .slide-right-enter-from {
  transform: translateX(-100vw);
}

.slide-left-enter-to, .slide-right-enter-to {
  transform: translateX(0);
}
</style>