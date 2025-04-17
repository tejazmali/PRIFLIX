document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
    
    // Add event listeners
    setupEventListeners();
    
    // If there's a search query in URL, process it
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        searchContent(searchQuery);
    }
    
    // Setup slider navigation
    setupSliderNavigation();
});

// Initialize the application
function initApp() {
    try {
        // Load content from our content data
        loadContentData();
        
        // Set up hero banner with a random content item
        setupHeroBanner();
        
        // Setup slider navigation after content is loaded
        setupSliderNavigation();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', () => {
        document.querySelector('.search-container').classList.toggle('active');
        searchInput.focus();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchContent(searchInput.value);
        }
    });
    
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    document.addEventListener("DOMContentLoaded", () => {
        const heroPlayBtn = document.querySelector('.hero-banner .play-btn');
        const heroInfoBtn = document.querySelector('.hero-banner .more-info-btn');
      
        console.log("Play Button:", heroPlayBtn); // <-- Confirm this shows the element
      
        heroPlayBtn?.addEventListener('click', () => {
          const contentId = heroPlayBtn.dataset.contentId;
          const folderid = heroPlayBtn.dataset.folderid;
          const title = document.querySelector('.hero-title')?.textContent;
      
          console.log("Clicked", { contentId, folderid, title });
      
          if (contentId) {
            const type = document.querySelector('.hero-description')?.textContent.split(' • ')[0];
            const contentItem = { title, folderid, type };
            showFolderContent(contentItem);
          }
        });
      
        heroInfoBtn?.addEventListener('click', () => {
          const contentId = heroInfoBtn.dataset.contentId;
          if (contentId) {
            showContentDetails(contentId);
          }
        });
      });
      
    
    heroInfoBtn.addEventListener('click', () => {
        const contentId = heroInfoBtn.dataset.contentId;
        if (contentId) {
            showContentDetails(contentId);
        }
    });
    
    // Modal close functionality
    const modal = document.getElementById('movieModal');
    
    // Close button click
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close on click outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Navigation links
    document.querySelectorAll('.main-nav a, .footer-section a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active state in navigation
                document.querySelectorAll('.main-nav li').forEach(li => li.classList.remove('active'));
                this.parentElement.classList.add('active');
            }
        });
    });
    
    // Handle scroll events for navbar background
    window.addEventListener('scroll', handleScroll);
    
    // Initialize header state on page load
    handleScroll();
}

// Handle scroll for navbar
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});



// Toggle mobile menu
function toggleMobileMenu() {
    // Implement mobile menu toggle
    const nav = document.querySelector('.main-nav');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}

// Load content from our content data
function loadContentData() {
    try {
        // Group content by type
        const contentByType = groupContentByType(contentData);
        
        // Render content for each category
        renderContentByType('Series', contentByType['Series'] || [], 'seriesContent');
        renderContentByType('Anime', contentByType['Anime'] || [], 'animeContent');
        renderContentByType('Movie', contentByType['Movie'] || [], 'movieContent');
        renderContentByType('Cartoon movies', contentByType['Cartoon movies'] || [], 'cartoonMoviesContent');
        renderContentByType('Cartoon series', contentByType['Cartoon series'] || [], 'cartoonSeriesContent');
        
        // Load seasonal content from TMDB only if not on mobile
        if (!isMobileDevice()) {
            loadSeasonalContent();
        }
        
        // Create trending section with mix of content
        const trendingContent = createTrendingContent(contentData);
        renderContentByType('Trending', trendingContent, 'trendingMovies');
        
        // Hide empty sections
        hideEmptySections();
    } catch (error) {
        console.error('Error loading content data:', error);
    }
}

// Group content by type
function groupContentByType(contentItems) {
    const groupedContent = {};
    
    contentItems.forEach(item => {
        if (!groupedContent[item.type]) {
            groupedContent[item.type] = [];
        }
        groupedContent[item.type].push(item);
    });
    
    return groupedContent;
}

