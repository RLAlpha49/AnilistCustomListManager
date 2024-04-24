<template>
  <!-- Main container for the update process -->
  <div class="update">
    <!-- Error dropdown component, shown when retry countdown is active -->
    <ErrorDropdown v-if="retryCountdown >= 0" :countdown="retryCountdown"/>
    <!-- Container for the controls -->
    <div class="controls">
      <!-- Title of the update process -->
      <h1 style="text-align: center">Update Custom Lists</h1>
      <!-- Description of the update process -->
      <p style="text-align: center">This step allows you to start updating your Anilist. You can pause the update
        process at any time.</p>
      <!-- Container for the start/pause button -->
      <div class="button-controls">
        <!-- Button to start or pause the update process -->
        <button @click="toggleUpdate" :disabled="done">
          <!-- Text of the button changes based on the state of the update process -->
          <span v-if="done">Start</span>
          <span v-else>{{ isUpdating ? 'Pause' : 'Start' }}</span>
        </button>
      </div>
      <!-- Progress text, shows the number of updated entries out of the total entries -->
      <p v-if="!done">{{
          totalEntries > 0 && mediaList && mediaList.length > 0 ? totalEntries - mediaList.length : 0
        }}/{{ totalEntries > 0 ? totalEntries : 0 }}</p>
      <!-- Progress text, shows the total number of entries when done -->
      <p v-else>{{ totalEntries }}/{{ totalEntries }}</p>
      <!-- Progress bar, shows the progress of the update process -->
      <ProgressBar
          :value="done ? 100 : parseFloat((totalEntries > 0 && mediaList && mediaList.length > 0 ? ((totalEntries - mediaList.length) / totalEntries) * 100 : 0).toFixed(2))"></ProgressBar>
      <!-- Text showing the ID of the entry currently being updated -->
      <p v-if="currentEntry && !done">Updating entry with ID: {{ currentEntry.media.id }}</p>
      <!-- Text showing that the update process is finished -->
      <p v-else-if="done">Finished updating</p>
      <!-- Navigation buttons -->
      <div class="navigation-buttons">
        <!-- Button to go back to the list manager -->
        <router-link to="/custom-list-manager/list-manager">
          <button>Back</button>
        </router-link>
        <!-- Button to finish the update process -->
        <router-link to="/custom-list-manager/work-in-progress">
          <button>Finish</button>
        </router-link>
      </div>
    </div>
    <!-- Loading animation, shown when loading -->
    <div v-if="isLoading" class="loading">
      <span v-for="i in 18" :key="i" :style="{ '--i': i }"></span>
    </div>
    <!-- Container for the media list, shown when not done and not loading -->
    <div v-if="!done && !isLoading" class="media-list">
      <!-- Link for each entry in the media list -->
      <a v-for="entry in mediaList" :id="entry.media.id" :key="entry.media.id" :href="getMediaUrl(entry)"
         class="media-link"
         :class="{ removing: entry.removing }"
         target="_blank">
        <!-- Card for the media entry -->
        <div class="media-card">
          <!-- Cover image of the media entry -->
          <img :data-src="entry.media.coverImage.extraLarge" alt="Cover Image" class="lazy">
          <!-- Titles of the media entry -->
          <div class="media-titles">
            <!-- Romaji title of the media entry -->
            <h3>Romaji Title:</h3>
            <h2 class="romaji-title">{{ entry.media.title.romaji }}</h2>
            <!-- English title of the media entry -->
            <h3>English Title:</h3>
            <h3 class="english-title">{{ entry.media.title.english }}</h3>
          </div>
          <!-- Container for the media info and custom lists -->
          <div class="media-container">
            <!-- Media info of the media entry -->
            <div class="media-info">
              <!-- Status, score, and repeat of the media entry -->
              <h3>Media Info:</h3>
              <p>Status: {{ entry.status }}</p>
              <p>Score: {{ entry.score }}</p>
              <p>Repeat: {{ entry.repeat }}</p>
            </div>
            <!-- Custom lists to update for the media entry -->
            <div class="custom-lists">
              <!-- List of custom lists to update -->
              <h3>To Update:</h3>
              <ul>
                <!-- Each custom list to update -->
                <li v-for="(value, list) in entry.lists" :key="list">
                  <!-- Name and value of the custom list -->
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
// Importing necessary modules and components
import {EventBus} from "@/event-bus";
import ProgressBar from 'primevue/progressbar';
import {mapGetters} from 'vuex'
import ErrorDropdown from "@/components/base/ErrorDropdown";

