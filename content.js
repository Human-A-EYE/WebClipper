console.log("SnapClip content script loaded");
console.log("html2canvas:", typeof html2canvas);
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab.id) return;

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tab.id, { action: 'startOverlay' });
      });
    });
  });
});

