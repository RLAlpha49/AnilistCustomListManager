import { createStore } from 'vuex' // Importing Vuex store creation function
import createPersistedState from 'vuex-persistedstate' // Importing Vuex persisted state plugin

export default createStore({
  // Vuex store configuration
  state: {
    // Initial state properties
    lists: [], // Array to store lists
    type: '', // Type of list
    userId: null, // User ID
    hideDefaultStatusLists: true, // Boolean to indicate whether to hide default status lists
    userSettings: {
      // User settings object
      listPlacements: [], // Array to store list placements
      conditionsAnime: [], // Array to store conditions for anime
      conditionsManga: [], // Array to store conditions for manga
      listLocationsAnime: [], // Array to store list locations for anime
      listLocationsManga: [] // Array to store list locations for manga
    }
  },
  // Vuex mutations to modify state
  mutations: {
    // Mutation to set lists
    setLists (state, lists) {
      state.lists = lists.map(list => {
        return {
          ...list,
          entries: list.entries.map(entry => {
            // eslint-disable-next-line no-unused-vars
            const { media, ...rest } = entry
            return rest
          })
        }
      })
    },
    // Mutation to set type
    setType (state, type) {
      state.type = type
    },
    // Mutation to set user ID
    setUserId (state, userId) {
      state.userId = userId
    },
    // Mutation to set hideDefaultStatusLists
    setHideDefaultStatusLists (state, hideDefaultStatusLists) {
      state.hideDefaultStatusLists = hideDefaultStatusLists
    },
    // Mutation to set list locations for anime
    setListLocationsAnime (state, listLocations) {
      state.userSettings.listLocationsAnime = listLocations
    },
    // Mutation to set list locations for manga
    setListLocationsManga (state, listLocations) {
      state.userSettings.listLocationsManga = listLocations
    },
    // Mutation to set conditions for anime
    setConditionsAnime (state, conditions) {
      state.userSettings.conditionsAnime = conditions
    },
    // Mutation to set conditions for manga
    setConditionsManga (state, conditions) {
      state.userSettings.conditionsManga = conditions
    }
  },
  // Vuex getters to access state
  getters: {
    // Getter for lists
    lists: state => state.lists,
    // Getter for user ID
    userId: state => state.userId,
    // Getter for type
    type: state => state.type,
    // Getter for hideDefaultStatusLists
    hideDefaultStatusLists: state => state.hideDefaultStatusLists,
    // Getter for list locations for anime
    listLocationsAnime: state => state.userSettings.listLocationsAnime,
    // Getter for list locations for manga
    listLocationsManga: state => state.userSettings.listLocationsManga,
    // Getter for conditions for anime
    conditionsAnime: state => state.userSettings.conditionsAnime,
    // Getter for conditions for manga
    conditionsManga: state => state.userSettings.conditionsManga
  },
  // Vuex plugins to enable additional functionality
  plugins: [createPersistedState()] // Using Vuex persisted state plugin
})
