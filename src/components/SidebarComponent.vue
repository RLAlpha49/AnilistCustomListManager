<template>
  <aside>
    <ul>
      <li>Link 1</li>
      <li>Link 2</li>
      <li>Link 3</li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'SidebarComponent',
}
</script>

<style scoped>
aside {
  width: 64px;
  flex-shrink: 0;
  flex-basis: auto;
  background-color: #16181f;
  font-family: "Helvetica Neue", sans-serif;
  color: #c5c6c7;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: width 0.5s;
  grid-row: 2;
  position: sticky;
  top: 0;
  bottom: 0;
}
</style>