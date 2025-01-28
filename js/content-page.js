// Function to get meta tag content by ID
function getMetaTagContentById(id) {
  const metaTag = document.getElementById(id);
  return metaTag ? metaTag.getAttribute("content") : null;
}

// Get API Key and Folder ID from meta tags by ID
const API_KEY = getMetaTagContentById("api-key");
const FOLDER_ID = getMetaTagContentById("folder-id");

// Validate meta tag values
if (!API_KEY || !FOLDER_ID) {
  console.error("API Key or Folder ID is missing in meta tags.");
}

// Title placeholder replacement
const title = document.getElementById("title")?.content || "Default Title";
document.querySelectorAll("*").forEach((el) => {
  if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
    el.textContent = el.textContent.replace(/{title}/g, title);
  }
});

// Global variables
let episodes = []; // Store fetched episodes
let currentEpisodeIndex = 0; // Track the currently playing episode

async function fetchEpisodes() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+name+contains+'E'&key=${API_KEY}&fields=files(name,id)`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.files || data.files.length === 0) {
      console.warn("No files found in the folder.");
      return [];
    }

    // Log filenames for debugging purposes
    console.log("Fetched files:", data.files.map(file => file.name));

    // Sort files numerically based on the episode number
    const sortedFiles = data.files
      .map(file => {
        // Extract episode number using regex
        const match = file.name.match(/(?:S\d+\s)?E(\d+)/i); // Matches "E03" or "S01 E03"
        const episodeNumber = match ? parseInt(match[1]) : null; // Extract episode number or null if not found
        return {
          ...file,
          episodeNumber,
        };
      })
      .filter(file => file.episodeNumber !== null) // Filter out files without a valid episode number
      .sort((a, b) => a.episodeNumber - b.episodeNumber); // Sort by episode number

    if (sortedFiles.length === 0) {
      console.warn("No valid episodes found after processing.");
      return [];
    }

    // Log sorted order for debugging
    console.log("Sorted files:", sortedFiles.map(file => file.name));

    // Assign episode numbers based on the sorted order (before reversing)
    const episodesWithTitles = sortedFiles.map((file, index) => ({
      title: `Episode ${file.episodeNumber}`, // Use the actual episode number
      link: `https://drive.google.com/file/d/${file.id}/preview`,
    }));

    // Reverse the list for display order
    return episodesWithTitles.reverse(); // Reverse for the intended order of display
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
      <i class="fas fa-circle-play play-icon"></i>
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
    playIcon.classList.remove("fa-circle-pause");
    playIcon.classList.add("fa-circle-play");
  });

  // Set the play icon to pause for the selected episode
  const playIcon = episodeElement.querySelector(".play-icon");
  playIcon.classList.remove("fa-circle-play");
  playIcon.classList.add("fa-circle-pause");

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

// Initialize the episode list
generateEpisodeList();

// Fetch the folder ID from the meta tag
const folderId = document.getElementById("folder-id")?.getAttribute("content");
const downloadLink = document.getElementById("download-link");

// Set the download link URL
if (folderId) {
  downloadLink.href = `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
} else {
  console.error("Folder ID is missing!");
}
