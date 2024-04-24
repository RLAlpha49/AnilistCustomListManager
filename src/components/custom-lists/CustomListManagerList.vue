<template>
  <div id="list-manager-list">
    <!-- Error dropdown component, shown when retry countdown is active -->
    <ErrorDropdown v-if="retryCountdown >= 0" :countdown="retryCountdown"/>
    <!-- Container for the list manager content -->
    <div class="manager">
      <!-- Title of the list manager -->
      <h1 style="text-align: center">{{ title }}</h1>
      <!-- Description of the list manager functionality -->
      <p style="text-align: center">
        The order of the list does not affect the functionality.<br>
        Select the option in the dropdowns to be associated with the custom list.<br>
        For example if you want all anime/manga with the completed status to be set a certain custom list.
      </p>
      <!-- Container for the list type buttons -->
      <div class="button-container">
        <!-- Button to fetch anime lists -->
        <button @click="fetchLists('ANIME')">Anime Lists</button>
        <!-- Button to fetch manga lists -->
        <button @click="fetchLists('MANGA')">Manga Lists</button>
      </div>
      <!-- Checkbox to hide default status lists -->
      <div style="text-align: center;">
        <input id="hideDefaultStatusLists" v-model="hideDefaultStatusLists" type="checkbox">
        <label for="hideDefaultStatusLists">Hide Default Status Lists</label>
        <p style="color: #c5c6c7; font-size: 0.8em;">
          This option is for hiding AniList's default status lists (Watching, Completed, Planning, etc).
          It does not affect the custom lists.
        </p>
      </div>
      <!-- Container for the draggable list items -->
      <div class="draggable-container">
        <!-- Spinner shown when loading -->
        <div v-if="loading" class="spinner"></div>
        <!-- Draggable component for the custom lists -->
        <draggable
            v-model="lists"
            group="customLists"
            item-key="name"
            @end="drag=false"
            @start="drag=true">
          <!-- Template for each draggable list item -->
          <template #item="{element}">
            <div class="list-item">
              <!-- Drag handle for the list item -->
              <div class="drag-handle">&#x2630;</div>
              <!-- Name of the list -->
              <div class="list-content">{{ element.name }}</div>
              <!-- Dropdown to select the condition for the list -->
              <Dropdown v-model="element.selectedOption" :options="getOptions(listType)" class="custom-dropdown" filter
                        option-value="value"
                        optionGroupChildren="items"
                        optionGroupLabel="label" optionLabel="label" placeholder="Select a Condition"
                        showClear>
                <!-- Template for each option group in the dropdown -->
                <template #optiongroup="slotProps">
                  <div class="flex align-items-center">
                    <!-- Label of the option group -->
                    <div>{{ slotProps.option.label }}</div>
                  </div>
                </template>
              </Dropdown>
            </div>
          </template>
        </draggable>
      </div>
      <!-- Navigation buttons -->
      <div class="navigation-buttons">
        <!-- Button to go back to the Anilist login page -->
        <router-link to="/custom-list-manager/anilist-login">
          <button>Back</button>
        </router-link>
        <!-- Button to go to the next step -->
        <button @click="confirmAndNavigate">Next</button>
      </div>
      <!-- Popup shown when confirming the conditions -->
      <div v-if="showPopup" class="popup">
        <!-- Title of the popup -->
        <h2>Conditions:</h2>
        <!-- Checkbox to hide default status lists -->
        <div>
          <input id="hideDefaultStatusLists" v-model="hideDefaultStatusLists" type="checkbox">
          <label for="hideDefaultStatusLists">Hide Default Status Lists</label>
        </div>
        <!-- List of the conditions for each custom list -->
        <ul>
          <li v-for="list in filteredLists" :key="list.name">
            <!-- Name and selected option of the list -->
            {{ list.name }}: {{ list.selectedOption }}
          </li>
        </ul>
        <!-- Navigation buttons -->
        <div class="navigation-buttons">
          <!-- Button to cancel the confirmation -->
          <button @click="showPopup = false">Cancel</button>
          <!-- Button to confirm the conditions and go to the next step -->
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

import ErrorDropdown from "@/components/base/ErrorDropdown";