// Create trending content from a mix of all content types
function createTrendingContent(contentItems) {
    // Shuffle the array
    const shuffled = [...contentItems].sort(() => 0.5 - Math.random());
    // Get first 10 items
    return shuffled.slice(0, 10);
}

// Hide empty sections
function hideEmptySections() {
    const contentSections = document.querySelectorAll('.movie-row');
    
    contentSections.forEach(section => {
        const slider = section.querySelector('.movie-slider');
        const cards = slider.querySelectorAll('.movie-card');
        
        if (cards.length === 0) {
            section.style.display = 'none';
        }
    });
}

// Render content by type
function renderContentByType(type, contentItems, containerId) {
    const container = document.getElementById(containerId);
    
    // Clear loading spinner
    container.innerHTML = '';
    
    // Create content cards
    contentItems.forEach(item => {
        const contentCard = createContentCard(item);
        container.appendChild(contentCard);
    });
    
    // Setup slider navigation after content is rendered
    setupSliderNavigation();
}

// Create a content card element
function createContentCard(contentItem) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = contentItem.id || contentItem.tmdbId || '';
    
    // Add content type badge to easily identify different types
    const typeBadge = document.createElement('span');
    typeBadge.className = 'content-type-badge';
    typeBadge.textContent = contentItem.type;
    
    // For seasonal content, add special styling or icon
    if (contentItem.isSeasonalContent) {
        typeBadge.className += ' seasonal-badge';
        typeBadge.innerHTML = `<i class="fas fa-snowflake"></i> ${getCurrentSeason().name}`;
    }
    
    // Create the card HTML structure with poster image
    card.innerHTML = `
        <img src="${contentItem.image || 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${contentItem.title}" loading="lazy">
        <div class="movie-info">
            <h3 class="movie-title">${contentItem.title}</h3>
            
            <div class="movie-actions">
                <i class="fas fa-play" title="Play"></i>
                <i class="fas fa-info-circle" title="More Info"></i>
                <i class="fas fa-plus" title="Add to My List"></i>
            </div>
        </div>
    `;
    
    // Add the badge to the card
    card.appendChild(typeBadge);
    
    // Add click event listener to show folder content or content details
    card.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target.classList.contains('fa-play')) {
            // For seasonal content that doesn't have folder ID, show details modal
            if (contentItem.isSeasonalContent) {
                showContentDetails(contentItem);
            } else {
                showFolderContent(contentItem);
            }
        } else if (target.classList.contains('fa-info-circle')) {
            // For info icon, also directly navigate to streaming page unless it's seasonal content
            if (contentItem.isSeasonalContent) {
                showContentDetails(contentItem);
            } else {
                navigateToStreamingPage(contentItem);
            }
        } else if (target.classList.contains('fa-plus')) {
            addToMyList(contentItem);
            event.stopPropagation();
        } else {
            // If user clicked elsewhere on the card, directly navigate to streaming page
            if (contentItem.isSeasonalContent) {
                showContentDetails(contentItem);
            } else {
                navigateToStreamingPage(contentItem);
            }
        }
    });
    
    return card;
}

