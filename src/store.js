import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    lists: [],
    type: '',
    userId: null,
    hideDefaultStatusLists: true,
    userSettings: {
      listPlacements: [],
      conditionsAnime: [],
      conditionsManga: [],
      listLocationsAnime: [],
      listLocationsManga: []
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
    setHideDefaultStatusLists (state, hideDefaultStatusLists) {
      state.hideDefaultStatusLists = hideDefaultStatusLists
    },
    setListLocationsAnime (state, listLocations) {
      state.userSettings.listLocationsAnime = listLocations
    },
    setListLocationsManga (state, listLocations) {
      state.userSettings.listLocationsManga = listLocations
    },
    setConditionsAnime (state, conditions) {
      state.userSettings.conditionsAnime = conditions
    },
    setConditionsManga (state, conditions) {
      state.userSettings.conditionsManga = conditions
    }
  },
  getters: {
    lists: state => state.lists,
    userId: state => state.userId,
    type: state => state.type,
    hideDefaultStatusLists: state => state.hideDefaultStatusLists,
    listLocationsAnime: state => state.userSettings.listLocationsAnime,
    listLocationsManga: state => state.userSettings.listLocationsManga,
    conditionsAnime: state => state.userSettings.conditionsAnime,
    conditionsManga: state => state.userSettings.conditionsManga
  },
  plugins: [createPersistedState()]
})
