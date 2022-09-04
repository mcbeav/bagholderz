# Sequence
Generate NFT Image & Metadata Sets For Ethereum & Solana Networks. (Originally Written For & Used To Generate The bagholderz NFT Collection)

*This project is in the process of being updated & modified for general use. Use at your own risk. I shall not be held liable for anything that may go wrong*

## Setup
- Run *npm install* To Install Required Project Dependencies.
- The images that will be used to assemble the collection should be inside of the layers folder.
- The trait_type in the metadata will use the folder name & is case-sensitive.
- Create a .ENV file in the root of the project. The project uses a .ENV file for configuration.

- ### .ENV Configuration Options
	- **WIDTH**: Sets The Width Of The Generated Images
	- **HEIGHT**: Sets The Height Of The Generated Images
	- **SIZE**: The Size Of The Collection ( The Amount Of Images To Generate )
	- **LAYERS**: A Comma Separated List Of The Names Of The Folders Containing The Images That Will Be Used To Generate The Images. ( Do Not Add Spaces After Each Comma )
		- **options**
			- ?ignoreDNA=true
				- Instructs The App To Ignore The Layer Name When Creating The Attributes For The Metadata
	- **NAME**: The Name Of The NFT Collection
	- **DESCRIPTION**: A Short Description Of The NFT Collection
	- **SYMBOL**: The Symbol For The Smart Contract Of The NFT Collection ( ex: Bitcoin is BTC, Ethereum is ETH )
	- **URL**: The URL For The Collection's Website
	- **ADDRESS**: The Wallet Address For The Owner Of The Smart Contract

	- ### Example Configuration .ENV
		- Sets The Width & Height Of The Images To 600x600 Pixels
		- Sets The Collection Size To 1000 Images To Be Generated
		- Sets The Layers & Layer Order To Background, shadow, shirt, Diamond Hands, Coin, Paper Bag, Crayon, & Outline
			- The shadow, shirt, & outline layers Will Be Ignored When Generating The Metadata & Will NOT Show As Traits
		- Sets The Collection Name To bagholderz
		- Sets The Description Of The Collection
		- Sets The Symbol To BAGZ
		- Sets The URL For The Collection
		
				WIDTH=600
				HEIGHT=600
				SIZE=1000
				LAYERS=Background,shadow?ignoreDNA=true,shirt?ignoreDNA=true,Diamond Hands,Coin,Paper Bag,Crayon,outline?ignoreDNA=true
				NAME=bagholderz
				DESCRIPTION=NFT Collection Reflecting On Current Market Sentiment & The Crypto Community
				SYMBOL=BAGZ
				URL=https://bagholderz.co
				
## Rarity
- By default, each file has a weight of 5, with all files having equal opportunity of being chosen at random.
- The weight of a file can be specified by adding a **#** and the weight to the filename
	- A **lower** number will cause the file to be chosen **less** often
	- A **higher** number will cause the file to be chosen **more** often

By default the file *ADA.png* has a weight of 5

	ADA.png
	
The weight has been changed to 1 & now 	*ADA.png* will appear 5 times less then every other file

	ADA#1.png
	
The weight has been changed to 9 & now *ADA.png* will appear far more often than other files

	ADA#9.png	

## Usage
- **build.js** accepts optional arguments when running the script.


### build
- Builds The NFT Collection According To The Configuration Set In The .ENV File
- The build function runs by default if no parameters are passed when calling **build.js**


> *Runs The Build Function Generating The Collection Based On The Configuration In The .ENV File*

		node build.js
		
- #### Manual Creation
	- A Single Image Can Be Manually Generated Using Specific Images By Specifying Each File Name As Arguments When Calling The Script
	- ***random*** can be used in place of a filename to have the script choose at random

> *Manually Generates An Image With The Layers Specified, Green.png Is Used For The Background, Bag-1 Is Used For The Next Layer, and The Coin Is Chosen At Random*

		node build.js build green bag-1 random

### fix
- Allows You To Delete Generated Files For Any Reason, & Cleans Up The Collection Renaming The Images & JSON Files To Ensure All Images Are In Numerical Order, & The Correct JSON File Is Associated With It
- **If you want to delete any of the generated images, only delete it's image. Run the fix method after deleting the image(s) & the function will handle the JSON**

		node build.js fix

### expand
- Creates More Images Expanding The Collection. Accepts An Optional Parameter. If An Integer Is Passed To The Function The Function Will Create The Specified Amount Of Images. If No Parameter Is Passed To The Function The Function Will Subtract The Amount Of Images That Currently Exist From The SIZE Value Set In The Configuration ENV And Create The Resulting Value Number Of Images.

> Calling expand without specifying a number will count how many images you have currently created, and create new images until the total amount created is equal to the value set as SIZE in the configuration ENV file.

		node build.js expand
		
> Passing an integer value to expand tells expand to create a specific amount of images. This example tells expand to create 5 more images.

		node build.js expand 5


### report
- Generates A Report With An Array Of The Images Containing The Specified Matching Property & Value Pair

> Generates a report with an array of the images that have the coin trait_type equal to ADA

		node build.js report coin ADA


### network
- Modifies An Existing Collection's Metadata To Change Compatibility From Ethereum To Solana Or From Solana To Ethereum

> Changes the existing collection's created metadata from Ethereum to Solana compatibility

		node build.js network solana
		
> Changes the existing collection's created metadata from Solana to Ethereum compatibility

		node build.js network ethereum


### rarity
- Generates A JSON File Detailing The Occurrence Of Each Trait & It's Rarity

		node build.js rarity


### update
- Updates The Metadata For An Already Generated Collection

- #### description
	- Passing description & A String Describing The Collection Will Update The Description In The Metadata Files For The Collection

			node build.js update description "This is an example, updating the description"
			
- #### name
	- Passing name & The Desired Name For The Collection Updates The Name In The Metadata Files For The Collection

			node build.js update name Bagholderz
			
- #### uri
	- Passing uri & The URI String Will Update The URI In The Metadata Files For The Collection

			node.js update uri Az8D72hxYXBwjs823dl0sa89aa



## Issues
- Currently, there is no way to generate a background color, and you must supply a set of background layers if you would like a background. (This feature is planned for the future)

## To Do
- Refactor For More General Use
- Finish Commenting Code
- Finish Updating The Usage Instructions
- Add Option To Generate Background / Background Color Without Requiring A Folder Of Images