// Setup hero banner with a random content item
function setupHeroBanner() {
    try {
        if (contentData.length > 0) {
            const movies = contentData.filter(item => item.type === 'Movie');
            const randomContent = movies.length > 0 ? 
                movies[Math.floor(Math.random() * movies.length)] : 
                contentData[Math.floor(Math.random() * contentData.length)];

            const heroBanner = document.getElementById('heroBanner');
            heroBanner.style.backgroundImage = `url(${randomContent.image})`;

            const titleEl = document.querySelector('.hero-title');
            const descEl = document.querySelector('.hero-description');
            const playBtn = document.querySelector('.hero-buttons .play-btn');
            const infoBtn = document.querySelector('.hero-buttons .more-info-btn');

            if (titleEl && descEl && playBtn && infoBtn) {
                titleEl.textContent = randomContent.title;
                descEl.textContent = `${randomContent.type} • Stream Now`;

                // Set data attributes (optional)
                playBtn.dataset.folderid = randomContent.folderid;
                infoBtn.dataset.folderid = randomContent.folderid;

                // Update button text if it's not a movie
                playBtn.innerHTML = randomContent.type !== 'Movie'
                    ? '<i class="fas fa-play"></i> Watch Episodes'
                    : '<i class="fas fa-play"></i> Play';

                // ✅ Add click event to play button
                playBtn.onclick = () => {
                    const url = new URL('streaming.html', window.location.origin);
                    url.searchParams.set('folderId', randomContent.folderid);
                    url.searchParams.set('title', randomContent.title);
                    url.searchParams.set('type', randomContent.type);
                    window.location.href = url.toString();
                };
                
                // ✅ Add click event to info button (redirect directly instead of showing modal)
                infoBtn.onclick = () => {
                    const url = new URL('streaming.html', window.location.origin);
                    url.searchParams.set('folderId', randomContent.folderid);
                    url.searchParams.set('title', randomContent.title);
                    url.searchParams.set('type', randomContent.type);
                    window.location.href = url.toString();
                };
            }
        }
    } catch (error) {
        console.error('Error setting up hero banner:', error);
    }
}


// Search for content
function searchContent(query) {
    if (!query.trim()) return;
    
    try {
        const searchResults = contentData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        );
        
        // Display search results in a new row
        const contentContainer = document.querySelector('.content');
        
        // Check if search results section already exists
        let searchSection = document.getElementById('searchResults');
        
        if (!searchSection) {
            // Create a new section for search results
            searchSection = document.createElement('section');
            searchSection.className = 'movie-row';
            searchSection.id = 'searchResults';
            searchSection.innerHTML = `
                <h2 class="row-title">Search Results for "${query}"</h2>
                <div class="movie-slider" id="searchMovies">
                    <div class="loading-spinner"></div>
                </div>
            `;
            
            // Insert at the top of content
            contentContainer.insertBefore(searchSection, contentContainer.firstChild);
        } else {
            // Update title
            searchSection.querySelector('.row-title').textContent = `Search Results for "${query}"`;
            searchSection.querySelector('.movie-slider').innerHTML = '<div class="loading-spinner"></div>';
        }
        
        // Render search results
        renderContentByType('Search', searchResults, 'searchMovies');
        
        // Show no results message if needed
        if (searchResults.length === 0) {
            const searchMoviesContainer = document.getElementById('searchMovies');
            searchMoviesContainer.innerHTML = '<p class="no-results">No results found. Try a different search term.</p>';
        }
        
        // Scroll to search results
        searchSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error searching content:', error);
    }
}

