<template>
  <div v-if="show" class="error-modal">
    <div class="modal-content">
      <h2>Error</h2>
      <p>{{ message }}</p>
      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
.error-modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(27, 29, 37, 0.8); /* Change the background color to match your app's theme */
}

.modal-content {
  background-color: #1b1d25; /* Change the background color to match your app's theme */
  color: #c5c6c7; /* Change the text color to match your app's theme */
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #66fcf1; /* Change the border color to match your app's theme */
  width: 80%;
}

.modal-content button {
  background-color: #66fcf1; /* Change the button color to match your app's theme */
  color: #1b1d25; /* Change the button text color to match your app's theme */
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  transition-duration: 0.4s;
}

.modal-content button:hover {
  background-color: #1b1d25; /* Change the button hover color to match your app's theme */
  color: #66fcf1; /* Change the button text hover color to match your app's theme */
  outline: 2px solid #66fcf1; /* Change the button hover outline color to match your app's theme */
}
</style>