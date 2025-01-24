// Function to get meta tag content by name
function getMetaTagContent(name) {
  const metaTag = document.querySelector(`meta[name="${name}"]`);
  return metaTag ? metaTag.getAttribute("content") : null;
}

// Get API Key and Folder ID from meta tags
const API_KEY = getMetaTagContent("api-key");
const FOLDER_ID = getMetaTagContent("folder-id");

// Validate meta tag values
if (!API_KEY || !FOLDER_ID) {
  console.error("API Key or Folder ID is missing in meta tags.");
}

// Title placeholder replacement
const title = document.querySelector('meta[name="title"]')?.content || "Default Title";
document.querySelectorAll("*").forEach((el) => {
  if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
    el.textContent = el.textContent.replace(/{title}/g, title);
  }
});

// Global variables
let episodes = []; // Store fetched episodes
let currentEpisodeIndex = 0; // Track the currently playing episode

// Function to fetch and sort files from Google Drive folder
async function fetchEpisodes() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(name,id)`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // Sort files numerically based on their names in descending order
    const sortedFiles = data.files.sort((a, b) => {
      const numA = parseInt(a.name.match(/\d+/)) || 0;
      const numB = parseInt(b.name.match(/\d+/)) || 0;
      return numB - numA;
    });

    return sortedFiles.map((file, index) => ({
      title: `Episode ${sortedFiles.length - index}`, // Assign "Episode 1" to the last file
      link: `https://drive.google.com/file/d/${file.id}/preview`,
    }));
  } catch (error) {
    console.error("Failed to fetch episodes:", error.message);
    return [];
  }
}

// Function to generate the episode list
async function generateEpisodeList() {
  const episodeListContainer = document.getElementById("episode-list");
  episodeListContainer.innerHTML = `<p>Loading episodes...</p>`; // Show loading indicator

  episodes = await fetchEpisodes(); // Fetch episodes

  

  // Clear loading indicator
  episodeListContainer.innerHTML = "";

  // Reverse episodes for display
  const reversedEpisodes = episodes.reverse();

  reversedEpisodes.forEach((episode) => {
    const episodeElement = document.createElement("div");
    episodeElement.classList.add("episode");

    episodeElement.innerHTML = `
      <i class="fas fa-play play-icon"></i>
      <span class="episode-title">${episode.title}</span>
      <i class="fas fa-chevron-right"></i>
    `;

    episodeElement.onclick = () => playEpisode(episode.title, episode.link, episodeElement);
    episodeListContainer.appendChild(episodeElement);
  });

  // Automatically play the first episode
  const firstEpisode = reversedEpisodes[0];
  const firstEpisodeElement = episodeListContainer.querySelector(".episode");
  playEpisode(firstEpisode.title, firstEpisode.link, firstEpisodeElement);
}

// Function to play an episode
function playEpisode(title, url, episodeElement) {
  // Get all episodes and reset play icons
  const allEpisodes = document.querySelectorAll(".episode");
  allEpisodes.forEach((episode) => {
    const playIcon = episode.querySelector(".play-icon");
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
  });

  // Set the play icon to pause for the selected episode
  const playIcon = episodeElement.querySelector(".play-icon");
  playIcon.classList.remove("fa-play");
  playIcon.classList.add("fa-pause");

  // Play the video in the player
  const player = document.getElementById("video-player");
  player.innerHTML = `<iframe width="100%" height="100%" src="${url}" frameborder="0" allowfullscreen></iframe>`;
  console.log("Playing:", title, url);

  // Display the episode name below the video player
  const playedEpisodeName = document.getElementById("played-episode-name");
  playedEpisodeName.innerHTML = `<span>${title}</span>`;

  // Update the current episode index
  currentEpisodeIndex = episodes.findIndex((ep) => ep.title === title);

  // Scroll to the video player
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Handle the "Next" button functionality
document.querySelector(".next-btn").addEventListener("click", () => {
  if (currentEpisodeIndex + 1 < episodes.length) {
    const nextEpisode = episodes[currentEpisodeIndex + 1];
    const episodeElements = document.querySelectorAll(".episode");
    const nextEpisodeElement = episodeElements[currentEpisodeIndex + 1];
    playEpisode(nextEpisode.title, nextEpisode.link, nextEpisodeElement);
  } else {
    alert("No more episodes to play!");
  }
});

// Function to navigate to the home page


// Initialize the episode list
generateEpisodeList();
