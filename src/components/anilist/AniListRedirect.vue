<script>
import {EventBus} from "@/event-bus.js";

export default {
  name: 'AniListRedirect',
  mounted() {
    try {
      const urlHash = new URL(window.location.href).hash;
      const params = new URLSearchParams(urlHash.substring(1)); // Remove the leading '#'
      const accessToken = params.get('access_token');

      if (accessToken) {
        // Store the access token securely
        localStorage.setItem('anilistToken', accessToken)

        // Save the token with a 24-hour expiration time
        this.saveToken(accessToken);

        // Redirect the user to another page
        this.$router.push('/custom-list-manager/anilist-login')
      } else {
        // Handle the error
        EventBus.emit('show-error', 'No access token found in URL hash');
      }
    } catch (error) {
      EventBus.emit('show-error', 'Failed to process redirect: ' + error.message);
    }
  },
  methods: {
    saveToken(accessToken) {
      try {
        // Save the access token to local storage
        localStorage.setItem('anilistToken', accessToken);

        // Set the expiration time to the current time plus 24 hours
        const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('anilistTokenExpiration', expirationTime.toString());
      } catch (error) {
        EventBus.emit('show-error', 'Failed to save token: ' + error.message);
      }
    }
  }
}
</script>