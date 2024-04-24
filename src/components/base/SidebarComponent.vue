<template>
  <!-- The sidebar component of the application -->
  <aside class="sidebar">
    <!-- Navigation menu -->
    <nav>
      <!-- List of navigation links -->
      <ul>
        <!-- Site icon link -->
        <li class="site-icon-li">
          <a href="/">
            <div class="link-content">
              <!-- Site icon image -->
              <img
                  class="site-icon"
                  src="/images/favicon.webp"
                  alt="Site Sidebar Icon"
              />
              <!-- Site name -->
              <span class="link-text">List Manager</span>
            </div>
          </a>
        </li>
        <!-- Home link -->
        <li>
          <a href="/">
            <div class="link-content">
              <!-- Home icon image -->
              <img
                  src="/images/home.webp"
                  alt="Home Sidebar Icon"
              />
              <!-- Home link text -->
              <span class="link-text">Home</span>
            </div>
          </a>
        </li>
        <!-- Custom Lists link -->
        <li>
          <router-link to="/custom-list-manager/custom-list-home">
            <div class="link-content">
              <!-- Custom Lists icon image -->
              <img
                  src="/images/custom-list.webp"
                  alt="Stat Cards Sidebar Icon"
              />
              <!-- Custom Lists link text -->
              <span class="link-text">Custom Lists</span>
            </div>
          </router-link>
        </li>
        <!-- Stat Cards link -->
        <li>
          <a href="https://anicards.alpha49.com" target="_blank">
            <div class="link-content">
              <!-- Stat Cards icon image -->
              <img
                  src="/images/stat-cards.webp"
                  alt="Stat Cards Sidebar Icon"
              />
              <!-- Container for link text and smaller text -->
              <div class="text-container">
                <!-- Stat Cards link text -->
                <span class="link-text">Stat Cards</span>
                <!-- Smaller text -->
                <span class="small-text">(Different Site)</span>
              </div>
            </div>
          </a>
        </li>
        <!-- FAQ link -->
        <li>
          <router-link to="/faq">
            <div class="link-content">
              <!-- FAQ icon image -->
              <img
                  src="/images/faq.webp"
                  alt="FAQ Sidebar Icon"
              />
              <!-- FAQ link text -->
              <span class="link-text">FAQ</span>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>
    <!-- Bottom link section -->
    <div class="bottom-link">
      <!-- Link content -->
      <div class="link-content">
        <!-- Discord link -->
        <a href="https://discordid.netlify.app/?id=251479989378220044" target="_blank">
          <!-- Discord icon image -->
          <img
              src="/images/Discord.webp"
              alt="Discord Sidebar Icon"
          />
        </a>
        <!-- GitHub link -->
        <a
            href="https://github.com/RLAlpha49/Anilist-Stat-Cards"
            target="_blank"
        >
          <!-- GitHub icon image -->
          <img
              id="github-icon"
              data-src="/images/GitHub.webp"
              alt="GitHub Sidebar Icon"
          />
        </a>
        <!-- Ko-Fi link -->
        <a href="https://ko-fi.com/alpha49" target="_blank">
          <!-- Ko-Fi icon image -->
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
export default {
  // The name of the component
  name: 'SidebarComponent',
  // Lifecycle hook that is called after the component is mounted
  mounted() {
    // Add event listener for sidebar toggle
    this.addSidebarToggleEventListener();
    // Load images
    this.loadImages();
    // Add active link class
    this.addActiveLinkClass();
  },
  // Watch for route changes
  watch: {
    '$route': 'addActiveLinkClass'
  },
  // Component methods
  methods: {
    // Load image by id
    loadImage(id) {
      const img = document.getElementById(id)
      if (img && !img.src) {
        img.src = img.dataset.src
      }
    },
    // Load all images
    loadImages() {
      this.loadImage('github-icon')
      this.loadImage('kofi-icon')
      // Add more calls to loadImage for the other images
    },
    // Add event listener for sidebar toggle
    addSidebarToggleEventListener() {
      const arrow = document.getElementById('arrow')
      if (arrow) {
        arrow.addEventListener('click', function () {
          const sidebar = document.getElementsByClassName('sidebar')[0]

          if (sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded')
            arrow.classList.remove('expanded')
          } else {
            sidebar.classList.add('expanded')
            arrow.classList.add('expanded')
          }
        })
      } else {
        console.log('Element with id "arrow" was not found in the DOM.')
      }
    },
    // Add active link class
    addActiveLinkClass() {
      // Get all the list items in the sidebar navigation
      const listItems = document.querySelectorAll('.sidebar nav ul li')

      // Loop over each list item
      listItems.forEach(function (listItem) {
        const link = listItem.querySelector('a')

        // Check if the listItem is not the site icon
        if (!listItem.classList.contains('site-icon-li')) {
          // Check if the link's href starts with '/custom-list-manager/'
          if (link.getAttribute('href').startsWith('/custom-list-manager/')) {
            // Check if the current URL starts with '/custom-list-manager/'
            if (window.location.pathname.startsWith('/custom-list-manager/')) {
              listItem.classList.add('active-link')
            } else {
              listItem.classList.remove('active-link')
            }
          } else if (window.location.pathname === link.getAttribute('href')) {
            listItem.classList.add('active-link')
          } else {
            listItem.classList.remove('active-link')
          }
        }
      })
    }
  },
  // Lifecycle hook that is called after the component is updated
  updated() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('expanded')) {
      this.loadImages();
    }
  }
}
</script>

