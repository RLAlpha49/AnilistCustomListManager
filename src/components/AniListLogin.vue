<template>
  <div class="anilist-login">
    <button @click="login">Login with AniList</button>
    <button v-if="isLoggedIn" @click="logout">Logout</button>
    <p v-if="isLoggedIn">You are logged in.</p>
    <p v-else>You are not logged in.</p>
    <div class="navigation-buttons">
      <router-link to="/custom-list-manager">
        <button>Back</button>
      </router-link>
      <router-link :to="isLoggedIn ? '/next-page' : ''">
        <button :class="{ 'button-disabled': !isLoggedIn }">Next</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AniListLogin',
  data() {
    return {
      isLoggedIn: false
    }
  },
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
  methods: {
    login() {
      const clientId = process.env.VUE_APP_ANILIST_CLIENT_ID;
      const responseType = 'token';

      const url = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=${responseType}`;

      window.location.href = url;
    },
    logout() {
      // Remove the access token and its expiration time from local storage
      localStorage.removeItem('anilistToken');
      localStorage.removeItem('anilistTokenExpiration');

      // Update the isLoggedIn state
      this.isLoggedIn = false;
    }
  }
}
</script>

<style scoped>
.anilist-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #1b1d25;
  color: #c5c6c7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.button-disabled {
  background-color: #ccc !important;
  color: #888 !important;
  cursor: not-allowed !important;
}

.anilist-login h1 {
  color: #66fcf1;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.anilist-login p {
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 20px;
}

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

.anilist-login button:hover {
  background-color: #45a29e;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>