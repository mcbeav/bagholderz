require( "dotenv" ).config();

const CWD = process.cwd();

module.exports = 
    {
        directories: 
            {
                base: CWD,
                build: ( process.env.BUILD !== undefined ) ? `${CWD}/${process.env.BUILD}` : `${CWD}/generator/build`
            },
        height: Number( process.env.HEIGHT ),
        width: Number( process.env.WIDTH ),
        size: Number( process.env.SIZE ),
        layers: String( process.env.LAYERS ).split( "," ).map( ( el ) => { return el.trim(); }),
        delimeter: "#",
        name: String( process.env.NAME ),
        symbol: ( process.env.SYMBOL !== undefined && String( process.env.NETWORK ).toLowerCase() === "solana" ) ? String( process.env.SYMBOL ) : undefined,
        description: String( process.env.DESCRIPTION ),
        url: ( process.env.URL !== undefined && String( process.env.NETWORK ).toLowerCase() === "solana" ) ? String( process.env.URL ) : undefined,
        fee: ( process.env.FEE !== undefined && String( process.env.NETWORK ).toLowerCase() === "solana" ) ? process.env.FEE : undefined,
        share: ( process.env.SHARE !== undefined && String( process.env.NETWORK ).toLowerCase() === "solana" ) ? process.env.SHARE : undefined,
        address: ( process.env.ADDRESS !== undefined && String( process.env.NETWORK ).toLowerCase() === "solana" ) ? String( process.env.ADDRESS ) : undefined,
        duplicates: ( process.env.DUPLICATES !== undefined ) ? true : false,
        threshold: Number( 500 ),
        background: ( process.env.BACKGROUND !== undefined ) ? true : false,
        network: ( String( process.env.NETWORK ).toLowerCase() === "solana" ) ? "solana" : "ethereum"
    }