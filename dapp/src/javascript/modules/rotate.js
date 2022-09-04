import { shuffle } from "./shuffle";

const rotate = ( el, sampleSize, array = [] ) => {

    if( array.length === 0 ) {
        for( let i = 1; i <= sampleSize; i++ ) {
            array.push( i );
        }
        shuffle( array );
    }

    setTimeout(() => { 
        el.src = `./img/sample/${array.shift()}.png`;
        rotate( el, sampleSize, array );
    }, 2500 );
}

export default rotate;