// Show content details in a modal
function showContentDetails(contentItem) {
    // Set up modal content
    const modal = document.getElementById('contentModal');
    const modalTitle = document.getElementById('contentModalTitle');
    const modalBody = document.getElementById('contentModalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = contentItem.title;
    
    // Process differently based on whether it's seasonal content or not
    if (contentItem.isSeasonalContent && contentItem.tmdbId) {
        // For seasonal content, fetch detailed info from TMDB
        const contentType = contentItem.type === 'Series' ? 'tv' : 'movie';
        
        getContentDetails(contentItem.tmdbId, contentType)
            .then(details => {
                if (!details) {
                    // If TMDB API is disabled or failed, use basic content details
                    renderContentDetailsInModal({
                        title: contentItem.title,
                        overview: 'No overview available.',
                        backdrop: null,
                        poster: null,
                        year: '',
                        rating: '',
                        genres: '',
                        runtime: '',
                        contentId: contentItem.id,
                        folderid: contentItem.folderid,
                        type: contentItem.type
                    }, contentItem);
                    return;
                }
                
                // Format the details for display
                renderContentDetailsInModal(details, contentItem);
            })
            .catch(error => {
                console.error('Error fetching content details:', error);
                modalBody.innerHTML = '<p class="no-results">Failed to load content details.</p>';
            });
    } else {
        // For regular content, search TMDB
        searchTMDB(contentItem.title, contentItem.type)
            .then(result => {
                if (!result) {
                    // If TMDB API is disabled or no results, use basic content details
                    renderContentDetailsInModal({
                        title: contentItem.title,
                        overview: 'No overview available.',
                        backdrop: null,
                        poster: null,
                        year: '',
                        rating: '',
                        genres: '',
                        runtime: '',
                        contentId: contentItem.id,
                        folderid: contentItem.folderid,
                        type: contentItem.type
                    }, contentItem);
                    return;
                }
                
                // Use the TMDB data to enhance our display
                const details = {
                    title: result.title || result.name,
                    overview: result.overview,
                    backdrop: getTMDBImageUrl(result.backdrop_path, CONFIG.TMDB_BACKDROP_SIZE),
                    poster: getTMDBImageUrl(result.poster_path, CONFIG.TMDB_POSTER_SIZE),
                    year: new Date(result.release_date || result.first_air_date).getFullYear(),
                    rating: Math.round(result.vote_average * 10) / 10,
                    genres: result.genres ? result.genres.map(g => g.name).join(', ') : '',
                    runtime: result.runtime ? `${result.runtime} min` : '',
                    contentId: contentItem.id,
                    folderid: contentItem.folderid,
                    type: contentItem.type
                };
                
                renderContentDetailsInModal(details, contentItem);
            })
            .catch(error => {
                console.error('Error searching TMDB:', error);
                modalBody.innerHTML = '<p class="no-results">Failed to load content details.</p>';
            });
    }
}

// Render content details in modal
function renderContentDetailsInModal(details, contentItem) {
    const modalBody = document.querySelector('.modal-body');
    const isSeasonalContent = contentItem.isSeasonalContent || false;
    
    // Create the HTML for the modal content
    let modalHTML = `
        <div class="modal-backdrop" style="background-image: url('${details.backdrop || details.poster || contentItem.image}')"></div>
        <div class="modal-details">
            <h2 class="modal-title">${details.title || contentItem.title}</h2>
            <p class="modal-info">
                ${details.year ? `<span>${details.year}</span> • ` : ''}
                ${details.rating ? `<span><i class="fas fa-star"></i> ${details.rating}</span> • ` : ''}
                ${details.runtime ? `<span>${details.runtime}</span> • ` : ''}
                ${details.genres ? `<span>${details.genres}</span>` : ''}
            </p>
            <p class="modal-overview">${details.overview || 'No overview available.'}</p>
    `;
    
    // Show different buttons based on content type
    modalHTML += `<div class="modal-actions">`;
    
    if (isSeasonalContent) {
        // For seasonal content, provide a link to TMDB instead of play button
        modalHTML += `
            <a href="https://www.themoviedb.org/${details.media_type || 'movie'}/${details.id}" target="_blank" class="more-info-btn">
                <i class="fas fa-external-link-alt"></i> View on TMDB
            </a>
        `;
    } else {
        // For regular content, show play button
        modalHTML += `
            <button class="play-btn" data-folderid="${contentItem.folderid}" data-content-id="${contentItem.id}">
                <i class="fas fa-play"></i> Play
            </button>
        `;
    }
    
    // Add to my list button for all content types
    modalHTML += `
            <button class="add-list-btn" data-content-id="${contentItem.id || details.id}">
                <i class="fas fa-plus"></i> Add to My List
            </button>
        </div>
    `;
    
    // Add cast information if available
    if (details.credits && details.credits.cast && details.credits.cast.length > 0) {
        modalHTML += `
            <div class="modal-cast">
                <h3 class="cast-title">Cast</h3>
                <div class="cast-list">
        `;
        
        details.credits.cast.slice(0, 5).forEach(castMember => {
            modalHTML += `
                <div class="cast-item">
                    <img src="${getTMDBImageUrl(castMember.profile_path, CONFIG.TMDB_PROFILE_SIZE) || 'https://via.placeholder.com/185x278?text=No+Image'}" alt="${castMember.name}">
                    <p>${castMember.name}</p>
                </div>
            `;
        });
        
        modalHTML += `
                </div>
            </div>
        `;
    }
    
    modalHTML += `</div>`;
    
    // Set the HTML content
    modalBody.innerHTML = modalHTML;
    
    // Add event listeners to buttons
    setupModalButtonListeners();
}

// Show folder content (episodes list) - now navigates to the streaming page
async function showFolderContent(contentItem) {
    navigateToStreamingPage(contentItem);
}

// Navigate to the streaming page
function navigateToStreamingPage(contentItem) {
    // Build the URL with query parameters
    const url = new URL('streaming.html', window.location.origin);
    url.searchParams.set('folderId', contentItem.folderid);
    url.searchParams.set('title', contentItem.title);
    url.searchParams.set('type', contentItem.type);
    
    // If we have a TMDB ID, add it
    if (contentItem.tmdbId) {
        url.searchParams.set('tmdbId', contentItem.tmdbId);
    }
    
    // Navigate to the streaming page
    window.location.href = url.toString();
}

// Simple function to fetch files from a Google Drive folder
async function fetchFilesFromDrive(folderId) {
    if (!folderId) return [];
    
    try {
        // Build the API URL
        const apiUrl = getDriveAPIUrl(folderId);
        
        // Fetch data from Google Drive API
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.files || data.files.length === 0) {
            console.warn("No files found in the folder.");
            return [];
        }
        
        return data.files;
    } catch (error) {
        console.error("Failed to fetch files from Drive:", error.message);
        return [];
    }
}

