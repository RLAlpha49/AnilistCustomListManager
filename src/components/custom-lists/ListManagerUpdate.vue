<template>
  <div class="media-list">
    <a :href="getMediaUrl(entry)" target="_blank" v-for="entry in mediaList" :key="entry.media.id" class="media-link">
      <div class="media-card">
        <img :src="entry.media.coverImage.large" alt="Cover Image">
        <div class="media-titles">
          <h3>Romaji Title:</h3>
          <h2 class="romaji-title">{{ entry.media.title.romaji }}</h2>
          <h3>English Title:</h3>
          <h3 class="english-title">{{ entry.media.title.english }}</h3>
        </div>
        <div class="media-info">
          <h3>Media Info:</h3>
          <p>Status: {{ entry.status }}</p>
          <p>Score: {{ entry.score }}</p>
          <p>Repeat: {{ entry.repeat }}</p>
        </div>
        <div class="custom-lists">
          <h3>Lists:</h3>
          <ul>
            <li v-for="(list, index) in entry.lists" :key="index">{{ list }}</li>
          </ul>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import {EventBus} from "@/event-bus";
import {mapGetters} from 'vuex'

export default {
  name: 'ListManagerUpdate',
  data() {
    return {
      mediaList: [],
      defaultLists: [],
      customLists: []
    }
  },
  computed: {
    ...mapGetters(['type', 'userId', 'lists', 'hideDefaultStatusLists'])
  },
  mounted() {
    this.token = localStorage.getItem('anilistToken');
    if (!this.token) {
      EventBus.emit('show-error', 'Anilist token not found in local storage');
      return;
    }
    this.fetchMediaList();
  },
  methods: {
    getMediaUrl(entry) {
      const base = 'https://anilist.co/';
      const type = this.type === 'ANIME' ? 'anime' : 'manga';
      return `${base}${type}/${entry.media.id}`;
    },
    async fetchMediaList() {
      const mediaListQuery = `
        query ($userId: Int, $type: MediaType) {
          MediaListCollection(userId: $userId, type: $type) {
            lists {
              entries {
                hiddenFromStatusLists
                score(format: POINT_10)
                repeat
                status
                customLists
                media {
                  id
                  title {
                    romaji
                    english
                  }
                  coverImage {
                    large
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        userId: this.userId,
        type: this.type.toUpperCase()
      };

      const response = await this.fetchAniList(mediaListQuery, variables);
      const lists = response.data.MediaListCollection.lists;

      // Flatten the array of entries
      let entries = lists.flatMap(list => list.entries);

      // Remove duplicates based on media.id
      const seen = new Set();
      entries = entries.filter(entry => {
        const duplicate = seen.has(entry.media.id);
        seen.add(entry.media.id);
        return !duplicate;
      });

      // Create an object to store the entries for each list
      const listsData = {};
      this.lists.forEach(list => {
        listsData[list.name] = [];
      });

      entries = entries.map(entry => {
        // Create a new property 'lists' for each entry
        entry.lists = [];

        // Check the status lists
        this.lists.forEach(list => {
          if (list.selectedOption.includes('Status set to')) {
            let status = list.selectedOption.split(' ').slice(-1)[0].toUpperCase();
            if (status === 'WATCHING' || status === 'READING') {
              status = 'CURRENT';
            }
            if (entry.status === status && !entry.customLists[list.name]) {
              entry.lists.push(list.name);
            }
          }

          // Check the score lists
          if (list.selectedOption.includes('Score set to')) {
            if (list.selectedOption.includes('below 5') && entry.score > 0 && entry.score < 5 && !entry.customLists[list.name]) {
              entry.lists.push(list.name);
            } else {
              const scoreCondition = parseInt(list.selectedOption.split(' ').slice(-1)[0]);
              if (!list.selectedOption.includes('below 5') && entry.score === scoreCondition && !entry.customLists[list.name]) {
                entry.lists.push(list.name);
              }
            }
          }

          // Check the reread list
          if (list.selectedOption === 'Reread' && entry.repeat > 0 && !entry.customLists[list.name]) {
            entry.lists.push(list.name);
          }
        });

        return entry;
      });

      // Filter out entries with empty lists
      entries = entries.filter(entry => entry.lists.length > 0);

      // Sort the entries by the romaji title
      entries.sort((a, b) => a.media.title.romaji.localeCompare(b.media.title.romaji));

      this.mediaList = entries;

      console.log('Media List:', this.mediaList);
    },
    async fetchAniList(query, variables = {}) {
      const url = 'https://graphql.anilist.co';
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: variables
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
    },
    updateAniList() {
      // Here you can add the logic to update the user's AniList according to the specific conditions set
      // You'll probably need to iterate over the lists array and make API calls to update the AniList
    }
  }
}
</script>

<style scoped>
.media-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
  margin: 20px;
  background-color: #1b1d25;
  color: #c5c6c7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.media-link {
  all: unset;
  text-decoration: none;
  width: 90%;
}

.media-link:hover {
  cursor: pointer;
}

.media-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border: 1px solid #66fcf1;
  background-color: #0b0c10;
  margin: 10px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 10px;
  transform: translateX(-10px);
}

.media-card:hover {
  transform: scale(1.05) translateX(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.media-card img {
  width: 15%;
  height: auto;
  margin-right: 20px;
  object-fit: cover;
}

.media-card div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.media-titles {
  width: 50%;
  align-self: flex-start;
}

.media-titles h3, .media-titles h2 {
  margin-top: 0px;
  margin-bottom: 10px;
}

.romaji-title {
  color: #66fcf1;
  font-weight: bold;
  word-wrap: break-word;
  word-break: break-word;
  margin-bottom: 10px;
}

.english-title {
  color: #c5c6c7;
  font-style: italic;
  word-wrap: break-word;
  word-break: break-word;
}

.media-card h2, .media-card h3 {
  margin-top: 0px;
  font-size: 16px;
  text-align: center;
}

.media-info {
  margin-left: 10px;
  align-self: flex-start;
}

.media-card p {
  text-align: center;
  margin: 5px 0;
  font-size: 14px;
  color: #c5c6c7;
}

.custom-lists {
  margin-left: 10px;
  align-self: flex-start;
}

.media-card ul {
  padding: 0;
  list-style-type: none;
  color: #c5c6c7;
}

@media (max-width: 800px) {
  .media-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .media-card img {
    width: 25%;
    margin: auto;
    margin-bottom: 10px;
  }

  .media-titles, .media-info, .custom-lists {
    width: 100%;
    margin-left: 0;
  }
}
</style>