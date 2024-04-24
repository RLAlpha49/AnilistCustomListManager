<template>
  <!-- The error modal is only displayed if the 'show' prop is true -->
  <div v-if="show" class="error-modal">
    <div class="modal-content">
      <!-- Display the error title and message -->
      <h2>Error</h2>
      <p>{{ message }}</p>
      <!-- Close button emits a 'close' event when clicked -->
      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorModal',
  props: {
    // Define a required prop named 'show' of type Boolean
    show: {
      type: Boolean,
      required: true
    },
    // Define a required prop named 'message' of type String
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
/* Styles for the error modal */
.error-modal {
  /* Styles for positioning and appearance of the modal */
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(27, 29, 37, 0.8);
}

/* Styles for the modal content */
.modal-content {
  /* Styles for the appearance and layout of the modal content */
  background-color: #1b1d25;
  color: #c5c6c7;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #66fcf1;
  width: 80%;
}

/* Styles for the close button */
.modal-content button {
  /* Styles for the appearance and interaction of the close button */
  background-color: #66fcf1;
  color: #1b1d25;
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

/* Styles for the close button when hovered */
.modal-content button:hover {
  /* Styles for the appearance of the close button when hovered */
  background-color: #1b1d25;
  color: #66fcf1;
  outline: 2px solid #66fcf1;
}
</style>