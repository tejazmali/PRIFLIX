document.addEventListener("DOMContentLoaded", function () {
  let headerLoaded = false;
  let footerLoaded = false;

  // Function to reset the loader and progress bar
  function resetLoader() {
    const progressBar = document.querySelector(".progress-bar");
    progressBar.style.width = "0%"; // Reset progress bar width
    progressBar.style.animation = "none"; // Stop animation
    document.body.classList.remove("loaded"); // Show loader
    document.getElementById("content").style.display = "none"; // Hide content
  }

  // Function to complete loading and show content
  function completeLoading() {
    document.body.classList.add("loaded");
    document.getElementById("content").style.display = "block";
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.width = "100%"; // Fill the progress bar
    }
  }

  // Load header
  fetch("/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
      initializeMenuToggle(); // Ensure menu toggle works
      headerLoaded = true;
      checkAllContentLoaded();
    });

  // Load footer
  fetch("/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
      footerLoaded = true;
      checkAllContentLoaded();
    });

  // Check if header and footer are loaded
  function checkAllContentLoaded() {
    if (headerLoaded && footerLoaded) {
      completeLoading();
    }
  }

  // Start the progress bar
  function startProgressBar() {
    resetLoader(); // Reset loader
    const progressBar = document.querySelector(".progress-bar");
    progressBar.style.animation = "progressAnimation 1s linear forwards";
  }

  // Handle navigation or redirection
  function handleNavigation(event) {
    startProgressBar();
  }

  // Listen for beforeunload for navigation away
  window.addEventListener("beforeunload", handleNavigation);

  // For single-page apps or dynamic links
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      startProgressBar();
    });
  });

  // Handle browser back/forward navigation
  window.addEventListener("popstate", () => {
    resetLoader(); // Reset loader on back/forward navigation
    setTimeout(() => {
      headerLoaded = false;
      footerLoaded = false;

      // Force re-fetch of header and footer
      fetch("/header.html")
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("header").innerHTML = data;
          initializeMenuToggle();
          headerLoaded = true;
          checkAllContentLoaded();
        });

      fetch("/footer.html")
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("footer").innerHTML = data;
          footerLoaded = true;
          checkAllContentLoaded();
        });
    }, 100); // Small delay to simulate the reload
  });

  // Page load completion fallback
  window.addEventListener("load", () => {
    completeLoading();
  });
});


// Toggle the clear button and search results container based on input content
function toggleClearButton() {
  const queryInput = document.getElementById('query');
  const clearBtn = document.getElementById('clear-btn');
  const searchResultsContainer = document.getElementById('search-results-container');
  const query = queryInput.value.trim();

  if (query.length > 0) {
    clearBtn.style.display = 'block';
    searchResultsContainer.style.display = 'block';
    updateSearchResults(query);
  } else {
    clearBtn.style.display = 'none';
    searchResultsContainer.style.display = 'none';
  }
}

// Clear the search input and hide the clear button and search results
function clearSearch() {
  const queryInput = document.getElementById('query');
  queryInput.value = '';
  queryInput.focus();
  toggleClearButton();
}

// Update the search results container by filtering data from contentData
function updateSearchResults(query) {
  const searchResultsContainer = document.getElementById('search-results-container');
  const lowerQuery = query.toLowerCase();

  // Filter contentData based on the title match (case-insensitive)
  const filteredResults = contentData.filter(item =>
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
    filteredResults.forEach(result => {
      const li = document.createElement("li");
      li.className = "search-result-item";
      
      // Generate dynamic link with query parameters
      const link = `/content-page.html?title=${encodeURIComponent(result.title)}&folderid=${encodeURIComponent(result.folderid)}`;
      li.onclick = function() {
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
