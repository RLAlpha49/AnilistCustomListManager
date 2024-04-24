<template>
  <!-- The footer component of the application -->
  <footer class="footer-div">
    <!-- Copyright notice -->
    <p>© 2024 Alpha49</p>
    <!-- List of links -->
    <ul>
      <!-- Link to the website -->
      <li><a href="https://alpha49.com" target="_blank">Website</a></li>
      <!-- Link to the Github page -->
      <li><a href="https://github.com/RLAlpha49" target="_blank">Github</a></li>
      <!-- Link to send an email -->
      <li><a href="mailto:contact@alpha49.com">Contact</a></li>
    </ul>
    <!-- Disclaimer about AniList API -->
    <p>
      This application uses the AniList API. This project is not
      affiliated with AniList in any way.
    </p>
    <!-- License information -->
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
  // The name of the component
  name: 'FooterComponent',
}
</script>

<style scoped>
/* General styles for the footer */
.footer-div {
  width: auto;
  bottom: 0;
  background-color: #171723;
  color: #c5c6c7;
  text-align: center;
  padding: 10px;
  border-top: 1px solid #66fcf1;
  font-size: 0.8em;
  box-sizing: border-box;
  transition: width 0.5s;
}

/* General styles for the text and links in the footer */
.footer-div p,
.footer-div a {
  color: #c5c6c7;
  margin: 0;
  padding: 0;
}

/* General styles for the links when hovered */
.footer-div a:hover {
  color: #66fcf1;
}

/* General styles for the list of links */
.footer-div ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* Adjust styles for screens 700px wide or less */
@media (width <= 700px) {
  .footer-div {
    margin-top: calc(40px * 0.9);
    font-size: calc(0.8em * 0.95);
  }
}

/* Adjust styles for screens 550px wide or less */
@media (width <= 550px) {
  .footer-div {
    margin-top: calc(40px * 0.8);
    font-size: calc(0.8em * 0.9);
  }
}

/* Adjust styles for screens 500px wide or less */
@media (width <= 500px) {
  .footer-div {
    margin-top: calc(40px * 0.7);
    font-size: calc(0.8em * 0.7);
  }
}

/* Adjust styles for screens 450px wide or less */
@media (width <= 450px) {
  .footer-div {
    margin-top: calc(40px * 0.6);
    font-size: calc(0.8em * 0.8);
  }
}

/* Adjust styles for screens 400px wide or less */
@media (width <= 400px) {
  .footer-div {
    margin-top: calc(40px * 0.5);
    font-size: calc(0.8em * 0.75);
  }
}
</style>