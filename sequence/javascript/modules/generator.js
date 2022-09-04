const path = require( "path" );
const fs = require( "fs" );
const seedrandom = require( "seedrandom" );
const randomWords = require( "random-words" );

const configuration = require( "./config" );

const sha1 = require( "sha1" );
const { createCanvas, loadImage } = require( "canvas" );

class Generator
    {
        constructor( args = [] ) {

            this.canvas = createCanvas( configuration.width, configuration.height );
            this.ctx = this.canvas.getContext( "2d" );
            this.ctx.imageSmoothingEnabled = true;

            this.collection = [];
            this.index;

            this.route( args );
        }

        /**
         * route - Accepts The CLI Arguments & Runs The Appropriate Function 
         * @param {*} args 
         * 
         * Build - Builds The Collection Images & Corresponding Metadata JSON Files
         * Passing 0 Arguments - Generates The Images & Metadata JSON Files According To The Settings In The ENV File
         * Specifying The Name Of Each Property Of An Image You Want To Force The Creation Of - The Names Of Each Property You Want To Specify In Order Is Passsed To The Function. The String "random" Can Be Passed In Place Of A Property Name To Force The App To Choose A Property At Random | ex: node build.js random bag-1 luna wagmi - Forces The Generation Of A Random Background, Bag Texture 1, Luna Coin, & WAGMI Crayon
         * 
         * Fix - Renames & Relinks The Already Generated Image & JSON Files Allowing The Deletion Of Files You Do Not Want For Any Reason | ex: If You Do Not Like The Generated Images 1, 5, And 27, You Delete The JSON Files 1.json, 5.json, and 27.json And Run the node build.js fix Command To Rename & Relink The Files So The Collection Is Not Missing Any Files & All Of The Files Are In Order With It's Corresponding Metadata
         * 
         * Expand - Generates More Images & The Corresponding Metadata For An Already Generated Collection
         * Passing 0 Arguments Will Check How Many Images Have Been Created & The Total Collection Size Set In The ENV File & Will Generate Any Remaining Images So The Collection Has The Amount Of Images Generated That Matches The Size Of The Collection Specified In The ENV File
         * Can Pass An Integer Number & The Expand Function Will Generate The Number Of Images Passed To The Function Call | ex: node build.js expand 5 Generates 5 More Images Regardless Of The Specified Collection Size
         * 
         * Report - Generates A JSON Report Containing An Array Of The Files Containing The Matching Specified Property Name & Property Value
         * Param 1: attribute trait name
         * Param 2: value of the attribute
         * ex: node build.js report coin ADA - Generates A Report With An Array Of The All Of The Files That Have The ADA Coin Attribute
         * 
         * Network - Changes The Metadata Of A Generated Collection From Ethereum To Solana Or From Soalan To Ethereum
         * Param 1: Name Of The Desired Network Compatible Metadata
         * 
         * Rarity - Generates A Report Detailing The Occurances Of Each Attribute & Each Attribute's Rarity
         * 
         * Update - Updates The Metadata for An Already Generated File
         * uri - Updates The URI For The Collection
         * name - Updates The Collection Name
         * description - Updates The Description For The Collection
         * 
         */
        route( args ) {
            switch( String( args[ 0 ] ).toLowerCase() )
                {
                    case "build":
                        this.build( args );
                        break;

                    case "fix":
                        this.relinkFiles();
                        break;

                    case "expand":
                        this.expand( args[ 1 ] );
                        break;

                    case "report":
                        this.find( args[ 1 ], args[ 2 ] );
                        break;

                    case "network":
                        this.network( args[ 1 ] );
                        break;

                    case "rarity":
                        this.rarity();
                        break;

                    case "update":
                        this.update( args[ 1 ], args[ 2 ] );
                        break;

                    default:
                        this.initialize();
                        break;
                }
        }

        /**
         * initialize - Initializes The Build Process By Checking For The Required Directories & Creating Them If They Do Not Yet Exist
         */
        initialize() {
            if( fs.existsSync( configuration.directories.build ) ) {
                fs.rmdirSync( configuration.directories.build, { recursive: true });
            }

            fs.mkdirSync( configuration.directories.build );
            fs.mkdirSync( path.join( configuration.directories.build, `img` ) );
            fs.mkdirSync( path.join( configuration.directories.build, `json` ) );

            this.create();
        }

        /**
         * build - The Main Process That Performs The Required Steps For Building A Collection Based On The Values Set In The ENV File
         * @param {*} args
         * 
         */
        build( args ) {

            args.shift();

            let index;
            
            let collection = new Set();

            let layers = this.setup( configuration.layers );

            let files = this.getMetadata().map( filename => filename.split( "." ).shift() );

            if( files.length > 0 ) {
                files.sort( ( a, b ) => { return Number( a ) - Number( b ); });

                files.forEach( ( file ) => {
                    let json = fs.readFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, `${file}.json` ) );
                    let data = JSON.parse( json );
    
                    collection.add( data.dna );
                });

                index = Number( files[ files.length - 1 ] ) + 1;

            } else {

                index = ( configuration.network === "solana" ) ? 0 : 1;

            }

            let genetics = {
                dna: [],
                genome: []
            }

            if( layers.length !== args.length ) {
                console.log( `Each Layer Must Be Represented When Manually Building. The Layer Must Be Represented By The Name Of The File, Or By The Word RANDOM To Randomly Generate A Choice For The Layer.` );
                process.exit();
            } else {

                layers.forEach( ( layer, index ) => {
                    
                    if( String( args[ index ] ).toLowerCase() !== "random" ) {

                        let i = layer.elements.findIndex( ( el ) => {
                            return String( el.attribute ) === String( args[ index ] );
                        });

                        genetics.dna.push( `${layer.elements[ i ].id}:${layer.elements[ i ].attribute}` );

                        genetics.genome.push({
                            id: `${layer.elements[ i ].id}`,
                            attribute: `${layer.attribute}`,
                            name: `${layer.elements[ i ].attribute}`,
                            filename: `${layer.elements[ i ].filename}`,
                            options: ( layer.options !== undefined ) ? {...layer.options} : undefined
                        });

                    } else {
                        
                        let weight = layer.elements.reduce( ( add, el ) => { return add + el.weight;}, 0);

                        let choice = this.random( weight );
        
                        for( let i = 0; i < layer.elements.length; i++ ) {
                            choice -= layer.elements[ i ].weight;
            
                            if( choice < 0 ) {
                                genetics.dna.push( `${layer.elements[ i ].id}:${layer.elements[ i ].attribute}` );
                                return genetics.genome.push({
                                    id: `${layer.elements[ i ].id}`,
                                    attribute: `${layer.attribute}`,
                                    name: `${layer.elements[ i ].attribute}`,
                                    filename: `${layer.elements[ i ].filename}`,
                                    options: ( layer.options !== undefined ) ? {...layer.options} : undefined
                                });
                            }
                        }
                    }
                });

                genetics.dna = sha1( genetics.dna.join( "|" ) );

                if( !configuration.duplicates ) {

                    if( !this.isUnique( collection, genetics ) ) {

                        console.log( `Duplicate DNA. The Desired Image Being Requested Already Exists & Duplicates Are Not Allowed As Set In The Configuration File.` );
                        process.exit();

                    }

                }

                let imgs = [];
    
                genetics.genome.forEach( ( dna ) => {
                    imgs.push( this.load( dna ) );
                });

                Promise.all( imgs ).then( ( data ) => {
                    this.ctx.clearRect( 0, 0, configuration.width, configuration.height );
    
                    data.forEach( ( img ) => {
                        this.ctx.drawImage( img, 0, 0, configuration.width, configuration.height );
                    });

                    fs.writeFileSync( path.join( configuration.directories.build, `img`, `${index}.png` ), this.canvas.toBuffer( "image/png" ) );

                    let metadata = {
                        name: `${configuration.name} #${index}`,
                        symbol: ( configuration.network === "solana" && configuration.symbol !== undefined ) ? String( configuration.symbol ).toUpperCase() : undefined,
                        description: `${configuration.description}`,
                        seller_basis_fee_points: ( configuration.network === "solana" && configuration.fee !== undefined ) ? Number( configuration.fee ) : undefined,
                        image: ( configuration.network === "solana" ) ? `${index}.png` : `ipfs://URI/${index}.png`,
                        external_url: ( configuration.network === "solana" && configuration.url !== undefined ) ? configuration.url : undefined,
                        dna: ( configuration.network !== "solana" ) ? genetics.dna : undefined,
                        edition: index,
                        date: ( configuration.network !== "solana" ) ? Date.now() : undefined,
                        attributes: []
                    };
        
                    genetics.genome.forEach( ( gene ) => {
                        if( gene.options !== undefined ) {
                            if( gene.options.ignoredna === undefined ) {
                                metadata.attributes.push({
                                    trait_type: `${gene.attribute}`,
                                    value: `${gene.name}`
                                });
                            }
                        } else {
                            metadata.attributes.push({
                                trait_type: `${gene.attribute}`,
                                value: `${gene.name}`
                            });
                        }
                    });

                    if( configuration.network === "solana" ) {
                        metadata.properties =
                            {
                                files:
                                    [
                                        {
                                            uri: `ipfs://URI/${index}.png`,
                                            type: "image/png"
                                        }
                                    ],
                                    category: "image",
                                    creators:
                                        [
                                            {
                                                address: configuration.address,
                                                share: Number( configuration.share )
                                            }
                                        ]
                            }
                    }
        
                    try {
                        fs.writeFileSync( path.join( configuration.directories.build, `json`, `${index}.json` ), JSON.stringify( metadata, null, 2 ) );
                    } catch( err ) {
                        console.log( `Error Writing Metadata To JSON File:\n`, err );
                    }
                });
            }
        }

        /**
         * Create - Called By The Build Function, Performs The Process If Generating The Pieces Of The Image Set Being Created
         * @param {*} expanse 
         */
        create( expanse = undefined ) {
            this.index = ( expanse !== undefined ) ? expanse.start : undefined;
            
            let failed = 0;

            let count = ( expanse !== undefined ) ? expanse.start : 0;

            let collection = ( expanse !== undefined ) ? new Set( expanse.collection ) : new Set();

            let size = ( expanse !== undefined ) ? expanse.size : configuration.size;

            let layers = this.setup( configuration.layers );

            while( count < size ) {
                let genetics = this.sequence( layers );

                if( !configuration.duplicates ) {

                    if( this.isUnique( collection, genetics ) ) {

                        collection.add( genetics.dna );

                        this.collection.push( genetics );
                        count++;

                    } else {
                        failed++;
                        console.log( `Duplicate Created, Threshold Count Currently At ${failed}` );
                        if( failed > configuration.threshold ) {
                            console.log( `Not Enough Layers To Ensure Uniqueness For The Size Of The Collection Specified. Add More Elements, Or Reduce The Size Of The Collection` );
                            process.exit();
                        }
                    }

                } else {

                    this.collection.push( genetics );
                    count++;

                }
            }

            this.assemble();

        }

        /**
         * Setup - 
         * @param {*} list 
         * @returns 
         */
        setup( list ) {
            return list.map( ( name, index ) => {
                let options = ( name.includes( "?" ) ) ? this.options( name ) : undefined;
                name = ( options !== undefined ) ? options.shift() : name;
                return {
                    id: index,
                    attribute: name,
                    elements: this.elements( name ),
                    options: ( options !== undefined ) ? { ...options[0] } : undefined
                }
            });
        }

        /**
         * Options - 
         * @param {*} data 
         * @returns 
         */
        options( data ) {
            let arr = data.split( "?" );
            let name = arr.shift();
            let options = {};
            arr.forEach( ( el ) => {
                let details = el.split( "=" );
                options[ String( details[ 0 ] ).toLowerCase() ] = details[ 1 ];
            });

            return [name, options];
        }

        /**
         * Sequence - 
         * @param {*} layers 
         * @returns 
         */
        sequence( layers ) {
            let genetics = {
                dna: [],
                genome: []
            }
            let weight;
            layers.forEach( ( layer ) => {
                weight = layer.elements.reduce( ( add, el ) => { return add + el.weight;}, 0);

                let choice = this.random( weight );

                for( let i = 0; i < layer.elements.length; i++ ) {
                    choice -= layer.elements[ i ].weight;
    
                    if( choice < 0 ) {
                        genetics.dna.push( `${layer.elements[ i ].id}:${layer.elements[ i ].attribute}` );
                        return genetics.genome.push({
                            id: `${layer.elements[ i ].id}`,
                            attribute: `${layer.attribute}`,
                            name: `${layer.elements[ i ].attribute}`,
                            filename: `${layer.elements[ i ].filename}`,
                            options: ( layer.options !== undefined ) ? {...layer.options} : undefined
                        });
                    }
                }
            });

            genetics.dna = sha1( genetics.dna.join( "|" ) );
            return genetics;
        }

        /**
         * Elements - 
         * @param {*} dir 
         * @returns 
         */
        elements( dir ) {
            return fs.readdirSync( path.join( `${configuration.directories.base}`, `src`, `nft`, `layers`, dir ) )
                            .filter( ( file ) => {
                                return file.match( /.(bmp|gif|jpg|jpeg|png|tiff)$/);
                            })
                            .map( ( file, index ) => {
                                return {
                                    id: index,
                                    attribute: this.attribute( file ),
                                    filename: file,
                                    weight: this.weight( file )
                                }
                            });
        }

        /**
         * Attribute - 
         * @param {*} file 
         * @returns 
         */
        attribute( file ) {
            return ( file.includes( `${configuration.delimeter}` ) ) ? file.split( `${configuration.delimeter}` )[ 0 ] : file.split( `.` )[ 0 ];
        }

        /**
         * Weight - 
         * @param {*} str 
         * @returns 
         */
        weight( str ) {
            let name = str.split( "." ).shift();
            return ( name.includes( `${configuration.delimeter}` ) ) ? Number( name.split( `${configuration.delimeter}` ).pop() ) : 5;
        }

        /**
         * isUnique - 
         * @param {*} collection 
         * @param {*} genetics 
         * @returns 
         */
        isUnique( collection, genetics ) {
            return !collection.has( genetics.dna );
        }

        /**
         * Assemble - 
         */
        async assemble() {
            let imgs;
            this.collection.forEach( ( element, index ) => {

                imgs = [];

                element.genome.forEach( ( dna ) => {
                    imgs.push( this.load( dna ) );
                });

                this.draw( imgs, ( this.index !== undefined ) ? index + this.index : index );

            });

        }

        /**
         * Draw - 
         * @param {*} imgs 
         * @param {*} index 
         */
        async draw( imgs, index ) {
            await Promise.all( imgs ).then( ( data ) => {
                this.ctx.clearRect( 0, 0, configuration.width, configuration.height );

                data.forEach( ( img ) => {
                    this.ctx.drawImage( img, 0, 0, configuration.width, configuration.height );
                });

                this.save( index ).then( () => {
                    this.write( index );
                }).catch( ( err ) => {
                    console.log( `Error Attempting To Save Image From Canvas Drawing:\n`, err );
                })
            });
        }

        /**
         * Save - 
         * @param {*} index 
         * @returns 
         */
        save( index ) {
            return new Promise( ( resolve, reject ) => {
                try {
                    fs.writeFileSync( path.join( configuration.directories.build, `img`, `${( configuration.network === "solana" ) ? Number( index ) : Number( index + 1 )}.png` ), this.canvas.toBuffer( "image/png" ) );
                    resolve();
                } catch( err ) {
                    reject( err );
                }
            })
        }

        /**
         * Write - 
         * @param {*} index 
         */
        write( index ) {
            let metadata = {
                name: ( configuration.network === "solana" ) ? `${configuration.name} #${index}` : `${configuration.name} #${Number( index + 1 )}`,
                symbol: ( configuration.network === "solana" && configuration.symbol !== undefined ) ? String( configuration.symbol ).toUpperCase() : undefined,
                description: `${configuration.description}`,
                seller_basis_fee_points: ( configuration.network === "solana" && configuration.fee !== undefined ) ? Number( configuration.fee ) : undefined,
                image: ( configuration.network === "solana" ) ? `${index}.png` : `ipfs://URI/${Number( index + 1 )}.png`,
                external_url: ( configuration.network === "solana" && configuration.url !== undefined ) ? configuration.url : undefined,
                dna: ( configuration.network !== "solana" ) ? `${this.collection[ ( this.index !== undefined ) ? Number( index - this.index ) : index ].dna}` : undefined,
                edition: ( configuration.network === "solana" ) ? Number( index ) : Number( index + 1 ),
                date: ( configuration.network !== "solana" ) ? Date.now() : undefined,
                attributes: []
            };

            this.collection[ ( this.index !== undefined ) ? Number( index - this.index ) : index ].genome.forEach( ( gene ) => {
                if( gene.options !== undefined ) {
                    if( gene.options.ignoredna === undefined ) {
                        metadata.attributes.push({
                            trait_type: `${gene.attribute}`,
                            value: `${gene.name}`
                        });
                    }
                } else {
                    metadata.attributes.push({
                        trait_type: `${gene.attribute}`,
                        value: `${gene.name}`
                    });
                }
            });

            if( configuration.network === "solana" ) {
                metadata.properties =
                    {
                        files:
                            [
                                {
                                    uri: `ipfs://URI/${index}.png`,
                                    type: "image/png"
                                }
                            ],
                            category: "image",
                            creators:
                                [
                                    {
                                        address: configuration.address,
                                        share: Number( configuration.share )
                                    }
                                ]
                    }
            }

            try {
                fs.writeFileSync( path.join( configuration.directories.build, `json`, `${( configuration.network === "solana" ) ? Number( index ) : Number( index + 1 )}.json` ), JSON.stringify( metadata, null, 2 ) );
            } catch( err ) {
                console.log( `Error Writing Metadata To JSON File:\n`, err );
            }
        }

        /**
         * Load - 
         * @param {*} dna 
         * @returns 
         */
        async load( dna ) {
            try {
                return new Promise( async ( resolve ) => {
                    const img = await( loadImage( path.join( `${configuration.directories.base}`, `src`, `nft`, `layers`, `${dna.attribute}`, `${dna.filename}` ) ) );
                    resolve( img );
                });
            } catch( err ) {
                console.log( `Error Loading Image:\n`, err );
            }
        }

        /**
         * update - Updates The Metadata Files Of An Already Generated Collection, Can Update The URI, Collection Name, & Description Properties
         * @param  {string} args - The Arguments Passed From The CLI When Running build.js Update Command, [ 1 ] The Property Name Of What Is Being Updated (uri|name|description) [ 2 ] The Updated Value Being Assigned
         */
        update( ...args ) {

            switch( String( args[ 0 ] ).toLowerCase() )
                {
                    case "uri":
                        this.uri( args[ 1 ] );
                        break;

                    case "name":
                        this.name( args[ 1 ] );
                        break;

                    case "description":
                        this.description( args[ 1 ] );
                        break;
                }

        }

        /**
         * uri - Called From The Update Method, Updates The URI In Each Metadata File For The  Generated Collection
         * @param {String} uri  - The IPFS URI Where The Collection Is Hosted
         */
        uri( uri ) {
            let files = this.getMetadata();
            files.forEach( ( file ) => {
                let json = fs.readFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, file ) );
                let data = JSON.parse( json );

                if( configuration.network !== "solana" ){

                    data.image = `ipfs://${uri}/${data.edition}.png`;

                } else {

                    properties.files[ 0 ].uri = `ipfs://${uri}/${data.edition}.png`;

                }

                fs.writeFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, file ), JSON.stringify( data, null, 2 ) );
            });
        }

        /**
         * name - Called From The Update Method, Updates The Collection Name In Each Metadata File For The Generated Collection
         * @param {String} name - The Desired Of The Collection
         */
        name( name ) {
            let files = this.getMetadata();
            files.forEach( ( file ) => {
                let json = fs.readFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, file ) );
                let data = JSON.parse( json );

                data.name = `${name} #${data.edition}`;

                fs.writeFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, file ), JSON.stringify( data, null, 2 ) );
            });
        }

        /**
         * description - Called From The Update Method, Updates The Description In Each Metadata File For The Generated Collection
         * @param {String} description  - The Desired Description For The Collection
         */
        description( description ) {
            let files = this.getMetadata();
            files.forEach( ( file ) => {
                let json = fs.readFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, file ) );
                let data = JSON.parse( json );

                data.description = `${description}`;

                fs.writeFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, file ), JSON.stringify( data, null, 2 ) );
            });
        }

        /**
         * relinkFiles - Fixes The Metadata & Filenames Of The Collection Once Any Images In The Build Directory Have Been Deleted. Allows Manual Deletion Of Images In The Build Directory, The Function Will Rename The Image Files To The Proper Number, & Fix The Corresponding Metadata
         */
        relinkFiles() {
            let imgs = this.getBuildContents().map( filename => filename.split( "." ).shift() );
            let metadata = this.getMetadata().map( filename => filename.split( "." ).shift() );

            imgs.sort( ( a, b ) => { return Number( a ) - Number( b ); });
            metadata.sort( ( a, b ) => { return Number( a ) - Number( b ); });

            let marked = metadata.filter( filename => !imgs.includes( filename ) );

            marked.forEach( ( filename ) => {
                try {
                    fs.unlinkSync( path.join( `${configuration.directories.base}`, `build`, `json`, `${filename}.json` ) );
                } catch( err ) {
                    console.log( `Could Not Remove JSON File Associated With NFT Edition #${filename}\n`, err );
                }
            });

            imgs.forEach( ( filename, index ) => {
                try {
                    fs.renameSync( path.join( `${configuration.directories.base}`, `build`, `img`, `${filename}.png` ), path.join( `${configuration.directories.base}`, `build`, `img`, `${Number( index ) + 1}.png` ) );
                    fs.renameSync( path.join( `${configuration.directories.base}`, `build`, `json`, `${filename}.json` ), path.join( `${configuration.directories.base}`, `build`, `json`, `${Number( index ) + 1}.json` ) );
                } catch( err ) {
                    console.log( `Could Not Fix NFT Edition #${filename} Filename\n`, err );
                }
            });

            metadata = this.getMetadata().map( filename => filename.split( "." ).shift() );
            metadata.sort( ( a, b ) => { return Number( a ) - Number( b ); });

            metadata.forEach( ( file ) => {
                let json = fs.readFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, `${file}.json` ) );
                let data = JSON.parse( json );

                let name = String( data.name ).split( "#" ).shift();

                data.name = `${String( name ).trim()} #${file}`;

                data.edition = file;

                let index = data.image.lastIndexOf( "/" );

                if( index !== -1 ) {
                    data.image = `${String( data.image ).slice( 0, index )}/${file}.png`;
                }

                fs.writeFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, `${file}.json` ), JSON.stringify( data, null, 2 ) );
            });

        }

        /**
         * getMetadata - Returns The List Of JSON Files Currently Generated In The Build Directory
         * @returns Array
         */
        getMetadata() {
            return fs.readdirSync( path.join( `${configuration.directories.base}`, `build`, `json` ) )
                            .filter( ( file ) => {
                                return file.match( /.(json)$/);
                            });
        }

        /**
         * getBuildContents - Returns The List Of Image Files Currently Generated In The Build Directory
         * @returns Array
         */
        getBuildContents() {
            return fs.readdirSync( path.join( `${configuration.directories.base}`, `build`, `img` ) )
                            .filter( ( file ) => {
                                return file.match( /.(png)$/);
                            });
        }

        /**
         * expand - Generates More Images & Corresponding JSON Files Expanding The Collection
         * @param {Int} count (Optional) - Can Pass An Optional Number Of Images To Generate, If Nothing Is Passed The Number Generated Will Be The Size Of The Collection Set In The ENV File Minus The Amount Of Files Currently Generated
         */
        expand( count = undefined ) {
            let collection = [];

            let metadata = this.getMetadata().map( filename => filename.split( "." ).shift() );

            metadata.sort( ( a, b ) => { return Number( a ) - Number( b ); });

            let start = Number( metadata[ metadata.length - 1 ] );

            let size = ( count !== undefined ) ? Number( count ) + Number( metadata[ metadata.length - 1 ] ) : Number( configuration.size );

            metadata.forEach( ( file ) => {
                let json = fs.readFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, `${file}.json` ) );
                let data = JSON.parse( json );

                collection.push( data.dna );
            });

            this.create({start: start, size: size, collection: collection});
        }

        /**
         * random - Generates A Random Weighted Number
         * @param {Int} weight  - 
         * @returns Int
         */
        random( weight ) {
            let choice;
            let count = Math.floor( Math.random() * 10 ) + 1;
            let seed = randomWords({ exactly: Number( Math.floor( Math.random() * 10 ) + 1 ), join: '' });
            let random = seedrandom( seed );
            for( let i = 0; i <= count; i++ ) {
                choice = Math.floor( random() * Number( weight ) );
            }

            return choice;
        }

        /**
         * rarity - generate a report outlining the occurances & rarity of each property & value assigned to those properties
         */
        rarity() {
            let layers = configuration.layers.map( ( name ) => {
                return {
                    name: ( String( name ).includes( "?" ) ) ? String( name ).split( "?" ).shift().trim() : name,
                    elements: fs.readdirSync( path.join( `${configuration.directories.base}`, `src`, `nft`, `layers`, `${( String( name ).includes( "?" ) ) ? String( name ).split( "?" ).shift().trim() : name}` ) )
                                            .filter( ( file ) => {
                                                return file.match( /.(bmp|gif|jpg|jpeg|png|tiff)$/);
                                            })
                                            .map( ( file ) => {
                                                return {
                                                    attribute: this.attribute( file ),
                                                    occurance: 0,
                                                    calculation: undefined
                                                }
                                            })
                }
            });

            let files = this.getMetadata().map( filename => filename.split( "." ).shift() );
            files.sort( ( a, b ) => { return Number( a ) - Number( b ); });

            files.forEach( ( file ) => {
                let json = fs.readFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, `${file}.json` ) );
                let data = JSON.parse( json );

                data.attributes.forEach( ( attribute, index ) => {

                    let i = layers.findIndex( ( layer ) => {
                        return String( layer.name ).toLowerCase() === String( attribute.trait_type ).toLowerCase();
                    });

                    let ii = layers[ i ].elements.findIndex( ( el ) => {
                        return String( el.attribute ).toLowerCase() === String( attribute.value ).toLowerCase();
                    });

                    layers[ i ].elements[ ii ].occurance++;

                });
            });

            layers.forEach( ( layer, i ) => {
                layer.elements.forEach( ( el, ii ) => {
                    el.calculation = `${el.occurance} Out Of ${configuration.size} - Chance: ${( ( Number( el.occurance ) / Number( configuration.size ) ) * 100 ).toFixed( 2 )}%`;
                });
            });

            let metadata = 
                {
                    name: configuration.name,
                    size: configuration.size,
                    rarity: layers
                }

            fs.writeFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, `Rarities.json` ), JSON.stringify( metadata, null, 2 ) );
                
        }

        /**
         * report - Generates A Report JSON File Listing The Names Of The Files Generated With The Property Matching The Specified Value Passed To The Function
         * @param {String} prop 
         * @param {String} val 
         */
        report( prop, val ) {
            let files = this.getMetadata().map( filename => filename.split( "." ).shift() );
            files.sort( ( a, b ) => { return Number( a ) - Number( b ); });

            let metadata;

            metadata = [];

            files.forEach( ( file, index ) => {
                let json = fs.readFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, `${file}.json` ) );
                let data = JSON.parse( json );

                if( String( data.attributes[ 2 ].value ).toLowerCase() === String( coin ).toLowerCase() )
                    {
                        metadata.push( Number( index + 1 ) );
                    }
            });

            fs.writeFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, `${coin}.json` ), JSON.stringify( metadata, null, 2 ) );
        }

       /**
        * network - Changes An Existing Collection's Metadata To Be Compatible With Another Blockchain From Ethereum To Solana Or Vice Versa
        * @param {String} network - The Name Of The Network To Convert The Metadata Compatibility To (ethereum | solana)
        */
        network( network ) {
            let files = this.getMetadata();
            files.forEach( ( file ) => {
                let json = fs.readFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, file ) );
                let data = JSON.parse( json );

                let metadata = {
                    name: data.name,
                    symbol: ( String( network ).toLowerCase() === "solana" && configuration.symbol !== undefined ) ? String( configuration.symbol ).toUpperCase() : undefined,
                    description: data.description,
                    seller_basis_fee_points: ( String( network ).toLowerCase() === "solana" && configuration.fee !== undefined ) ? Number( configuration.fee ) : undefined,
                    image: ( String( network ).toLowerCase() === "solana" ) ? `${data.edition}.png` : data.image,
                    external_url: ( String( network ).toLowerCase() === "solana" && configuration.url !== undefined ) ? configuration.url : undefined,
                    dna: ( configuration.network !== "solana" && data.dna !== undefined ) ? data.dna : undefined,
                    edition: data.edition,
                    date: ( configuration.network !== "solana" && data.date !== undefined ) ? data.date : undefined,
                    attributes: []
                };

                if( String( network ).toLowerCase() === "solana" ) {
                    metadata.properties =
                        {
                            files:
                                [
                                    {
                                        uri: `ipfs://URI/${data.edition}.png`,
                                        type: "image/png"
                                    }
                                ],
                                category: "image",
                                creators:
                                    [
                                        {
                                            address: configuration.address,
                                            share: Number( configuration.share )
                                        }
                                    ]
                        }
                } else {

                    metadata.symbol = undefined;
                    metadata.seller_basis_fee_points = undefined;
                    metadata.external_url = undefined;
                    metadata.dna = ( data.dna !== undefined ) ? data.dna : [];
                    metadata.date = ( data.date !== undefined ) ? data.date : Date.now();
                    metadata.attributes = undefined;

                    if( metadata.dna.constructor === "Array" ) {
                        data.attributes.forEach( ( attribute ) => {
                            metadata.dna.push( `${attribute.trait_type}:${attribute.value}` );
                        });

                        metadata.dna = sha1( metadata.dna.join( "|" ) );
                    }

                }

                fs.writeFileSync( path.join( `${configuration.directories.base}`, `build`, `json`, file ), JSON.stringify( metadata, null, 2 ) );

            });
        }

    }

    module.exports = {Generator};