const preloader = ( size ) => {
    for( let i = 1; i <= size; i++ ) {
        let img = new Image();
        img.src = `./img/sample/${i}.png`;
    }
}

module.exports = {preloader};