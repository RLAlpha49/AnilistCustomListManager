<template>
  <header>
    <div id="arrow">
      <img
          src="/images/sidebar-arrow.webp"
          alt="Sidebar Expand Arrow"
      />
    </div>
    <p>
      <a
          class="changelog-link"
          href="https://docs.alpha49.com/"
          target="_blank"
      >Changelog</a
      >
    </p>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
}
</script>

<style scoped>
@import '../assets/styles/header.css';
</style>