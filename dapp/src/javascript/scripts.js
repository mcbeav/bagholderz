import { sampleSize } from "./modules/sampleSize";
import { preloader } from "./modules/preloader";
import { iOSTouchSupport } from "./modules/iOSTouchSupport";
import { debounce } from "./modules/debounce";
import { calculateHeight } from "./modules/calculateHeight";
import rotate from "./modules/rotate";

const viewport = debounce( calculateHeight, 100 );

const load = () => {
    if( document.readyState === "complete" ) {
        const img = document.getElementById( "sample" );
        preloader( sampleSize );
        iOSTouchSupport();
        calculateHeight();
        rotate( img, sampleSize );
    } else {
        setTimeout( load, 1 );
    }
}

document.addEventListener( "DOMContentLoaded", load );

window.addEventListener( "resize", viewport );