export default {
  name: 'ListManagerList',
  components: {
    draggable, // Enables drag and drop functionality
    Dropdown, // Dropdown component from PrimeVue
    ErrorDropdown // Custom error dropdown component
  },
  data() {
    return {
      drag: false, // State for drag and drop
      lists: [], // List of custom lists
      token: null, // Anilist token
      userId: null, // User ID
      listType: 'ANIME', // Default list type
      loading: false, // Loading state
      showPopup: false, // State for showing popup
      errorMessage: null, // Error message
      retryCountdown: -1, // Countdown for retrying failed requests
      hideDefaultStatusLists: this.$store.getters.hideDefaultStatusLists !== null ? this.$store.getters.hideDefaultStatusLists : true // State for hiding default status lists
    }
  },
  watch: {
    // Watcher for lists
    lists: {
      handler(newLists) {
        // When lists change, update the list locations and conditions in the store
        const newListLocations = newLists.map((list, index) => ({
          name: list.name,
          selectedOption: list.selectedOption,
          location: index
        }));

        const newConditions = newLists.map((list) => ({
          name: list.name,
          condition: list.selectedOption
        }));

        if (this.listType === 'ANIME') {
          this.$store.commit('setListLocationsAnime', newListLocations);
          this.$store.commit('setConditionsAnime', newConditions);
        } else if (this.listType === 'MANGA') {
          this.$store.commit('setListLocationsManga', newListLocations);
          this.$store.commit('setConditionsManga', newConditions);
        }
      },
      deep: true // Deep watch to observe nested data
    },
    // Watcher for hideDefaultStatusLists
    hideDefaultStatusLists: {
      handler(newValue) {
        // When hideDefaultStatusLists changes, update it in the store
        this.$store.commit('setHideDefaultStatusLists', newValue);
      },
      immediate: true // Apply the handler immediately upon registration
    }
  },
  computed: {
    // Computed property for title
    title() {
      return `Your ${this.listType} Custom Lists`;
    },
    // Computed property for filtered lists
    filteredLists() {
      return this.lists.filter(list => list.selectedOption);
    }
  },
  mounted() {
    // When the component is mounted, fetch the Anilist token and viewer ID
    this.token = localStorage.getItem('anilistToken');
    if (!this.token) {
      EventBus.emit('show-error', 'Anilist token not found in local storage');
      return;
    }
    this.fetchViewerId();
  },
  methods: {
    // Method to show error
    showError(message) {
      EventBus.emit('show-error', message);
    },
    // Method to confirm and navigate
    confirmAndNavigate() {
      if (typeof this.showConditions !== 'function') {
        EventBus.emit('show-error', 'showConditions is not a function');
        return;
      }
      this.showConditions();
    },
    // Method to show conditions
    showConditions() {
      this.showPopup = true;
    },
    // Method to proceed to next step
    proceedToNextStep() {
      this.showPopup = false;
      this.$store.commit('setLists', this.filteredLists);
      this.$store.commit('setType', this.listType);
      this.$store.commit('setUserId', this.userId);
      this.$store.commit('setHideDefaultStatusLists', this.hideDefaultStatusLists);
      this.$router.push("/custom-list-manager/update");
    },
    // Method to sort lists
    sortLists() {
      // Define categories for anime and manga
      const categoriesAnime = ["watching", "completed", "paused", "planning", "dropped", "rewatched", "10", "9", "8", "7", "6", "5", "<5", "4", "3", "2", "1", "tv", "tv short", "movie", "special", "ova", "ona", "music"];
      const categoriesManga = ["reading", "completed", "paused", "planning", "dropped", "reread", "10", "9", "8", "7", "6", "5", "<5", "4", "3", "2", "1", "manga (japan)", "manga (south korean)", "manga (chinese)", "manga", "manwha", "manhua", "one shot", "light novel", "web novel"];
      const categories = this.listType === 'ANIME' ? categoriesAnime : categoriesManga;
      // Sort the lists based on the categories
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
      let formatItems = [];
      let genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Ecchi', 'Fantasy', 'Horror', 'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi', 'Slice Of Life', 'Sports', 'Supernatural', 'Thriller', 'Hentai'];
      let tagCategories = ['Cast', 'Cast / Main Cast', 'Cast / Traits', 'Demographic', 'Setting', 'Setting / Scene', 'Setting / Time', 'Setting / Universe', 'Technical', 'Theme / Action', 'Theme / Arts', 'Theme / Arts-Music', 'Theme / Comedy', 'Theme / Drama', 'Theme / Fantasy', 'Theme / Game', 'Theme / Game-Card & Board Game', 'Theme / Game-Sport', 'Theme / Other', 'Theme / Other-Organisations', 'Theme / Other-Vehicle', 'Theme / Romance', 'Theme / Sci Fi', 'Theme / Sci Fi-Mecha', 'Theme / Slice Of Life'];
      let tags = "Polyamorous\nAnti-Hero\nEnsembleCast\nEstrangedFamily\nFemaleProtagonist\nMaleProtagonist\nPrimarilyAdultCast\nPrimarilyAnimalCast\nPrimarilyChildCast\nPrimarilyFemaleCast\nPrimarilyMaleCast\nPrimarilyTeenCast\nAgeRegression\nAgender\nAliens\nAmnesia\nAngels\nAnthropomorphism\nArrangedMarriage\nArtificialIntelligence\nAsexual\nButler\nCentaur\nChimera\nChuunibyou\nClone\nCosplay\nCrossdressing\nCyborg\nDelinquents\nDemons\nDetective\nDinosaurs\nDisability\nDissociativeIdentities\nDragons\nDullahan\nElf\nFairy\nFemboy\nGhost\nGoblin\nGods\nGyaru\nHikikomori\nHomeless\nIdol\nKemonomimi\nKuudere\nMaids\nMermaid\nMonsterBoy\nMonsterGirl\nNekomimi\nNinja\nNudity\nNun\nOfficeLady\nOiran\nOjou-Sama\nOrphan\nPirates\nRobots\nSamurai\nShrineMaiden\nSkeleton\nSuccubus\nTannedSkin\nTeacher\nTomboy\nTransgender\nTsundere\nTwins\nVampire\nVeterinarian\nVikings\nVillainess\nVTuber\nWerewolf\nWitch\nYandere\nZombie\nJosei\nKids\nSeinen\nShoujo\nShounen\nMatriarchy\nBar\nBoardingSchool\nCircus\nCoastal\nCollege\nDesert\nDungeon\nForeign\nInn\nKonbini\nNaturalDisaster\nOffice\nOutdoor\nPrison\nRural\nSchool\nSchoolClub\nSnowscape\nUrban\nWork\nAchronologicalOrder\nAnachronism\nAncientChina\nDystopian\nHistorical\nTimeSkip\nAfterlife\nAlternateUniverse\nAugmentedReality\nOmegaverse\nPost-Apocalyptic\nSpace\nUrbanFantasy\nVirtualWorld\n4-Koma\nAchromatic\nAdvertisement\nAnthology\nCGI\nEpisodic\nFlash\nFullCGI\nFullColor\nNoDialogue\nNon-Fiction\nPOV\nPuppetry\nRotoscoping\nStopMotion\nArchery\nBattleRoyale\nEspionage\nFugitive\nGuns\nMartialArts\nSpearplay\nSwordplay\nActing\nCalligraphy\nClassicLiterature\nDrawing\nFashion\nFood\nMakeup\nPhotography\nRakugo\nWriting\nBand\nDancing\nMusical\nParody\nSatire\nSlapstick\nSurrealComedy\nBullying\nClassStruggle\nComingOfAge\nConspiracy\nKingdomManagement\nRehabilitation\nRevenge\nSuicide\nTragedy\nAlchemy\nBodySwapping\nCultivation\nFairyTale\nHenshin\nIsekai\nKaiju\nMagic\nMythology\nNecromancy\nShapeshifting\nSteampunk\nSuperPower\nSuperhero\nWuxia\nYoukai\nBoardGame\nE-Sports\nVideoGames\nCardBattle\nGo\nKaruta\nMahjong\nPoker\nShogi\nAcrobatics\nAirsoft\nAmericanFootball\nAthletics\nBadminton\nBaseball\nBasketball\nBoxing\nCheerleading\nCycling\nFencing\nFishing\nFitness\nFootball\nGolf\nHandball\nIceSkating\nJudo\nLacrosse\nParkour\nRugby\nScubaDiving\nSkateboarding\nSumo\nSurfing\nSwimming\nTableTennis\nTennis\nVolleyball\nWrestling\nAdoption\nAnimals\nAstronomy\nAutobiographical\nBiographical\nBodyHorror\nCannibalism\nChibi\nCosmicHorror\nCrime\nCrossover\nDeathGame\nDenpa\nDrugs\nEconomics\nEducational\nEnvironmental\nEroGuro\nFilmmaking\nFoundFamily\nGambling\nGenderBending\nGore\nLanguageBarrier\nLGBTQ+Themes\nLostCivilization\nMarriage\nMedicine\nMemoryManipulation\nMeta\nMountaineering\nNoir\nOtakuCulture\nPandemic\nPhilosophy\nPolitics\nProxyBattle\nReincarnation\nReligion\nRoyalAffairs\nSlavery\nSoftwareDevelopment\nSurvival\nTerrorism\nTorture\nTravel\nWar\nAssassins\nCriminalOrganization\nCult\nFirefighters\nGangs\nMafia\nMilitary\nPolice\nTriads\nYakuza\nAviation\nCars\nMopeds\nMotorcycles\nShips\nTanks\nTrains\nAgeGap\nBisexual\nBoys'Love\nFemaleHarem\nHeterosexual\nLoveTriangle\nMaleHarem\nMixedGenderHarem\nTeens'Love\n+UnrequitedLove\nYuri\nCyberpunk\nSpaceOpera\nTimeLoop\nTimeManipulation\nTokusatsu\nRealRobot\nSuperRobot\nAgriculture\nCuteBoysDoingCuteThings\nCuteGirlsDoingCuteThings\nFamilyLife\nHorticulture\nIyashikei";

      tags = tags.split('\n').map(tag => tag.replace(/(?<!-)([A-Z])/g, ' $1').trim());

      const createOptionObjects = items => items.map(item => ({label: item, value: item}));

      if (type === 'ANIME') {
        miscItems = ['Rewatched', 'Adult (18+)'];
        formatItems = ['TV', 'TV_Short', 'Movie', 'Special', 'OVA', 'ONA', 'Music'];
      } else if (type === 'MANGA') {
        statusItems = ['Reading', 'Completed', 'Paused', 'Planning', 'Dropped'];
        miscItems = ['Reread', 'Adult (18+)'];
        formatItems = ['Manga (Japan)', 'Manga (South Korean)', 'Manga (Chinese)', 'One shot', 'Light Novel'];
      }

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
          label: 'Format',
          items: createOptionObjects(formatItems.map(format => `Format set to ${format}`))
        },
        {
          label: 'Genres',
          items: createOptionObjects(genres.map(genre => `Genres contain ${genre}`))
        },
        {
          label: 'Tags Categories',
          items: createOptionObjects(tagCategories.map(tagCategory => `Tag Categories contain ${tagCategory}`))
        },
        {
          label: 'Tags',
          items: createOptionObjects(tags.map(tag => `Tags contain ${tag}`))
        },
        {
          label: 'Misc',
          items: createOptionObjects(miscItems)
        }
      ];
    },
    getDefaultOption(listName) {
      const statusItems = ['watching', 'reading', 'completed', 'paused', 'planning', 'dropped'];
      const scoreItems = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
      const miscItems = ['rewatched', 'reread'];
      const formatItemsAnime = ['TV', 'TV_Short', 'Movie', 'Special', 'OVA', 'ONA', 'Music'];
      const formatItemsManga = ['Manga (Japan)', 'Manga (South Korean)', 'Manga (Chinese)', 'manga', 'manwha', 'manhua', 'One shot', 'Light Novel'];
      let tagCategories = ['Cast', 'Cast / Main Cast', 'Cast / Traits', 'Demographic', 'Setting', 'Setting / Scene', 'Setting / Time', 'Setting / Universe', 'Technical', 'Theme / Action', 'Theme / Arts', 'Theme / Arts-Music', 'Theme / Comedy', 'Theme / Drama', 'Theme / Fantasy', 'Theme / Game', 'Theme / Game-Card & Board Game', 'Theme / Game-Sport', 'Theme / Other', 'Theme / Other-Organisations', 'Theme / Other-Vehicle', 'Theme / Romance', 'Theme / Sci Fi', 'Theme / Sci Fi-Mecha', 'Theme / Slice Of Life'];
      let tagsList = "Polyamorous\nAnti-Hero\nEnsembleCast\nEstrangedFamily\nFemaleProtagonist\nMaleProtagonist\nPrimarilyAdultCast\nPrimarilyAnimalCast\nPrimarilyChildCast\nPrimarilyFemaleCast\nPrimarilyMaleCast\nPrimarilyTeenCast\nAgeRegression\nAgender\nAliens\nAmnesia\nAngels\nAnthropomorphism\nArrangedMarriage\nArtificialIntelligence\nAsexual\nButler\nCentaur\nChimera\nChuunibyou\nClone\nCosplay\nCrossdressing\nCyborg\nDelinquents\nDemons\nDetective\nDinosaurs\nDisability\nDissociativeIdentities\nDragons\nDullahan\nElf\nFairy\nFemboy\nGhost\nGoblin\nGods\nGyaru\nHikikomori\nHomeless\nIdol\nKemonomimi\nKuudere\nMaids\nMermaid\nMonsterBoy\nMonsterGirl\nNekomimi\nNinja\nNudity\nNun\nOfficeLady\nOiran\nOjou-Sama\nOrphan\nPirates\nRobots\nSamurai\nShrineMaiden\nSkeleton\nSuccubus\nTannedSkin\nTeacher\nTomboy\nTransgender\nTsundere\nTwins\nVampire\nVeterinarian\nVikings\nVillainess\nVTuber\nWerewolf\nWitch\nYandere\nZombie\nJosei\nKids\nSeinen\nShoujo\nShounen\nMatriarchy\nBar\nBoardingSchool\nCircus\nCoastal\nCollege\nDesert\nDungeon\nForeign\nInn\nKonbini\nNaturalDisaster\nOffice\nOutdoor\nPrison\nRural\nSchool\nSchoolClub\nSnowscape\nUrban\nWork\nAchronologicalOrder\nAnachronism\nAncientChina\nDystopian\nHistorical\nTimeSkip\nAfterlife\nAlternateUniverse\nAugmentedReality\nOmegaverse\nPost-Apocalyptic\nSpace\nUrbanFantasy\nVirtualWorld\n4-Koma\nAchromatic\nAdvertisement\nAnthology\nCGI\nEpisodic\nFlash\nFullCGI\nFullColor\nNoDialogue\nNon-Fiction\nPOV\nPuppetry\nRotoscoping\nStopMotion\nArchery\nBattleRoyale\nEspionage\nFugitive\nGuns\nMartialArts\nSpearplay\nSwordplay\nActing\nCalligraphy\nClassicLiterature\nDrawing\nFashion\nFood\nMakeup\nPhotography\nRakugo\nWriting\nBand\nDancing\nMusical\nParody\nSatire\nSlapstick\nSurrealComedy\nBullying\nClassStruggle\nComingOfAge\nConspiracy\nKingdomManagement\nRehabilitation\nRevenge\nSuicide\nTragedy\nAlchemy\nBodySwapping\nCultivation\nFairyTale\nHenshin\nIsekai\nKaiju\nMagic\nMythology\nNecromancy\nShapeshifting\nSteampunk\nSuperPower\nSuperhero\nWuxia\nYoukai\nBoardGame\nE-Sports\nVideoGames\nCardBattle\nGo\nKaruta\nMahjong\nPoker\nShogi\nAcrobatics\nAirsoft\nAmericanFootball\nAthletics\nBadminton\nBaseball\nBasketball\nBoxing\nCheerleading\nCycling\nFencing\nFishing\nFitness\nFootball\nGolf\nHandball\nIceSkating\nJudo\nLacrosse\nParkour\nRugby\nScubaDiving\nSkateboarding\nSumo\nSurfing\nSwimming\nTableTennis\nTennis\nVolleyball\nWrestling\nAdoption\nAnimals\nAstronomy\nAutobiographical\nBiographical\nBodyHorror\nCannibalism\nChibi\nCosmicHorror\nCrime\nCrossover\nDeathGame\nDenpa\nDrugs\nEconomics\nEducational\nEnvironmental\nEroGuro\nFilmmaking\nFoundFamily\nGambling\nGenderBending\nGore\nLanguageBarrier\nLGBTQ+Themes\nLostCivilization\nMarriage\nMedicine\nMemoryManipulation\nMeta\nMountaineering\nNoir\nOtakuCulture\nPandemic\nPhilosophy\nPolitics\nProxyBattle\nReincarnation\nReligion\nRoyalAffairs\nSlavery\nSoftwareDevelopment\nSurvival\nTerrorism\nTorture\nTravel\nWar\nAssassins\nCriminalOrganization\nCult\nFirefighters\nGangs\nMafia\nMilitary\nPolice\nTriads\nYakuza\nAviation\nCars\nMopeds\nMotorcycles\nShips\nTanks\nTrains\nAgeGap\nBisexual\nBoys'Love\nFemaleHarem\nHeterosexual\nLoveTriangle\nMaleHarem\nMixedGenderHarem\nTeens'Love\n+UnrequitedLove\nYuri\nCyberpunk\nSpaceOpera\nTimeLoop\nTimeManipulation\nTokusatsu\nRealRobot\nSuperRobot\nAgriculture\nCuteBoysDoingCuteThings\nCuteGirlsDoingCuteThings\nFamilyLife\nHorticulture\nIyashikei";

      const tags = tagsList.split('\n').map(tag => tag.replace(/(?<!-)([A-Z])/g, ' $1').trim());
      const allItems = [...statusItems, ...scoreItems, ...miscItems, ...formatItemsAnime, ...formatItemsManga, ...tagCategories, ...tags];

      if (listName.includes('<5')) {
        return `Score set to below 5`;
      }

      for (const item of allItems) {
        if (listName.toLowerCase().includes(item.toLowerCase())) {
          if (statusItems.includes(item)) {
            return `Status set to ${item.charAt(0).toUpperCase() + item.slice(1)}`;
          } else if (scoreItems.includes(item)) {
            return `Score set to ${item}`;
          } else if (miscItems.includes(item)) {
            return item.charAt(0).toUpperCase() + item.slice(1);
          } else if (formatItemsAnime.includes(item) || formatItemsManga.includes(item)) {
            if (['manga', 'manwha', 'manhua'].includes(item.toLowerCase())) {
              const countryMap = {
                'manga': 'Manga (Japan)',
                'manwha': 'Manga (South Korean)',
                'manhua': 'Manga (Chinese)'
              };
              return `Format set to ${countryMap[item.toLowerCase()]}`;
            } else {
              return `Format set to ${item}`;
            }
          } else if (tagCategories.includes(item)) {
            return `Tag Categories contain ${item}`;
          } else if (tags.includes(item)) {
            return `Tags contain ${item}`;
          }
        }
      }
      return null;
    },
    // Fetch the viewer's ID from Anilist
    async fetchViewerId() {
      // GraphQL query to get the viewer's ID
      const query = `
        query {
          Viewer {
            id
          }
        }
      `;

      try {
        // Fetch the data from Anilist
        const response = await this.fetchAniList(query);
        // Set the user ID to the viewer's ID
        this.userId = response.data.Viewer.id;
        // Fetch the lists for the current list type
        await this.fetchLists(this.listType);
      } catch (error) {
        // Emit an error event if something goes wrong
        EventBus.emit('show-error', error.message);
      }
    },

    // Fetch the lists from Anilist
    async fetchLists(type) {
      // Set the loading state to true
      this.loading = true;
      // Set the list type
      this.listType = type;
      // GraphQL query to get the lists
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
        // Fetch the data from Anilist
        const response = await this.fetchAniList(query);

        // Get the saved conditions and list locations from the store
        const savedConditions = this.listType === 'ANIME' ? this.$store.getters.conditionsAnime : this.$store.getters.conditionsManga;
        const savedListLocations = this.listType === 'ANIME' ? this.$store.getters.listLocationsAnime : this.$store.getters.listLocationsManga;

        // Filter the lists to only include custom lists
        const listsFromQuery = response.data.MediaListCollection.lists.filter(list => list.isCustomList);

        // Get the names of the saved lists and conditions
        const savedListNames = savedListLocations.map(list => list.name);
        const savedConditionNames = savedConditions.map(condition => condition.name);
        const queryListNames = listsFromQuery.map(list => list.name);

        // Check if all list names exist in the saved lists and conditions
        const allListNamesExist = queryListNames.every(name => savedListNames.includes(name));
        const allConditionNamesExist = queryListNames.every(name => savedConditionNames.includes(name));

        // If all list names exist and the list type hasn't changed, use the saved lists and conditions
        if (savedListLocations && savedListLocations.length >= listsFromQuery.length && savedConditions && savedConditions.length >= listsFromQuery.length && allListNamesExist && allConditionNamesExist && this.listType === type) {
          this.lists = savedListLocations.map(savedList => {
            const list = listsFromQuery.find(list => list.name === savedList.name);
            if (list) {
              let savedCondition = savedConditions.find(condition => condition.name === list.name);
              return {
                ...list,
                selectedOption: savedCondition ? savedCondition.condition : this.getDefaultOption(list.name)
              };
            }
          }).filter(list => list);
          console.log('Final lists:', this.lists);
        } else {
          // If not all list names exist or the list type has changed, fetch the lists from Anilist
          this.lists = listsFromQuery.map((list) => {
            return {
              ...list,
              selectedOption: this.getDefaultOption(list.name)
            };
          });
          this.sortLists();
          console.log('Final lists:', this.lists);

          // Save the new list locations and conditions in the store
          const newListLocations = this.lists.map((list, index) => ({
            name: list.name,
            selectedOption: list.selectedOption,
            location: index
          }));
          const newConditions = this.lists.map(list => ({
            name: list.name,
            selectedOption: list.selectedOption
          }));
          if (this.listType === 'ANIME') {
            this.$store.commit('setListLocationsAnime', newListLocations);
            this.$store.commit('setConditionsAnime', newConditions);
          } else if (this.listType === 'MANGA') {
            this.$store.commit('setListLocationsManga', newListLocations);
            this.$store.commit('setConditionsManga', newConditions);
          }
        }

        // Set the loading state to false
        this.loading = false;
      } catch (error) {
        // Log the error and emit an error event if something goes wrong
        console.error('Error in fetchLists:', error.message);
        EventBus.emit('show-error', error.message);
      }
    },

    // Fetch data from Anilist
    async fetchAniList(query, variables = {}, retryCount = 0) {
      // The URL for the Anilist API
      const url = 'https://graphql.anilist.co';
      // The options for the fetch request
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
        // Fetch the data from Anilist
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
        // If the fetch fails and the retry count is less than 5, retry the request
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
          // Emit an error event if the fetch fails and the retry count is 5 or more
          EventBus.emit('show-error', 'Network error. Please check your internet connection or try again later.');
        }
      }
    }
  }
}
</script>

