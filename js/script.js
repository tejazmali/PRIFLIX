document.addEventListener("DOMContentLoaded", function () {
  let headerLoaded = false;
  let footerLoaded = false;
  let fallbackTimeoutId;

  // Function to reset the loader and progress bar
  function resetLoader() {
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.width = "0%"; // Reset progress bar width
      progressBar.style.animation = "none"; // Stop animation
    }
    document.body.classList.remove("loaded"); // Show loader
    const contentElement = document.getElementById("content");
    if (contentElement) {
      contentElement.style.display = "none"; // Hide content
    }
  }

  // Function to complete loading and show content
  function completeLoading() {
    if (fallbackTimeoutId) {
      clearTimeout(fallbackTimeoutId);
    }
    document.body.classList.add("loaded");
    const contentElement = document.getElementById("content");
    if (contentElement) {
      contentElement.style.display = "block";
    }
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.width = "100%"; // Fill the progress bar
      progressBar.style.animation = "none";
    }
  }

  // Check if both header and footer are loaded
  function checkAllContentLoaded() {
    if (headerLoaded && footerLoaded) {
      completeLoading();
    }
  }

  // Load header with error handling
  function loadHeader() {
    fetch("/header.html")
      .then((response) => response.text())
      .then((data) => {
        const headerEl = document.getElementById("header");
        if (headerEl) {
          headerEl.innerHTML = data;
        }
        if (typeof initializeMenuToggle === "function") {
          initializeMenuToggle();
        }
        headerLoaded = true;
        checkAllContentLoaded();
      })
      .catch((err) => {
        console.error("Error loading header:", err);
        headerLoaded = true;
        checkAllContentLoaded();
      });
  }

  // Load footer with error handling
  function loadFooter() {
    fetch("/footer.html")
      .then((response) => response.text())
      .then((data) => {
        const footerEl = document.getElementById("footer");
        if (footerEl) {
          footerEl.innerHTML = data;
        }
        footerLoaded = true;
        checkAllContentLoaded();
      })
      .catch((err) => {
        console.error("Error loading footer:", err);
        footerLoaded = true;
        checkAllContentLoaded();
      });
  }

  // Fallback: Force complete loading after 10 seconds if header/footer haven't loaded
  function startFallbackTimer() {
    fallbackTimeoutId = setTimeout(() => {
      console.warn("Fallback triggered: Forcing load completion.");
      headerLoaded = true;
      footerLoaded = true;
      completeLoading();
    }, 10000);
  }

  // Start the progress bar animation and reset loader
  function startProgressBar() {
    resetLoader();
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.animation = "progressAnimation 1s linear forwards";
    }
  }

  // Navigation handling: start progress bar on link clicks or before unload
  function handleNavigation() {
    startProgressBar();
  }

  window.addEventListener("beforeunload", handleNavigation);
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", handleNavigation);
  });

  // When the user navigates using the browser back/forward buttons:
  window.addEventListener("popstate", () => {
    // If the current URL indicates the home page, force a full page reload.
    if (
      window.location.pathname === "/" ||
      window.location.pathname.toLowerCase() === "/index.html"
    ) {
      window.location.reload();
    } else {
      // For other pages, attempt to load header/footer via AJAX.
      resetLoader();
      headerLoaded = false;
      footerLoaded = false;
      startFallbackTimer();
      loadHeader();
      loadFooter();
    }
  });

  // Start the header/footer loading process with a fallback timer
  startFallbackTimer();
  loadHeader();
  loadFooter();

  // As a fallback, complete loading on window load event
  window.addEventListener("load", completeLoading);
});

// Toggle the clear button and search results container based on input content
function toggleClearButton() {
  const queryInput = document.getElementById("query");
  const clearBtn = document.getElementById("clear-btn");
  const searchResultsContainer = document.getElementById("search-results-container");
  const query = queryInput.value.trim();

  if (query.length > 0) {
    clearBtn.style.display = "block";
    searchResultsContainer.style.display = "block";
    updateSearchResults(query);
  } else {
    clearBtn.style.display = "none";
    searchResultsContainer.style.display = "none";
  }
}

// Clear the search input and hide the clear button and search results
function clearSearch() {
  const queryInput = document.getElementById("query");
  queryInput.value = "";
  queryInput.focus();
  toggleClearButton();
}

// Update the search results container by filtering data from contentData
function updateSearchResults(query) {
  const searchResultsContainer = document.getElementById("search-results-container");
  const lowerQuery = query.toLowerCase();

  // Filter contentData based on the title match (case-insensitive)
  const filteredResults = contentData.filter((item) =>
    item.title.toLowerCase().includes(lowerQuery)
  );
  
  // Build the results list using DOM methods for better event handling
  searchResultsContainer.innerHTML = ""; // Clear previous results
  const ul = document.createElement("ul");

  if (filteredResults.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No results found.";
    li.classList.add("no-result");
    ul.appendChild(li);
  } else {
    filteredResults.forEach((result) => {
      const li = document.createElement("li");
      li.className = "search-result-item";
      
      // Generate dynamic link with query parameters
      const link = `/content-page.html?title=${encodeURIComponent(result.title)}&folderid=${encodeURIComponent(result.folderid)}`;
      li.onclick = function () {
        window.location.href = link;
      };
      
      // Create and append thumbnail image
      const img = document.createElement("img");
      img.src = result.image;
      img.alt = result.title;
      img.className = "result-image";
      li.appendChild(img);
      
      // Create and append title text
      const span = document.createElement("span");
      span.className = "result-title";
      span.textContent = result.title;
      li.appendChild(span);
      
      ul.appendChild(li);
    });
  }
  searchResultsContainer.appendChild(ul);
}

// Generate the main movie grid with clickable thumbnails
function generateMovieGrid() {
  const movieGrid = document.getElementById("movie-grid");
  contentData.forEach((content) => {
    // Create thumbnail image for the grid
    const movieThumbnail = document.createElement("img");
    movieThumbnail.src = content.image;
    movieThumbnail.alt = content.title;
    movieThumbnail.className = "thumbnail";
    
    // Generate dynamic link for content-page.html with query parameters
    const link = `/content-page.html?title=${encodeURIComponent(content.title)}&folderid=${encodeURIComponent(content.folderid)}`;
    movieThumbnail.onclick = () => {
      window.location.href = link;
    };

    movieGrid.appendChild(movieThumbnail);
  });
}

// Initialize the movie grid on page load
document.addEventListener("DOMContentLoaded", generateMovieGrid);