// Get Google Drive API URL
function getDriveAPIUrl(folderId) {
    return `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${CONFIG.GOOGLE_API_KEY}`;
}

// Get Google Drive embed URL
function getDriveEmbedUrl(fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Get Google Drive folder URL
function getDriveFolderUrl(folderId) {
    return `https://drive.google.com/drive/folders/${folderId}`;
}

// Get TMDB image URL
function getTMDBImageUrl(path, size) {
    return `${CONFIG.TMDB_IMAGE_BASE_URL}${size}${path}`;
}

// Play content from Google Drive - kept for backwards compatibility but mostly replaced by streaming.html
function playContent(fileId, episodeTitle) {
    // Check if we're in the streaming page context
    if (window.location.pathname.includes('streaming.html')) {
        // Use the streaming page's playVideo function
        if (typeof playVideo === 'function') {
            playVideo(fileId, episodeTitle);
            return;
        }
    }
    
    // For the main page, navigate to streaming page with episode info
    const currentContentItem = getCurrentContentItemFromContext();
    if (currentContentItem) {
        const url = new URL('streaming.html', window.location.origin);
        url.searchParams.set('folderId', currentContentItem.folderid);
        url.searchParams.set('title', currentContentItem.title);
        url.searchParams.set('type', currentContentItem.type);
        url.searchParams.set('episodeId', fileId);
        url.searchParams.set('episodeTitle', episodeTitle || '');
        
        // Navigate to the streaming page
        window.location.href = url.toString();
        return;
    }
    
    // Fallback to the old modal method if unable to determine content context
    const videoModal = document.getElementById('videoModal');
    const videoContainer = videoModal.querySelector('.video-container');
    const playedEpisodeName = document.getElementById('played-episode-name');
    
    // Create the iframe for Google Drive
    videoContainer.innerHTML = `
        <iframe src="${getDriveEmbedUrl(fileId)}" 
                frameborder="0" 
                allowfullscreen>
        </iframe>
    `;
    
    // Update the played episode name if provided
    if (episodeTitle) {
        playedEpisodeName.innerHTML = `<span>${episodeTitle}</span>`;
        playedEpisodeName.style.display = 'block';
    } else {
        playedEpisodeName.style.display = 'none';
    }
    
    // Show or hide next button based on episode count
    const nextButton = videoModal.querySelector('.next-btn');
    const episodes = window.currentEpisodes || [];
    
    if (episodes.length <= 1) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'block';
        
        // Update current episode index if this is a specific episode
        if (fileId) {
            const index = episodes.findIndex(episode => episode.id === fileId);
            if (index !== -1) {
                window.currentEpisodeIndex = index;
            }
        }
    }
    
    // Show the video modal
    videoModal.style.display = 'block';
}

