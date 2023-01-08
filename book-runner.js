const rand = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
const nl2br = (str) => {
  return str.replace(/\n/g, '<br />');
}

let currentPage = -1;

const bookEl = document.getElementById('book')
let html = ``

// cover
html += `
  <div class="page cover" id="cover">
    <div class="title"><span class="read">${BOOK.cover.title}</span></div>
    <div class="subtitle"><span class="read">${BOOK.cover.subtitle}</span></div>
    <div class="author"><span class="read">Written by ${BOOK.cover.author}</span></div>
    <div class="illustrator"><span class="read">Illustrations by ${BOOK.cover.illustrator}</span></div>
    <div class="loading-wrapper">
      <div class="loading-indicator"></div>  
    </div>
  </div>
`

BOOK.pages.forEach((page, index) => {
  html += `
    <div class="page" id="page-${index}">
      <div class="image" style="background-image: url(./img/pages/${rand(page.images)});"></div>
      <div class="text ${page.textPosition ? page.textPosition : ''}"><div class="read">${nl2br(page.text)}</div></div>
    </div>
  `
});

html += `
  <div class="page" id="end">
    <div class="end-text"><span class="read">The End</span></div>
  </div>
`

// preload all images
const loadedImages = {};
let numImages = 0;
BOOK.pages.forEach((page) => {
  page.images.forEach((image) => {
    numImages++;
    const img = new Image();
    img.src = `./img/pages/${image}`;
    loadedImages[image] = false;
    img.onload = () => {
      loadedImages[image] = true;
    }
  });
});

bookEl.innerHTML = html;

const coverEl = document.getElementById('cover');
coverEl.style.visibility = 'visible';

const endEl = document.getElementById('end');
endEl.style.visibility = 'hidden';

const hidePages = () => {
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => {
    page.style.visibility = 'hidden';
  });
};

const htmlToReadableText = (html) => {
  let r = html.replace(/(<br[^>]*>)/ig, '\n');
  r.replace(/,/g, ' ');
  return r
}

const loadingWrapperEl = document.querySelector('.loading-wrapper');
const loadingIndicatorEl = document.querySelector('.loading-indicator');
let loaded = false

const synth = window.speechSynthesis;
let currentlyReading = false

let currPageEl = coverEl
let prevPageEl = null
let transitioning = false

const doPageTransition = (goFoward) => {
  if (currentPage === 1000) {
    currPageEl = endEl
  } else if (currentPage === -1) {
    currPageEl = coverEl
  } else {
    const pageEl = document.getElementById(`page-${currentPage}`);
    currPageEl = pageEl
  }

  transitioning = true
  if (goFoward) {
    currPageEl.style.visibility = 'visible';
    currPageEl.style.animation = 'circleClipAnimationIn 0.8s ease-out';
    setTimeout(() => {
      if (prevPageEl) prevPageEl.style.visibility = 'hidden';
      currPageEl.style.animation = '';
      transitioning = false
    }, 900);
  } else {
    currPageEl.style.visibility = 'visible';
    if (prevPageEl) prevPageEl.style.animation = 'circleClipAnimationOut 0.8s ease-out';
    setTimeout(() => {
      if (prevPageEl) prevPageEl.style.visibility = 'hidden';
      if (prevPageEl) prevPageEl.style.animation = '';
      transitioning = false
    }, 750);
  }
}

let introShown = false

const isIphone = () => {
  return navigator.platform.toLowerCase().includes('iphone')
}

const isMobile = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

const interactEvent = (event) => {
  if (!loaded) return
  if (transitioning) return
  if (!introShown) return

  const hitMiddle = event.clientX > window.innerWidth / 5 &&
    event.clientX < window.innerWidth - window.innerWidth / 5
  if (hitMiddle) {
    if (currentlyReading) {
      synth.cancel()
    }
    currentlyReading = true;
    const pageText = Array.prototype.slice.call(currPageEl.querySelectorAll('.read'))
      .map((el) => el.innerHTML)
      .join('\n\n');
    const content = htmlToReadableText(pageText);
    const utterThis = new SpeechSynthesisUtterance(content);
    speechSynthesis.speak(utterThis);

    if (isMobile()) {
      Array.prototype.slice.call(currPageEl.querySelectorAll('.text')).forEach((el) => {
        el.style.opacity = 0
      })
    }

    return
  }

  Array.prototype.slice.call(currPageEl.querySelectorAll('.text')).forEach((el) => {
    el.style.opacity = 1
  })

  if (currentlyReading) {
    currentlyReading = false;
    synth.cancel();
  }

  prevPageEl = currPageEl

  const goFoward = event.clientX > window.innerWidth / 2
  if (goFoward) {
    if (currentPage < 1000) {
      currentPage++
      if (currentPage >= BOOK.pages.length) {
        currentPage = 1000;
      }
    } else {
      return
    }
  } else {
    if (currentPage === 1000) {
      currentPage = BOOK.pages.length - 1
    } else if (currentPage > -1) {
      currentPage--
    } else {
      return
    }
  }

  doPageTransition(goFoward)
}

const goToStart = () => {
  hidePages()
  currentPage = -1
  doPageTransition(true)
}

var clickEventType = ((document.ontouchstart !== null) ? 'click' : 'touchend');
window.addEventListener(clickEventType, (event) => {
  const localEvent = clickEventType === 'click' ? event: event.changedTouches[0]
  interactEvent(localEvent)
});

const introEl = document.querySelector('#intro')

window.addEventListener(clickEventType, (event) => {
  if (!introShown) {
    event.stopPropagation()
    introEl.style.display = 'none'
    introShown = true
  }
})

let loadingInterval = null
setInterval(() => {
  let numLoaded = 0;
  Object.keys(loadedImages).forEach((image) => {
    if (loadedImages[image]) {
      numLoaded++;
    }
  });
  loadingIndicatorEl.style.right = `${100 - (numLoaded / numImages) * 100}vw`;
  if (numLoaded === numImages) {
    clearInterval(loadingInterval);
    loadingWrapperEl.style.visibility = 'hidden';
    loaded = true
  }
}, 100);

// watch for start
setInterval(() => {
  if (window.location.hash === '#start') {
    goToStart()
    window.location.hash = ''
  }
}, 50);