<style scoped>
/* Styles for the sidebar navigation links */
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

/* Styles for the sidebar */
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

/* Styles for expanded sidebar */
.sidebar.expanded {
  width: 180px;
}

/* Styles for sidebar navigation list */
.sidebar nav ul,
.sidebar .bottom-link {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

/* Styles for sidebar navigation list items */
.sidebar nav ul li:not(.site-icon-li),
.sidebar .bottom-link {
  width: 100%;
}

/* Styles for sidebar navigation links' icons */
.sidebar nav ul li a img,
.sidebar .bottom-link a img {
  width: 32px;
  height: 32px;
}

/* Styles for sidebar navigation links' icons, except for the site icon */
.sidebar nav ul li a img:not(.site-icon),
.sidebar .bottom-link a img:not(.site-icon) {
  filter: invert(1) brightness(0.6);
}

/* Hover effect for sidebar navigation links */
.sidebar nav ul li a:hover,
.sidebar .bottom-link a:hover {
  filter: brightness(130%);
}

/* Styles for link content */
.link-content {
  display: flex;
  align-items: center;
}

/* Styles for link text */
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

/* Styles for text container */
.text-container {
  display: flex;
  flex-direction: column;
}

/* Styles for smaller text */
.small-text {
  transform: scaleX(0);
  transform-origin: left;
  opacity: 0;
  transition: transform 0.7s, opacity 0.7s;
  white-space: nowrap;
  text-decoration: none;
  filter: brightness(0.6);
  color: white;
  font-size: 0.8em;
  display: block;
}

/* Styles for link text when sidebar is expanded */
.sidebar.expanded .link-text, .sidebar.expanded .small-text{
  padding-left: 10px;
  transform: scaleX(1);
  opacity: 1;
}

/* Styles for active sidebar navigation links */
.sidebar nav ul li.active-link:not(.site-icon-li) a {
  filter: brightness(160%);
}

/* Styles for active sidebar navigation link text */
.sidebar nav ul li.active-link:not(.site-icon-li) .link-text {
  filter: none;
  color: #47a59f;
}

/* Styles for hiding non-first child links in the bottom section */
.sidebar .bottom-link .link-content a:not(:first-child) {
  display: none;
}

/* Styles for icons in the bottom section */
.sidebar .bottom-link .link-content a:not(:first-child) img {
  filter: invert(0) brightness(0.6);
}

/* Styles for hover effect on active sidebar navigation links */
.sidebar nav ul li.active-link:not(.site-icon-li) a:hover {
  filter: brightness(120%);
}

/* Styles for active sidebar navigation links' icons */
.sidebar nav ul li.active-link .link-content img:not(.site-icon) {
  filter:
      invert(56%)
      sepia(58%)
      saturate(371%)
      hue-rotate(127deg)
      brightness(92%)
      contrast(85%);
}

/* Styles for adjusting height of bottom link content */
.bottom-link .link-content {
  height: 46px;
}

/* Styles for positioning the bottom link section */
.sidebar .bottom-link {
  margin-top: auto;
}

/* Styles for displaying non-first child links in the bottom section when sidebar is expanded */
.sidebar.expanded .bottom-link .link-content a:not(:first-child) {
  display: block;
}

/* Media queries for responsive design */

/* For widths up to 700px */
@media (width <= 700px) {
  .sidebar {
    width: calc(64px * 0.9);
  }

  .sidebar.expanded {
    width: calc(180px * 0.9);
  }

  .sidebar nav ul li a,
  .sidebar .bottom-link a {
    padding: calc(5px * 0.9) calc(15px * 0.9);
  }

  .sidebar nav ul li a img,
  .sidebar .bottom-link a img {
    width: calc(32px * 0.9);
    height: calc(32px * 0.9);
  }

  .link-text {
    padding-left: calc(10px * 0.9);
    font-size: calc(1em * 0.95);
  }

  .small-text {
    padding-left: calc(10px * 0.9);
    font-size: calc(0.8em * 0.95);
  }
}

/* For widths up to 550px */
@media (width <= 550px) {
  .sidebar {
    width: calc(64px * 0.8);
  }

  .sidebar.expanded {
    width: calc(180px * 0.8);
  }

  .sidebar nav ul li a,
  .sidebar .bottom-link a {
    padding: calc(5px * 0.8) calc(15px * 0.8);
  }

  .sidebar nav ul li a img,
  .sidebar .bottom-link a img {
    width: calc(32px * 0.8);
    height: calc(32px * 0.8);
  }

  .link-text {
    padding-left: calc(10px * 0.8);
    font-size: calc(1em * 0.9);
  }

  .small-text {
    padding-left: calc(10px * 0.8);
    font-size: calc(0.8em * 0.9);
  }
}

/* For widths up to 500px */
@media (width <= 500px) {
  .sidebar {
    width: calc(64px * 0.7);
  }

  .sidebar.expanded {
    width: calc(180px * 0.7);
  }

  .sidebar nav ul li a,
  .sidebar .bottom-link a {
    padding: calc(5px * 0.7) calc(15px * 0.7);
  }

  .sidebar nav ul li a img,
  .sidebar .bottom-link a img {
    width: calc(32px * 0.7);
    height: calc(32px * 0.7);
  }

  .link-text {
    padding-left: calc(10px * 0.7);
    font-size: calc(1em * 0.85);
  }

  .small-text {
    padding-left: calc(10px * 0.7);
    font-size: calc(0.8em * 0.85);
  }
}

/* For widths up to 450px */
@media (width <= 450px) {
  .sidebar {
    width: calc(64px * 0.6);
  }

  .sidebar.expanded {
    width: calc(180px * 0.65);
  }

  .sidebar nav ul li a,
  .sidebar .bottom-link a {
    padding: calc(5px * 0.6) calc(15px * 0.6);
  }

  .sidebar nav ul li a img,
  .sidebar .bottom-link a img {
    width: calc(32px * 0.6);
    height: calc(32px * 0.6);
  }

  .link-text {
    padding-left: calc(10px * 0.6);
    font-size: calc(1em * 0.8);
  }
}

/* For widths up to 400px */
@media (width <= 400px) {
  .sidebar {
    width: calc(64px * 0.5);
  }

  .sidebar.expanded {
    width: calc(180px * 0.6);
  }

  .sidebar nav ul li a,
  .sidebar .bottom-link a {
    padding: calc(5px * 0.5) calc(15px * 0.5);
  }

  .sidebar nav ul li a img,
  .sidebar .bottom-link a img {
    width: calc(32px * 0.5);
    height: calc(32px * 0.5);
  }

  .link-text {
    padding-left: calc(10px * 0.5);
    font-size: calc(1em * 0.7);
  }
}
</style>