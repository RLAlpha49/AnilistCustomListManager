import { createRouter, createWebHistory } from 'vue-router' // Importing Vue Router functions
import CustomListManager from './components/custom-lists/CustomListManagerHome.vue' // Importing CustomListManager component
import AniListLogin from './components/anilist/AniListLogin.vue' // Importing AniListLogin component
import AniListRedirect from './components/anilist/AniListRedirect.vue' // Importing AniListRedirect component
import ListManagerList from './components/custom-lists/CustomListManagerList.vue' // Importing ListManagerList component
import ListManagerUpdate from './components/custom-lists/CustomListManagerUpdate.vue' // Importing ListManagerUpdate component
import WorkInProgress from './components/base/WorkInProgress.vue' // Importing WorkInProgress component

const router = createRouter({
  history: createWebHistory(), // Using web history mode
  routes: [
    // Route for CustomListManager component
    {
      path: '/custom-list-manager/custom-list-home',
      name: 'CustomListManager',
      component: CustomListManager
    },
    // Route for AniListLogin component
    {
      path: '/custom-list-manager/anilist-login',
      name: 'AniListLogin',
      component: AniListLogin
    },
    // Route for AniListRedirect component
    {
      path: '/custom-list-manager/anilist-redirect',
      name: 'AniListRedirect',
      component: AniListRedirect
    },
    // Route for ListManagerList component
    {
      path: '/custom-list-manager/list-manager',
      name: 'ListManager',
      component: ListManagerList
    },
    // Route for ListManagerUpdate component
    {
      path: '/custom-list-manager/update',
      name: 'ListManagerUpdate',
      component: ListManagerUpdate
    },
    // Route for WorkInProgress component
    {
      path: '/custom-list-manager/work-in-progress',
      name: 'WorkInProgress',
      component: WorkInProgress
    }
  ]
})

export default router // Exporting the router configuration
