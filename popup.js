function toWebtoonView(e) {
  chrome.runtime.sendMessage({ action: 'toWebtoonView' });
}

function toPatreonView(e) {
  chrome.runtime.sendMessage({ action: 'toPatreonView' });
}

document.addEventListener('DOMContentLoaded', function () {
  var btn01 = document.querySelector('#btnWebtoonView');
  btn01.addEventListener('click', toWebtoonView);
});

document.addEventListener('DOMContentLoaded', function () {
  var btn01 = document.querySelector('#btnPatreonView');
  btn01.addEventListener('click', toPatreonView);
});
