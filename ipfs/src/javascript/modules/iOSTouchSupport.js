const iOSTouchSupport = () => {
    if ( /iP(hone|ad)/.test( window.navigator.userAgent ) ) {
        document.body.addEventListener( 'touchstart', () => {}, false );
    }
}

module.exports = {iOSTouchSupport};