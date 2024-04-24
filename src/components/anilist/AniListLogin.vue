<template>
  <div class="anilist-login">
    <!-- Button to initiate AniList login -->
    <button @click="login">Login with AniList</button>
    <!-- Button to logout if logged in -->
    <button v-if="isLoggedIn" @click="logout">Clear Cached Token</button>
    <!-- Message indicating logged in status -->
    <p v-if="isLoggedIn">You are logged in.</p>
    <!-- Message indicating not logged in status -->
    <p v-else>You are not logged in.</p>
    <!-- Navigation buttons -->
    <div class="navigation-buttons">
      <!-- Button to navigate back -->
      <router-link to="/custom-list-manager/custom-list-home">
        <button>Back</button>
      </router-link>
      <!-- Button to navigate next, disabled if not logged in -->
      <router-link :to="isLoggedIn ? '/custom-list-manager/list-manager' : ''">
        <button :class="{ 'button-disabled': !isLoggedIn }">Next</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import {EventBus} from "@/event-bus.js";

export default {
  // Component name
  name: 'AniListLogin',
  // Component data
  data() {
    return {
      isLoggedIn: false
    }
  },
  // Lifecycle hook: mounted
  mounted() {
    const accessToken = localStorage.getItem('anilistToken');
    const expirationTime = localStorage.getItem('anilistTokenExpiration');

    if (new Date().getTime() > expirationTime) {
      // Token has expired, remove it from local storage
      localStorage.removeItem('anilistToken');
      localStorage.removeItem('anilistTokenExpiration');
      this.isLoggedIn = false;
    } else if (accessToken) {
      // Token is still valid
      this.isLoggedIn = true;
    }
  },
  // Component methods
  methods: {
    // Method to initiate AniList login
    login() {
      const clientId = process.env.VUE_APP_ANILIST_CLIENT_ID;
      const responseType = 'token';

      window.location.href = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=${responseType}`;
    },
    // Method to logout
    logout() {
      try {
        // Remove the access token and its expiration time from local storage
        localStorage.removeItem('anilistToken');
        localStorage.removeItem('anilistTokenExpiration');

        // Update the isLoggedIn state
        this.isLoggedIn = false;
      } catch (error) {
        // Emit an error event
        EventBus.emit('show-error', 'Failed to logout: ' + error.message);
      }
    }
  }
}
</script>

<style scoped>
/* Scoped CSS styles for the AniListLogin component */
.anilist-login {
  /* Flexbox layout for centering content vertically and horizontally */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 20px;
  background-color: #1b1d25;
  color: #c5c6c7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Styles for disabled button */
.button-disabled {
  background-color: #ccc !important;
  color: #888 !important;
  cursor: not-allowed !important;
}

/* Styles for heading */
.anilist-login h1 {
  color: #66fcf1;
  font-size: 2.5em;
  margin-bottom: 20px;
}

/* Styles for paragraphs */
.anilist-login p {
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 20px;
}

/* Styles for buttons */
.anilist-login button {
  padding: 10px 20px;
  font-size: 1.2em;
  color: #1b1d25;
  background-color: #66fcf1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
}

/* Hover effect for buttons */
.anilist-login button:hover {
  background-color: #45a29e;
}

/* Styles for navigation buttons */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

@media (width <= 700px) {
  .anilist-login p {
    font-size: calc(1.2em * 0.95);
  }

  .anilist-login button {
    font-size: calc(1.2em * 0.95);
  }
}

@media (width <= 550px) {
  .anilist-login p {
    font-size: calc(1.2em * 0.9);
  }

  .anilist-login button {
    font-size: calc(1.2em * 0.9);
  }
}

@media (width <= 500px) {
  .anilist-login p {
    font-size: calc(1.2em * 0.85);
  }

  .anilist-login button {
    font-size: calc(1.2em * 0.85);
  }
}

@media (width <= 450px) {
  .anilist-login p {
    font-size: calc(1.2em * 0.8);
  }

  .anilist-login button {
    font-size: calc(1.2em * 0.8);
  }
}

@media (width <= 400px) {
  .anilist-login p {
    font-size: calc(1.2em * 0.75);
  }

  .anilist-login button {
    font-size: calc(1.2em * 0.75);
  }
}
</style>