<template>
  <div class="update">
    <ErrorDropdown v-if="retryCountdown >= 0" :countdown="retryCountdown"/>
    <div class="controls">
      <h1 style="text-align: center">Update Custom Lists</h1>
      <p style="text-align: center">This step allows you to start updating your Anilist. You can pause the update
        process
        at any time.</p>
      <div class="button-controls">
        <button @click="toggleUpdate" :disabled="done">
          <span v-if="done">Start</span>
          <span v-else>{{ isUpdating ? 'Pause' : 'Start' }}</span>
        </button>
      </div>
      <p v-if="!done">{{
          totalEntries > 0 && mediaList && mediaList.length > 0 ? totalEntries - mediaList.length : 0
        }}/{{ totalEntries > 0 ? totalEntries : 0 }}</p>
      <p v-else>{{ totalEntries }}/{{ totalEntries }}</p>
      <ProgressBar
          :value="done ? 100 : parseFloat((totalEntries > 0 && mediaList && mediaList.length > 0 ? ((totalEntries - mediaList.length) / totalEntries) * 100 : 0).toFixed(2))"></ProgressBar>
      <p v-if="currentEntry && !done">Updating entry with ID: {{ currentEntry.media.id }}</p>
      <p v-else-if="done">Finished updating</p>
      <div class="navigation-buttons">
        <router-link to="/custom-list-manager/list-manager">
          <button>Back</button>
        </router-link>
        <router-link to="/custom-list-manager/work-in-progress">
          <button>Finish</button>
        </router-link>
      </div>
    </div>
    <div v-if="isLoading" class="loading">
      <span v-for="i in 18" :key="i" :style="{ '--i': i }"></span>
    </div>
    <div v-if="!done && !isLoading" class="media-list">
      <a v-for="entry in mediaList" :id="entry.media.id" :key="entry.media.id" :href="getMediaUrl(entry)"
         class="media-link"
         :class="{ removing: entry.removing }"
         target="_blank">
        <div class="media-card">
          <img :data-src="entry.media.coverImage.extraLarge" alt="Cover Image" class="lazy">
          <div class="media-titles">
            <h3>Romaji Title:</h3>
            <h2 class="romaji-title">{{ entry.media.title.romaji }}</h2>
            <h3>English Title:</h3>
            <h3 class="english-title">{{ entry.media.title.english }}</h3>
          </div>
          <div class="media-container">
            <div class="media-info">
              <h3>Media Info:</h3>
              <p>Status: {{ entry.status }}</p>
              <p>Score: {{ entry.score }}</p>
              <p>Repeat: {{ entry.repeat }}</p>
            </div>
            <div class="custom-lists">
              <h3>To Update:</h3>
              <ul>
                <li v-for="(value, list) in entry.lists" :key="list">
                  {{ list }}: {{ value ? 'True' : 'False' }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import {EventBus} from "@/event-bus";
import ProgressBar from 'primevue/progressbar';
import {mapGetters} from 'vuex'

import ErrorDropdown from "@/components/base/ErrorDropdown";

export default {
  name: 'ListManagerUpdate',
  components: {
    ProgressBar,
    ErrorDropdown
  },
  data() {
    return {
      mediaList: [],
      defaultLists: [],
      customLists: [],
      isLoading: false,
      isUpdating: false,
      shouldPause: false,
      currentEntry: null,
      totalEntries: 0,
      updateProcess: null,
      done: false,
      retryCountdown: -1
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
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    getMediaUrl(entry) {
      const base = 'https://anilist.co/';
      const type = this.type === 'ANIME' ? 'anime' : 'manga';
      return `${base}${type}/${entry.media.id}`;
    },
    capitalizeWords(str) {
      let words = str.split(/[\s()]+/);
      words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

      // Find the index of the word 'Manga'
      const index = words.findIndex(word => word === 'Manga');

      // If found, join the 'Manga' and all following words with parentheses
      if (index >= 0 && index < words.length - 1) {
        words[index] = `${words[index]} (${words.slice(index + 1).join(' ').trim()})`;
        words = words.slice(0, index + 1);
      }

      return words.join(' ');
    },
    async fetchMediaList() {
      await this.delay(500);
      this.isLoading = true;
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
                  format
                  countryOfOrigin
                  title {
                    romaji
                    english
                  }
                  genres
                  tags {
                    name
                    category
                  }
                  isAdult
                  coverImage {
                    extraLarge
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
        // Create new properties 'lists', 'tagCategories', 'tags', 'genres', and 'isAdult' for each entry
        entry.lists = {};
        entry.tagCategories = entry.media.tags.map(tag => tag.category);
        entry.tags = entry.media.tags.map(tag => tag.name);
        entry.genres = entry.media.genres.map(genres => genres);
        entry.isAdult = entry.media.isAdult;

        // Track the current status, score, and format lists
        let currentStatusList = '';
        let currentScoreList = '';
        let currentFormatList = '';
        let toUpdate = false;

        // Check the status lists
        this.lists.forEach(list => {
          if (list.selectedOption.includes('Status set to')) {
            let status = list.selectedOption.split(' ').slice(-1)[0].toUpperCase();
            if (status === 'WATCHING' || status === 'READING') {
              status = 'CURRENT';
            }
            if (entry.status === status && entry.customLists[list.name] !== true) {
              currentStatusList = list.name;
              entry.lists[list.name] = true;
              toUpdate = true;
            } else if (entry.status !== status && entry.customLists[list.name] !== false) {
              entry.lists[list.name] = false;
              toUpdate = true;
            } else if (entry.status === status) {
              currentStatusList = list.name;
              entry.lists[list.name] = true;
            }
          }

          // Check the score lists
          if (list.selectedOption.includes('Score set to')) {
            if (list.selectedOption.includes('below 5') && entry.score > 0 && entry.score < 5 && !entry.customLists[list.name]) {
              entry.lists[list.name] = true;
            } else if (!list.selectedOption.includes('below 5')) {
              const scoreCondition = parseInt(list.selectedOption.split(' ').slice(-1)[0]);
              if (entry.score === scoreCondition && entry.customLists[list.name] !== true) {
                entry.lists[list.name] = true;
                toUpdate = true;
              } else if (entry.score !== scoreCondition && entry.customLists[list.name] !== false) {
                entry.lists[list.name] = false;
                toUpdate = true;
              } else if (entry.score === scoreCondition) {
                entry.lists[list.name] = true;
              }
            }
          }

          // Check the format lists
          if (list.selectedOption.includes('Format set to')) {
            let format = list.selectedOption.replace('Format set to ', '').toUpperCase();
            if (this.type === 'MANGA' && ['MANGA', 'MANWHA', 'MANHUA', 'MANGA (JAPAN)', 'MANGA (SOUTH KOREAN)', 'MANGA (CHINESE)'].includes(format)) {
              const countryMap = {
                'MANGA': 'Manga (Japan)',
                'MANWHA': 'Manga (South Korean)',
                'MANHUA': 'Manga (Chinese)'
              };
              const country = entry.media.countryOfOrigin;
              if (['MANGA', 'MANWHA', 'MANHUA'].includes(format)) {
                format = countryMap[format];
              } else {
                format = this.capitalizeWords(format);
              }
              if ((country === 'JP' && format === 'Manga (Japan)') ||
                  (country === 'KR' && format === 'Manga (South Korean)') ||
                  (country === 'CN' && format === 'Manga (Chinese)')) {
                if (entry.customLists[list.name] === false) {
                  currentFormatList = list.name;
                  entry.lists[list.name] = true;
                  toUpdate = true;
                } else if (entry.customLists[list.name] !== false) {
                  entry.lists[list.name] = true;
                }
              } else if (entry.customLists[list.name] !== false) {
                entry.lists[list.name] = false;
                toUpdate = true;
              }
            } else if (entry.media.format === format && entry.customLists[list.name] === false) {
              currentFormatList = list.name;
              entry.lists[list.name] = true;
              toUpdate = true;
            } else if (entry.media.format !== format && entry.customLists[list.name] !== false) {
              entry.lists[list.name] = false;
              toUpdate = true;
            } else if (entry.media.format === format) {
              currentFormatList = list.name;
              entry.lists[list.name] = true;
            }
          }

          if (list.selectedOption.includes('Genres contain')) {
            let genre = list.selectedOption.replace('Genres contain ', '');
            // Check the genre
            if (entry.genres.includes(genre) && entry.customLists[list.name] !== true) {
              entry.lists[list.name] = true;
              toUpdate = true;
            } else if (!entry.genres.includes(genre) && entry.customLists[list.name] !== false) {
              entry.lists[list.name] = false;
              toUpdate = true;
            } else if (entry.genres.includes(genre)) {
              entry.lists[list.name] = true;
            }
          }

          if (list.selectedOption.includes('Tag Categories contain')) {
            let tagCategory = list.selectedOption.replace('Tag Categories contain ', '');
            // Check the tags
            if (entry.tagCategories.includes(tagCategory) && entry.customLists[list.name] !== true) {
              entry.lists[list.name] = true;
              toUpdate = true;
            } else if (!entry.tagCategories.includes(tagCategory) && entry.customLists[list.name] !== false) {
              entry.lists[list.name] = false;
              toUpdate = true;
            } else if (entry.tagCategories.includes(tagCategory)) {
              entry.lists[list.name] = true;
            }
          }

          if (list.selectedOption.includes('Tags contain')) {
            let tag = list.selectedOption.replace('Tags contain ', '');
            // Check the tags
            if (entry.tags.includes(tag) && entry.customLists[list.name] !== true) {
              entry.lists[list.name] = true;
              toUpdate = true;
            } else if (!entry.tags.includes(tag) && entry.customLists[list.name] !== false) {
              entry.lists[list.name] = false;
              toUpdate = true;
            } else if (entry.tags.includes(tag)) {
              entry.lists[list.name] = true;
            }
          }

          // Check the reread/rewatched list
          if ((list.selectedOption === 'Reread' || list.selectedOption === 'Rewatched') && entry.repeat > 0 && !entry.customLists[list.name]) {
            entry.lists[list.name] = true;
            toUpdate = true;
          } else if ((list.selectedOption === 'Reread' || list.selectedOption === 'Rewatched') && entry.repeat <= 0 && entry.customLists[list.name]) {
            entry.lists[list.name] = false;
            toUpdate = true;
          } else if ((list.selectedOption === 'Reread' || list.selectedOption === 'Rewatched') && entry.repeat > 0) {
            entry.lists[list.name] = true;
          }

          // Check the adult list
          if (list.selectedOption === 'Adult (18+)' && entry.isAdult === true && entry.customLists[list.name] !== true) {
            entry.lists[list.name] = true;
            toUpdate = true;
          } else if (list.selectedOption === 'Adult (18+)' && entry.isAdult === false && entry.customLists[list.name] !== false) {
            entry.lists[list.name] = false;
            toUpdate = true;
          } else if (list.selectedOption === 'Adult (18+)' && entry.isAdult === true) {
            entry.lists[list.name] = true;
          }
        });

        // If the current status, score, or format list is not in the custom lists, set it to true
        if (currentStatusList && !entry.customLists[currentStatusList]) {
          entry.lists[currentStatusList] = true;
          toUpdate = true;
        }
        if (currentScoreList && !entry.customLists[currentScoreList]) {
          entry.lists[currentScoreList] = true;
          toUpdate = true;
        }
        if (currentFormatList && !entry.customLists[currentFormatList]) {
          entry.lists[currentFormatList] = true;
          toUpdate = true;
        }

        if (!toUpdate) {
          entry.lists = {};
        }

        // Check if the hiddenFromStatusLists value is different from the hideDefaultStatusLists value
        if (entry.hiddenFromStatusLists !== this.hideDefaultStatusLists) {
          entry.lists['hiddenFromStatusLists'] = this.hideDefaultStatusLists;
        }

        return entry;
      });

      // Filter out entries with empty lists
      entries = entries.filter(entry => Object.values(entry.lists).some(value => value));

      // Sort the entries by the romaji title
      entries.sort((a, b) => a.media.title.romaji.localeCompare(b.media.title.romaji));

      this.mediaList = entries;

      this.totalEntries = this.mediaList.length;

      this.isLoading = false;

      console.log('Media List:', this.mediaList);

      if (this.mediaList.length === 0) {
        this.done = true;
        return;
      }
    },
    async fetchAniList(query, variables = {}, retryCount = 0) {
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
        console.log('Error:', error.code, error.message, error.stack)
        if (error.message === 'Failed to fetch' && retryCount < 5) {
          this.retryCountdown = 15;
          return new Promise((resolve) => {
            const countdownInterval = setInterval(async () => {
              this.retryCountdown--;
              if (this.retryCountdown < 0) {
                clearInterval(countdownInterval);
                // Retry the request instead of returning
                resolve(await this.fetchAniList(query, variables, retryCount + 1));
              }
            }, 1000);
          });
        } else {
          EventBus.emit('show-error', 'Network error. Please check your internet connection or try again later.');
        }
      }
    },
    toggleUpdate() {
      this.isUpdating = !this.isUpdating;

      if (this.isUpdating) {
        this.shouldPause = false;
        this.updateProcess = this.startUpdate();
      } else {
        if (this.updateProcess) {
          this.updateProcess.cancel();
        }
        this.pauseUpdate();
      }
    },
    startUpdate() {
      let index = 0;

      const cancellablePromise = new Promise((resolve) => {
        const updateLoop = () => {
          if (index < this.mediaList.length) {
            this.currentEntry = this.mediaList[index];

            this.updateEntry(this.currentEntry).then(() => {
              this.removeEntry(this.currentEntry);

              const pauseLoop = () => {
                if (this.shouldPause || cancellablePromise.cancelled) {
                  if (cancellablePromise.cancelled) {
                    return resolve('Update process cancelled');
                  }
                  setTimeout(pauseLoop, 1000);
                } else {
                  setTimeout(() => {
                    updateLoop();
                  }, 1000);
                }
              };
              pauseLoop();
            });
          } else {
            this.done = true;
            resolve();
          }
        };
        updateLoop();
      });

      cancellablePromise.cancelled = false;

      cancellablePromise.cancel = function () {
        this.cancelled = true;
      };

      return cancellablePromise;
    },
    async updateEntry(entry) {
      const updateMediaListEntryMutation = `
        mutation ($mediaId: Int, $hiddenFromStatusLists: Boolean, $customLists: [String]) {
          SaveMediaListEntry (mediaId: $mediaId, hiddenFromStatusLists: $hiddenFromStatusLists, customLists: $customLists) {
            id
            hiddenFromStatusLists
            customLists
          }
        }
      `;

      const variables = {
        mediaId: entry.media.id,
        hiddenFromStatusLists: entry.lists.hiddenFromStatusLists,
        customLists: Object.keys(entry.lists).filter(list => entry.lists[list])
      };

      const response = await this.fetchAniList(updateMediaListEntryMutation, variables);

      if (response.data.SaveMediaListEntry) {
        console.log(`Successfully updated entry with id ${entry.media.id}`);
      } else {
        console.log(`Failed to update entry with id ${entry.media.id}`);
      }
    },
    removeEntry(entry) {
      entry.removing = true;

      // Wait for the animation to complete before actually removing the entry
      setTimeout(() => {
        this.mediaList = this.mediaList.filter(e => e.media.id !== entry.media.id);
      }, 500);
    },
    pauseUpdate() {
      this.shouldPause = true;
    },
  }
}
</script>

