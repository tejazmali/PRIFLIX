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


(function () {
  const version = localStorage.getItem("cache_version") || new Date().getTime();
  localStorage.setItem("cache_version", version);

  document.querySelectorAll("script[src], link[rel='stylesheet']").forEach((el) => {
    let src = el.getAttribute("src") || el.getAttribute("href");
    if (src) {
      el.setAttribute(
        el.tagName === "SCRIPT" ? "src" : "href",
        src.split("?")[0] + "?v=" + version
      );
    }
  });

  // Uncomment below to force a hard reload (use with caution)
  //location.reload(true);
})();