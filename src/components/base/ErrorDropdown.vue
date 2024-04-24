<template>
  <!-- The div is only displayed if the countdown prop is greater than or equal to 0 -->
  <div class="dropdown" v-if="countdown >= 0">
    <!-- Display an error message with a countdown -->
    Error: Retrying in {{ countdown }} secs
  </div>
</template>

<script>
export default {
  props: {
    // Define a required prop named countdown of type Number
    countdown: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.dropdown {
  /* Styles for positioning and sizing the dropdown */
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