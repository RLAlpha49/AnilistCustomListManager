<template>
  <div id="list-manager-list">
    <div class="manager">
      <h1 style="text-align: center">{{ title }}</h1>
      <div class="button-container">
        <button @click="fetchLists('ANIME')">Anime Lists</button>
        <button @click="fetchLists('MANGA')">Manga Lists</button>
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
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
              <div class="list-content">{{element.name}}</div>
            </div>
          </template>
        </draggable>
      </div>
      <div class="navigation-buttons">
        <router-link to="/custom-list-manager/anilist-login">
          <button>Back</button>
        </router-link>
        <router-link to="/custom-list-manager/next-page">
          <button>Next</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'ListManagerList',
  components: {
    draggable
  },
  data() {
    return {
      drag: false,
      lists: [],
      token: null,
      userId: null,
      listType: 'ANIME',
      loading: false
    }
  },
  computed: {
    title() {
      return `Your ${this.listType} Custom Lists`;
    }
  },
  mounted() {
    this.token = localStorage.getItem('anilistToken');
    this.fetchViewerId();
  },
  methods: {
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
        this.fetchLists(this.listType);
      } catch (error) {
        this.errorMessage = 'Error: ' + error.message;
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
        this.lists = response.data.MediaListCollection.lists.filter(list => list.isCustomList);
        this.loading = false;
      } catch (error) {
        this.errorMessage = 'Error: ' + error.message;
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

        // Check if the request was rate limited
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        return await response.json();
      } catch (error) {
        this.errorMessage = 'Error: ' + error.message;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.drag-handle {
  margin-right: 10px;
  color: #66fcf1;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
