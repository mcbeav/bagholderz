const debounce = ( fn, delay ) => {
    let timerID;

    return ( ...args ) => {
        const boundFn = fn.bind( this, ...args );
        clearTimeout( timerID );
        timerID = setTimeout( boundFn, delay );
    }
}

module.exports = {debounce};