<template>
  <!-- Homepage container -->
  <div class="homepage">
    <!-- Title -->
    <h1>Welcome to Custom List Manager</h1>
    <!-- Description -->
    <p>This application allows you to manage your Anilist in a more personalized way.</p>
    <!-- Features section -->
    <div class="features">
      <!-- Feature cards -->
      <div class="feature-card">
        <h2>Move your entries</h2>
        <p>Move your entries to specific custom lists</p>
      </div>
      <div class="feature-card">
        <h2>Sort entries</h2>
        <p>Sort entries based on status, score, rereads, genres, tags, and type (Manga, Manwha, Manhua)</p>
      </div>
      <div class="feature-card">
        <h2>Update entries</h2>
        <p>Update entries automatically based on the conditions you set</p>
      </div>
    </div>
    <!-- Navigation buttons -->
    <div class="navigation-buttons">
      <!-- Button to go back -->
      <router-link to="/">
        <button>Back</button>
      </router-link>
      <!-- Button to proceed to the next page -->
      <router-link to="/custom-list-manager/anilist-login">
        <button>Next</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
/* Homepage styles */
.homepage {
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

/* Title styles */
.homepage h1 {
  color: #66fcf1;
  font-size: 2.5em;
  margin-bottom: 20px;
  text-align: center;
}

/* Description styles */
.homepage p {
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 20px;
}

/* Features section styles */
.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

/* Feature card styles */
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
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Feature title styles */
.feature-card h2 {
  color: #66fcf1;
  font-size: 1.5em;
  margin-bottom: 10px;
}

/* Feature description styles */
.feature-card p {
  color: #c5c6c7;
  font-size: 1em;
}

/* Button styles */
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

/* Navigation buttons styles */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>