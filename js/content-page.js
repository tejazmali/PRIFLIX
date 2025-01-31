// Function to get meta tag content by ID
function getMetaTagContentById(id) {
  const metaTag = document.getElementById(id);
  return metaTag ? metaTag.getAttribute("content") : null; // Return content if meta tag exists, otherwise null
}

// Function to handle query parameters and extract title and folderid
function getQueryParams() {
  const params = new URLSearchParams(window.location.search); // Parse query parameters from the URL
  return {
    title: params.get("title"), // Get the 'title' parameter
    folderid: params.get("folderid"), // Get the 'folderid' parameter
  };
}

// Function to update the page content based on query parameters
function updateContentPage() {
  const { title: queryTitle, folderid: queryFolderId } = getQueryParams(); // Destructure query parameters

  // Update meta tags with query parameters
  const titleMeta = document.getElementById("title"); // Get the meta tag for title
  const folderidMeta = document.getElementById("folderid"); // Get the meta tag for folderid

  if (queryTitle && titleMeta) {
    titleMeta.content = queryTitle; // Update meta tag content with the title from query parameters
    document.title = `${queryTitle} - Priflix`; // Update the page title
  }

  if (queryFolderId && folderidMeta) {
    folderidMeta.content = queryFolderId; // Update meta tag content with the folderid from query parameters
  }

  // Update displayed title and {title} placeholders in the DOM
  const title = titleMeta?.content || "Default Title"; // Use the meta tag content or a default title
  document.querySelector(".content-name").textContent = title; // Update the content name in the DOM
  document.querySelectorAll("*").forEach((el) => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
      el.textContent = el.textContent.replace(/{title}/g, title); // Replace {title} placeholders with the actual title
    }
  });
}

// Update content from query parameters before initializing
updateContentPage();

// Get API Key and Folder ID from updated meta tags
const API_KEY = getMetaTagContentById("api-key"); // Retrieve API key from meta tag
const FOLDER_ID = getMetaTagContentById("folderid"); // Retrieve folder ID from meta tag

// Validate meta tag values
if (!API_KEY || !FOLDER_ID) {
  console.error("API Key or Folder ID is missing in meta tags."); // Log an error if either is missing
}

// Global variables
let episodes = []; // Store fetched episodes
let currentEpisodeIndex = 0; // Track the currently playing episode

// Function to fetch episodes from Google Drive
async function fetchEpisodes() {
  try {
    // Fetch files from Google Drive API
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+name+contains+'E'&key=${API_KEY}&fields=files(name,id)`
    );

    if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`); // Handle HTTP errors

    const data = await response.json(); // Parse response JSON
    if (!data.files?.length) {
      console.warn("No files found in the folder."); // Log a warning if no files are found
      return [];
    }

    // Process and sort files
    const sortedFiles = data.files
      .map((file) => {
        const match = file.name.match(/(?:S\d+\s)?E(\d+)/i); // Extract episode number from file name
        return { ...file, episodeNumber: match ? parseInt(match[1]) : null }; // Add episodeNumber property
      })
      .filter((file) => file.episodeNumber !== null) // Filter out files without valid episode numbers
      .sort((a, b) => a.episodeNumber - b.episodeNumber); // Sort files by episode number in ascending order

    if (sortedFiles.length === 0) {
      console.warn("No valid episodes found."); // Log a warning if no valid episodes are found
      return [];
    }

    // Create episodes list in ascending order
    return sortedFiles.map((file) => ({
      title: `Episode ${file.episodeNumber}`, // Set episode title
      link: `https://drive.google.com/file/d/${file.id}/preview`, // Set episode preview link
    }));
  } catch (error) {
    console.error("Failed to fetch episodes:", error.message); // Log any errors during fetching
    return [];
  }
}

// Function to generate and display the episode list
// Function to generate and display the episode list
async function generateEpisodeList() {
  const episodeListContainer = document.getElementById("episode-list");
  const nextButton = document.querySelector(".next-btn");
  const playedEpisodeName = document.getElementById("played-episode-name"); // Get the played episode name element

  episodeListContainer.innerHTML = `<p>Loading episodes...</p>`;
  episodes = await fetchEpisodes();
  episodeListContainer.innerHTML = "";

  if (episodes.length === 1) {
    episodeListContainer.style.visibility = "hidden";
    nextButton.style.display = "none";
    playedEpisodeName.style.display = "none"; // Hide the played episode name
    playEpisode(episodes[0].title, episodes[0].link);
    return;
  }

  if (episodes.length === 0) {
    episodeListContainer.innerHTML = `<p>No episodes available.</p>`;
    return;
  }

  playedEpisodeName.style.display = "block"; // Ensure it is visible when there are multiple episodes

  episodes.forEach((episode, index) => {
    const episodeElement = document.createElement("div");
    episodeElement.classList.add("episode");
    episodeElement.innerHTML = `
      <i class="fas fa-circle-play play-icon"></i>
      <span class="episode-title">${episode.title}</span>
      <i class="fas fa-chevron-right"></i>
    `;
    episodeElement.onclick = () => playEpisode(episode.title, episode.link, episodeElement);
    episodeListContainer.appendChild(episodeElement);
  });

  if (episodes.length > 0) {
    playEpisode(episodes[0].title, episodes[0].link, episodeListContainer.querySelector(".episode"));
  }
}



// Function to play an episode
function playEpisode(title, url, episodeElement) {
  // Reset play icons for all episodes
  document.querySelectorAll(".episode").forEach((ep) => {
    ep.querySelector(".play-icon").classList.replace("fa-circle-pause", "fa-circle-play");
  });

  // Set the clicked episode's icon to "pause"
  if (episodeElement) {
    episodeElement.querySelector(".play-icon").classList.replace("fa-circle-play", "fa-circle-pause");
  }

  // Update the video player with the selected episode
  const player = document.getElementById("video-player");
  player.innerHTML = `<iframe width="100%" height="100%" src="${url}" frameborder="0" allowfullscreen></iframe>`;
  console.log("Playing:", title, url);

  // Display the episode name below the video player
  const playedEpisodeName = document.getElementById("played-episode-name");
  playedEpisodeName.innerHTML = `<span>${title}</span>`;

  // Update the current episode index
  currentEpisodeIndex = episodes.findIndex((ep) => ep.title === title);
  window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
}

// Next episode functionality
document.querySelector(".next-btn").addEventListener("click", () => {
  if (currentEpisodeIndex + 1 < episodes.length) {
    const nextEpisode = episodes[currentEpisodeIndex + 1]; // Get the next episode
    const nextElement = document.querySelectorAll(".episode")[currentEpisodeIndex + 1]; // Get the next episode element
    playEpisode(nextEpisode.title, nextEpisode.link, nextElement); // Play the next episode
  } else {
    alert("No more episodes!"); // Alert if there are no more episodes
  }
});

// Initialize app by generating the episode list
generateEpisodeList();

// Set download link for the folder
const downloadLink = document.getElementById("download-link");
if (FOLDER_ID) {
  downloadLink.href = `https://drive.google.com/drive/folders/${FOLDER_ID}?usp=sharing`; // Set the download link
} else {
  console.error("Folder ID is missing!"); // Log an error if Folder ID is missing
}
