let startX, startY, overlay, selectionBox;

function createOverlay() {
  // Prevent duplicates
  if (document.getElementById('snapclip-overlay')) return;

  overlay = document.createElement('div');
  overlay.id = 'snapclip-overlay';
  document.body.appendChild(overlay);

  overlay.addEventListener('mousedown', startSelection);
  document.addEventListener('mousemove', resizeSelection);
  document.addEventListener('mouseup', endSelection);
}

function startSelection(e) {
  startX = e.clientX;
  startY = e.clientY;

  selectionBox = document.createElement('div');
  selectionBox.className = 'snapclip-box';
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  overlay.appendChild(selectionBox);
}

function resizeSelection(e) {
  if (!selectionBox) return;

  const width = Math.abs(e.clientX - startX);
  const height = Math.abs(e.clientY - startY);
  const left = Math.min(e.clientX, startX);
  const top = Math.min(e.clientY, startY);

  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
  selectionBox.style.left = `${left}px`;
  selectionBox.style.top = `${top}px`;
}

function endSelection(e) {
  if (!selectionBox) return;

  showActionButtons();
  document.removeEventListener('mousemove', resizeSelection);
  document.removeEventListener('mouseup', endSelection);

  // Click-away dismiss
  setTimeout(() => {
    document.addEventListener('click', dismissOverlay);
  }, 0);
}

function showActionButtons() {
  const btnContainer = document.createElement('div');
  btnContainer.className = 'snapclip-buttons';

  const saveBtn = document.createElement('button');
  saveBtn.innerText = 'Save';
  saveBtn.onclick = () => alert('Save clicked!');

  const copyBtn = document.createElement('button');
  copyBtn.innerText = 'Copy';
  copyBtn.onclick = () => alert('Copy clicked!');

  btnContainer.appendChild(saveBtn);
  btnContainer.appendChild(copyBtn);
  selectionBox.appendChild(btnContainer);
}

function dismissOverlay(e) {
  if (!e.target.closest('.snapclip-box') && !e.target.closest('.snapclip-buttons')) {
    overlay.remove();
    document.removeEventListener('click', dismissOverlay);
  }
}

// Listen for extension trigger
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startOverlay') {
    createOverlay();
  }
});
