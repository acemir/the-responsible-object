import "../scss/main.scss";
import anime from 'animejs/lib/anime.es.js';

import Xwiper from 'xwiper';
import { debounce } from "debounce";
import { TextLinesReveal } from "./textLinesReveal";

const xwiper = new Xwiper('main');

window.history.scrollRestoration = 'manual';
const revealChapters = {};
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

let $topbar = document.querySelector('.topbar');
let $nav = $topbar.querySelector('nav');
let $navAchors = $nav.querySelectorAll('[href]');
$nav.querySelector('[href="'+ window.location.hash +'"]').classList.add('is-active');

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

xwiper.onSwipeUp(function(e) {
    if (!isNavTransition && allowNavNext) {
        if ($activeScreen.nextElementSibling) {
            screenNavigateNext();
        } else if ($activeChapter.nextElementSibling) {
            screenNavigateNext(true);
        }
    }
});

xwiper.onSwipeDown(function(e) {
    if (!isNavTransition && allowNavPrev) {
        if ($activeScreen.previousElementSibling) {
            screenNavigatePrev()
        } else if ($activeChapter.previousElementSibling) {
            screenNavigatePrev(true)
        }
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key == 'ArrowUp' || event.key == 'PageUp') {
        if (!isNavTransition && allowNavPrev) {
            if ($activeScreen.previousElementSibling) {
                screenNavigatePrev()
            } else if ($activeChapter.previousElementSibling) {
                screenNavigatePrev(true)
            }
        }
    } else if (event.key == 'ArrowDown' || event.key == 'PageDown') {
        if (!isNavTransition && allowNavNext) {
            if ($activeScreen.nextElementSibling) {
                screenNavigateNext();
            } else if ($activeChapter.nextElementSibling) {
                screenNavigateNext(true);
            }
        }
    }
});

function screenNavigateNext(withChapter) {
    isNavTransition = true;
    
    const $screenToShow = withChapter ? $activeChapter.nextElementSibling.children[0] : $activeScreen.nextElementSibling;
    
    const revealIdToHide = $activeChapter.id + [...$activeScreen.parentElement.children].indexOf($activeScreen);
    const revealIdToShow = (withChapter ? $screenToShow.parentElement.id : $activeChapter.id) + [...$screenToShow.parentElement.children].indexOf($screenToShow);
    
    revealChapters[revealIdToHide].out('reverse');
    
    $activeScreen.classList.add('is-hidding--next');
    const timeline = anime.timeline({
        duration: 800,
        easing: 'easeInOutExpo'
    });
    timeline.add({
        targets: $activeScreen,
        clipPath: ['inset(0 0 0px 0)', 'inset(0 0 '+ window.innerHeight + 'px 0)'],
        begin: function(anim) {
        },
        complete: function(anim) {
            $activeScreen.classList.remove('is-active','is-hidding--next');
            withChapter && $activeChapter.classList.remove('is-active');
            $activeScreen.style.clipPath = '';
        }
    }).add({
        targets: $screenToShow,
        clipPath: ['inset('+ window.innerHeight +'px 0 0 0)', 'inset(0px 0 0 0)'],
        begin: function(anim) {
            withChapter && $screenToShow.parentElement.classList.add('is-active');
            $screenToShow.classList.add('is-active','is-showing--next');
            if (!revealChapters[revealIdToShow]) {
                revealChapters[revealIdToShow] = new TextLinesReveal([...$screenToShow.querySelectorAll('.heading span'),...$screenToShow.querySelectorAll('.content p')]);
            }
            revealChapters[revealIdToShow].in('normal');
        },
        complete: function(anim) {
            $screenToShow.classList.remove('is-showing--next');
            $screenToShow.style.clipPath = '';
            $activeScreen = $screenToShow;
            if (withChapter) {
                $activeChapter = $screenToShow.parentElement;
                updateNavActive();
                updateWindowHash();
            }
            screenScrollHandler();
            isNavTransition = false;
        }
    }, '-=400');
}

