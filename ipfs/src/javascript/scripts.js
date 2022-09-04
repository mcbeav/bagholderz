import { iOSTouchSupport } from "./modules/iOSTouchSupport";
import { debounce } from "./modules/debounce";
import { calculateHeight } from "./modules/calculateHeight";

const viewport = debounce( calculateHeight, 100 );

const load = () => {
    if( document.readyState === "complete" ) {
        iOSTouchSupport();
        setTimeout( () => { calculateHeight(); }, 300 );
    } else {
        setTimeout( load, 1 );
    }
}

document.addEventListener( "DOMContentLoaded", load );

window.addEventListener( "resize", viewport );