// Helper function to get the current content item from context
function getCurrentContentItemFromContext() {
    try {
        // First check if we have a current content from hero banner
        const heroPlayBtn = document.querySelector('.hero-banner .play-btn');
        if (heroPlayBtn) {
            const folderid = heroPlayBtn.dataset.folderid;
            const title = document.querySelector('.hero-title').textContent;
            const type = document.querySelector('.hero-description').textContent.split(' • ')[0];
            
            if (folderid && title) {
                return { folderid, title, type };
            }
        }
        
        // If we're in a folder modal, try to get content from there
        const folderModal = document.getElementById('folderContentModal');
        if (folderModal && folderModal.style.display === 'block') {
            const title = folderModal.querySelector('.modal-title').textContent;
            // Extract folderid from any button in the modal
            const folderIdElement = folderModal.querySelector('[data-folderid]');
            if (folderIdElement && title) {
                const folderid = folderIdElement.dataset.folderid;
                return { folderid, title, type: 'Series' }; // Assume Series if in folder modal
            }
        }
        
        // Check if we're in a content modal
        const movieModal = document.getElementById('movieModal');
        if (movieModal && movieModal.style.display === 'block') {
            const title = movieModal.querySelector('.modal-title').textContent;
            const folderIdElement = movieModal.querySelector('[data-folderid]');
            if (folderIdElement && title) {
                const folderid = folderIdElement.dataset.folderid;
                const typeText = movieModal.querySelector('.modal-info span').textContent;
                return { folderid, title, type: typeText };
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error getting current content item:', error);
        return null;
    }
}

// Add content to My List

function addToMyList(contentItem) {
    // In a real app, this would save to localStorage or a backend
    // Get existing list from localStorage
    let myList = JSON.parse(localStorage.getItem('myList')) || [];
    
    // Check if item is already in the list
    const isAlreadyInList = myList.some(item => 
        item.folderid === contentItem.folderid
    );
    
    if (!isAlreadyInList) {
        // Add to my list
        myList.push(contentItem);
        localStorage.setItem('myList', JSON.stringify(myList));
        alert(`Added "${contentItem.title}" to My List!`);
    } else {
        // Remove from my list
        myList = myList.filter(item => item.folderid !== contentItem.folderid);
        localStorage.setItem('myList', JSON.stringify(myList));
        alert(`Removed "${contentItem.title}" from My List!`);
    }
    
    // Refresh My List section if visible
    const myListSection = document.getElementById('myList');
    if (myListSection) {
        renderMyList();
    }
}

// Render My List
function renderMyList() {
    const myList = JSON.parse(localStorage.getItem('myList')) || [];
    renderContentByType('My List', myList, 'myListContent');
    
    // Show message if my list is empty
    if (myList.length === 0) {
        const myListContainer = document.getElementById('myListContent');
        myListContainer.innerHTML = '<p class="no-results">Your list is empty. Add content by clicking the + button on any title.</p>';
    }
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
}



// Get content description
function getContentDescription(contentItem) {
    // In a real app, this would come from an API or database
    // For this demo, we'll generate a description based on the content type and title
    
    const type = contentItem.type;
    const title = contentItem.title;
    
    switch (type) {
        case 'Movie':
            return `Watch ${title} - a captivating film streamed directly from Google Drive. Click play to start watching this movie now.`;
        case 'Series':
            return `${title} is a compelling series with multiple episodes. Browse the episode list to start watching this series.`;
        case 'Anime':
            return `${title} is an exciting anime series available for streaming. Explore the episodes to begin your anime adventure.`;
        case 'Cartoon movies':
            return `${title} is a delightful animated film for all ages. Stream this cartoon movie directly from Google Drive.`;
        case 'Cartoon series':
            return `${title} features multiple episodes of animated fun. Browse through the episodes to start enjoying this cartoon series.`;
        default:
            return `Stream ${title} directly from Google Drive. Click to explore more.`;
    }
}

// Search TMDB
async function searchTMDB(query, type) {
    // Implement the logic to search TMDB
    // This is a placeholder and should be replaced with actual implementation
    return null; // Placeholder return, actual implementation needed
}

// Setup modal button listeners
function setupModalButtonListeners() {
    const modal = document.getElementById('movieModal');
    
    // Find buttons in the modal
    const playBtn = modal.querySelector('.play-btn');
    const addListBtn = modal.querySelector('.add-list-btn');
    
    // Play button functionality
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            const folderId = playBtn.dataset.folderid;
            const contentId = playBtn.dataset.contentId;
            
            if (folderId) {
                // For content with folder ID, navigate to streaming page
                const contentItem = {
                    folderid: folderId,
                    title: modal.querySelector('.modal-title').textContent
                };
                
                navigateToStreamingPage(contentItem);
                
                // Hide the modal
                modal.style.display = 'none';
            }
        });
    }
    
    // Add to list button functionality
    if (addListBtn) {
        addListBtn.addEventListener('click', () => {
            const contentId = addListBtn.dataset.contentId;
            
            // Find the original content item
            const contentItem = contentData.find(item => item.id === contentId);
            
            if (contentItem) {
                addToMyList(contentItem);
            }
        });
    }
}

