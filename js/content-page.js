// Function to get meta tag content by name
function getMetaTagContent(name) {
  const metaTag = document.querySelector(`meta[name="${name}"]`);
  return metaTag ? metaTag.getAttribute("content") : null;
}

// Get API Key and Folder ID from meta tags
const API_KEY = getMetaTagContent("api-key");
const FOLDER_ID = getMetaTagContent("folder-id");

console.log(API_KEY, FOLDER_ID); // You can check if they are loaded correctly

// Function to fetch and sort files from Google Drive folder
async function fetchEpisodes() {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(name,id)`
  );
  const data = await response.json();

  // Sort files numerically based on their names in descending order (reverse)
  const sortedFiles = data.files.sort((a, b) => {
    const numA = parseInt(a.name.match(/\d+/)) || 0; // Extract number from name or default to 0
    const numB = parseInt(b.name.match(/\d+/)) || 0;
    return numB - numA; // Descending order
  });

  // Map sorted files to simplified episode names, reversed order
  return sortedFiles.map((file, index) => ({
    title: `Episode ${sortedFiles.length - index}`, // Assign "Episode 1" to the last file, etc.
    link: `https://drive.google.com/file/d/${file.id}/preview`,
  }));
}

// Function to generate the episode list
async function generateEpisodeList() {
  const episodes = await fetchEpisodes();
  const episodeListContainer = document.getElementById("episode-list");

  // Reverse the order of episodes
  const reversedEpisodes = episodes.reverse();

  reversedEpisodes.forEach((episode) => {
    const episodeElement = document.createElement("div");
    episodeElement.classList.add("episode");

    episodeElement.innerHTML = `
      <i class="fas fa-play play-icon"></i>
      <span class="episode-title">${episode.title}</span>
      <i class="fas fa-chevron-right"></i>
    `;

    episodeElement.onclick = () =>
      playEpisode(episode.title, episode.link, episodeElement);
    episodeListContainer.appendChild(episodeElement);
  });

  // Automatically play the first episode
  if (reversedEpisodes.length > 0) {
    const firstEpisode = reversedEpisodes[0];
    const firstEpisodeElement = episodeListContainer.querySelector(".episode");
    playEpisode(firstEpisode.title, firstEpisode.link, firstEpisodeElement);
  }
}

// Function to play an episode
function playEpisode(title, url, episodeElement) {
  // Get all episodes
  const allEpisodes = document.querySelectorAll(".episode");

  // Reset the play icon for all episodes
  allEpisodes.forEach((episode) => {
    const playIcon = episode.querySelector(".play-icon");
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
  });

  // Change the play icon to pause icon for the clicked episode
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

  // Scroll to the video player
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Call the function to generate the episodes
generateEpisodeList();

function goToHome() {
  // Navigate to the homepage
  window.location.href = "/";
}
