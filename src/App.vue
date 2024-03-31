<template>
  <div class="container">
    <SidebarComponent />
    <div class="main">
      <HeaderComponent />
      <!-- Add your main content here -->
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
@import './assets/styles/home.css';
</style>