<template>
  <div class="dropdown" v-if="countdown >= 0">
    Error: Retrying in {{ countdown }} secs
  </div>
</template>

<script>
export default {
  props: {
    countdown: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.dropdown {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 600px;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.5);
  color: #ffffff;
  text-align: center;
  z-index: 1000;
  border-radius: 10px;
}
</style>