<style>
/* Styling for the main container of the list manager */
.manager {
  padding: 20px;
  margin: 20px;
  background-color: #1b1d25;
  color: #c5c6c7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Styling for the footer div */
.footer-div {
  margin-top: 20px !important;
}

/* Styling for the container that holds the buttons */
.button-container {
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

/* Styling for the checkboxes */
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

/* Styling for the checkboxes when checked */
input[type="checkbox"]:checked {
  background-color: #66fcf1;
}

/* Styling for the checkboxes when checked (after effect) */
input[type="checkbox"]:checked:after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1b1d25;
}

/* Styling for the container that holds the draggable items */
.draggable-container {
  padding: 20px;
}

/* Styling for the spinner */
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

/* Animation for the spinner */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Animation for hue rotation */
@keyframes hueRotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

/* Styling for the list items */
.list-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #0b0c10;
  cursor: move;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Styling for the list items (before effect) */
.list-item::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 1px solid #66fcf1;
}

/* Styling for the list items when hovered over */
.list-item:hover::before {
  animation: hueRotate 5s linear infinite;
  border-width: 3px;
}

/* Styling for the list items when hovered over */
.list-item:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Styling for the custom dropdown */
.custom-dropdown {
  margin-left: auto;
  background-color: #1b1d25;
  color: #c5c6c7;
  border: 1px solid #66fcf1;
  transition-duration: 0.4s;
}

