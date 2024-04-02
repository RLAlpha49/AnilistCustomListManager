<template>
  <div class="spinner"></div>
</template>

<script>
export default {
  name: 'AniListRedirect',
  mounted() {
    const urlHash = new URL(window.location.href).hash;

    const accessToken = urlHash.split('=')[1];

    if (accessToken) {
      // Store the access token securely
      localStorage.setItem('anilistToken', accessToken)

      // Redirect the user to another page
      this.$router.push('/anilist-login')
    } else {
      // Handle the error
      console.error('No access token found in URL hash')
    }
  }
}
</script>

<style scoped>
.spinner {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>