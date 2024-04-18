<template>
  <div id="list-manager-list">
    <div class="manager">
      <h1 style="text-align: center">{{ title }}</h1>
      <p style="text-align: center">The order of the list does not affect the functionality.<br> Select the option in
        the dropdowns to be assocaited with the custom list.<br> For example if you want all anime/manga with the
        completed status to be set a certain custom list.</p>
      <div class="button-container">
        <button @click="fetchLists('ANIME')">Anime Lists</button>
        <button @click="fetchLists('MANGA')">Manga Lists</button>
      </div>
      <div style="text-align: center;">
        <input type="checkbox" id="hideDefaultStatusLists" v-model="hideDefaultStatusLists">
        <label for="hideDefaultStatusLists">Hide Default Status Lists</label>
        <p style="color: #c5c6c7; font-size: 0.8em;">
          This option is for hiding AniList's default status lists (Watching, Completed, Planning, etc).
          It does not affect the custom lists.
        </p>
      </div>
      <div class="draggable-container">
        <div v-if="loading" class="spinner"></div>
        <draggable
            v-model="lists"
            group="customLists"
            @start="drag=true"
            @end="drag=false"
            item-key="name">
          <template #item="{element}">
            <div class="list-item">
              <div class="drag-handle">&#x2630;</div>
              <div class="list-content">{{ element.name }}</div>
              <Dropdown v-model="element.selectedOption" :options="getOptions(listType)" filter showClear
                        optionLabel="label"
                        option-value="value"
                        optionGroupLabel="label" optionGroupChildren="items" placeholder="Select a Condition"
                        class="custom-dropdown">
                <template #optiongroup="slotProps">
                  <div class="flex align-items-center">
                    <div>{{ slotProps.option.label }}</div>
                  </div>
                </template>
              </Dropdown>
            </div>
          </template>
        </draggable>
      </div>
      <div class="navigation-buttons">
        <router-link to="/custom-list-manager/anilist-login">
          <button>Back</button>
        </router-link>
        <button @click="confirmAndNavigate">Next</button>
      </div>
      <div v-if="showPopup" class="popup">
        <h2>Conditions:</h2>
        <div>
          <input type="checkbox" id="hideDefaultStatusLists" v-model="hideDefaultStatusLists">
          <label for="hideDefaultStatusLists">Hide Default Status Lists</label>
        </div>
        <ul>
          <li v-for="list in filteredLists" :key="list.name">
            {{ list.name }}: {{ list.selectedOption }}
          </li>
        </ul>
        <div class="navigation-buttons">
          <button @click="showPopup = false">Cancel</button>
          <button @click="proceedToNextStep">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Dropdown from 'primevue/dropdown';
import {EventBus} from "@/event-bus.js";

