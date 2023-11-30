function assa(e) {
  chrome.tabs.executeScript(null, {
    code: "document.querySelector('#main-app-navigation').style.display = 'none';",
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var btn01 = document.querySelector('#btn');
  btn01.addEventListener('click', assa);
});