<style scoped>
.update {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading {
  display: flex;
  justify-content: center;
  width: 100%;
  transform: translateY(18vh);
}

.loading span {
  position: absolute;
  height: 150px;
  width: 5px;
  background: linear-gradient(#35defc 50%, transparent 50%);
  top: calc(50% - 150px);
  transform-origin: bottom center;
  transform: rotate(calc(var(--i) * 20deg));
  border-radius: 50px;
  animation: loading 2s calc(var(--i) * 0.1s) infinite;
}

@keyframes loading {
  from {
    opacity: 0;
  }
}


@media (min-width: 1200px) {
  .media-list {
    width: 1050px;
  }
}

@media (max-width: 1100px) {
  .media-card h2, .media-card h3 {
    font-size: calc(16px * 0.9) !important;
  }

  .media-card p, .media-card li {
    font-size: calc(14px * 0.9) !important;
  }
}

@media (max-width: 900px) {
  .media-card h2, .media-card h3 {
    font-size: calc(16px * 0.8) !important;
  }

  .media-card p, .media-card li {
    font-size: calc(14px * 0.8) !important;
  }
}

@media (max-width: 900px) {
  .media-card {
    align-items: center !important;
  }

  .media-card img {
    width: 25% !important;
  }

  .media-titles {
    align-self: center !important;
  }

  .media-container {
    flex-direction: column !important;
    align-items: center !important;
    width: auto !important;
    padding-left: 10px !important;
    gap: 10px !important;
  }

  .media-info, .custom-lists {
    width: 100% !important;
  }
}

.controls, .media-list {
  padding: 20px;
  margin: 20px;
  background-color: #1b1d25;
  color: #c5c6c7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.controls p {
  font-size: 16px;
  color: #c5c6c7;
  line-height: 1.5;
  margin-bottom: 10px;
  text-align: center;
}

.p-progressbar {
  background-color: #3f3f46;
  border-radius: 5px;
  height: 20px;
  margin: 20px 0;
}

.p-progressbar-value {
  background-color: #66fcf1;
  border-radius: 5px;
}

.button-controls {
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

button:disabled {
  background-color: #888;
  color: #ccc;
  cursor: not-allowed;
}

.media-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.media-link {
  all: unset;
  text-decoration: none;
  width: 95%;
  transition: all 0.5s ease;
}

.media-link.removing {
  opacity: 0;
  transform: translateY(-30px);
}

.media-link:hover {
  cursor: pointer;
}

.media-card {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  border: 1px solid #66fcf1;
  background-color: #0b0c10;
  margin: 10px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 10px;
  transform: translateX(-10px);
  overflow: hidden;
}

.media-card:hover::before {
  position: absolute;
  content: '';
  width: 300%;
  height: 35%;
  background: linear-gradient(45deg, #fff, #66fcf1);
  background-size: 300% 300%;
  left: -100%;
  top: 32.5%;
  transform: rotate(45deg);
  animation: gradient 5s ease infinite, rotateBorder 5s linear infinite;
}

@keyframes gradient {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 100%;
  }
}

@keyframes rotateBorder {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.media-card::after {
  position: absolute;
  content: '';
  inset: 5px;
  border-radius: 10px;
  background: #0b0c10;
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
  z-index: 1;
}

.media-card img, .media-titles {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.media-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 40%;
  z-index: 1;
}

.media-titles {
  width: 45%;
  align-self: flex-start;
}

.media-titles h3, .media-titles h2 {
  margin-top: 0px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  padding-top: 0;
  padding-bottom: 0;
  margin: 5px 0;
  font-size: 14px;
  color: #c5c6c7;
}

.custom-lists {
  width: 60%;
  margin-left: 10px;
  align-self: flex-start;
}

.media-card ul {
  padding: 0;
  margin-top: 0;
  list-style-type: none;
  color: #c5c6c7;
}

.media-card li {
  margin-bottom: 5px;
}

@media (max-width: 700px) {
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