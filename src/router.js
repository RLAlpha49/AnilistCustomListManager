import { createRouter, createWebHistory } from 'vue-router'
import CustomListManager from './components/ListManagerHome.vue'
import AniListLogin from './components/AniListLogin.vue'
import AniListRedirect from './components/AniListRedirect.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/custom-list-manager/custom-list-home',
      name: 'CustomListManager',
      component: CustomListManager
    },
    {
      path: '/custom-list-manager/anilist-login',
      name: 'AniListLogin',
      component: AniListLogin
    },
    {
      path: '/custom-list-manager/anilist-redirect',
      name: 'AniListRedirect',
      component: AniListRedirect
    }
  ]
})

export default router
