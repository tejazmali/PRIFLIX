document.addEventListener("DOMContentLoaded", function () {
  // Load header
  fetch("/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
      initializeMenuToggle(); // Ensure toggle works after loading
    });

  // Load footer
  fetch("/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    });

 
});
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  document.getElementById("content").style.display = "block";
});
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  document.getElementById("content").style.display = "block";
  const progressBar = document.querySelector(".progress-bar");
  progressBar.style.width = "100%"; // Set width to 100% after content is loaded
});
