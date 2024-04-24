<template>
  <!-- The header component of the application -->
  <header>
    <!-- Sidebar expand arrow -->
    <div id="arrow">
      <img
          src="/images/sidebar-arrow.webp"
          alt="Sidebar Expand Arrow"
      />
    </div>
    <!-- Link to the changelog -->
    <p>
      <a
          class="changelog-link"
          href="https://docs.alpha49.com/anilist-list-manager"
          target="_blank"
      >Changelog</a
      >
    </p>
  </header>
</template>

<script>
export default {
  // The name of the component
  name: 'HeaderComponent',
}
</script>

<style scoped>
/* Styles for the header */
header {
  grid-column: 1 / -1;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 42px;
  background-color: #1e1e2e;
  color: #66fcf1;
  box-sizing: border-box;
  z-index: 1;
}

/* Styles for the sidebar expand arrow */
#arrow {
  position: relative;
  left: 0;
  cursor: pointer;
}

/* Styles for the sidebar expand arrow image */
#arrow img {
  width: 32px;
  height: 32px;
  filter: invert(1);
  transition: transform 0.5s ease-in-out;
}

/* Styles for the sidebar expand arrow image when the sidebar is expanded */
#arrow.expanded img {
  transform: rotate(180deg);
}

/* Styles for the paragraph in the header */
header p {
  color: #c5c6c7;
  margin-left: auto;
  margin-bottom: 16px;
  font-size: 1em;
}

/* Styles for the changelog link */
.changelog-link {
  color: #61aeff;
  text-decoration: none;
  font-weight: bold;
}

/* Styles for the changelog link when hovered */
.changelog-link:hover {
  color: #4090d9;
  text-decoration: underline;
}

/* Responsive styles for screens 700px wide or less */
@media (width <= 700px) {
  header {
    height: calc(42px * 0.9);
  }

  #arrow img {
    width: calc(32px * 0.9);
    height: calc(32px * 0.9);
  }

  header p {
    font-size: calc(1em * 0.9);
  }
}

/* Responsive styles for screens 550px wide or less */
@media (width <= 550px) {
  header {
    height: calc(42px * 0.8);
  }

  #arrow img {
    width: calc(32px * 0.8);
    height: calc(32px * 0.8);
  }

  header p {
    font-size: calc(1em * 0.8);
    margin-bottom: calc(16px * 0.8);
  }
}

/* Responsive styles for screens 500px wide or less */
@media (width <= 500px) {
  header {
    height: calc(42px * 0.7);
  }

  #arrow img {
    width: calc(32px * 0.7);
    height: calc(32px * 0.7);
  }

  header p {
    font-size: calc(1em * 0.7);
    margin-bottom: calc(16px * 0.7);
  }
}

/* Responsive styles for screens 450px wide or less */
@media (width <= 450px) {
  header {
    height: calc(42px * 0.6);
  }

  #arrow img {
    width: calc(32px * 0.6);
    height: calc(32px * 0.6);
  }

  header p {
    font-size: calc(1em * 0.6);
    margin-bottom: calc(16px * 0.6);
  }
}

/* Responsive styles for screens 400px wide or less */
@media (width <= 400px) {
  header {
    height: calc(42px * 0.5);
  }

  #arrow img {
    width: calc(32px * 0.5);
    height: calc(32px * 0.5);
  }

  header p {
    font-size: calc(1em * 0.5);
    margin-bottom: calc(16px * 0.5);
  }
}
</style>