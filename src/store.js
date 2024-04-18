import { createStore } from 'vuex'

export default createStore({
  state: {
    type: null,
    userId: null,
    lists: [],
    hideDefaultStatusLists: false
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
    setHideDefaultStatusLists (state, value) {
      state.hideDefaultStatusLists = value
    }
  },
  getters: {
    type: state => state.type,
    userId: state => state.userId,
    lists: state => state.lists,
    hideDefaultStatusLists: state => state.hideDefaultStatusLists
  },
  actions: {},
  modules: {}
})