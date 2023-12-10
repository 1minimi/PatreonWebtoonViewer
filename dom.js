const PAGE_NUM_SELECTOR = '.fbOLiA';

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

  const pageNumInfoTag = await syncGetPageNumEle();

  if (pageNumInfoTag === null) {
    return false;
  }

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

// 비동기 함수: 특정 태그가 등장할 때까지 대기
async function waitForElement() {
  return new Promise((resolve) => {
    const targetElement = document.querySelector(PAGE_NUM_SELECTOR);

    // 태그가 이미 존재하는 경우 즉시 resolve
    if (targetElement) {
      resolve(targetElement);
    } else {
      // MutationObserver를 사용하여 태그 등장을 감지
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const addedNode = mutation.addedNodes[0];

            if (addedNode.querySelector(PAGE_NUM_SELECTOR)) {
              observer.disconnect(); // 태그가 등장하면 observer 중단
              resolve(addedNode);
            }
          }
        });
      });

      // 태그가 등장할 때까지 관찰 시작
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
}

// 동기 코드: 비동기 함수 실행 및 5초 이내에 결과 기다림
async function syncGetPageNumEle() {
  console.log('동기 코드 시작');

  try {
    const result = await Promise.race([
      waitForElement(),
      new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);

    if (result) {
      console.log('태그가 등장했습니다:', result.textContent);
      return result;
    } else {
      console.log('5초 이내에 태그가 등장하지 않았습니다.');
    }
  } catch (error) {
    console.error('에러 발생:', error);
  }

  console.log('동기 코드 종료');
}
