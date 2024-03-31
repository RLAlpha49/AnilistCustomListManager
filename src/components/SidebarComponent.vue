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
              <span class="link-text">AniCards</span>
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
          <a href="/StatCards/">
            <div class="link-content">
              <img
                  src="/images/stat-cards.webp"
                  alt="Stat Cards Sidebar Icon"
              />
              <span class="link-text">Stat Cards</span>
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
@import '../assets/styles/sidebar.css';
</style>