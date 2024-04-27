<template>
  <div class="finished-page">
    <h1>Thank you for using this project!</h1>
    <p>Please check out some of my other projects on GitHub:</p>
    <ul>
      <li><a href="https://github.com/RLAlpha49/AniCards" target="_blank">AniCards</a></li>
      <li><a href="https://github.com/RLAlpha49/Anilist-Manga-Updater" target="_blank">Kenmei-to-Anilist</a></li>
      <li><a href="https://github.com/RLAlpha49/AniLink" target="_blank">AniLink</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ListManagerFinished',
}
</script>

<style scoped>
.finished-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.finished-page ul {
  list-style-type: none;
  padding: 0;
}

.finished-page li {
  padding: 10px 0;
  border-bottom: 1px solid #66fcf1;
}

.finished-page li:last-child {
  border-bottom: none;
}


.finished-page a {
  color: #66fcf1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.finished-page a:hover {
  color: #fff;
}
</style>