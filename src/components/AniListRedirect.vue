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

      // Save the token with a 24-hour expiration time
      this.saveToken(accessToken);

      // Redirect the user to another page
      this.$router.push('/anilist-login')
    } else {
      // Handle the error
      console.error('No access token found in URL hash')
    }
  },
  methods: {
    saveToken(accessToken) {
      // Save the access token to local storage
      localStorage.setItem('anilistToken', accessToken);

      // Set the expiration time to the current time plus 24 hours
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('anilistTokenExpiration', expirationTime);
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