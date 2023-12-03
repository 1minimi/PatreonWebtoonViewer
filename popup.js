function controlDom(e) {
  chrome.runtime.sendMessage({ action: 'removeNavi' });
}

document.addEventListener('DOMContentLoaded', function () {
  var btn01 = document.querySelector('#btn');
  btn01.addEventListener('click', controlDom);
});
