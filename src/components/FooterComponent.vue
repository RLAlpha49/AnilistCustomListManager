<template>
  <footer class="footer-div">
    <p>© 2024 Alpha49</p>
    <ul>
      <li><a href="https://alpha49.com" target="_blank">Website</a></li>
      <li>
        <a href="https://github.com/RLAlpha49" target="_blank">Github</a>
      </li>
      <li><a href="mailto:contact@alpha49.com">Contact</a></li>
    </ul>
    <p>
      This application uses the AniList API. This project is not
      affiliated with AniList in any way.
    </p>
    <p>
      This project is licensed under the
      <a href="https://www.gnu.org/licenses/gpl-3.0.en.html"
      >GNU General Public License v3.0</a
      >.
    </p>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
}
</script>

<style scoped>
@import '../assets/styles/footer.css';
</style>