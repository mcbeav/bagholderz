const {Generator} = require( `./javascript/modules/generator.js` );
const args = process.argv.slice( 2 );

const generator = new Generator( ( args.length > 0 ) ? args : undefined );