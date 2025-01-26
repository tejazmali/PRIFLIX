document.addEventListener("DOMContentLoaded", function () {
  let headerLoaded = false;
  let footerLoaded = false;

  // Load header
  fetch("/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
      initializeMenuToggle(); // Ensure toggle works after loading
      headerLoaded = true;
      checkAllContentLoaded(); // Check if all content is loaded
    });

  // Load footer
  fetch("/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
      footerLoaded = true;
      checkAllContentLoaded(); // Check if all content is loaded
    });

  // Function to check if both header and footer are loaded
  function checkAllContentLoaded() {
    if (headerLoaded && footerLoaded) {
      document.body.classList.add("loaded"); // Hide loader
      document.getElementById("content").style.display = "block"; // Show content
      const progressBar = document.querySelector(".progress-bar");
      progressBar.style.width = "100%"; // Complete progress bar
    }
  }
});

// Function to start the progress bar
function startProgressBar() {
  const progressBar = document.querySelector(".progress-bar");
  progressBar.style.width = "0%"; // Reset the progress bar
  progressBar.style.animation = "progressAnimation 1s linear forwards";
  document.body.classList.remove("loaded"); // Show the loader
}

// Function to show loader before navigation
function handleNavigation(event) {
  startProgressBar();
}

// Add event listener for navigation or redirection
window.addEventListener("beforeunload", handleNavigation);

// For single-page apps or dynamic navigation
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    startProgressBar();
  });
});

// Page load completion logic
window.addEventListener("load", () => {
  // If no external content is being fetched, fallback to show page
  document.body.classList.add("loaded");
  document.getElementById("content").style.display = "block";
});
