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
      this.$router.push('/custom-list-manager/anilist-login')
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
      localStorage.setItem('anilistTokenExpiration', expirationTime.toString());
    }
  }
}
</script>