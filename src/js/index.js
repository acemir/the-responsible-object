import "../scss/main.scss";

import anime from 'animejs/lib/anime.es.js';

// import Xwiper from 'xwiper';
import { debounce } from "debounce";

// const xwiper = new Xwiper('main');

// xwiper.onSwipeLeft(() => console.log('swipe left'));

// xwiper.onSwipeRight(() => console.log('swipe right'));

// xwiper.onSwipeUp(() => console.log('swipe up'));

// xwiper.onSwipeDown(() => console.log('swipe down'));

// xwiper.onTap(() => console.log('tap'));

// // Remove listener
// xwiper.destroy();


// window.addEventListener('wheel', debounce(function(e) {
//     console.log(e);
// },150))

// START IN HASH
window.history.scrollRestoration = 'manual';
const defaultChapter = '#introduction';
let $activeChapter = window.location.hash && document.querySelector(window.location.hash);
if (!$activeChapter) {
    if (window.history.replaceState) {
        // IE10, Firefox, Chrome, etc.
        window.history.replaceState(null, null, defaultChapter);
    } else {
        // IE9, IE8, etc
        window.location.hash = defaultChapter;
    }
    $activeChapter = document.querySelector(window.location.hash);
}

let $activeScreen = $activeChapter.querySelector('.screen-1');
$activeChapter.classList.add('is-active');
$activeScreen.classList.add('is-active');

let $topbar = document.querySelector('.topbar');
let $nav = $topbar.querySelector('nav');
$nav.querySelector('[href="'+ window.location.hash +'"]').classList.add('is-active');

let $navAchors = $nav.querySelectorAll('[href]');

function topbarScrollHandler(e) {
    $topbar.classList.remove('is-sticky');
    document.removeEventListener('scroll', topbarScrollHandler);
}
document.addEventListener('scroll', topbarScrollHandler);

let allowNavPrev = false;
let allowNavNext = false;
let isNavTransition = false;

function screenScrollHandler(e) {
    allowNavPrev = window.scrollY == 0;
    allowNavNext = (window.innerHeight + window.scrollY) >= document.body.scrollHeight;
}
document.addEventListener('scroll', screenScrollHandler);
screenScrollHandler();

function screenWheelNavHandler(e) {
    if (!isNavTransition && allowNavPrev && e.deltaY < 0) {
        if ($activeScreen.previousElementSibling) {
            screenNavigatePrev()
        } else if ($activeChapter.previousElementSibling) {
            screenNavigatePrev(true)
        }
    } else if (!isNavTransition && allowNavNext && e.deltaY > 0) {
        if ($activeScreen.nextElementSibling) {
            screenNavigateNext();
        } else if ($activeChapter.nextElementSibling) {
            screenNavigateNext(true);
        }
    }
}
document.addEventListener('wheel', debounce(screenWheelNavHandler, 150, true));

function screenNavigateNext(withChapter) {
    isNavTransition = true;

    const $screenToShow = withChapter ? $activeChapter.nextElementSibling.children[0] : $activeScreen.nextElementSibling;
    
    $activeScreen.classList.add('is-hidding--next');
    const timeline = anime.timeline({
        duration: 800,
        easing: 'easeInOutExpo'
    });
    timeline.add({
        targets: $activeScreen,
        clipPath: ['inset(0 0 0px 0)', 'inset(0 0 '+ window.innerHeight + 'px 0)'],
        begin: function(anim) {
            // console.log('begin anim 1')
        },
        complete: function(anim) {
            $activeScreen.classList.remove('is-active','is-hidding--next');
            withChapter && $activeChapter.classList.remove('is-active');
            $activeScreen.style.clipPath = '';
            // console.log('complete anim 1')
        }
    }).add({
        targets: $screenToShow,
        clipPath: ['inset('+ window.innerHeight +'px 0 0 0)', 'inset(0px 0 0 0)'],
        begin: function(anim) {
            withChapter && $activeChapter.nextElementSibling.classList.add('is-active');
            $screenToShow.classList.add('is-active','is-showing--next');
            // console.log('begin anim 2')
        },
        complete: function(anim) {
            $screenToShow.classList.remove('is-showing--next');
            $activeScreen.style.clipPath = '';
            $activeScreen = $screenToShow;
            if (withChapter) {
                $activeChapter = $activeChapter.nextElementSibling;
                updateNavActive();
                updateWindowHash();
            }
            screenScrollHandler();
            isNavTransition = false;
            // console.log('complete anim 2')
        }
    }, '-=400');
}

