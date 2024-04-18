<template>
  <div>
  </div>
</template>

<script>
import {EventBus} from "@/event-bus";
import { mapGetters } from 'vuex'

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
                media {
                  id
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
            const status = list.selectedOption.split(' ').slice(-1)[0].toUpperCase();
            if (entry.status === status) {
              entry.lists.push(list.name);
            }
          }

          // Check the score lists
          if (list.selectedOption.includes('Score set to')) {
            if (list.selectedOption.includes('below 5') && entry.score < 5) {
              entry.lists.push(list.name);
            } else {
              const scoreCondition = parseInt(list.selectedOption.split(' ').slice(-1)[0]);
              if (entry.score === scoreCondition) {
                entry.lists.push(list.name);
              }
            }
          }

          // Check the reread list
          if (list.selectedOption === 'Reread' && entry.repeat > 0) {
            entry.lists.push(list.name);
          }
        });

        return entry;
      });

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