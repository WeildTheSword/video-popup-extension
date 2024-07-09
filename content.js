document.addEventListener('mouseup', handleTextSelection);


//Only activates video pop-up if text is selected
// Here we are using an if statement to check if the selected text
// Is greater than 1 element. 
// Of course if text selected is greater than 0,
// We need to tell our program that the user is highlighting text.
// If this conditioni is satisfied, "showVideoPopup" 
// Is activated, creating and allowing the user to see a video.
function handleTextSelection() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    showVideoPopup();
  } else {
    hideVideoPopup(); // nothing will show up if nothign is seelected
  }
}

function showVideoPopup() {
  if (document.getElementById('video-popup')) {
    return; 
// The way that this essentially works is if the text is highlighted
// The video window will stay on the screen
// If the user deselects the text that they want to translate,
// The video window will disappear
  }


  //General structure for container of video window
  let videoPopup = document.createElement('div');
  videoPopup.id = 'video-popup';
  videoPopup.style.position = 'fixed';
  videoPopup.style.top = '10px';
  videoPopup.style.left = '10px';
  videoPopup.style.width = '320px';
  videoPopup.style.height = '240px';
  videoPopup.style.backgroundColor = 'white';
  videoPopup.style.zIndex = 10000;
  videoPopup.style.border = '1px solid black';
  videoPopup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
  videoPopup.style.padding = '10px';
  videoPopup.style.cursor = 'move';
  
  let videoElement = document.createElement('video');
  videoElement.controls = true;
  videoElement.style.width = '100%';
  videoElement.style.height = '100%';
  
  let sourceElement = document.createElement('source');
  sourceElement.src = chrome.runtime.getURL('video.mp4');
  sourceElement.type = 'video/mp4';
  
  videoElement.appendChild(sourceElement);
  videoPopup.appendChild(videoElement);
  
  document.body.appendChild(videoPopup);
  
  dragElement(videoPopup);
}

function hideVideoPopup() {
  const videoPopup = document.getElementById('video-popup');
  if (videoPopup) {
    videoPopup.remove();
  }
}

function dragElement(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
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
