import SplitType from 'split-type';
import anime from 'animejs/lib/anime.es.js';

export class TextLinesReveal {
    constructor(animationElems) {
        this.DOM = {
            animationElems: Array.isArray(animationElems) ? animationElems : [animationElems]
        };

        // array of SplitType instances
        this.SplitTypeInstances = [];
        // array of all HTML .line
        this.lines = [];

        for (const el of this.DOM.animationElems) {
            const SplitTypeInstance = new SplitType(el, { types: 'lines' });
            // wrap the lines (div with class .oh)
            // the inner child will be the one animating the transform
            this.wrapLines(SplitTypeInstance.lines, 'div', 'oh');
            this.lines.push(SplitTypeInstance.lines);
            // keep a reference to the SplitType instance
            this.SplitTypeInstances.push(SplitTypeInstance);
        }

        this.initEvents();
    }
    in(direction) {
        // lines are visible
        this.isVisible = true;

        // animation
        anime.remove(this.lines);
        // gsap.killTweensOf(this.lines);
        return anime.timeline({
            duration: 900,
            easing: 'easeInOutExpo'
        }).add({
            targets: this.lines,
            translateY: ['150%','0%'],
            rotate: ['15deg','0deg'],
            delay: anime.stagger(4, {direction: direction})
        });
        // return gsap.timeline({defaults: {duration: 1.2, ease: 'expo'}})
        // .set(this.lines, {
        //     y: '150%',
        //     rotate: 15
        // })
        // .to(this.lines, {
        //     y: '0%',
        //     rotate: 0,
        //     stagger: 0.04
        // });
    }
    out(direction) {
        // lines are invisiblez
        this.isVisible = false;

        // animation
        anime.remove(this.lines);
        // gsap.killTweensOf(this.lines);
        return anime.timeline({
            duration: 600,
            easing: 'easeInOutExpo'
        }).add({
            targets: this.lines,
            translateY: ['0%','-150%'],
            rotate: ['0deg','-5deg'],
            delay: anime.stagger(3, {direction: direction})
        });
        // return gsap.timeline({
        //     defaults: {duration: 0.7, ease: 'power2'}
        // })
        // .to(this.lines, {
        //     y: '-150%',
        //     rotate: -5,
        //     stagger: 0.02
        // });
    }
    initEvents() {
        window.addEventListener('resize', () => {
            // empty the lines array
            this.lines = [];
            // re initialize the Split Text 
            for (const instance of this.SplitTypeInstances) {
                // re-split text
                // https://github.com/lukePeavey/SplitType#instancesplitoptions-void
                instance.split();

                // need to wrap again the new lines elements (div with class .oh)
                this.wrapLines(instance.lines, 'div', 'oh');
                this.lines.push(instance.lines);
            }
        });
    }
    
    wrapLines(elems, wrapType, wrapClass) {
        elems.forEach(char => {
              // add a wrap for every char (overflow hidden)
              const wrapEl = document.createElement(wrapType);
              wrapEl.classList = wrapClass;
              char.parentNode.appendChild(wrapEl);
              wrapEl.appendChild(char);

              if (this.isVisible) {
                  char.style.transform = '';
              }
          });
      }
    
}