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
    TMDB_STILL_SIZE: 'w300', // Added still size for episode image
    
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
    CATEGORIES: ['Movies', 'Series', 'Anime', 'Cartoons', 'My List', 'Seasonal Picks'],
    
    // TMDB Search Settings
    TMDB_SEARCH_TYPES: {
        'Movie': 'movie',
        'Series': 'tv',
        'Anime': 'tv',
        'Cartoon movies': 'movie',
        'Cartoon series': 'tv'
    },
    
    // Seasonal configuration
    SEASONS: {
        WINTER: {
            name: 'Winter',
            months: [12, 1, 2],
            keywords: ['winter', 'snow', 'christmas', 'holiday', 'new year', 'ice'],
            genres: [18, 10751, 14] // Drama, Family, Fantasy genres often associated with winter
        },
        SPRING: {
            name: 'Spring',
            months: [3, 4, 5],
            keywords: ['spring', 'bloom', 'garden', 'flower', 'renewal'],
            genres: [10749, 35, 12] // Romance, Comedy, Adventure genres
        },
        SUMMER: {
            name: 'Summer',
            months: [6, 7, 8],
            keywords: ['summer', 'beach', 'vacation', 'sun', 'ocean', 'sea'],
            genres: [12, 28, 35] // Adventure, Action, Comedy genres
        },
        FALL: {
            name: 'Fall',
            months: [9, 10, 11],
            keywords: ['autumn', 'fall', 'halloween', 'harvest', 'thanksgiving'],
            genres: [27, 9648, 18] // Horror, Mystery, Drama genres
        }
    }
};

// Debug Mode (set to false in production)
const DEBUG = true;

// Function to detect if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function to get TMDB API URL with API key
function getTMDBApiUrl(endpoint, params = {}) {
    if (isMobileDevice()) {
        console.log('TMDB API calls disabled on mobile devices');
        return null;
    }
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
    if (isMobileDevice()) {
        console.log('TMDB API calls disabled on mobile devices');
        return null;
    }
    const searchType = CONFIG.TMDB_SEARCH_TYPES[type] || 'movie';
    const url = getTMDBApiUrl(`/search/${searchType}`, {
        query: title,
        include_adult: false,
        language: 'en-US',
        page: 1
    });
    
    if (!url) return null;
    
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
    if (isMobileDevice()) {
        console.log('TMDB API calls disabled on mobile devices');
        return null;
    }
    const contentType = CONFIG.TMDB_SEARCH_TYPES[type] || 'movie';
    const url = getTMDBApiUrl(`/${contentType}/${id}`, {
        append_to_response: 'credits,videos,recommendations',
        language: 'en-US'
    });
    
    if (!url) return null;
    
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
    if (isMobileDevice()) {
        console.log('TMDB API calls disabled on mobile devices');
        return null;
    }
    if (!showId || !seasonNumber) return null;
    
    try {
        const url = getTMDBApiUrl(`/tv/${showId}/season/${seasonNumber}`, {
            language: 'en-US',
            append_to_response: 'images,credits'
        });
        
        if (!url) return null;
        
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
    if (isMobileDevice()) {
        console.log('TMDB API calls disabled on mobile devices');
        return null;
    }
    if (!showId || !seasonNumber || !episodeNumber) return null;
    
    try {
        const url = getTMDBApiUrl(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`, {
            language: 'en-US',
            append_to_response: 'images,credits'
        });
        
        if (!url) return null;
        
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

// Function to detect current season
function getCurrentSeason() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
    
    for (const season in CONFIG.SEASONS) {
        if (CONFIG.SEASONS[season].months.includes(currentMonth)) {
            return CONFIG.SEASONS[season];
        }
    }
    
    // Default to current season based on hemisphere (Northern)
    if (currentMonth >= 3 && currentMonth <= 5) return CONFIG.SEASONS.SPRING;
    if (currentMonth >= 6 && currentMonth <= 8) return CONFIG.SEASONS.SUMMER;
    if (currentMonth >= 9 && currentMonth <= 11) return CONFIG.SEASONS.FALL;
    return CONFIG.SEASONS.WINTER;
}

// Function to get seasonal content from TMDB
async function getSeasonalContent() {
    if (isMobileDevice()) {
        console.log('TMDB API calls disabled on mobile devices');
        return null;
    }
    const currentSeason = getCurrentSeason();
    const seasonKeywords = currentSeason.keywords.join('|');
    const seasonGenres = currentSeason.genres.join('|');
    
    try {
        // Try to get content by seasonal keywords first
        const keywordUrl = getTMDBApiUrl('/discover/movie', {
            with_keywords: seasonKeywords,
            sort_by: 'popularity.desc',
            include_adult: false,
            page: 1
        });
        
        if (!keywordUrl) return null;
        
        const keywordResponse = await fetch(keywordUrl);
        if (!keywordResponse.ok) {
            throw new Error(`TMDB API error: ${keywordResponse.status}`);
        }
        
        const keywordData = await keywordResponse.json();
        
        // If we don't get enough results, try by genre
        if (keywordData.results.length < 5) {
            const genreUrl = getTMDBApiUrl('/discover/movie', {
                with_genres: seasonGenres,
                sort_by: 'popularity.desc',
                include_adult: false,
                page: 1
            });
            
            if (!genreUrl) return null;
            
            const genreResponse = await fetch(genreUrl);
            if (!genreResponse.ok) {
                throw new Error(`TMDB API error: ${genreResponse.status}`);
            }
            
            const genreData = await genreResponse.json();
            
            // Combine results
            const combinedResults = [...keywordData.results, ...genreData.results];
            // Remove duplicates
            const uniqueResults = Array.from(new Set(combinedResults.map(item => item.id)))
                .map(id => combinedResults.find(item => item.id === id));
                
            return {
                results: uniqueResults.slice(0, 10),
                season: currentSeason.name
            };
        }
        
        return {
            results: keywordData.results.slice(0, 10),
            season: currentSeason.name
        };
    } catch (error) {
        console.error('Error fetching seasonal content:', error);
        return null;
    }
}

// Helper function to clean up titles by removing text in parentheses
function cleanTitle(title) {
    if (!title) return '';
    return title.replace(/\s*\([^)]*\)\s*/g, '').trim();
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
window.getCurrentSeason = getCurrentSeason;
window.getSeasonalContent = getSeasonalContent; 