export default {
  // Component name
  name: 'ListManagerUpdate',

  // Components used in this component
  components: {
    ProgressBar,
    ErrorDropdown
  },

  // Data properties of the component
  data() {
    return {
      mediaList: [], // List of media to be updated
      defaultLists: [], // Default lists
      customLists: [], // Custom lists
      isLoading: false, // Loading state
      isUpdating: false, // Updating state
      shouldPause: false, // Pause state
      currentEntry: null, // Current entry being updated
      totalEntries: 0, // Total entries to be updated
      updateProcess: null, // Update process
      done: false, // Done state
      retryCountdown: -1 // Retry countdown
    }
  },

  // Computed properties of the component
  computed: {
    // Mapping getters from Vuex store
    ...mapGetters(['type', 'userId', 'lists', 'hideDefaultStatusLists'])
  },

  // Lifecycle hook when the component is mounted
  mounted() {
    // Get the Anilist token from local storage
    this.token = localStorage.getItem('anilistToken');

    // If the token is not found, emit an error
    if (!this.token) {
      EventBus.emit('show-error', 'Anilist token not found in local storage');
      return;
    }

    // Fetch the media list
    this.fetchMediaList();
  },

  // Methods of the component
  methods: {
    // Delay function
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Function to get the URL of a media entry
    getMediaUrl(entry) {
      const base = 'https://anilist.co/';
      const type = this.type === 'ANIME' ? 'anime' : 'manga';
      return `${base}${type}/${entry.media.id}`;
    },

    // Function to capitalize words
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
      // Delay the execution of the next line of code by 500 milliseconds
      await this.delay(500);

      // Set the loading state to true
      this.isLoading = true;

      // Define the GraphQL query to fetch the media list
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

      // Define the variables to be used in the GraphQL query
      const variables = {
        userId: this.userId,
        type: this.type.toUpperCase()
      };

      // Execute the GraphQL query and store the response
      const response = await this.fetchAniList(mediaListQuery, variables);

      // Extract the lists from the response data
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

      // Map over the entries to create new properties and check the lists
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
          // Check if the selected option includes 'Status set to'
          if (list.selectedOption.includes('Status set to')) {
            // Extract the status from the selected option
            let status = list.selectedOption.split(' ').slice(-1)[0].toUpperCase();
            if (status === 'WATCHING' || status === 'READING') {
              status = 'CURRENT';
            }
            // Check if the entry's status matches the status and the custom list is not true
            if (entry.status === status && entry.customLists[list.name] !== true) {
              currentStatusList = list.name;
              entry.lists[list.name] = true;
              toUpdate = true;
            } else if (entry.status !== status && entry.customLists[list.name] !== false) {
              // Check if the entry's status does not match the status and the custom list is not false
              entry.lists[list.name] = false;
              toUpdate = true;
            } else if (entry.status === status) {
              // Check if the entry's status matches the status
              currentStatusList = list.name;
              entry.lists[list.name] = true;
            }
          }

          // Check the score lists
          if (list.selectedOption.includes('Score set to')) {
            // Check if the selected option includes 'below 5' and the score is between 0 and 5 and the custom list is not true
            if (list.selectedOption.includes('below 5') && entry.score > 0 && entry.score < 5 && !entry.customLists[list.name]) {
              entry.lists[list.name] = true;
            } else if (!list.selectedOption.includes('below 5')) {
              // Extract the score condition from the selected option
              const scoreCondition = parseInt(list.selectedOption.split(' ').slice(-1)[0]);
              // Check if the entry's score matches the score condition and the custom list is not true
              if (entry.score === scoreCondition && entry.customLists[list.name] !== true) {
                entry.lists[list.name] = true;
                toUpdate = true;
              } else if (entry.score !== scoreCondition && entry.customLists[list.name] !== false) {
                // Check if the entry's score does not match the score condition and the custom list is not false
                entry.lists[list.name] = false;
                toUpdate = true;
              } else if (entry.score === scoreCondition) {
                // Check if the entry's score matches the score condition
                entry.lists[list.name] = true;
              }
            }
          }

          // Check if the selected option relates to the format
          if (list.selectedOption.includes('Format set to')) {
            // Extract the format from the selected option and convert it to uppercase
            let format = list.selectedOption.replace('Format set to ', '').toUpperCase();
            // Logic for handling manga format
            if (this.type === 'MANGA' && ['MANGA', 'MANWHA', 'MANHUA', 'MANGA (JAPAN)', 'MANGA (SOUTH KOREAN)', 'MANGA (CHINESE)'].includes(format)) {
              // Define mapping of country-specific manga formats
              const countryMap = {
                'MANGA': 'Manga (Japan)',
                'MANWHA': 'Manga (South Korean)',
                'MANHUA': 'Manga (Chinese)'
              };
              // Extract the country of origin from the entry's media
              const country = entry.media.countryOfOrigin;
              // Handle manga format based on country of origin
              if (['MANGA', 'MANWHA', 'MANHUA'].includes(format)) {
                format = countryMap[format];
              } else {
                format = this.capitalizeWords(format);
              }
              // Update entry's list based on manga format and country of origin
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
              // Update entry's list if the media format matches and it's not in custom lists
              currentFormatList = list.name;
              entry.lists[list.name] = true;
              toUpdate = true;
            } else if (entry.media.format !== format && entry.customLists[list.name] !== false) {
              // Update entry's list if the media format doesn't match and it's in custom lists
              entry.lists[list.name] = false;
              toUpdate = true;
            } else if (entry.media.format === format) {
              // Update entry's list if the media format matches
              currentFormatList = list.name;
              entry.lists[list.name] = true;
            }
          }

          // Check if the selected option relates to genres
          if (list.selectedOption.includes('Genres contain')) {
            let genre = list.selectedOption.replace('Genres contain ', '');
            // Update entry's list based on genre inclusion
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

          // Check if the selected option relates to tag categories
          if (list.selectedOption.includes('Tag Categories contain')) {
            let tagCategory = list.selectedOption.replace('Tag Categories contain ', '');
            // Update entry's list based on tag category inclusion
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

          // Check if the selected option relates to tags
          if (list.selectedOption.includes('Tags contain')) {
            let tag = list.selectedOption.replace('Tags contain ', '');
            // Update entry's list based on tag inclusion
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

          // Check if the selected option is for rereading or rewatching
          if ((list.selectedOption === 'Reread' || list.selectedOption === 'Rewatched') && entry.repeat > 0 && !entry.customLists[list.name]) {
            // Update entry's list if the media is being reread or rewatched
            entry.lists[list.name] = true;
            toUpdate = true;
          } else if ((list.selectedOption === 'Reread' || list.selectedOption === 'Rewatched') && entry.repeat <= 0 && entry.customLists[list.name]) {
            // Update entry's list if the media is not being reread or rewatched
            entry.lists[list.name] = false;
            toUpdate = true;
          } else if ((list.selectedOption === 'Reread' || list.selectedOption === 'Rewatched') && entry.repeat > 0) {
            // Update entry's list if the media is being reread or rewatched
            entry.lists[list.name] = true;
          }

          // Check if the selected option is for adult content
          if (list.selectedOption === 'Adult (18+)' && entry.isAdult === true && entry.customLists[list.name] !== true) {
            // Update entry's list if the media is adult content
            entry.lists[list.name] = true;
            toUpdate = true;
          } else if (list.selectedOption === 'Adult (18+)' && entry.isAdult === false && entry.customLists[list.name] !== false) {
            // Update entry's list if the media is not adult content
            entry.lists[list.name] = false;
            toUpdate = true;
          } else if (list.selectedOption === 'Adult (18+)' && entry.isAdult === true) {
            // Update entry's list if the media is adult content
            entry.lists[list.name] = true;
          }
        });

        // If current status, score, or format list is not in custom lists, set it to true
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

        // If there are no updates to the lists, clear them
        if (!toUpdate) {
          entry.lists = {};
        }

        // Check if the hiddenFromStatusLists value is different from the hideDefaultStatusLists value
        if (entry.hiddenFromStatusLists !== this.hideDefaultStatusLists) {
          entry.lists['hiddenFromStatusLists'] = this.hideDefaultStatusLists;
        }

        // Return the updated entry
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
    // Method to fetch data from Anilist
    async fetchAniList(query, variables = {}, retryCount = 0) {
      // Define the URL for the Anilist API
      const url = 'https://graphql.anilist.co';

      // Define the options for the fetch request
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
        // Make the fetch request
        const response = await fetch(url, options);

        // If the response is not ok, throw an error
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response data as JSON
        const data = await response.json();

        // If there are errors in the data, throw an error
        if (data.errors) {
          throw new Error(data.errors.map(error => error.message).join(', '));
        }

        // Return the data
        return data;
      } catch (error) {
        // Log the error
        console.log('Error:', error.code, error.message, error.stack)

        // If the error message is 'Failed to fetch' and the retry count is less than 5
        if (error.message === 'Failed to fetch' && retryCount < 5) {
          // Set the retry countdown to 15
          this.retryCountdown = 15;

          // Return a new promise
          return new Promise((resolve) => {
            // Set an interval to decrement the retry countdown every second
            const countdownInterval = setInterval(async () => {
              this.retryCountdown--;

              // If the retry countdown is less than 0
              if (this.retryCountdown < 0) {
                // Clear the interval
                clearInterval(countdownInterval);

                // Retry the request and resolve the promise with the result
                resolve(await this.fetchAniList(query, variables, retryCount + 1));
              }
            }, 1000);
          });
        } else {
          // Emit an error event
          EventBus.emit('show-error', 'Network error. Please check your internet connection or try again later.');
        }
      }
    },
    // Method to toggle the update state
    toggleUpdate() {
      // Toggle the updating state
      this.isUpdating = !this.isUpdating;

      // If the component is updating
      if (this.isUpdating) {
        // Set the pause state to false
        this.shouldPause = false;

        // Start the update process
        this.updateProcess = this.startUpdate();
      } else {
        // If there is an update process
        if (this.updateProcess) {
          // Cancel the update process
          this.updateProcess.cancel();
        }

        // Pause the update
        this.pauseUpdate();
      }
    },
    // Method to start the update process
    startUpdate() {
      // Initialize the index
      let index = 0;

      // Create a cancellable promise
      const cancellablePromise = new Promise((resolve) => {
        // Define the update loop
        const updateLoop = () => {
          // If the index is less than the length of the media list
          if (index < this.mediaList.length) {
            // Set the current entry to the entry at the current index
            this.currentEntry = this.mediaList[index];

            // Update the current entry
            this.updateEntry(this.currentEntry).then(() => {
              // Remove the current entry from the media list
              this.removeEntry(this.currentEntry);

              // Define the pause loop
              const pauseLoop = () => {
                // If the update process should be paused or the promise is cancelled
                if (this.shouldPause || cancellablePromise.cancelled) {
                  // If the promise is cancelled, resolve the promise with a message
                  if (cancellablePromise.cancelled) {
                    return resolve('Update process cancelled');
                  }
                  // Delay the next iteration of the pause loop
                  setTimeout(pauseLoop, 1000);
                } else {
                  // Delay the next iteration of the update loop
                  setTimeout(() => {
                    updateLoop();
                  }, 1000);
                }
              };
              // Start the pause loop
              pauseLoop();
            });
          } else {
            // If all entries have been updated, set the done state to true and resolve the promise
            this.done = true;
            resolve();
          }
        };
        // Start the update loop
        updateLoop();
      });

      // Set the cancelled state of the promise to false
      cancellablePromise.cancelled = false;

      // Define the cancel method for the promise
      cancellablePromise.cancel = function () {
        // Set the cancelled state of the promise to true
        this.cancelled = true;
      };

      // Return the cancellable promise
      return cancellablePromise;
    },
    // Method to update a media list entry
    async updateEntry(entry) {
      // Define the GraphQL mutation to update a media list entry
      const updateMediaListEntryMutation = `
        mutation ($mediaId: Int, $hiddenFromStatusLists: Boolean, $customLists: [String]) {
          SaveMediaListEntry (mediaId: $mediaId, hiddenFromStatusLists: $hiddenFromStatusLists, customLists: $customLists) {
            id
            hiddenFromStatusLists
            customLists
          }
        }
      `;

      // Define the variables for the mutation
      const variables = {
        mediaId: entry.media.id,
        hiddenFromStatusLists: entry.lists.hiddenFromStatusLists,
        customLists: Object.keys(entry.lists).filter(list => entry.lists[list])
      };

      // Execute the mutation and store the response
      const response = await this.fetchAniList(updateMediaListEntryMutation, variables);

      // If the mutation was successful, log a success message
      if (response.data.SaveMediaListEntry) {
        console.log(`Successfully updated entry with id ${entry.media.id}`);
      } else {
        // If the mutation failed, log an error message
        console.log(`Failed to update entry with id ${entry.media.id}`);
      }
    },
    // Method to remove a media list entry
    removeEntry(entry) {
      // Set the removing state of the entry to true
      entry.removing = true;

      // Wait for the animation to complete before actually removing the entry
      setTimeout(() => {
        // Remove the entry from the media list
        this.mediaList = this.mediaList.filter(e => e.media.id !== entry.media.id);
      }, 500);
    },
    // Method to pause the update process
    pauseUpdate() {
      // Set the shouldPause state to true
      this.shouldPause = true;
    },
  }
}
</script>