function screenNavigatePrev(withChapter) {
    isNavTransition = true;

    const $screenToShow = withChapter ? $activeChapter.previousElementSibling.children[$activeChapter.previousElementSibling.children.length - 1] : $activeScreen.previousElementSibling;
    
    $activeScreen.classList.add('is-hidding--prev');
    const timeline = anime.timeline({
        duration: 800,
        easing: 'easeInOutExpo'
    });
    timeline.add({
        targets: $activeScreen,
        clipPath: ['inset(0px 0 0 0)', 'inset('+ window.innerHeight +'px 0 0 0)'],
        begin: function(anim) {
            // console.log('begin anim 1')
        },
        complete: function(anim) {
            $activeScreen.classList.remove('is-active','is-hidding--prev');
            withChapter && $activeChapter.classList.remove('is-active');
            $activeScreen.style.clipPath = '';
        }
    }).add({
        targets: $screenToShow,
        clipPath: ['inset(0 0 '+ window.innerHeight + 'px 0)', 'inset(0 0 0px 0)'],
        begin: function(anim) {
            withChapter && $activeChapter.previousElementSibling.classList.add('is-active');
            $screenToShow.classList.add('is-active','is-showing--prev');
        },
        complete: function(anim) {
            $screenToShow.classList.remove('is-showing--prev');
            document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
            $activeScreen.style.clipPath = '';
            $activeScreen = $screenToShow;
            if (withChapter) {
                $activeChapter = $activeChapter.previousElementSibling;
                updateNavActive();
                updateWindowHash();
            }
            screenScrollHandler();
            isNavTransition = false;
            // console.log('complete anim 2')
        }
    }, '-=600');
}

window.addEventListener('hashchange', function(e) {
    let $chapterToShow = window.location.hash && document.querySelector(window.location.hash);
    if ($chapterToShow) {
        isNavTransition = true;
        let $screenToShow = $chapterToShow.children[0];
        const timeline = anime.timeline({
            duration: 800,
            easing: 'easeInOutExpo'
        });
        timeline.add({
            targets: $activeScreen,
            clipPath: ['inset(0 0% 0 0)', 'inset(0 100% 0 0)'],
            begin: function(anim) {
                // console.log('begin anim 1')
            },
            complete: function(anim) {
                $activeChapter.classList.remove('is-active');
                $activeScreen.classList.remove('is-active');
                $activeScreen.style.clipPath = '';
            }
        }).add({
            targets: $screenToShow,
            clipPath: ['inset(0 0 0 100%)', 'inset(0 0 0 0%)'],
            begin: function(anim) {
                $chapterToShow.classList.add('is-active');
                $screenToShow.classList.add('is-active','is-showing--next');
                // console.log('begin anim 2')
            },
            complete: function(anim) {
                $screenToShow.classList.remove('is-showing--next');
                $activeChapter = $chapterToShow;
                $activeScreen = $screenToShow;
                updateNavActive();
                screenScrollHandler();
                isNavTransition = false;
                // console.log('complete anim 2')
            }
        }, '-=400')
    }
  }, false);

function updateNavActive() {
    for(let i=0; i < $navAchors.length; i++) { 
        // console.log($navAchors[i].hash, '#' + $activeChapter.id );
        if ($navAchors[i].hash == '#' + $activeChapter.id) {
            $navAchors[i].classList.add('is-active');
        } else {
            $navAchors[i].classList.remove('is-active');
        }
    }
}

function updateWindowHash() {
    if (window.history.pushState) {
        // IE10, Firefox, Chrome, etc.
        window.history.pushState(null, null, '#' + $activeChapter.id);
    } else {
        // IE9, IE8, etc
        window.location.hash = '#' + $activeChapter.id;
    }
}