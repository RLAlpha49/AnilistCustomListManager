<template>
  <div class="container">
    <SidebarComponent />
    <div class="main">
      <HeaderComponent />
      <!-- Add your main content here -->
      <FooterComponent />
    </div>
  </div>
</template>

<script>
import SidebarComponent from './components/SidebarComponent.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
  name: 'App',
  components: {
    SidebarComponent,
    HeaderComponent,
    FooterComponent
  }
}
</script>

<style>
@import './assets/styles/home.css';
</style>
