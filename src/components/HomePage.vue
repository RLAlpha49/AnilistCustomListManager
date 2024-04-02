<template>
  <div class="homepage">
    <h1>Welcome to Custom List Manager</h1>
    <p>This application allows you to manage your Anilist in a more personalized way.</p>
    <div class="features">
      <div class="feature-card">
        <h2>Grab the list</h2>
        <p>Grab the list of the authenticated Anilist user</p>
      </div>
      <div class="feature-card">
        <h2>Move your entries</h2>
        <p>Move your entries to specific custom lists</p>
      </div>
      <div class="feature-card">
        <h2>Sort entries</h2>
        <p>Sort entries based on status, score, rereads, and type (Manga, Manwha, Manhua)</p>
      </div>
      <div class="feature-card">
        <h2>Filter entries</h2>
        <p>Filter entries by specific tags</p>
      </div>
    </div>
    <router-link to="/anilist-login">
      <button>Next Step</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
.homepage {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #1b1d25;
  color: #c5c6c7;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.homepage h1 {
  color: #66fcf1;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.homepage p {
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 20px;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.feature-card {
  background-color: #0b0c10;
  border: 1px solid #66fcf1;
  border-radius: 5px;
  padding: 10px;
  width: 200px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

.feature-card h2 {
  color: #66fcf1;
  font-size: 1.5em;
  margin-bottom: 10px;
}

.feature-card p {
  color: #c5c6c7;
  font-size: 1em;
}

.homepage button {
  padding: 10px 20px;
  font-size: 1.2em;
  color: #1b1d25;
  background-color: #66fcf1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.homepage button:hover {
  background-color: #45a29e;
}
</style>