export default {
  name: 'ListManagerList',
  components: {
    draggable,
    Dropdown
  },
  data() {
    return {
      drag: false,
      lists: [],
      token: null,
      userId: null,
      listType: 'ANIME',
      loading: false,
      showPopup: false,
      errorMessage: null,
      hideDefaultStatusLists: true,
    }
  },
  computed: {
    title() {
      return `Your ${this.listType} Custom Lists`;
    },
    filteredLists() {
      return this.lists.filter(list => list.selectedOption);
    }
  },
  mounted() {
    this.token = localStorage.getItem('anilistToken');
    if (!this.token) {
      EventBus.emit('show-error', 'Anilist token not found in local storage');
      return;
    }
    this.fetchViewerId();
  },
  methods: {
    showError(message) {
      EventBus.emit('show-error', message);
    },
    confirmAndNavigate() {
      if (typeof this.showConditions !== 'function') {
        EventBus.emit('show-error', 'showConditions is not a function');
        return;
      }
      this.showConditions();
    },
    showConditions() {
      this.showPopup = true;
    },
    proceedToNextStep() {
      this.showPopup = false;
      this.$store.commit('setLists', this.filteredLists);
      this.$store.commit('setType', this.listType);
      this.$store.commit('setUserId', this.userId);
      this.$router.push("/custom-list-manager/update");
    },
    sortLists() {
      const categoriesAnime = ["watching", "completed", "paused", "planning", "dropped", "rewatched", "10", "9", "8", "7", "6", "5", "<5", "4", "3", "2", "1"];
      const categoriesManga = ["reading", "completed", "paused", "planning", "dropped", "reread", "10", "9", "8", "7", "6", "5", "<5", "4", "3", "2", "1"];
      const categories = this.listType === 'ANIME' ? categoriesAnime : categoriesManga;
      this.lists.sort((a, b) => {
        const aCategoryIndex = categories.findIndex(category => a.name.toLowerCase().includes(category));
        const bCategoryIndex = categories.findIndex(category => b.name.toLowerCase().includes(category));
        return (aCategoryIndex === -1 ? categories.length : aCategoryIndex) - (bCategoryIndex === -1 ? categories.length : bCategoryIndex);
      });
    },
    getOptions(type) {
      let statusItems = ['Watching', 'Completed', 'Paused', 'Planning', 'Dropped'];
      const scoreItems = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'below 5'];
      let miscItems = [];

      const createOptionObjects = items => items.map(item => ({label: item, value: item}));

      if (type === 'ANIME') {
        miscItems = ['Rewatched'];
        return [
          {
            label: 'Status',
            items: createOptionObjects(statusItems.map(status => `Status set to ${status}`))
          },
          {
            label: 'Score',
            items: createOptionObjects(scoreItems.map(score => `Score set to ${score}`))
          },
          {
            label: 'Misc',
            items: createOptionObjects(miscItems)
          }
        ];
      } else if (type === 'MANGA') {
        statusItems = ['Reading', 'Completed', 'Paused', 'Planning', 'Dropped'];
        miscItems = ['Reread'];
        return [
          {
            label: 'Status',
            items: createOptionObjects(statusItems.map(status => `Status set to ${status}`))
          },
          {
            label: 'Score',
            items: createOptionObjects(scoreItems.map(score => `Score set to ${score}`))
          },
          {
            label: 'Misc',
            items: createOptionObjects(miscItems)
          }
        ];
      }
    },
    getDefaultOption(listName) {
      const statusItems = ['watching', 'reading', 'completed', 'paused', 'planning', 'dropped'];
      const scoreItems = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
      const miscItems = ['rewatched', 'reread'];
      const allItems = [...statusItems, ...scoreItems, ...miscItems];

      if (listName.includes('<5')) {
        return `Score set to below 5`;
      }

      for (const item of allItems) {
        if (listName.toLowerCase().includes(item)) {
          if (statusItems.includes(item)) {
            return `Status set to ${item.charAt(0).toUpperCase() + item.slice(1)}`;
          } else if (scoreItems.includes(item)) {
            return `Score set to ${item}`;
          } else if (miscItems.includes(item)) {
            return item.charAt(0).toUpperCase() + item.slice(1);
          }
        }
      }

      return null;
    },
    async fetchViewerId() {
      const query = `
        query {
          Viewer {
            id
          }
        }
      `;

      try {
        const response = await this.fetchAniList(query);
        this.userId = response.data.Viewer.id;
        await this.fetchLists(this.listType);
      } catch (error) {
        EventBus.emit('show-error', error.message);
      }
    },
    async fetchLists(type) {
      this.loading = true;
      this.listType = type;
      const query = `
        query {
          MediaListCollection(userId: ${this.userId}, type: ${type}) {
            lists {
              isCustomList
              name
            }
          }
        }
      `;

      try {
        const response = await this.fetchAniList(query);
        this.lists = response.data.MediaListCollection.lists.filter(list => list.isCustomList).map(list => ({
          ...list,
          selectedOption: this.getDefaultOption(list.name)
        }));
        // console.log(this.lists)
        this.sortLists();
        this.loading = false;
      } catch (error) {
        EventBus.emit('show-error', error.message);
      }
    },
    async fetchAniList(query) {
      const url = 'https://graphql.anilist.co';
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query
        })
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors.map(error => error.message).join(', '));
        }
        return data;
      } catch (error) {
        EventBus.emit('show-error', error.message);
      }
    }
  }
}
</script>

<style>
.manager {
  padding: 20px;
  margin: 20px;
  background-color: #1b1d25;
  color: #c5c6c7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.error-message {
  color: red;
  font-weight: bold;
}

.footer-div {
  margin-top: 20px !important;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  background-color: #66fcf1;
  color: #1b1d25;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  transition-duration: 0.4s;
}

button:hover {
  background-color: #1b1d25;
  color: #66fcf1;
  outline: 2px solid #66fcf1;
}

input[type="checkbox"] {
  appearance: none;
  background-color: #1b1d25;
  border: 2px solid #66fcf1;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  height: 20px;
  width: 20px;
  transition-duration: 0.3s;
  vertical-align: middle;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #66fcf1;
}

input[type="checkbox"]:checked:after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1b1d25;
}

.draggable-container {
  padding: 20px;
}

.spinner {
  display: flex;
  justify-content: center;
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.list-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #66fcf1;
  background-color: #0b0c10;
  cursor: move;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.list-item:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.custom-dropdown {
  margin-left: auto;
  background-color: #1b1d25;
  color: #c5c6c7;
  border: 1px solid #66fcf1;
  transition-duration: 0.4s;
}

.p-dropdown-header {
  background-color: #242631;
}

.p-dropdown-filter {
  background-color: #1b1d25;
  color: #c5c6c7;
}

.p-dropdown-item-group {
  background-color: #242631;
  color: #c5c6c7;
}

.custom-dropdown .p-dropdown-label {
  color: #ffffff;
  white-space: normal;
  word-wrap: break-word;
}

.p-dropdown-panel {
  background-color: #1b1d25;
  color: #c5c6c7;
}

.p-dropdown-item {
  color: #c5c6c7;
  white-space: normal;
  word-wrap: break-word;
}

.p-dropdown-item.p-focus {
  background-color: #66fcf1;
  color: #1b1d25;
}

.p-dropdown-item.p-highlight {
  background-color: #66fcf1;
  color: #1b1d25;
}

.drag-handle {
  margin-right: 10px;
  color: #66fcf1;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  background-color: #1b1d25;
  color: #c5c6c7;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  max-height: 70vh;
  overflow-y: auto;
}

.popup ul {
  list-style-type: none;
  padding: 0;
}

.popup li {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #66fcf1;
  background-color: #0b0c10;
  color: #c5c6c7;
  border-radius: 5px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.popup li:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.popup button {
  background-color: #66fcf1;
  color: #1b1d25;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  transition-duration: 0.4s;
}

.popup button:hover {
  background-color: #1b1d25;
  color: #66fcf1;
  outline: 2px solid #66fcf1;
}
</style>
