(()=>{var e={302:e=>{e.exports={calculateHeight:function(){var e=.01*window.innerHeight;document.documentElement.style.setProperty("--vh","".concat(e,"px"))}}},18:function(e){var t=this;e.exports={debounce:function(e,n){var o;return function(){for(var r=arguments.length,a=new Array(r),i=0;i<r;i++)a[i]=arguments[i];var c=e.bind.apply(e,[t].concat(a));clearTimeout(o),o=setTimeout(c,n)}}}},75:e=>{e.exports={iOSTouchSupport:function(){/iP(hone|ad)/.test(window.navigator.userAgent)&&document.body.addEventListener("touchstart",(function(){}),!1)}}},196:e=>{e.exports={preloader:function(e){for(var t=1;t<=e;t++)(new Image).src="./img/sample/".concat(t,".png")}}},84:e=>{e.exports={sampleSize:15}},771:e=>{e.exports={shuffle:function(e){for(var t=e.length-1;t>0;t--){var n=Math.floor(Math.random()*(t+1)),o=[e[n],e[t]];e[t]=o[0],e[n]=o[1]}}}}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var a=t[o]={exports:{}};return e[o].call(a.exports,a,a.exports,n),a.exports}(()=>{"use strict";var e=n(84),t=n(196),o=n(75),r=n(18),a=n(302),i=n(771);const c=function e(t,n){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];if(0===o.length){for(var r=1;r<=n;r++)o.push(r);(0,i.shuffle)(o)}setTimeout((function(){t.src="./img/sample/".concat(o.shift(),".png"),e(t,n,o)}),2500)};var s=(0,r.debounce)(a.calculateHeight,100);document.addEventListener("DOMContentLoaded",(function n(){if("complete"===document.readyState){var r=document.getElementById("sample");(0,t.preloader)(e.sampleSize),(0,o.iOSTouchSupport)(),(0,a.calculateHeight)(),c(r,e.sampleSize)}else setTimeout(n,1)})),window.addEventListener("resize",s)})()})();