# DriveStream - Stream from Google Drive

DriveStream is a web application that allows you to create your own Netflix-like streaming service using Google Drive as content storage. This application is built with HTML, CSS, and vanilla JavaScript.

## Features

- Netflix-style user interface
- Direct integration with Google Drive API to fetch content
- Stream movies and series directly from Google Drive
- Responsive design that works on desktop and mobile devices
- Search functionality
- Content categories (Movies, Series, Anime, Cartoons)
- Episode browsing with automatic episode number detection
- "Next Episode" functionality for series
- "My List" feature to save favorite content
- Direct URL access to specific content via query parameters
- Mobile-friendly video player

## Prerequisites

Before you can use this application, you'll need:

1. A Google Cloud Platform account to create an API key
2. Google Drive folder(s) with your content
3. A web server or hosting service to deploy the application

## Setup

1. Clone or download this repository
2. Create a Google Cloud Platform project and enable the Google Drive API
3. Create an API key in Google Cloud Console
4. Update the `DRIVE_API_KEY` in `config.js` with your API key
5. Update the `contentData` array in `content-data.js` with your own content data
6. Host the files on a web server or deploy to a hosting service

## Google Drive API Integration

This application now includes full Google Drive API integration:

1. **API Key Configuration**: Set your Google Drive API key in the config.js file
2. **Dynamic Content Fetching**: Episodes are dynamically fetched from Google Drive folders
3. **Smart Episode Detection**: Automatically detects episode numbers from filenames (e.g., "S01E01")
4. **Sorting**: Episodes are automatically sorted in the correct order
5. **Direct URL Access**: Access content directly via URL parameters

### Getting a Google Drive API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Drive API
4. Create credentials (API Key)
5. Restrict the API key to Google Drive API only
6. Copy the API key and paste it in your config.js file

## How to Use

### Preparing Content Files in Google Drive

1. Organize your content into folders on Google Drive
2. Share the folders with "Anyone with the link can view" permissions
3. For series with multiple episodes, name your files with episode numbers (e.g., "S01E01 - Episode Name.mp4")
4. Get the folder IDs from the URLs (the long string of characters in the URL)

### Adding Content to the Application

To add content to the application, edit the `contentData` array in `content-data.js` with your content information:

```javascript
const contentData = [
    {
        title: "Movie Title",
        image: "URL to image/poster",
        folderid: "Google Drive Folder ID",
        type: "Movie" // or "Series", "Anime", "Cartoon movies", "Cartoon series"
    },
    // Add more content items...
];
```

### Direct URL Access

You can directly access specific content using URL parameters:

```
https://your-site.com/index.html?folderid=YOUR_FOLDER_ID&title=Content%20Title&type=Movie
```

The following URL parameters are supported:
- `folderid`: The Google Drive folder ID containing your content (required)
- `title`: The title to display for the content (optional)
- `type`: The content type - "Movie", "Series", "Anime", etc. (optional, defaults to "Series")

## Files in this Project

- `index.html` - Main HTML structure with meta tags for Google Drive API
- `styles.css` - CSS styling for the Netflix-like interface
- `config.js` - Configuration settings including Google Drive API key
- `content-data.js` - Content data array with all movies and series
- `app.js` - Main application code with Google Drive API integration

## Google Drive Integration

This application uses Google Drive as content storage and the Google Drive API for content retrieval:

1. **Direct File Access for Movies**: The application automatically fetches and plays the first video file found in movie folders without requiring user selection
2. **Episode Browsing for Series**: For TV shows, anime, and cartoon series, the application extracts episode numbers and displays them in order for selection
3. **Smart File Detection**: Automatically identifies video files in folders using MIME type detection
4. **Direct URL Access**: Access specific content by folder ID with URL parameters that specify content type

### URL Parameters

You can directly access specific content using URL parameters:

```
https://your-site.com/index.html?folderid=YOUR_FOLDER_ID&title=Content%20Title&type=Movie
```

The following URL parameters are supported:
- `folderid`: The Google Drive folder ID containing your content (required)
- `title`: The title to display for the content (optional)
- `type`: The content type - "Movie", "Series", "Anime", etc. (optional, defaults to "Series")

## Limitations and Considerations

- For best results, name your episode files with a clear episode number format (e.g., "S01E01")
- Google Drive API has usage limits - for high traffic sites, implement caching strategies
- This application doesn't include user authentication - add Firebase Auth or similar for user management
- For production use, implement server-side components to securely manage API keys

## License

This project is intended for educational purposes only.

## Disclaimer

This application is not affiliated with, endorsed by, or in any way officially connected with Netflix or Google. All product names, logos, and brands are property of their respective owners.

Using this application to stream copyrighted content that you don't have the rights to may violate copyright laws. Always ensure you have the proper rights to the content you're streaming. 