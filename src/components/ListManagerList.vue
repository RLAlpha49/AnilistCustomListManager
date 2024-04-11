<template>
  <div style="height: 100%;">
    <h1>Your Custom Lists</h1>
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
      token: null
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

      const response = await this.fetchAniList(query);
      const userId = response.data.Viewer.id;
      this.fetchLists(userId);
    },
    async fetchLists(userId) {
      const query = `
        query {
          MediaListCollection(userId: ${userId}, type: ANIME) {
            lists {
              isCustomList
              name
            }
          }
        }
      `;

      const response = await this.fetchAniList(query);

      // Filter out the custom lists
      this.lists = response.data.MediaListCollection.lists.filter(list => list.isCustomList);
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

      const response = await fetch(url, options);
      return await response.json();
    }
  }
}
</script>

<style>
.footer-div {
  margin-top: 20px !important;
}

.draggable-container {
  height: 100%;
  overflow: auto;
  background-color: #1b1d25;
  color: #c5c6c7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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
</style>