/* Styling for the dropdown header */
.p-dropdown-header {
  background-color: #242631;
}

/* Styling for the dropdown filter */
.p-dropdown-filter {
  background-color: #1b1d25;
  color: #c5c6c7;
}

/* Styling for the dropdown item group */
.p-dropdown-item-group {
  background-color: #242631;
  color: #c5c6c7;
}

/* Styling for the dropdown label */
.custom-dropdown .p-dropdown-label {
  color: #ffffff;
  white-space: normal;
  word-wrap: break-word;
}

/* Styling for the dropdown panel */
.p-dropdown-panel {
  background-color: #1b1d25;
  color: #c5c6c7;
  max-width: 80%;
}

/* Styling for the dropdown item */
.p-dropdown-item {
  color: #c5c6c7;
  white-space: normal;
  word-wrap: break-word;
}

/* Styling for the dropdown item when focused */
.p-dropdown-item.p-focus {
  background-color: #66fcf1;
  color: #1b1d25;
}

/* Styling for the dropdown item when highlighted */
.p-dropdown-item.p-highlight {
  background-color: #66fcf1;
  color: #1b1d25;
}

/* Styling for the drag handle */
.drag-handle {
  margin-right: 10px;
  color: #66fcf1;
}

/* Styling for the navigation buttons */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* Styling for the popup */
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

