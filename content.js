chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'textHighlighted') {
    chrome.windows.getAll({populate: true}, (windows) => {
      let popupExists = windows.some(window => window.type === 'popup' && window.tabs.some(tab => tab.url.includes('popup.html')));
      if (!popupExists) {
        chrome.windows.create({
          url: chrome.runtime.getURL('popup.html'),
          type: 'popup',
          width: 320,
          height: 240
        });
      }
    });
  }
});
document.addEventListener('mouseup', handleTextSelection);

function handleTextSelection() {
  const selectedText = window.getSelection().toString().trim().toLowerCase();
  if (selectedText.length > 0) {
    showMediaPopup(selectedText);
  } else {
    hideMediaPopup();
  }
}

function showMediaPopup(selectedText) {
  const popup = document.getElementById('media-popup');
  if (popup) {
    return;
  }

  let mediaPopup = document.createElement('div');
  mediaPopup.id = 'media-popup';
  mediaPopup.style.position = 'fixed';
  mediaPopup.style.top = '10px';
  mediaPopup.style.left = '10px';
  mediaPopup.style.width = '320px';
  mediaPopup.style.height = '240px';
  mediaPopup.style.backgroundColor = 'white';
  mediaPopup.style.zIndex = 10000;
  mediaPopup.style.border = '1px solid black';
  mediaPopup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
  mediaPopup.style.padding = '10px';
  mediaPopup.style.cursor = 'move';

  let imgElement = document.createElement('img');
  imgElement.style.width = '100%';
  imgElement.style.height = '100%';

  //
  switch (selectedText) {
    case 'and':
      imgElement.src = chrome.runtime.getURL('Cat.png');
      break;
    case 'the':
      imgElement.src = chrome.runtime.getURL('Video.mp4');
      break;
    case 'is':
      imgElement.src = chrome.runtime.getURL('Turtle.png');
      break;
    default:
      imgElement = null;
  }

  if (imgElement) {
    mediaPopup.appendChild(imgElement);
    document.body.appendChild(mediaPopup);
    dragElement(mediaPopup);
  }
}

function hideMediaPopup() {
  const mediaPopup = document.getElementById('media-popup');
  if (mediaPopup) {
    mediaPopup.remove();
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
