

# Priflix Private Netflix

**Priflix Private Netflix** is a personal media streaming platform that lets you create your very own Netflix-like experience. With seamless integration with Google Drive for content fetching, you can easily add and manage your personal movie and anime collection and enjoy them from anywhere.

## Features

- **Personal Media Library:** Add your favorite movies, TV shows, and anime to create a custom streaming experience.
- **Google Drive Integration:** Automatically fetch and stream content stored on your Google Drive.
- **Automatic Content Arrangement:** Once content is added, it is automatically arranged in-line for a smooth browsing experience.
- **Responsive Design:** Enjoy a clean, modern interface that works on both desktop and mobile devices.
- **Private & Secure:** Designed for personal use, keeping your collection accessible only to you.
- **Easy Setup & Customization:** Quick installation process and flexible configuration options to suit your needs.

## Getting Started

Follow these instructions to set up your own instance of Priflix Private Netflix.

### Prerequisites

- **Node.js & npm:** Ensure you have Node.js (v12 or later) and npm installed on your system.
- **Google Drive API Credentials:** You will need to create and configure your Google API credentials to enable content fetching.
- **Git:** To clone the repository.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/tejazmali/priflix-private.netflix.git
   cd priflix-private.netflix
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Google Drive API:**

   - Visit the [Google Developers Console](https://console.developers.google.com/) and create a new project.
   - Enable the Google Drive API for your project.
   - Create OAuth 2.0 credentials and download the `credentials.json` file.
   - Place the `credentials.json` file in the project root or in a designated configuration folder.
   - Update the configuration file (e.g., `.env` or `config.js`) with your Google API credentials and any additional settings.

4. **Configure Your Media Collection:**

   - **Content Folder:** Create a folder named **ld** in your Google Drive. This folder is used for fetching content.
   - **Public Access:** Ensure the **ld** folder is set to public. Only public folders can be fetched automatically by the application.
   - **Automatic Arrangement:** Once your media files (movies and anime) are added to the **ld** folder, the service will automatically arrange them in-line for a seamless viewing experience.
   - Update the configuration file with the folder ID of your **ld** folder and any desired streaming settings.

### Running the Application

Start the development server with:

```bash
npm start
```

Then, open your browser and navigate to `http://localhost:3000` (or your specified port) to access your personal streaming platform.

## Usage

- **Dashboard:** Access your collection and browse through your movies and anime.
- **Search & Filter:** Quickly find your desired content using the built-in search and filter features.
- **Playback:** Click on any item to start streaming directly from your Google Drive.
- **Customization:** Adjust settings, change themes, or update the configuration to better suit your preferences.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or improvements, please submit an issue or create a pull request. Ensure your code adheres to the project’s coding standards and include relevant tests where applicable.

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/YourFeatureName`
3. Commit your changes: `git commit -m 'Add Your Feature'`
4. Push to the branch: `git push origin feature/YourFeatureName`
5. Open a pull request.


## Acknowledgements

- **Google Drive API:** Thanks to the Google team for the robust API that makes content fetching seamless.
- **Open Source Community:** Appreciation to all contributors and the community who continuously improve this project.

---

Any Problem ? - [CONTACT ME HERE](https://tejasmali.vercel.app/#contact)
