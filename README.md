# Custom List Manager for AniList

This project is a Vue.js application that allows users to manage their AniList in a more personalized way. It provides
features to fetch the list of the authenticated AniList user, move entries to specific custom lists, and sort entries
based on status, score, rereads, and type (Manga, Manwha, Manhua).

## Features

- Fetch the list of the authenticated AniList user
- Move your entries to specific custom lists
- Sort entries based on status, score, rereads, and type (Manga, Manwha, Manhua)

## Installation

1. Clone the repository
    ```bash
    git clone https://github.com/RLAlpha49/AnilistListManager.git
    ```

2. Install the dependencies
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables
    ```bash
    VUE_APP_ANILIST_CLIENT_ID=your_anilist_client_id
    ```

4. Run the application
    ```bash
    npm run serve
    ```

## Usage

1. Login with your AniList account.
2. Choose between Anime and Manga lists.
3. Manage your custom lists as per your needs.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[GPL-3.0](LICENSE)
