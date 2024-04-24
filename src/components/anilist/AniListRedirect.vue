<script>
// Import the EventBus from the event-bus.js file
import {EventBus} from "@/event-bus.js";

export default {
  // Component name
  name: 'AniListRedirect',
  // Lifecycle hook: mounted
  mounted() {
    try {
      // Get the hash portion of the URL
      const urlHash = new URL(window.location.href).hash;
      // Extract parameters from the URL hash
      const params = new URLSearchParams(urlHash.substring(1)); // Remove the leading '#'
      // Get the access token from the parameters
      const accessToken = params.get('access_token');

      if (accessToken) {
        // Store the access token securely in local storage
        localStorage.setItem('anilistToken', accessToken)

        // Save the token with a 24-hour expiration time
        this.saveToken(accessToken);

        // Redirect the user to another page
        this.$router.push('/custom-list-manager/anilist-login')
      } else {
        // Handle the case when no access token is found
        EventBus.emit('show-error', 'No access token found in URL hash');
      }
    } catch (error) {
      // Handle errors
      EventBus.emit('show-error', 'Failed to process redirect: ' + error.message);
    }
  },
  // Component methods
  methods: {
    // Method to save the access token and its expiration time
    saveToken(accessToken) {
      try {
        // Save the access token to local storage
        localStorage.setItem('anilistToken', accessToken);

        // Set the expiration time to the current time plus 24 hours
        const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('anilistTokenExpiration', expirationTime.toString());
      } catch (error) {
        // Handle errors when saving the token
        EventBus.emit('show-error', 'Failed to save token: ' + error.message);
      }
    }
  }
}
</script>