document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('extensionToggle');

    //CHAT GPT WAS UTILIZED TO CREATE THE FOLLOWING SCRIPT..
    // Hassan, I did not create this...



    // Retrieve the current state from storage
    chrome.storage.sync.get(['videoPopupEnabled'], (result) => {
      toggle.checked = result.videoPopupEnabled || false;
    });
  
    // Listen for changes to the toggle button
    toggle.addEventListener('change', (event) => {
      chrome.storage.sync.set({ videoPopupEnabled: event.target.checked });
    });
  });
  