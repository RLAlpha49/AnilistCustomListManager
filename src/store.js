import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    lists: [],
    type: '',
    userId: null,
    userSettings: {
      listPlacements: [],
      conditions: []
    }
  },
  mutations: {
    setLists (state, lists) {
      state.lists = lists
    },
    setType (state, type) {
      state.type = type
    },
    setUserId (state, userId) {
      state.userId = userId
    },
    setListPlacements (state, placements) {
      state.userSettings.listPlacements = placements
    },
    setConditions (state, conditions) {
      state.userSettings.conditions = conditions
    }
  },
  getters: {
    lists: state => state.lists,
    userId: state => state.userId,
    type: state => state.type,
    listPlacements: state => state.userSettings.listPlacements,
    conditions: state => state.userSettings.conditions
  },
  plugins: [createPersistedState()]
})
