// content.js

// Responsible for video play, pause, close functionality


// Handle text selection on the page
document.addEventListener('mouseup', handleTextSelection);

function handleTextSelection() {
  try {
    const selectedText = window.getSelection().toString().trim().toLowerCase();
    if (selectedText.length > 0) {
      showMediaPopup(selectedText);
    } else {
      hideMediaPopup(); // Hide the pop-up if no text is selected
    }
  } catch (err) {
    console.error('Error handling text selection:', err);
  }
}

function showMediaPopup(selectedText) {
  if (typeof chrome.runtime === 'undefined' || typeof chrome.runtime.getURL !== 'function') {
    console.error('chrome.runtime.getURL is not available');
    return;
  }

  fetch(chrome.runtime.getURL('mediaMap.json'))
    .then(response => response.json())
    .then(mediaMap => {
      const videoSrc = mediaMap[selectedText];
      if (!videoSrc) {
        return; // Exit if no matching video
      }

      // Remove any existing pop-up
      hideMediaPopup();

      let mediaPopup = document.createElement('div');
      mediaPopup.id = 'media-popup';
      mediaPopup.style.position = 'fixed';
      mediaPopup.style.top = 'calc(50% - 120px)'; // Center vertically
      mediaPopup.style.left = 'calc(50% - 160px)'; // Center horizontally
      mediaPopup.style.width = '320px';
      mediaPopup.style.height = '240px';
      mediaPopup.style.backgroundColor = '#333';
      mediaPopup.style.color = '#fff';
      mediaPopup.style.zIndex = 10000;
      mediaPopup.style.borderRadius = '8px';
      mediaPopup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
      mediaPopup.style.padding = '10px';
      mediaPopup.style.cursor = 'move'; // Make the whole window draggable
      mediaPopup.style.display = 'flex';
      mediaPopup.style.flexDirection = 'column';
      mediaPopup.style.alignItems = 'center';
      mediaPopup.style.justifyContent = 'center';

      // Create a close button
      let closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.marginBottom = '10px';
      closeButton.style.backgroundColor = '#f44336';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '4px';
      closeButton.style.padding = '10px 20px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = hideMediaPopup;

      let videoElement = document.createElement('video');
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.controls = true;
      videoElement.src = chrome.runtime.getURL(videoSrc);
      videoElement.autoplay = true;

      mediaPopup.appendChild(closeButton);
      mediaPopup.appendChild(videoElement);
      document.body.appendChild(mediaPopup);

      // Make the pop-up draggable
      dragElement(mediaPopup);
    })
    .catch(err => console.error('Failed to load media map:', err));
}

function hideMediaPopup() {
  const mediaPopup = document.getElementById('media-popup');
  if (mediaPopup) {
    mediaPopup.remove();
  }
}

function dragElement(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  // Function to handle the drag when mouse is down on the element
  element.onmousedown = function(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  };

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
