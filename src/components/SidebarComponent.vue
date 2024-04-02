<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li class="site-icon-li">
          <a href="/">
            <div class="link-content">
              <img
                  class="site-icon"
                  src="/images/favicon.webp"
                  alt="Site Sidebar Icon"
              />
              <span class="link-text">List Manager</span>
            </div>
          </a>
        </li>
        <li>
          <a href="/">
            <div class="link-content">
              <img
                  src="/images/home.webp"
                  alt="Home Sidebar Icon"
              />
              <span class="link-text">Home</span>
            </div>
          </a>
        </li>
        <li>
          <a href="/custom-list-manager">
            <div class="link-content">
              <img
                  src="/images/custom-list.webp"
                  alt="Stat Cards Sidebar Icon"
              />
              <span class="link-text">Custom Lists</span>
            </div>
          </a>
        </li>
        <li>
          <a href="/faq">
            <div class="link-content">
              <img
                  src="/images/faq.webp"
                  alt="FAQ Sidebar Icon"
              />
              <span class="link-text">FAQ</span>
            </div>
          </a>
        </li>
      </ul>
    </nav>
    <div class="bottom-link">
      <div class="link-content">
        <a href="https://discord.gg/TaeAPPmAbw" target="_blank">
          <img
              src="/images/Discord.webp"
              alt="Discord Sidebar Icon"
          />
        </a>
        <a
            href="https://github.com/RLAlpha49/Anilist-Stat-Cards"
            target="_blank"
        >
          <img
              id="github-icon"
              data-src="/images/GitHub.webp"
              alt="GitHub Sidebar Icon"
          />
        </a>
        <a href="https://ko-fi.com/alpha49" target="_blank">
          <img
              id="kofi-icon"
              data-src="/images/Ko-Fi.webp"
              alt="Ko-Fi Sidebar Icon"
          />
        </a>
      </div>
    </div>
  </aside>
</template>

<script>
import { loadImage, loadImages } from '@/assets/scripts/loadImages.js'
import addSidebarToggleEventListener from '@/assets/scripts/sidebarExpanded.js'

export default {
  name: 'SidebarComponent',
  mounted() {
    addSidebarToggleEventListener();
    loadImages();
  },
  methods: {
    loadImage,
    loadImages,
  },
  updated() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('expanded')) {
      this.loadImages();
    }
  }
}
</script>

<style scoped>
.sidebar nav ul li a,
.sidebar .bottom-link a {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  text-decoration: none;
  color: white;
  width: auto;
  transition: width 0.7s;
  overflow: hidden;
}

.sidebar {
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
  height: 100vh;
}

.sidebar.expanded {
  width: 180px;
}

.sidebar nav ul,
.sidebar .bottom-link {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.sidebar nav ul li:not(.site-icon-li),
.sidebar .bottom-link {
  width: 100%;
}

.sidebar nav ul li a img,
.sidebar .bottom-link a img {
  width: 32px;
  height: 32px;
}

.sidebar nav ul li a img:not(.site-icon),
.sidebar .bottom-link a img:not(.site-icon) {
  filter: invert(1) brightness(0.6);
}

.sidebar nav ul li a:hover,
.sidebar .bottom-link a:hover {
  filter: brightness(130%);
}

.link-content {
  display: flex;
  align-items: center;
}

.link-text {
  transform: scaleX(0);
  transform-origin: left;
  opacity: 0;
  transition: transform 0.7s, opacity 0.7s;
  white-space: nowrap;
  text-decoration: none;
  filter: brightness(0.6);
  color: white;
}

.sidebar.expanded .link-text {
  padding-left: 10px;
  transform: scaleX(1);
  opacity: 1;
}

.sidebar nav ul li.active-link:not(.site-icon-li) a {
  filter: brightness(160%);
}

.sidebar nav ul li.active-link:not(.site-icon-li) .link-text {
  filter: none;
  color: #47a59f;
}

.sidebar .bottom-link .link-content a:not(:first-child) {
  display: none;
}

.sidebar .bottom-link .link-content a:not(:first-child) img {
  filter: invert(0) brightness(0.6);
}

.sidebar nav ul li.active-link:not(.site-icon-li) a:hover {
  filter: brightness(120%);
}

.sidebar nav ul li.active-link .link-content img:not(.site-icon) {
  filter:
      invert(56%)
      sepia(58%)
      saturate(371%)
      hue-rotate(127deg)
      brightness(92%)
      contrast(85%);
}

.bottom-link .link-content {
  height: 46px;
}

.sidebar .bottom-link {
  margin-top: auto;
}

.sidebar.expanded .bottom-link .link-content a:not(:first-child) {
  display: block;
}
</style>