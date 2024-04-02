import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import AniListLogin from './components/AniListLogin.vue'
import AniListRedirect from './components/AniListRedirect.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
      {
          path: '/anilist-login',
          name: 'AniListLogin',
          component: AniListLogin
      },
      {
          path: '/anilist-redirect',
          name: 'AniListRedirect',
          component: AniListRedirect
      }
  ]
})

export default router