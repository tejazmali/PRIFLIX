// Configuration for DriveStream

// Configuration Object
const CONFIG = {
    // TMDB API Configuration
    TMDB_API_KEY: 'b53f986e99e7ffc7ebb9831b2b15d139',
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    TMDB_POSTER_SIZE: 'w500',
    TMDB_BACKDROP_SIZE: 'original',
    TMDB_PROFILE_SIZE: 'w185',
    TMDB_STILL_SIZE: 'w300', // Added still size for episode images
    
    // Google Drive API Configuration
    // Google Drive API Key (replace with your own from Google Cloud Console)
    DRIVE_API_KEY: 'AIzaSyC_vjcACAZfiM-UbXeHuSuvetOHsKJPPJk',
    
    // Google Drive URL Templates
    DRIVE_PREVIEW_URL: 'https://drive.google.com/file/d/',
    DRIVE_EMBED_URL: 'https://drive.google.com/file/d/',
    DRIVE_DOWNLOAD_URL: 'https://drive.google.com/uc?export=download&id=',
    DRIVE_FOLDER_URL: 'https://drive.google.com/drive/folders/',
    
    // Episode Pattern for Extracting Episode Numbers
    EPISODE_PATTERN: /(?:S\d+\s)?E(\d+)/i,
    
    // Categories for organizing content
    CATEGORIES: ['Movies', 'Series', 'Anime', 'Cartoons', 'My List'],
    
    // TMDB Search Settings
    TMDB_SEARCH_TYPES: {
        'Movie': 'movie',
        'Series': 'tv',
        'Anime': 'tv',
        'Cartoon movies': 'movie',
        'Cartoon series': 'tv'
    }
};

// Debug Mode (set to false in production)
const DEBUG = true;

// Function to get TMDB API URL with API key
function getTMDBApiUrl(endpoint, params = {}) {
    const url = new URL(`${CONFIG.TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', CONFIG.TMDB_API_KEY);
    
    // Add additional parameters
    for (const key in params) {
        url.searchParams.append(key, params[key]);
    }
    
    return url.toString();
}

// Function to get TMDB Image URL
function getTMDBImageUrl(path, size) {
    if (!path) return null;
    return `${CONFIG.TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Function to search TMDB for content information
async function searchTMDB(title, type) {
    const searchType = CONFIG.TMDB_SEARCH_TYPES[type] || 'movie';
    const url = getTMDBApiUrl(`/search/${searchType}`, {
        query: title,
        include_adult: false,
        language: 'en-US',
        page: 1
    });
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }
        const data = await response.json();
        return data.results && data.results.length > 0 ? data.results[0] : null;
    } catch (error) {
        console.error('Error searching TMDB:', error);
        return null;
    }
}

// Function to get detailed content info from TMDB
async function getContentDetails(id, type) {
    const contentType = CONFIG.TMDB_SEARCH_TYPES[type] || 'movie';
    const url = getTMDBApiUrl(`/${contentType}/${id}`, {
        append_to_response: 'credits,videos,recommendations',
        language: 'en-US'
    });
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching content details:', error);
        return null;
    }
}

// Function to get Google Drive API URL for listing files in a folder
function getDriveAPIUrl(folderId, searchQuery = '') {
    let query = `'${folderId}'+in+parents`;
    if (searchQuery) {
        query += `+and+${searchQuery}`;
    }
    return `https://www.googleapis.com/drive/v3/files?q=${query}&key=${CONFIG.DRIVE_API_KEY}&fields=files(name,id,mimeType,thumbnailLink)`;
}

// Function to get Google Drive Embed URL
function getDriveEmbedUrl(fileId) {
    return `${CONFIG.DRIVE_EMBED_URL}${fileId}/preview`;
}

// Function to get Google Drive Folder URL
function getDriveFolderUrl(folderId) {
    return `${CONFIG.DRIVE_FOLDER_URL}${folderId}?usp=sharing`;
}

// Function to get TV show season details
async function getTVSeasonDetails(showId, seasonNumber) {
    if (!showId || !seasonNumber) return null;
    
    try {
        const url = getTMDBApiUrl(`/tv/${showId}/season/${seasonNumber}`, {
            language: 'en-US',
            append_to_response: 'images,credits'
        });
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching TV season details:', error);
        return null;
    }
}

// Function to get TV show episode details
async function getTVEpisodeDetails(showId, seasonNumber, episodeNumber) {
    if (!showId || !seasonNumber || !episodeNumber) return null;
    
    try {
        const url = getTMDBApiUrl(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`, {
            language: 'en-US',
            append_to_response: 'images,credits'
        });
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching TV episode details:', error);
        return null;
    }
}

// Export configuration
window.CONFIG = CONFIG;
window.getTMDBApiUrl = getTMDBApiUrl;
window.getTMDBImageUrl = getTMDBImageUrl;
window.searchTMDB = searchTMDB;
window.getContentDetails = getContentDetails;
window.getTVSeasonDetails = getTVSeasonDetails;
window.getTVEpisodeDetails = getTVEpisodeDetails;
window.getDriveAPIUrl = getDriveAPIUrl;
window.getDriveEmbedUrl = getDriveEmbedUrl;
window.getDriveFolderUrl = getDriveFolderUrl; 