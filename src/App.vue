<template>
  <div class="container">
    <SidebarComponent />
    <div class="main">
      <HeaderComponent />
      <div class="center-container">
        <router-view />
      </div>
      <SpeedInsights />
      <inject />
      <FooterComponent />
    </div>
  </div>
</template>

<script>
import SidebarComponent from './components/SidebarComponent.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { inject } from "@vercel/analytics"

export default {
  name: 'App',
  components: {
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    SpeedInsights,
    inject
  }
}
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
html {
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
}

body, html {
  height: 100%;
  padding: 0;
  overflow: hidden;
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
  justify-content: center;
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
  overflow: auto;
  padding: 20px;
}

h1 {
  color: #66fcf1;
  font-size: 2.5em;
}
</style>