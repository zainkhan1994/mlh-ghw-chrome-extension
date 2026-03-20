document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const titleSpan = document.getElementById('title');
  const urlSpan = document.getElementById('url');
  const saveBtn = document.getElementById('save-btn');
  const historyList = document.getElementById('history');

  titleSpan.innerText = tab.title;
  urlSpan.innerText = tab.url;

  const updateHistory = () => {
    chrome.storage.local.get(['captures'], (data) => {
      const captures = data.captures || [];
      historyList.innerHTML = '';
      captures.slice(-3).reverse().forEach(cap => {
        const li = document.createElement('li');
        li.innerText = cap.title.substring(0, 30) + '...';
        historyList.appendChild(li);
      });
    });
  };

  updateHistory();

  saveBtn.addEventListener('click', () => {
    chrome.storage.local.get(['captures'], (data) => {
      const captures = data.captures || [];
      const newCapture = { title: tab.title, url: tab.url, time: Date.now() };
      captures.push(newCapture);
      chrome.storage.local.set({ captures }, () => {
        document.getElementById('status').innerText = '✅ Saved for evidence!';
        updateHistory();
      });
    });
  });
});
