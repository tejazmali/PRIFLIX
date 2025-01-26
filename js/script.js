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
   document.addEventListener('DOMContentLoaded', function() {
  const progressBar = document.querySelector('.progress-bar span');
  let progress = 0;

  const interval = setInterval(function() {
    progress += 5; // Increase the progress by 5% every 100ms
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      document.body.classList.add('loaded'); // Content is loaded, hide the loader
    }
  }, 100);
});
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  document.getElementById("content").style.display = "block";
});
