function t(t){return t&&t.__esModule?t.default:t}var e={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},n={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},r=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],i={CSS:{},springs:{}};function o(t,e,n){return Math.min(Math.max(t,e),n)}function a(t,e){return t.indexOf(e)>-1}function s(t,e){return t.apply(null,e)}var u={arr:function(t){return Array.isArray(t)},obj:function(t){return a(Object.prototype.toString.call(t),"Object")},pth:function(t){return u.obj(t)&&t.hasOwnProperty("totalLength")},svg:function(t){return t instanceof SVGElement},inp:function(t){return t instanceof HTMLInputElement},dom:function(t){return t.nodeType||u.svg(t)},str:function(t){return"string"==typeof t},fnc:function(t){return"function"==typeof t},und:function(t){return void 0===t},nil:function(t){return u.und(t)||null===t},hex:function(t){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t)},rgb:function(t){return/^rgb/.test(t)},hsl:function(t){return/^hsl/.test(t)},col:function(t){return u.hex(t)||u.rgb(t)||u.hsl(t)},key:function(t){return!e.hasOwnProperty(t)&&!n.hasOwnProperty(t)&&"targets"!==t&&"keyframes"!==t}};function c(t){var e=/\(([^)]+)\)/.exec(t);return e?e[1].split(",").map((function(t){return parseFloat(t)})):[]}function l(t,e){var n=c(t),r=o(u.und(n[0])?1:n[0],.1,100),a=o(u.und(n[1])?100:n[1],.1,100),s=o(u.und(n[2])?10:n[2],.1,100),l=o(u.und(n[3])?0:n[3],.1,100),d=Math.sqrt(a/r),h=s/(2*Math.sqrt(a*r)),f=h<1?d*Math.sqrt(1-h*h):0,p=h<1?(h*d-l)/f:-l+d;function g(t){var n=e?e*t/1e3:t;return n=h<1?Math.exp(-n*h*d)*(1*Math.cos(f*n)+p*Math.sin(f*n)):(1+p*n)*Math.exp(-n*d),0===t||1===t?t:1-n}return e?g:function(){var e=i.springs[t];if(e)return e;for(var n=1/6,r=0,o=0;;)if(1===g(r+=n)){if(++o>=16)break}else o=0;var a=r*n*1e3;return i.springs[t]=a,a}}function d(t){return void 0===t&&(t=10),function(e){return Math.ceil(o(e,1e-6,1)*t)*(1/t)}}var h,f,p=function(){var t=.1;function e(t,e){return 1-3*e+3*t}function n(t,e){return 3*e-6*t}function r(t){return 3*t}function i(t,i,o){return((e(i,o)*t+n(i,o))*t+r(i))*t}function o(t,i,o){return 3*e(i,o)*t*t+2*n(i,o)*t+r(i)}return function(e,n,r,a){if(0<=e&&e<=1&&0<=r&&r<=1){var s=new Float32Array(11);if(e!==n||r!==a)for(var u=0;u<11;++u)s[u]=i(u*t,e,r);return function(t){return e===n&&r===a||0===t||1===t?t:i(c(t),n,a)}}function c(n){for(var a=0,u=1;10!==u&&s[u]<=n;++u)a+=t;--u;var c=a+(n-s[u])/(s[u+1]-s[u])*t,l=o(c,e,r);return l>=.001?function(t,e,n,r){for(var a=0;a<4;++a){var s=o(e,n,r);if(0===s)return e;e-=(i(e,n,r)-t)/s}return e}(n,c,e,r):0===l?c:function(t,e,n,r,o){var a,s,u=0;do{(a=i(s=e+(n-e)/2,r,o)-t)>0?n=s:e=s}while(Math.abs(a)>1e-7&&++u<10);return s}(n,a,a+t,e,r)}}}(),g=(h={linear:function(){return function(t){return t}}},f={Sine:function(){return function(t){return 1-Math.cos(t*Math.PI/2)}},Circ:function(){return function(t){return 1-Math.sqrt(1-t*t)}},Back:function(){return function(t){return t*t*(3*t-2)}},Bounce:function(){return function(t){for(var e,n=4;t<((e=Math.pow(2,--n))-1)/11;);return 1/Math.pow(4,3-n)-7.5625*Math.pow((3*e-2)/22-t,2)}},Elastic:function(t,e){void 0===t&&(t=1),void 0===e&&(e=.5);var n=o(t,1,10),r=o(e,.1,2);return function(t){return 0===t||1===t?t:-n*Math.pow(2,10*(t-1))*Math.sin((t-1-r/(2*Math.PI)*Math.asin(1/n))*(2*Math.PI)/r)}}},["Quad","Cubic","Quart","Quint","Expo"].forEach((function(t,e){f[t]=function(){return function(t){return Math.pow(t,e+2)}}})),Object.keys(f).forEach((function(t){var e=f[t];h["easeIn"+t]=e,h["easeOut"+t]=function(t,n){return function(r){return 1-e(t,n)(1-r)}},h["easeInOut"+t]=function(t,n){return function(r){return r<.5?e(t,n)(2*r)/2:1-e(t,n)(-2*r+2)/2}},h["easeOutIn"+t]=function(t,n){return function(r){return r<.5?(1-e(t,n)(1-2*r))/2:(e(t,n)(2*r-1)+1)/2}}})),h);function v(t,e){if(u.fnc(t))return t;var n=t.split("(")[0],r=g[n],i=c(t);switch(n){case"spring":return l(t,e);case"cubicBezier":return s(p,i);case"steps":return s(d,i);default:return s(r,i)}}function m(t){try{return document.querySelectorAll(t)}catch(t){return}}function y(t,e){for(var n=t.length,r=arguments.length>=2?arguments[1]:void 0,i=[],o=0;o<n;o++)if(o in t){var a=t[o];e.call(r,a,o,t)&&i.push(a)}return i}function w(t){return t.reduce((function(t,e){return t.concat(u.arr(e)?w(e):e)}),[])}function b(t){return u.arr(t)?t:(u.str(t)&&(t=m(t)||t),t instanceof NodeList||t instanceof HTMLCollection?[].slice.call(t):[t])}function S(t,e){return t.some((function(t){return t===e}))}function E(t){var e={};for(var n in t)e[n]=t[n];return e}function x(t,e){var n=E(t);for(var r in t)n[r]=e.hasOwnProperty(r)?e[r]:t[r];return n}function O(t,e){var n=E(t);for(var r in e)n[r]=u.und(t[r])?e[r]:t[r];return n}function L(t){return u.rgb(t)?(n=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e=t))?"rgba("+n[1]+",1)":e:u.hex(t)?function(t){var e=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(function(t,e,n,r){return e+e+n+n+r+r})),n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return"rgba("+parseInt(n[1],16)+","+parseInt(n[2],16)+","+parseInt(n[3],16)+",1)"}(t):u.hsl(t)?function(t){var e,n,r,i=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(t),o=parseInt(i[1],10)/360,a=parseInt(i[2],10)/100,s=parseInt(i[3],10)/100,u=i[4]||1;function c(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*(e-t)*n:n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t}if(0==a)e=n=r=s;else{var l=s<.5?s*(1+a):s+a-s*a,d=2*s-l;e=c(d,l,o+1/3),n=c(d,l,o),r=c(d,l,o-1/3)}return"rgba("+255*e+","+255*n+","+255*r+","+u+")"}(t):void 0;var e,n}function T(t){var e=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(t);if(e)return e[1]}function C(t,e){return u.fnc(t)?t(e.target,e.id,e.total):t}function A(t,e){return t.getAttribute(e)}function M(t,e,n){if(S([n,"deg","rad","turn"],T(e)))return e;var r=i.CSS[e+n];if(!u.und(r))return r;var o=document.createElement(t.tagName),a=t.parentNode&&t.parentNode!==document?t.parentNode:document.body;a.appendChild(o),o.style.position="absolute",o.style.width=100+n;var s=100/o.offsetWidth;a.removeChild(o);var c=s*parseFloat(e);return i.CSS[e+n]=c,c}function P(t,e,n){if(e in t.style){var r=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),i=t.style[e]||getComputedStyle(t).getPropertyValue(r)||"0";return n?M(t,i,n):i}}function D(t,e){return u.dom(t)&&!u.inp(t)&&(!u.nil(A(t,e))||u.svg(t)&&t[e])?"attribute":u.dom(t)&&S(r,e)?"transform":u.dom(t)&&"transform"!==e&&P(t,e)?"css":null!=t[e]?"object":void 0}function k(t){if(u.dom(t)){for(var e,n=t.style.transform||"",r=/(\w+)\(([^)]*)\)/g,i=new Map;e=r.exec(n);)i.set(e[1],e[2]);return i}}function j(t,e,n,r){var i=a(e,"scale")?1:0+function(t){return a(t,"translate")||"perspective"===t?"px":a(t,"rotate")||a(t,"skew")?"deg":void 0}(e),o=k(t).get(e)||i;return n&&(n.transforms.list.set(e,o),n.transforms.last=e),r?M(t,o,r):o}function I(t,e,n,r){switch(D(t,e)){case"transform":return j(t,e,r,n);case"css":return P(t,e,n);case"attribute":return A(t,e);default:return t[e]||0}}function N(t,e){var n=/^(\*=|\+=|-=)/.exec(t);if(!n)return t;var r=T(t)||0,i=parseFloat(e),o=parseFloat(t.replace(n[0],""));switch(n[0][0]){case"+":return i+o+r;case"-":return i-o+r;case"*":return i*o+r}}function q(t,e){if(u.col(t))return L(t);if(/\s/g.test(t))return t;var n=T(t),r=n?t.substr(0,t.length-n.length):t;return e?r+e:r}function B(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function Y(t){for(var e,n=t.points,r=0,i=0;i<n.numberOfItems;i++){var o=n.getItem(i);i>0&&(r+=B(e,o)),e=o}return r}function W(t){if(t.getTotalLength)return t.getTotalLength();switch(t.tagName.toLowerCase()){case"circle":return function(t){return 2*Math.PI*A(t,"r")}(t);case"rect":return function(t){return 2*A(t,"width")+2*A(t,"height")}(t);case"line":return function(t){return B({x:A(t,"x1"),y:A(t,"y1")},{x:A(t,"x2"),y:A(t,"y2")})}(t);case"polyline":return Y(t);case"polygon":return function(t){var e=t.points;return Y(t)+B(e.getItem(e.numberOfItems-1),e.getItem(0))}(t)}}function F(t,e){var n=e||{},r=n.el||function(t){for(var e=t.parentNode;u.svg(e)&&u.svg(e.parentNode);)e=e.parentNode;return e}(t),i=r.getBoundingClientRect(),o=A(r,"viewBox"),a=i.width,s=i.height,c=n.viewBox||(o?o.split(" "):[0,0,a,s]);return{el:r,viewBox:c,x:c[0]/1,y:c[1]/1,w:a,h:s,vW:c[2],vH:c[3]}}function H(t,e,n){function r(n){void 0===n&&(n=0);var r=e+n>=1?e+n:0;return t.el.getPointAtLength(r)}var i=F(t.el,t.svg),o=r(),a=r(-1),s=r(1),u=n?1:i.w/i.vW,c=n?1:i.h/i.vH;switch(t.property){case"x":return(o.x-i.x)*u;case"y":return(o.y-i.y)*c;case"angle":return 180*Math.atan2(s.y-a.y,s.x-a.x)/Math.PI}}function R(t,e){var n=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,r=q(u.pth(t)?t.totalLength:t,e)+"";return{original:r,numbers:r.match(n)?r.match(n).map(Number):[0],strings:u.str(t)||e?r.split(n):[]}}function X(t){return y(t?w(u.arr(t)?t.map(b):b(t)):[],(function(t,e,n){return n.indexOf(t)===e}))}function $(t){var e=X(t);return e.map((function(t,n){return{target:t,id:n,total:e.length,transforms:{list:k(t)}}}))}function V(t,e){var n=E(e);if(/^spring/.test(n.easing)&&(n.duration=l(n.easing)),u.arr(t)){var r=t.length;2===r&&!u.obj(t[0])?t={value:t}:u.fnc(e.duration)||(n.duration=e.duration/r)}var i=u.arr(t)?t:[t];return i.map((function(t,n){var r=u.obj(t)&&!u.pth(t)?t:{value:t};return u.und(r.delay)&&(r.delay=n?0:e.delay),u.und(r.endDelay)&&(r.endDelay=n===i.length-1?e.endDelay:0),r})).map((function(t){return O(t,n)}))}function U(t,e){var n=[],r=e.keyframes;for(var i in r&&(e=O(function(t){for(var e=y(w(t.map((function(t){return Object.keys(t)}))),(function(t){return u.key(t)})).reduce((function(t,e){return t.indexOf(e)<0&&t.push(e),t}),[]),n={},r=function(r){var i=e[r];n[i]=t.map((function(t){var e={};for(var n in t)u.key(n)?n==i&&(e.value=t[n]):e[n]=t[n];return e}))},i=0;i<e.length;i++)r(i);return n}(r),e)),e)u.key(i)&&n.push({name:i,tweens:V(e[i],t)});return n}function G(t,e){var n;return t.tweens.map((function(r){var i=function(t,e){var n={};for(var r in t){var i=C(t[r],e);u.arr(i)&&1===(i=i.map((function(t){return C(t,e)}))).length&&(i=i[0]),n[r]=i}return n.duration=parseFloat(n.duration),n.delay=parseFloat(n.delay),n}(r,e),o=i.value,a=u.arr(o)?o[1]:o,s=T(a),c=I(e.target,t.name,s,e),l=n?n.to.original:c,d=u.arr(o)?o[0]:l,h=T(d)||T(c),f=s||h;return u.und(a)&&(a=l),i.from=R(d,f),i.to=R(N(a,d),f),i.start=n?n.end:0,i.end=i.start+i.delay+i.duration+i.endDelay,i.easing=v(i.easing,i.duration),i.isPath=u.pth(o),i.isPathTargetInsideSVG=i.isPath&&u.svg(e.target),i.isColor=u.col(i.from.original),i.isColor&&(i.round=1),n=i,i}))}var z={css:function(t,e,n){return t.style[e]=n},attribute:function(t,e,n){return t.setAttribute(e,n)},object:function(t,e,n){return t[e]=n},transform:function(t,e,n,r,i){if(r.list.set(e,n),e===r.last||i){var o="";r.list.forEach((function(t,e){o+=e+"("+t+") "})),t.style.transform=o}}};function Z(t,e){$(t).forEach((function(t){for(var n in e){var r=C(e[n],t),i=t.target,o=T(r),a=I(i,n,o,t),s=N(q(r,o||T(a)),a),u=D(i,n);z[u](i,n,s,t.transforms,!0)}}))}function _(t,e){return y(w(t.map((function(t){return e.map((function(e){return function(t,e){var n=D(t.target,e.name);if(n){var r=G(e,t),i=r[r.length-1];return{type:n,property:e.name,animatable:t,tweens:r,duration:i.end,delay:r[0].delay,endDelay:i.endDelay}}}(t,e)}))}))),(function(t){return!u.und(t)}))}function Q(t,e){var n=t.length,r=function(t){return t.timelineOffset?t.timelineOffset:0},i={};return i.duration=n?Math.max.apply(Math,t.map((function(t){return r(t)+t.duration}))):e.duration,i.delay=n?Math.min.apply(Math,t.map((function(t){return r(t)+t.delay}))):e.delay,i.endDelay=n?i.duration-Math.max.apply(Math,t.map((function(t){return r(t)+t.duration-t.endDelay}))):e.endDelay,i}var J=0;var K=[],tt=function(){var t;function e(n){for(var r=K.length,i=0;i<r;){var o=K[i];o.paused?(K.splice(i,1),r--):(o.tick(n),i++)}t=i>0?requestAnimationFrame(e):void 0}return"undefined"!=typeof document&&document.addEventListener("visibilitychange",(function(){nt.suspendWhenDocumentHidden&&(et()?t=cancelAnimationFrame(t):(K.forEach((function(t){return t._onDocumentVisibility()})),tt()))})),function(){t||et()&&nt.suspendWhenDocumentHidden||!(K.length>0)||(t=requestAnimationFrame(e))}}();function et(){return!!document&&document.hidden}function nt(t){void 0===t&&(t={});var r,i=0,a=0,s=0,u=0,c=null;function l(t){var e=window.Promise&&new Promise((function(t){return c=t}));return t.finished=e,e}var d=function(t){var r=x(e,t),i=x(n,t),o=U(i,t),a=$(t.targets),s=_(a,o),u=Q(s,i),c=J;return J++,O(r,{id:c,children:[],animatables:a,animations:s,duration:u.duration,delay:u.delay,endDelay:u.endDelay})}(t);l(d);function h(){var t=d.direction;"alternate"!==t&&(d.direction="normal"!==t?"normal":"reverse"),d.reversed=!d.reversed,r.forEach((function(t){return t.reversed=d.reversed}))}function f(t){return d.reversed?d.duration-t:t}function p(){i=0,a=f(d.currentTime)*(1/nt.speed)}function g(t,e){e&&e.seek(t-e.timelineOffset)}function v(t){for(var e=0,n=d.animations,r=n.length;e<r;){var i=n[e],a=i.animatable,s=i.tweens,u=s.length-1,c=s[u];u&&(c=y(s,(function(e){return t<e.end}))[0]||c);for(var l=o(t-c.start-c.delay,0,c.duration)/c.duration,h=isNaN(l)?1:c.easing(l),f=c.to.strings,p=c.round,g=[],v=c.to.numbers.length,m=void 0,w=0;w<v;w++){var b=void 0,S=c.to.numbers[w],E=c.from.numbers[w]||0;b=c.isPath?H(c.value,h*S,c.isPathTargetInsideSVG):E+h*(S-E),p&&(c.isColor&&w>2||(b=Math.round(b*p)/p)),g.push(b)}var x=f.length;if(x){m=f[0];for(var O=0;O<x;O++){f[O];var L=f[O+1],T=g[O];isNaN(T)||(m+=L?T+L:T+" ")}}else m=g[0];z[i.type](a.target,i.property,m,a.transforms),i.currentValue=m,e++}}function m(t){d[t]&&!d.passThrough&&d[t](d)}function w(t){var e=d.duration,n=d.delay,p=e-d.endDelay,y=f(t);d.progress=o(y/e*100,0,100),d.reversePlayback=y<d.currentTime,r&&function(t){if(d.reversePlayback)for(var e=u;e--;)g(t,r[e]);else for(var n=0;n<u;n++)g(t,r[n])}(y),!d.began&&d.currentTime>0&&(d.began=!0,m("begin")),!d.loopBegan&&d.currentTime>0&&(d.loopBegan=!0,m("loopBegin")),y<=n&&0!==d.currentTime&&v(0),(y>=p&&d.currentTime!==e||!e)&&v(e),y>n&&y<p?(d.changeBegan||(d.changeBegan=!0,d.changeCompleted=!1,m("changeBegin")),m("change"),v(y)):d.changeBegan&&(d.changeCompleted=!0,d.changeBegan=!1,m("changeComplete")),d.currentTime=o(y,0,e),d.began&&m("update"),t>=e&&(a=0,d.remaining&&!0!==d.remaining&&d.remaining--,d.remaining?(i=s,m("loopComplete"),d.loopBegan=!1,"alternate"===d.direction&&h()):(d.paused=!0,d.completed||(d.completed=!0,m("loopComplete"),m("complete"),!d.passThrough&&"Promise"in window&&(c(),l(d)))))}return d.reset=function(){var t=d.direction;d.passThrough=!1,d.currentTime=0,d.progress=0,d.paused=!0,d.began=!1,d.loopBegan=!1,d.changeBegan=!1,d.completed=!1,d.changeCompleted=!1,d.reversePlayback=!1,d.reversed="reverse"===t,d.remaining=d.loop,r=d.children;for(var e=u=r.length;e--;)d.children[e].reset();(d.reversed&&!0!==d.loop||"alternate"===t&&1===d.loop)&&d.remaining++,v(d.reversed?d.duration:0)},d._onDocumentVisibility=p,d.set=function(t,e){return Z(t,e),d},d.tick=function(t){s=t,i||(i=s),w((s+(a-i))*nt.speed)},d.seek=function(t){w(f(t))},d.pause=function(){d.paused=!0,p()},d.play=function(){d.paused&&(d.completed&&d.reset(),d.paused=!1,K.push(d),p(),tt())},d.reverse=function(){h(),d.completed=!d.reversed,p()},d.restart=function(){d.reset(),d.play()},d.remove=function(t){it(X(t),d)},d.reset(),d.autoplay&&d.play(),d}function rt(t,e){for(var n=e.length;n--;)S(t,e[n].animatable.target)&&e.splice(n,1)}function it(t,e){var n=e.animations,r=e.children;rt(t,n);for(var i=r.length;i--;){var o=r[i],a=o.animations;rt(t,a),a.length||o.children.length||r.splice(i,1)}n.length||r.length||e.pause()}nt.version="3.2.1",nt.speed=1,nt.suspendWhenDocumentHidden=!0,nt.running=K,nt.remove=function(t){for(var e=X(t),n=K.length;n--;){it(e,K[n])}},nt.get=I,nt.set=Z,nt.convertPx=M,nt.path=function(t,e){var n=u.str(t)?m(t)[0]:t,r=e||100;return function(t){return{property:t,el:n,svg:F(n),totalLength:W(n)*(r/100)}}},nt.setDashoffset=function(t){var e=W(t);return t.setAttribute("stroke-dasharray",e),e},nt.stagger=function(t,e){void 0===e&&(e={});var n=e.direction||"normal",r=e.easing?v(e.easing):null,i=e.grid,o=e.axis,a=e.from||0,s="first"===a,c="center"===a,l="last"===a,d=u.arr(t),h=d?parseFloat(t[0]):parseFloat(t),f=d?parseFloat(t[1]):0,p=T(d?t[1]:t)||0,g=e.start||0+(d?h:0),m=[],y=0;return function(t,e,u){if(s&&(a=0),c&&(a=(u-1)/2),l&&(a=u-1),!m.length){for(var v=0;v<u;v++){if(i){var w=c?(i[0]-1)/2:a%i[0],b=c?(i[1]-1)/2:Math.floor(a/i[0]),S=w-v%i[0],E=b-Math.floor(v/i[0]),x=Math.sqrt(S*S+E*E);"x"===o&&(x=-S),"y"===o&&(x=-E),m.push(x)}else m.push(Math.abs(a-v));y=Math.max.apply(Math,m)}r&&(m=m.map((function(t){return r(t/y)*y}))),"reverse"===n&&(m=m.map((function(t){return o?t<0?-1*t:-t:Math.abs(y-t)})))}return g+(d?(f-h)/y:h)*(Math.round(100*m[e])/100)+p}},nt.timeline=function(t){void 0===t&&(t={});var e=nt(t);return e.duration=0,e.add=function(r,i){var o=K.indexOf(e),a=e.children;function s(t){t.passThrough=!0}o>-1&&K.splice(o,1);for(var c=0;c<a.length;c++)s(a[c]);var l=O(r,x(n,t));l.targets=l.targets||t.targets;var d=e.duration;l.autoplay=!1,l.direction=e.direction,l.timelineOffset=u.und(i)?d:N(i,d),s(e),e.seek(l.timelineOffset);var h=nt(l);s(h),a.push(h);var f=Q(a,t);return e.delay=f.delay,e.endDelay=f.endDelay,e.duration=f.duration,e.seek(0),e.reset(),e.autoplay&&e.play(),e},e},nt.easing=v,nt.penner=g,nt.random=function(t,e){return Math.floor(Math.random()*(e-t+1))+t};var ot,at=nt;function st(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function ut(t){for(var e,n=1;n<arguments.length;n++)e=null==arguments[n]?{}:arguments[n],n%2?st(Object(e),!0).forEach((function(n){ct(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):st(Object(e)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}));return t}function ct(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}const lt={threshold:50,passive:!1};ot=class{constructor(t,e={}){this.options=ut(ut({},lt),e),this.element=null,this.touchStartX=0,this.touchStartY=0,this.touchEndX=0,this.touchEndY=0,this.onSwipeLeftAgent=null,this.onSwipeRightAgent=null,this.onSwipeUpAgent=null,this.onSwipeDownAgent=null,this.onTapAgent=null,this.onTouchStart=this.onTouchStart.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),this.onSwipeLeft=this.onSwipeLeft.bind(this),this.onSwipeRight=this.onSwipeRight.bind(this),this.onSwipeUp=this.onSwipeUp.bind(this),this.onSwipeDown=this.onSwipeDown.bind(this),this.onTap=this.onTap.bind(this),this.destroy=this.destroy.bind(this),this.handleGesture=this.handleGesture.bind(this);let n=!!this.options.passive&&{passive:!0};this.element=t instanceof EventTarget?t:document.querySelector(t),this.element.addEventListener("touchstart",this.onTouchStart,n),this.element.addEventListener("touchend",this.onTouchEnd,n)}onTouchStart(t){this.touchStartX=t.changedTouches[0].screenX,this.touchStartY=t.changedTouches[0].screenY}onTouchEnd(t){this.touchEndX=t.changedTouches[0].screenX,this.touchEndY=t.changedTouches[0].screenY,this.handleGesture()}onSwipeLeft(t){this.onSwipeLeftAgent=t}onSwipeRight(t){this.onSwipeRightAgent=t}onSwipeUp(t){this.onSwipeUpAgent=t}onSwipeDown(t){this.onSwipeDownAgent=t}onTap(t){this.onTapAgent=t}destroy(){this.element.removeEventListener("touchstart",this.onTouchStart),this.element.removeEventListener("touchend",this.onTouchEnd)}handleGesture(){return this.touchEndX+this.options.threshold<=this.touchStartX?(this.onSwipeLeftAgent&&this.onSwipeLeftAgent(),"swiped left"):this.touchEndX-this.options.threshold>=this.touchStartX?(this.onSwipeRightAgent&&this.onSwipeRightAgent(),"swiped right"):this.touchEndY+this.options.threshold<=this.touchStartY?(this.onSwipeUpAgent&&this.onSwipeUpAgent(),"swiped up"):this.touchEndY-this.options.threshold>=this.touchStartY?(this.onSwipeDownAgent&&this.onSwipeDownAgent(),"swiped down"):this.touchEndY===this.touchStartY?(this.onTapAgent&&this.onTapAgent(),"tap"):void 0}};var dt;function ht(t,e,n){var r,i,o,a,s;function u(){var c=Date.now()-a;c<e&&c>=0?r=setTimeout(u,e-c):(r=null,n||(s=t.apply(o,i),o=i=null))}null==e&&(e=100);var c=function(){o=this,i=arguments,a=Date.now();var c=n&&!r;return r||(r=setTimeout(u,e)),c&&(s=t.apply(o,i),o=i=null),s};return c.clear=function(){r&&(clearTimeout(r),r=null)},c.flush=function(){r&&(s=t.apply(o,i),o=i=null,clearTimeout(r),r=null)},c}function ft(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function pt(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var r,i,o=[],a=!0,s=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(o.push(r.value),!e||o.length!==e);a=!0);}catch(t){s=!0,i=t}finally{try{a||null==n.return||n.return()}finally{if(s)throw i}}return o}(t,e)||vt(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function gt(t){return function(t){if(Array.isArray(t))return mt(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||vt(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function vt(t,e){if(t){if("string"==typeof t)return mt(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?mt(t,e):void 0}}function mt(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function yt(t,e){return Object.getOwnPropertyNames(Object(t)).reduce((function(n,r){var i=Object.getOwnPropertyDescriptor(Object(t),r),o=Object.getOwnPropertyDescriptor(Object(e),r);return Object.defineProperty(n,r,o||i)}),{})}function wt(t){return"string"==typeof t}function bt(t){return Array.isArray(t)}function St(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=yt(e);return void 0!==n.types?t=n.types:void 0!==n.split&&(t=n.split),void 0!==t&&(n.types=(wt(t)||bt(t)?String(t):"").split(",").map((function(t){return String(t).trim()})).filter((function(t){return/((line)|(word)|(char))/i.test(t)}))),(n.absolute||n.position)&&(n.absolute=n.absolute||/absolute/.test(e.position)),n}function Et(t){var e=wt(t)||bt(t)?String(t):"";return{none:!e,lines:/line/i.test(e),words:/word/i.test(e),chars:/char/i.test(e)}}function xt(t){return null!==t&&"object"==typeof t}function Ot(t){return bt(t)?t:null==t?[]:function(t){return xt(t)&&function(t){return"number"==typeof t&&t>-1&&t%1==0}(t.length)}(t)?Array.prototype.slice.call(t):[t]}function Lt(t){return xt(t)&&/^(1|3|11)$/.test(t.nodeType)}function Tt(t){var e=t;return wt(t)&&(e=/^(#[a-z]\w+)$/.test(t.trim())?document.getElementById(t.trim().slice(1)):document.querySelectorAll(t)),Ot(e).reduce((function(t,e){return[].concat(gt(t),gt(Ot(e).filter(Lt)))}),[])}function Ct(t,e,n){var r={},i=null;return xt(t)&&(i=t[Ct.expando]||(t[Ct.expando]=++Ct.uid),r=Ct.cache[i]||(Ct.cache[i]={})),void 0===n?void 0===e?r:r[e]:void 0!==e?(r[e]=n,n):void 0}function At(t){var e=t&&t[Ct.expando];e&&(delete t[e],delete Ct.cache[e])}ht.debounce=ht,dt=ht,function(){function t(){for(var t=arguments.length,e=0;e<t;e++){var n=e<0||arguments.length<=e?void 0:arguments[e];1===n.nodeType||11===n.nodeType?this.appendChild(n):this.appendChild(document.createTextNode(String(n)))}}function e(){for(;this.lastChild;)this.removeChild(this.lastChild);arguments.length&&this.append.apply(this,arguments)}function n(){for(var t=this.parentNode,e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];var i=n.length;if(t)for(i||t.removeChild(this);i--;){var o=n[i];"object"!=typeof o?o=this.ownerDocument.createTextNode(o):o.parentNode&&o.parentNode.removeChild(o),i?t.insertBefore(this.previousSibling,o):t.replaceChild(o,this)}}Element.prototype.append||(Element.prototype.append=t,DocumentFragment.prototype.append=t),Element.prototype.replaceChildren||(Element.prototype.replaceChildren=e,DocumentFragment.prototype.replaceChildren=e),Element.prototype.replaceWith||(Element.prototype.replaceWith=n,DocumentFragment.prototype.replaceWith=n)}(),Ct.expando="splitType".concat(1*new Date),Ct.cache={},Ct.uid=0;var Mt="[".concat("\ud800-\udfff","]"),Pt="[".concat("\\u0300-\\u036f\\ufe20-\\ufe23").concat("\\u20d0-\\u20f0","]"),Dt="(?:".concat(Pt,"|").concat("\ud83c[\udffb-\udfff]",")"),kt="[^".concat("\ud800-\udfff","]"),jt="(?:\ud83c[\udde6-\uddff]){2}",It="[\ud800-\udbff][\udc00-\udfff]",Nt="".concat(Dt,"?"),qt="[".concat("\\ufe0e\\ufe0f","]?"),Bt=qt+Nt+("(?:\\u200d(?:"+[kt,jt,It].join("|")+")"+qt+Nt+")*"),Yt="(?:".concat(["".concat(kt).concat(Pt,"?"),Pt,jt,It,Mt].join("|"),"\n)"),Wt=RegExp("".concat("\ud83c[\udffb-\udfff]","(?=").concat("\ud83c[\udffb-\udfff]",")|").concat(Yt).concat(Bt),"g"),Ft=RegExp("[".concat(["\\u200d","\ud800-\udfff","\\u0300-\\u036f\\ufe20-\\ufe23","\\u20d0-\\u20f0","\\ufe0e\\ufe0f"].join(""),"]"));function Ht(t){return Ft.test(t)}function Rt(t){return Ht(t)?function(t){return t.match(Wt)||[]}(t):function(t){return t.split("")}(t)}function Xt(t){return null==t?"":String(t)}function $t(t){return document.createTextNode(t)}function Vt(t,e){var n=document.createElement(t);return e?(Object.keys(e).forEach((function(t){var r=e[t];null!==r&&("textContent"===t||"innerHTML"===t?n[t]=r:"children"===t?Ot(r).forEach((function(t){Lt(t)&&n.appendChild(t),wt(t)&&n.appendChild($t(t))})):n.setAttribute(t,String(r).trim()))})),n):n}var Ut={splitClass:"",lineClass:"line",wordClass:"word",charClass:"char",types:["lines","words","chars"],absolute:!1,tagName:"div"};function Gt(t,e){var n,r=Et((e=yt(Ut,e)).types),i=e.tagName,o=(t.nodeValue||"").replace(/\s+/g," ").trim(),a=document.createDocumentFragment(),s=[];return/^\s/.test(t.nodeValue)&&a.append(" "),n=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:" ";return(t=t?String(t):"").split(e)}(o).reduce((function(t,n,o,u){var c,l;return r.chars&&(l=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return(t=Xt(t))&&wt(t)&&!e&&Ht(t)?Rt(t):t.split(e)}(n).map((function(t){var n=Vt(i,{class:"".concat(e.splitClass," ").concat(e.charClass),style:"display: inline-block;",children:t});return Ct(n).isChar=!0,s=[].concat(gt(s),[n]),n}))),r.words||r.lines?(Ct(c=Vt(i,{class:"".concat(e.wordClass," ").concat(e.splitClass),style:"display: inline-block; position: ".concat(r.words?"relative":"static"),children:r.chars?l:n})).isWord=!0,Ct(c).isWordStart=!0,Ct(c).isWordEnd=!0,a.appendChild(c)):l.forEach((function(t){a.appendChild(t)})),o<u.length-1&&a.appendChild($t(" ")),r.words?t.concat(c):t}),[]),/\s$/.test(t.nodeValue)&&a.append(" "),t.replaceWith(a),{words:n,chars:s}}function zt(t,e){if(3===t.nodeType)return Gt(t,e);var n=Ot(t.childNodes);if(n.length&&(Ct(t).isSplit=!0,!Ct(t).isRoot)){t.style.display="inline-block",t.style.position="relative";var r=t.nextSibling,i=t.previousSibling,o=t.textContent||"",a=r?r.textContent:" ",s=i?i.textContent:" ";Ct(t).isWordEnd=/\s$/.test(o)||/^\s/.test(a),Ct(t).isWordStart=/^\s/.test(o)||/\s$/.test(s)}return n.reduce((function(t,n){var r=zt(n,e),i=r.words,o=r.chars;return{words:[].concat(gt(t.words),gt(i)),chars:[].concat(gt(t.chars),gt(o))}}),{words:[],chars:[]})}function Zt(t){Ct(t).isWord?t.replaceWith.apply(t,gt(t.childNodes)):Ot(t.children).forEach((function(t){return Zt(t)}))}function _t(t,e,n){var r,i,o,a=Et(e.types),s=e.tagName,u=t.getElementsByTagName("*"),c=[],l=[],d=null,h=[];Ct(t).nodes=u;var f=t.parentElement,p=t.nextElementSibling,g=document.createDocumentFragment(),v=window.getComputedStyle(t),m=v.textAlign,y=.2*parseFloat(v.fontSize);return e.absolute&&(o={left:t.offsetLeft,top:t.offsetTop,width:t.offsetWidth},i=t.offsetWidth,r=t.offsetHeight,Ct(t).cssWidth=t.style.width,Ct(t).cssHeight=t.style.height),Ot(u).forEach((function(r){var i=r.parentElement===t,o=function(t,e,n,r){if(!n.absolute)return{top:e?t.offsetTop:null};var i=t.offsetParent,o=pt(r,2),a=o[0],s=o[1],u=0,c=0;if(i&&i!==document.body){var l=i.getBoundingClientRect();u=l.x+a,c=l.y+s}var d=t.getBoundingClientRect(),h=d.width,f=d.height,p=d.x;return{width:h,height:f,top:d.y+s-c,left:p+a-u}}(r,i,e,n),s=o.width,u=o.height,h=o.top,f=o.left;/^br$/i.test(r.nodeName)||(a.lines&&i&&((null===d||h-d>=y)&&(d=h,c.push(l=[])),l.push(r)),e.absolute&&(Ct(r).top=h,Ct(r).left=f,Ct(r).width=s,Ct(r).height=u))})),f&&f.removeChild(t),a.lines&&(h=c.map((function(t){var n=Vt(s,{class:"".concat(e.splitClass," ").concat(e.lineClass),style:"display: block; text-align: ".concat(m,"; width: 100%;")});Ct(n).isLine=!0;var r={height:0,top:1e4};return g.appendChild(n),t.forEach((function(t,e,i){var o=Ct(t),a=o.isWordEnd,s=o.top,u=o.height,c=i[e+1];r.height=Math.max(r.height,u),r.top=Math.min(r.top,s),n.appendChild(t),a&&Ct(c).isWordStart&&n.append(" ")})),e.absolute&&(Ct(n).height=r.height,Ct(n).top=r.top),n})),a.words||Zt(g),t.replaceChildren(g)),e.absolute&&(t.style.width="".concat(t.style.width||i,"px"),t.style.height="".concat(r,"px"),Ot(u).forEach((function(t){var e=Ct(t),n=e.isLine,r=e.top,i=e.left,a=e.width,s=e.height,u=Ct(t.parentElement),c=!n&&u.isLine;t.style.top="".concat(c?r-u.top:r,"px"),t.style.left="".concat(n?o.left:i-(c?o.left:0),"px"),t.style.height="".concat(s,"px"),t.style.width="".concat(n?o.width:a,"px"),t.style.position="absolute"}))),f&&(p?f.insertBefore(t,p):f.appendChild(t)),h}var Qt=yt(Ut,{}),Jt=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.isSplit=!1,this.settings=yt(Qt,St(n)),this.elements=Tt(e)||[],this.revert(),this.elements.forEach((function(t){Ct(t).html=t.innerHTML})),this.split()}var e,n,r;return e=t,r=[{key:"defaults",get:function(){return Qt},set:function(t){Qt=yt(Qt,St(t))}},{key:"setDefaults",value:function(t){return Qt=yt(Qt,St(t)),Ut}},{key:"revert",value:function(t){Tt(t).forEach((function(t){var e=Ct(t),n=e.isSplit,r=e.html;n&&(t.innerHTML=r||"",Ct(t).isSplit=!1,Ct(t).html=null)}))}},{key:"create",value:function(e,n){return new t(e,n)}}],(n=[{key:"split",value:function(t){var e=this;this.revert(),this.lines=[],this.words=[],this.chars=[];var n=[window.pageXOffset,window.pageYOffset];void 0!==t&&(this.settings=yt(this.settings,St(t)));var r=Et(this.settings.types);r.none||(this.elements.forEach((function(t){Ct(t).isRoot=!0;var n=zt(t,e.settings),r=n.words,i=n.chars;e.words=[].concat(gt(e.words),gt(r)),e.chars=[].concat(gt(e.chars),gt(i))})),this.elements.forEach((function(t){if(r.lines||e.settings.absolute){var i=_t(t,e.settings,n);e.lines=[].concat(gt(e.lines),gt(i))}})),this.isSplit=!0,window.scrollTo(n[0],n[1]),this.elements.forEach((function(t){Ot(Ct(t).nodes).forEach(At),Ct(t).nodes=null})))}},{key:"revert",value:function(){this.elements.forEach((function(t){var e=Ct(t),n=e.isSplit,r=e.html,i=e.cssWidth,o=e.cssHeight;n&&(t.innerHTML=r,t.style.width=i||"",t.style.height=o||"",Ct(t).isSplit=!1)})),this.isSplit&&(this.lines=null,this.words=null,this.chars=null,this.isSplit=!1)}}])&&ft(e.prototype,n),r&&ft(e,r),Object.defineProperty(e,"prototype",{writable:!1}),t}();class Kt{constructor(t){this.DOM={animationElems:Array.isArray(t)?t:[t]},this.SplitTypeInstances=[],this.lines=[];for(const t of this.DOM.animationElems){const e=new Jt(t,{types:"lines"});this.wrapLines(e.lines,"div","oh"),this.lines.push(e.lines),this.SplitTypeInstances.push(e)}this.initEvents()}in(t){return this.isVisible=!0,at.remove(this.lines),at.timeline({duration:900,easing:"easeInOutExpo"}).add({targets:this.lines,translateY:["150%","0%"],rotate:["15deg","0deg"],delay:at.stagger(4,{direction:t})})}out(t){return this.isVisible=!1,at.remove(this.lines),at.timeline({duration:600,easing:"easeInOutExpo"}).add({targets:this.lines,translateY:["0%","-150%"],rotate:["0deg","-5deg"],delay:at.stagger(3,{direction:t})})}initEvents(){window.addEventListener("resize",(()=>{this.lines=[];for(const t of this.SplitTypeInstances)t.split(),this.wrapLines(t.lines,"div","oh"),this.lines.push(t.lines)}))}wrapLines(t,e,n){t.forEach((t=>{const r=document.createElement(e);r.classList=n,t.parentNode.appendChild(r),r.appendChild(t),this.isVisible&&(t.style.transform="translateY(0%) rotate(0deg)")}))}}const te=new(t(ot))("main");window.history.scrollRestoration="manual";const ee={};let ne=window.location.hash&&document.querySelector(window.location.hash);ne||(window.history.replaceState?window.history.replaceState(null,null,"#introduction"):window.location.hash="#introduction",ne=document.querySelector(window.location.hash));let re=ne.querySelector(".screen-1"),ie=document.querySelector(".topbar"),oe=ie.querySelector("nav"),ae=oe.querySelectorAll("[href]");function se(t){ie.classList.remove("is-sticky"),document.removeEventListener("scroll",se)}oe.querySelector('[href="'+window.location.hash+'"]').classList.add("is-active"),ie.style.transition="unset";let ue=!1,ce=!1,le=!1;function de(t){ue=0==window.scrollY,ce=window.innerHeight+window.scrollY>=document.body.scrollHeight}function he(t){le=!0;const e=t?ne.nextElementSibling.children[0]:re.nextElementSibling,n=ne.id+[...re.parentElement.children].indexOf(re),r=(t?e.parentElement.id:ne.id)+[...e.parentElement.children].indexOf(e);ee[n].out("reverse"),re.classList.add("is-hidding--next");at.timeline({duration:800,easing:"easeInOutExpo"}).add({targets:re,clipPath:["inset(0 0 0px 0)","inset(0 0 "+window.innerHeight+"px 0)"],begin:function(t){},complete:function(e){re.classList.remove("is-active","is-hidding--next"),t&&ne.classList.remove("is-active"),re.style.clipPath=""}}).add({targets:e,clipPath:["inset("+window.innerHeight+"px 0 0 0)","inset(0px 0 0 0)"],begin:function(n){t&&e.parentElement.classList.add("is-active"),e.classList.add("is-active","is-showing--next"),ee[r]||(ee[r]=new Kt([...e.querySelectorAll(".heading span"),...e.querySelectorAll(".content p")])),ee[r].in("normal")},complete:function(n){e.classList.remove("is-showing--next"),e.style.clipPath="",re=e,t&&(ne=e.parentElement,pe(),ge()),de(),le=!1}},"-=400")}function fe(t){le=!0;const e=t?ne.previousElementSibling.children[ne.previousElementSibling.children.length-1]:re.previousElementSibling,n=ne.id+[...re.parentElement.children].indexOf(re),r=(t?e.parentElement.id:ne.id)+[...e.parentElement.children].indexOf(e);ee[n].out("normal"),re.classList.add("is-hidding--prev");at.timeline({duration:800,easing:"easeInOutExpo"}).add({targets:re,clipPath:["inset(0px 0 0 0)","inset("+window.innerHeight+"px 0 0 0)"],begin:function(t){},complete:function(e){re.classList.remove("is-active","is-hidding--prev"),t&&ne.classList.remove("is-active"),re.style.clipPath=""}}).add({targets:e,clipPath:["inset(0 0 "+window.innerHeight+"px 0)","inset(0 0 0px 0)"],begin:function(n){t&&e.parentElement.classList.add("is-active"),e.classList.add("is-active","is-showing--prev"),ee[r]||(ee[r]=new Kt([...e.querySelectorAll(".heading span"),...e.querySelectorAll(".content p")])),ee[r].in("reverse")},complete:function(n){e.classList.remove("is-showing--prev"),document.scrollingElement.scrollTop=document.scrollingElement.scrollHeight,e.style.clipPath="",re=e,t&&(ne=e.parentElement,pe(),ge()),de(),le=!1}},"-=600")}function pe(){for(let t=0;t<ae.length;t++)ae[t].hash=="#"+ne.id?ae[t].classList.add("is-active"):ae[t].classList.remove("is-active")}function ge(){window.history.pushState?window.history.pushState(null,null,"#"+ne.id):window.location.hash="#"+ne.id}document.addEventListener("wheel",(0,dt.debounce)((function(t){!le&&ue&&t.deltaY<0?re.previousElementSibling?fe():ne.previousElementSibling&&fe(!0):!le&&ce&&t.deltaY>0&&(re.nextElementSibling?he():ne.nextElementSibling&&he(!0))}),150,!0)),te.onSwipeUp((function(t){!le&&ce&&(re.nextElementSibling?he():ne.nextElementSibling&&he(!0))})),te.onSwipeDown((function(t){!le&&ue&&(re.previousElementSibling?fe():ne.previousElementSibling&&fe(!0))})),document.addEventListener("keydown",(function(t){"ArrowUp"==t.key||"PageUp"==t.key?!le&&ue&&(re.previousElementSibling?fe():ne.previousElementSibling&&fe(!0)):"ArrowDown"!=t.key&&"PageDown"!=t.key||!le&&ce&&(re.nextElementSibling?he():ne.nextElementSibling&&he(!0))})),window.addEventListener("hashchange",(function(t){let e=window.location.hash&&document.querySelector(window.location.hash);if(e){le=!0;let t=e.children[0];const n=ne.id+[...re.parentElement.children].indexOf(re),r=t.parentElement.id+[...t.parentElement.children].indexOf(t);ee[n].out("normal");at.timeline({duration:800,easing:"easeInOutExpo"}).add({targets:re,clipPath:["inset(0 0% 0 0)","inset(0 100% 0 0)"],begin:function(t){},complete:function(t){ne.classList.remove("is-active"),re.classList.remove("is-active"),re.style.clipPath=""}}).add({targets:t,clipPath:["inset(0 0 0 100%)","inset(0 0 0 0%)"],begin:function(n){e.classList.add("is-active"),t.classList.add("is-active","is-showing--next"),ee[r]||(ee[r]=new Kt([...t.querySelectorAll(".heading span"),...t.querySelectorAll(".content p")])),ee[r].in("normal")},complete:function(n){t.classList.remove("is-showing--next"),t.style.clipPath="",ne=e,re=t,pe(),de(),le=!1}},"-=400")}}),!1),document.addEventListener("readystatechange",(function(t){if("complete"===t.target.readyState){const t=ne.id+[...re.parentElement.children].indexOf(re);at.timeline({duration:800,easing:"easeInOutExpo"}).add({targets:re,clipPath:["inset(0 100% 0 0)","inset(0 0% 0 0)"],begin:function(e){ne.classList.add("is-active"),re.classList.add("is-active","is-showing--next"),ee[t]=new Kt([...ne.querySelectorAll(".heading span"),...ne.querySelectorAll(".content p")]),ee[t].in("normal")},complete:function(t){ie.style.transition="",ie.classList.add("is-sticky"),re.classList.remove("is-showing--next"),re.style.clipPath="",document.addEventListener("scroll",se),document.addEventListener("scroll",de),window.addEventListener("resize",de),de()}})}}));
//# sourceMappingURL=index.9eff2649.js.map