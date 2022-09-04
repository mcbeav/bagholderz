const calculateHeight = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty( "--vh", `${vh}px` );
}

module.exports = {calculateHeight};