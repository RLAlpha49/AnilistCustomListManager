<template>
  <div class="container">
    <SidebarComponent/>
    <div class="main">
      <HeaderComponent/>
      <div class="center-container">
        <router-view v-slot="{ Component }">
          <transition :name="transitionName">
            <component :is="Component" :key="$route.fullPath"/>
          </transition>
        </router-view>
      </div>
      <SpeedInsights/>
      <inject/>
      <FooterComponent/>
    </div>
  </div>
</template>

<script>
import SidebarComponent from './components/SidebarComponent.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import {SpeedInsights} from '@vercel/speed-insights/vue'
import {inject} from "@vercel/analytics"

export default {
  name: 'App',
  components: {
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    SpeedInsights,
    inject
  },
  data() {
    return {
      direction: 'forward'
    }
  },
  computed: {
    transitionName() {
      return this.direction === 'forward' ? 'slide-left' : 'slide-right';
    }
  },
  watch: {
    $route(to, from) {
      const toIndex = ['/', '/custom-list-manager/custom-list-manager', '/custom-list-manager/anilist-login', '/custom-list-manager/list-manager'].indexOf(to.path);
      const fromIndex = ['/', '/custom-list-manager/custom-list-manager', '/custom-list-manager/anilist-login', '/custom-list-manager/list-manager'].indexOf(from.path);
      this.direction = toIndex > fromIndex ? 'forward' : 'backward';
    }
  },
  mounted() {
    this.lazyLoadImages();
  },
  methods: {
    lazyLoadImages() {
      const images = document.querySelectorAll('img')
      images.forEach((img) => {
        img.setAttribute('loading', 'lazy')
      })
    }
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
  scrollbar-width: auto; /* For Firefox */
  -ms-overflow-style: auto; /* For Internet Explorer and Edge */
}

body, html {
  height: 100%;
  padding: 0;
  overflow-x: hidden; /* Hide horizontal scrollbar */
  overflow-y: auto; /* Show vertical scrollbar when needed */
}

/* Style the scrollbar */
::-webkit-scrollbar {
  width: 10px; /* Width of the scrollbar */
}

::-webkit-scrollbar-track {
  background: #1b1d25; /* Color of the track */
}

::-webkit-scrollbar-thumb {
  background: #66fcf1; /* Color of the scroll thumb */
  border-radius: 5px; /* Radius of the scroll thumb */
}

::-webkit-scrollbar-thumb:hover {
  background: #1b1d25; /* Color of the scroll thumb when hovered */
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