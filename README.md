# Anilist Custom List Manager

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [License](#license)

## Introduction

**Anilist Custom List Manager** is a tool designed to enhance your Anilist experience by allowing you to manage your anime and manga lists effortlessly.

## Features

- **Fetch Anime and Manga Lists:** Easily retrieve your existing lists from Anilist.
- **Custom List Management:** Organize your entries into personalized lists for better tracking and organization.
- **Sort Entries:** Sort your entries based on status, score, rereads, genres, tags, and type to quickly find what you're looking for.
- **Automatic Updates:** Automatically update entries based on the conditions you set, ensuring your lists are up-to-date.
- **User-Friendly Interface:** Built with a clean and intuitive UI using Next.js, Tailwind CSS, and Radix UI components.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/RLAlpha49/anilist-custom-list-manager.git
   cd anilist-custom-list-manager
   ```

2. **Install Dependencies**

   Ensure you have [Node.js](https://nodejs.org/) installed. Then, install the required packages:

   ```bash
   npm install
   ```

   or using Yarn:

   ```bash
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add your Anilist API credentials:

   ```env
   NEXT_PUBLIC_ANILIST_CLIENT_ID=your_client_id
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

   or using Yarn:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software as per the license terms.