function screenNavigatePrev(withChapter) {
    isNavTransition = true;

    const $screenToShow = withChapter ? $activeChapter.previousElementSibling.children[$activeChapter.previousElementSibling.children.length - 1] : $activeScreen.previousElementSibling;
    
    const revealIdToHide = $activeChapter.id + [...$activeScreen.parentElement.children].indexOf($activeScreen);
    const revealIdToShow = (withChapter ? $screenToShow.parentElement.id : $activeChapter.id) + [...$screenToShow.parentElement.children].indexOf($screenToShow);
    
    revealChapters[revealIdToHide].out('normal');

    $activeScreen.classList.add('is-hidding--prev');
    const timeline = anime.timeline({
        duration: 800,
        easing: 'easeInOutExpo'
    });
    timeline.add({
        targets: $activeScreen,
        clipPath: ['inset(0px 0 0 0)', 'inset('+ window.innerHeight +'px 0 0 0)'],
        begin: function(anim) {
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
            withChapter && $screenToShow.parentElement.classList.add('is-active');
            $screenToShow.classList.add('is-active','is-showing--prev');
            if (!revealChapters[revealIdToShow]) {
                revealChapters[revealIdToShow] = new TextLinesReveal([...$screenToShow.querySelectorAll('.heading span'),...$screenToShow.querySelectorAll('.content p')]);
            }
            revealChapters[revealIdToShow].in('reverse');
        },
        complete: function(anim) {
            $screenToShow.classList.remove('is-showing--prev');
            document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
            $screenToShow.style.clipPath = '';
            $activeScreen = $screenToShow;
            if (withChapter) {
                $activeChapter = $screenToShow.parentElement;
                updateNavActive();
                updateWindowHash();
            }
            screenScrollHandler();
            isNavTransition = false;
        }
    }, '-=600');
}

window.addEventListener('hashchange', function(e) {
    let $chapterToShow = window.location.hash && document.querySelector(window.location.hash);
    if ($chapterToShow) {
        isNavTransition = true;
        let $screenToShow = $chapterToShow.children[0];

        const revealIdToHide = $activeChapter.id + [...$activeScreen.parentElement.children].indexOf($activeScreen);
        const revealIdToShow = $screenToShow.parentElement.id + [...$screenToShow.parentElement.children].indexOf($screenToShow);
        
        revealChapters[revealIdToHide].out('normal');

        const timeline = anime.timeline({
            duration: 800,
            easing: 'easeInOutExpo'
        });
        timeline.add({
            targets: $activeScreen,
            clipPath: ['inset(0 0% 0 0)', 'inset(0 100% 0 0)'],
            begin: function(anim) {
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
                if (!revealChapters[revealIdToShow]) {
                    revealChapters[revealIdToShow] = new TextLinesReveal([...$screenToShow.querySelectorAll('.heading span'),...$screenToShow.querySelectorAll('.content p')]);
                }
                revealChapters[revealIdToShow].in('normal');
            },
            complete: function(anim) {
                $screenToShow.classList.remove('is-showing--next');
                $screenToShow.style.clipPath = '';
                $activeChapter = $chapterToShow;
                $activeScreen = $screenToShow;
                updateNavActive();
                screenScrollHandler();
                isNavTransition = false;
            }
        }, '-=400')
    }
  }, false);

function updateNavActive() {
    for(let i=0; i < $navAchors.length; i++) { 
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

document.addEventListener('readystatechange', function(event) {
    if (event.target.readyState === "complete") {
        const revealIdToShow = $activeChapter.id + [...$activeScreen.parentElement.children].indexOf($activeScreen);
        const timeline = anime.timeline({
            duration: 800,
            easing: 'easeInOutExpo'
        });
        timeline.add({
            targets: $activeScreen,
            clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
            begin: function(anim) {
                $activeChapter.classList.add('is-active');
                $activeScreen.classList.add('is-active','is-showing--next');
                revealChapters[revealIdToShow] = new TextLinesReveal([...$activeChapter.querySelectorAll('.heading span'),...$activeChapter.querySelectorAll('.content p')]);
                revealChapters[revealIdToShow].in('normal');
            },
            complete: function(anim) {
                $topbar.classList.add('is-sticky');
                $activeScreen.classList.remove('is-showing--next');
                $activeScreen.style.clipPath = '';
                document.addEventListener('scroll', screenScrollHandler);
                screenScrollHandler();
            }
        })
    }
});