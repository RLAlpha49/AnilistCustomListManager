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
header p {
  color: #c5c6c7;
  margin-left: auto;
  font-size: 1em;
}

.changelog-link {
  color: #61aeff;
  text-decoration: none;
  font-weight: bold;
}

.changelog-link:hover {
  color: #4090d9;
  text-decoration: underline;
}

#arrow {
  position: relative;
  left: 0;
  cursor: pointer;
}

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

#arrow img {
  width: 32px;
  height: 32px;
  filter: invert(1);
  transition: transform 0.5s ease-in-out;
}

#arrow.expanded img {
  transform: rotate(180deg);
}

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
  }
}

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
  }
}

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
  }
}

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
  }
}
</style>