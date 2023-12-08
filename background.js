chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'toWebtoonView') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      console.log('tabs' + tabs);
      console.log('tabs' + tabs === null);
      console.log('activeTab:' + activeTab);
      // 디버깅하면 tabs가 제대로 안넘어옴, (단 동작은 제대로함)
      // manifest에 contentscript 넣어서 자동 inject될 때만 디버깅 했을 때 제대로 넘어오는거 같음
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        // function: 대신 files: "dom.js"와 같이 파일로 뺄 수도 있다.
        files: ['dom.js'],
      });
    });
  } else if (request.action === 'toPatreonView') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.goBack(tabs[0].id);
    });
  }
});
