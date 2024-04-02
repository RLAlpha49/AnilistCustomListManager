import { createRouter, createWebHistory } from 'vue-router'
import CustomListManager from './components/CustomListManager.vue'
import AniListLogin from './components/AniListLogin.vue'
import AniListRedirect from './components/AniListRedirect.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/custom-list-manager',
      name: 'CustomListManager',
      component: CustomListManager
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
