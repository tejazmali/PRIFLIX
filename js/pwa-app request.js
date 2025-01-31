let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default mini-infobar from appearing
  e.preventDefault();
  // Save the event for triggering later
  deferredPrompt = e;

  // Show your custom install button
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  // Add a click event to trigger the install prompt
  installButton.addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's choice
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
      installButton.style.display = 'none'; // Hide the install button after interaction
    });
  });
});