<style scoped>
/* Styling for the main container of the update process */
.update {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Styling for the loading animation container */
.loading {
  display: flex;
  justify-content: center;
  width: 100%;
  transform: translateY(18vh);
}

/* Styling for the loading animation */
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

/* Animation for the loading spinner */
@keyframes loading {
  from {
    opacity: 0;
  }
}

/* Media query for screens with a minimum width of 1200px */
@media (min-width: 1200px) {
  /* Styling for the media list */
  .media-list {
    width: 1050px;
  }
}

/* Media query for screens with a maximum width of 1100px */
@media (max-width: 1100px) {
  /* Adjust font size for media card titles */
  .media-card h2, .media-card h3 {
    font-size: calc(16px * 0.9) !important;
  }

  /* Adjust font size for media card paragraphs and list items */
  .media-card p, .media-card li {
    font-size: calc(14px * 0.9) !important;
  }
}

/* Media query for screens with a maximum width of 900px */
@media (max-width: 900px) {
  /* Adjust font size for media card titles */
  .media-card h2, .media-card h3 {
    font-size: calc(16px * 0.8) !important;
  }

  /* Adjust font size for media card paragraphs and list items */
  .media-card p, .media-card li {
    font-size: calc(14px * 0.8) !important;
  }
}

/* Media query for screens with a maximum width of 900px */
@media (max-width: 900px) {
  /* Adjust alignment for media card */
  .media-card {
    align-items: center !important;
  }

  /* Adjust width for media card images */
  .media-card img {
    width: 25% !important;
  }

  /* Adjust alignment for media titles */
  .media-titles {
    align-self: center !important;
  }

  /* Adjust layout for media container */
  .media-container {
    flex-direction: column !important;
    align-items: center !important;
    width: auto !important;
    padding-left: 10px !important;
    gap: 10px !important;
  }

  /* Adjust width for media info and custom lists */
  .media-info, .custom-lists {
    width: 100% !important;
  }
}

/* Styling for the controls and media list containers */
.controls, .media-list {
  padding: 20px;
  margin: 20px;
  background-color: #1b1d25;
  color: #c5c6c7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Styling for the controls paragraphs */
.controls p {
  font-size: 16px;
  color: #c5c6c7;
  line-height: 1.5;
  margin-bottom: 10px;
  text-align: center;
}

/* Styling for the progress bar */
.p-progressbar {
  background-color: #3f3f46;
  border-radius: 5px;
  height: 20px;
  margin: 20px 0;
}

/* Styling for the progress bar value */
.p-progressbar-value {
  background-color: #66fcf1;
  border-radius: 5px;
}

/* Styling for the button controls container */
.button-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* Styling for the buttons */
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

/* Styling for the buttons when hovered over */
button:hover {
  background-color: #1b1d25;
  color: #66fcf1;
  outline: 2px solid #66fcf1;
}

/* Styling for the buttons when disabled */
button:disabled {
  background-color: #888;
  color: #ccc;
  cursor: not-allowed;
}

/* Styling for the media list */
.media-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

/* Styling for the media link */
.media-link {
  all: unset;
  text-decoration: none;
  width: 95%;
  transition: all 0.5s ease;
}

/* Styling for the media link when removing */
.media-link.removing {
  opacity: 0;
  transform: translateY(-30px);
}

/* Styling for the media link when hovered over */
.media-link:hover {
  cursor: pointer;
}

/* Styling for the media card */
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

/* Styling for the media card when hovered over */
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

/* Animation for the gradient */
@keyframes gradient {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 100%;
  }
}

/* Animation for the border rotation */
@keyframes rotateBorder {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Styling for the media card after pseudo-element */
.media-card::after {
  position: absolute;
  content: '';
  inset: 5px;
  border-radius: 10px;
  background: #0b0c10;
}

/* Styling for the media card when hovered over */
.media-card:hover {
  transform: scale(1.05) translateX(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Styling for the media card image */
.media-card img {
  width: 15%;
  height: auto;
  margin-right: 20px;
  object-fit: cover;
  z-index: 1;
}

/* Styling for the media card image and titles */
.media-card img, .media-titles {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

/* Styling for the media container */
.media-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 40%;
  z-index: 1;
}

/* Styling for the media titles */
.media-titles {
  width: 45%;
  align-self: flex-start;
}

/* Styling for the media titles headings */
.media-titles h3, .media-titles h2 {
  margin-top: 0px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Styling for the romaji title */
.romaji-title {
  color: #66fcf1;
  font-weight: bold;
  word-wrap: break-word;
  word-break: break-word;
  margin-bottom: 10px;
}

/* Styling for the English title */
.english-title {
  color: #c5c6c7;
  font-style: italic;
  word-wrap: break-word;
  word-break: break-word;
}

/* Styling for the media card headings */
.media-card h2, .media-card h3 {
  margin-top: 0px;
  font-size: 16px;
  text-align: center;
}

/* Styling for the media info */
.media-info {
  margin-left: 10px;
  align-self: flex-start;
}

/* Styling for the media card paragraphs */
.media-card p {
  text-align: center;
  padding-top: 0;
  padding-bottom: 0;
  margin: 5px 0;
  font-size: 14px;
  color: #c5c6c7;
}

/* Styling for the custom lists */
.custom-lists {
  width: 60%;
  margin-left: 10px;
  align-self: flex-start;
}

/* Styling for the media card unordered lists */
.media-card ul {
  padding: 0;
  margin-top: 0;
  list-style-type: none;
  color: #c5c6c7;
}

/* Styling for the media card list items */
.media-card li {
  margin-bottom: 5px;
}

/* Media query for screens with a maximum width of 700px */
@media (max-width: 700px) {
  /* Styling for the media card */
  .media-card {
    flex-direction: column;
    align-items: flex-start;
  }

  /* Styling for the media card images */
  .media-card img {
    width: 25%;
    margin: auto;
    margin-bottom: 10px;
  }

  /* Styling for the media titles, media info, and custom lists */
  .media-titles, .media-info, .custom-lists {
    width: 100%;
    margin-left: 0;
  }
}
</style>