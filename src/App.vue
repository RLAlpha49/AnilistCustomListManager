<template>
  <SidebarComponent />
  <div id="content">
    <HeaderComponent />
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <FooterComponent />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import SidebarComponent from './components/SidebarComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  }
}
</script>

<style>
body {
  margin: 0;
  height: 100%;
}

img {
  width: 500px;
  height: 500px;
}

#content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

#app {
  display: flex;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>