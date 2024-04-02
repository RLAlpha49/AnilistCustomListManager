<template>
  <div>
    <!-- You can display a loading spinner or a message here -->
  </div>
</template>

<script>
export default {
  name: 'AniListRedirect',
  mounted() {
    const urlHash = new URL(window.location.href).hash;
    console.log('URL hash:', urlHash);

    const accessToken = urlHash.split('=')[1];
    console.log('Access token:', accessToken);

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