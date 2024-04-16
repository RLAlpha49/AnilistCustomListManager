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

.footer-div p,
.footer-div a {
  color: #c5c6c7;
  margin: 0;
  padding: 0;
}

.footer-div a:hover {
  color: #66fcf1;
}

.footer-div ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

@media (width <= 700px) {
  .footer-div {
    margin-top: calc(40px * 0.9);
    font-size: calc(0.8em * 0.95);
  }
}

@media (width <= 550px) {
  .footer-div {
    margin-top: calc(40px * 0.8);
    font-size: calc(0.8em * 0.9);
  }
}

@media (width <= 500px) {
  .footer-div {
    margin-top: calc(40px * 0.7);
    font-size: calc(0.8em * 0.7);
  }
}

@media (width <= 450px) {
  .footer-div {
    margin-top: calc(40px * 0.6);
    font-size: calc(0.8em * 0.8);
  }
}

@media (width <= 400px) {
  .footer-div {
    margin-top: calc(40px * 0.5);
    font-size: calc(0.8em * 0.75);
  }
}
</style>