// Setup slider navigation
function setupSliderNavigation() {
    const movieRows = document.querySelectorAll('.movie-row');
    
    movieRows.forEach(row => {
        const slider = row.querySelector('.movie-slider');
        const leftNav = row.querySelector('.slider-nav.left');
        const rightNav = row.querySelector('.slider-nav.right');
        
        if (slider) {
            // Handle left navigation
            if (leftNav) {
                leftNav.replaceWith(leftNav.cloneNode(true));
                const newLeftNav = row.querySelector('.slider-nav.left');
                
                newLeftNav.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const scrollAmount = slider.clientWidth * 0.8; // Scroll 80% of the visible width
                    slider.scrollBy({
                        left: -scrollAmount,
                        behavior: 'smooth'
                    });
                });
            }
            
            // Handle right navigation
            if (rightNav) {
                rightNav.replaceWith(rightNav.cloneNode(true));
                const newRightNav = row.querySelector('.slider-nav.right');
                
                newRightNav.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const scrollAmount = slider.clientWidth * 0.8; // Scroll 80% of the visible width
                    slider.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                });
            }
            
            // Show/hide arrows based on scroll position
            slider.addEventListener('scroll', () => {
                if (leftNav) {
                    leftNav.style.opacity = slider.scrollLeft > 0 ? '1' : '0';
                }
                if (rightNav) {
                    rightNav.style.opacity = 
                        (slider.scrollLeft + slider.clientWidth) < slider.scrollWidth ? '1' : '0';
                }
            });
            
            // Initial arrow visibility
            if (leftNav) {
                leftNav.style.opacity = slider.scrollLeft > 0 ? '1' : '0';
            }
            if (rightNav) {
                rightNav.style.opacity = 
                    (slider.scrollLeft + slider.clientWidth) < slider.scrollWidth ? '1' : '0';
            }
        }
    });
} 