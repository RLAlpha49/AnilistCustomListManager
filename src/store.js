import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    lists: [],
    type: '',
    userId: null
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
    }
  },
  getters: {
    lists: state => state.lists,
    userId: state => state.userId,
    type: state => state.type
  },
  plugins: [createPersistedState()]
})
