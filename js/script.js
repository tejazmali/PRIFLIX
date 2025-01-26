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
document.addEventListener("DOMContentLoaded", function () {
  const progressBar = document.querySelector('.progress-bar span');
  const loaderOverlay = document.querySelector('.loader-overlay');

  // Show loader when navigating away from the page
  window.addEventListener('beforeunload', function (event) {
    loaderOverlay.style.opacity = 1;
    loaderOverlay.style.visibility = 'visible';

    let progress = 0;
    let speed = 100;  // Initial slow speed

    // Dynamic progress filling
    const interval = setInterval(function () {
      progress += 1;  // Increase progress by 1% per step

      // Adjust the speed based on the progress range
      if (progress <= 30) {
        speed = 100; // Slow speed
      } else if (progress <= 70) {
        speed = 50;  // Moderate speed
      } else {
        speed = 20;  // Fast speed
      }

      progressBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, speed); // Speed changes dynamically as progress increases
  });

  // When the new page is fully loaded
  window.addEventListener('load', function () {
    loaderOverlay.style.opacity = 0;
    loaderOverlay.style.visibility = 'hidden';
    document.getElementById('content').style.opacity = 1; // Show content after load
  });
});
