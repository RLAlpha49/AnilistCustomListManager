import { createStore } from 'vuex'

export default createStore({
  state: {
    type: null,
    userId: null,
    lists: []
  },
  mutations: {
    setLists(state, lists) {
      state.lists = lists
    },
    setType(state, type) {
      state.type = type
    },
    setUserId(state, userId) {
      state.userId = userId
    }
  },
  actions: {},
  modules: {}
})