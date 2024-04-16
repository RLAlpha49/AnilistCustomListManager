import { createRouter, createWebHistory } from 'vue-router'
import CustomListManager from './components/custom-lists/ListManagerHome.vue'
import AniListLogin from './components/anilist/AniListLogin.vue'
import AniListRedirect from './components/anilist/AniListRedirect.vue'
import ListManagerList from './components/custom-lists/ListManagerList.vue'
import WorkInProgress from './components/base/WorkInProgress.vue'

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
    },
    {
      path: '/custom-list-manager/list-manager',
      name: 'ListManager',
      component: ListManagerList
    },
    {
      path: '/custom-list-manager/work-in-progress',
      name: 'WorkInProgress',
      component: WorkInProgress
    }
  ]
})

export default router