/* Styling for the popup list */
.popup ul {
  list-style-type: none;
  padding: 0;
}

/* Styling for the popup list items */
.popup li {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #66fcf1;
  background-color: #0b0c10;
  color: #c5c6c7;
  border-radius: 5px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Styling for the popup list items when hovered over */
.popup li:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Styling for the popup buttons */
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

/* Styling for the popup buttons when hovered over */
.popup button:hover {
  background-color: #1b1d25;
  color: #66fcf1;
  outline: 2px solid #66fcf1;
}

@media (width <= 700px) {
  .manager {
    padding: calc(20px * 0.95);
    margin: calc(20px * 0.95);
  }

  h1 {
    font-size: calc(2.5em * 0.95);
  }

  p {
    font-size: calc(1.2em * 0.95);
  }

  button {
    font-size: calc(16px * 0.95) !important;
  }

  .draggable-container {
    padding: calc(20px * 0.95);
  }

  .p-dropdwon-panel {
    max-width: calc(80% * 0.95);
  }

  .p-inputtext {
    font-size: calc(1rem * 0.95);
  }

  .list-content {
    font-size: calc(1rem * 0.95);
  }

  .p-dropdown-item-group, .p-dropdown-item-label {
    font-size: calc(16px * 0.95);
  }

  .popup h2 {
    font-size: calc(1.5em * 0.95);
  }

  .popup label {
    font-size: calc(1rem * 0.95);
  }

  .popup li {
    font-size: calc(1rem * 0.95);
  }
}

@media (width <= 500px) {
  .manager {
    padding: calc(20px * 0.9);
    margin: calc(20px * 0.9);
  }

  h1 {
    font-size: calc(2.5em * 0.9);
  }

  p {
    font-size: calc(1.2em * 0.9);
  }

  button {
    font-size: calc(16px * 0.9) !important
  }

  .draggable-container {
    padding: calc(20px * 0.9);
  }

  .p-dropdwon-panel {
    max-width: calc(80% * 0.9);
  }

  .p-inputtext {
    font-size: calc(1rem * 0.9);
  }

  .list-content {
    font-size: calc(1rem * 0.9);
  }

  .p-dropdown-item-group, .p-dropdown-item-label {
    font-size: calc(16px * 0.9);
  }

  .popup h2 {
    font-size: calc(1.5em * 0.9);
  }

  .popup label {
    font-size: calc(1rem * 0.9);
  }

  .popup li {
    font-size: calc(1rem * 0.9);
  }
}

@media (width <= 450px) {
  .manager {
    padding: calc(20px * 0.85);
    margin: calc(20px * 0.85);
  }

  h1 {
    font-size: calc(2.5em * 0.85);
  }

  p {
    font-size: calc(1.2em * 0.85);
  }

  button {
    font-size: calc(16px * 0.85) !important;
  }

  .draggable-container {
    padding: calc(20px * 0.85);
  }

  .p-dropdwon-panel {
    max-width: calc(80% * 0.85);
  }

  .p-inputtext {
    font-size: calc(1rem * 0.85);
  }

  .list-content {
    font-size: calc(1rem * 0.85);
  }

  .p-dropdown-item-group, .p-dropdown-item-label {
    font-size: calc(16px * 0.85);
  }

  .popup h2 {
    font-size: calc(1.5em * 0.85);
  }

  .popup label {
    font-size: calc(1rem * 0.85);
  }

  .popup li {
    font-size: calc(1rem * 0.85);
  }
}

@media (width <= 400px) {
  .manager {
    padding: calc(20px * 0.7);
    margin: calc(20px * 0.7);
  }

  h1 {
    font-size: calc(2.5em * 0.7);
  }

  p {
    font-size: calc(1.2em * 0.7);
  }

  button {
    font-size: calc(16px * 0.7) !important;
  }

  .draggable-container {
    padding: calc(20px * 0.7);
  }

  .p-dropdwon-panel {
    max-width: calc(80% * 0.7);
  }

  .p-inputtext {
    font-size: calc(1rem * 0.7);
  }

  .list-content {
    font-size: calc(1rem * 0.7);
  }

  .p-dropdown-item-group, .p-dropdown-item-label {
    font-size: calc(16px * 0.7);
  }

  .popup h2 {
    font-size: calc(1.5em * 0.7);
  }

  .popup label {
    font-size: calc(1rem * 0.7);
  }

  .popup li {
    font-size: calc(1rem * 0.7);
  }
}
</style>
