run(); // 실행부

function run() {
  if (!clickFirstImage()) {
    console.log('동작 실패');
    return;
  }

  let imageSources = [];

  if (!extractImageSources(imageSources)) {
    console.log('동작 실패');
    return;
  }
}

function clickFirstImage() {
  const firstImage = document.querySelector('.sc-6xuyaw-1');

  if (firstImage === null) {
    console.log('첫번째 이미지를 찾을 수 없음');
    return false;
  }

  firstImage.click();

  return true;
}

async function extractImageSources(outImageSources) {
  const btnClose = document.querySelector('[data-tag="close"]');
  const btnNext = document.querySelector('[data-tag="nextImage"]');

  if (btnClose === null) {
    console.log('Close 버튼 못찾음');
    return false;
  }

  if (btnNext === null) {
    console.log('Next 버튼 못찾음');
    return false;
  }

  const pageNumInfoTag = await getPageNum();

  const rtnStrArr = pageNumInfoTag.textContent
    .split('/')
    .map((str) => str.trim());

  const firstNum = rtnStrArr[0];
  const lastPageNum = rtnStrArr[1];

  if (!readImageSources(outImageSources, lastPageNum, btnNext)) {
    console.log('이미지소스 로드 실패');
    return false;
  }

  hideOtherPanels();
  RenderWebtoonView(outImageSources);

  return true;
}

function readImageSources(outImageSources, lastNum, btnNext) {
  for (let index = 0; index < lastNum; index++) {
    const imageTag = document.querySelector('[data-tag="lightboxImage"]');
    const src = imageTag.src;

    outImageSources[index] = src;

    if (index !== lastNum - 1) {
      btnNext.click();
    }
  }

  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getPageNum() {
  await sleep(100); // pageNum 받기위해 0.1초 대기

  return document.querySelector('.fbOLiA');
}

function hideOtherPanels() {
  document.body.childNodes.forEach((ele) => (ele.style.display = 'none'));
}

function RenderWebtoonView(imageSources) {
  document.body.style.overflow = 'auto';
  document.body.style.paddingRight = '0';

  let container = document.createElement('div');
  container.setAttribute('id', 'root-container');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';

  for (let index = 0; index < imageSources.length; index++) {
    const img = new Image();
    img.src = imageSources[index];
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.margin = '0 auto';

    let imgDiv = document.createElement('div');

    imgDiv.setAttribute('id', 'container' + index);
    imgDiv.style.display = 'flex';
    imgDiv.appendChild(img);

    img.style.width = '100%';
    img.style.height = 'auto';

    container.appendChild(imgDiv);
  }

  document.body.appendChild(container);
}
