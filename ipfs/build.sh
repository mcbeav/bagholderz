#!/bin/bash
#
# Simple Script To Combine A Slightly Modified Version Of The Compiled Dapp Files To Create A Working Single Page HTML File For The IPFS Version Of The Dapp
#
#
# LOCATION (String) -- Stores The Absolute File Path To The Script That Is Running
readonly LOCATION="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )";
#  HTML (String) - Store The Location Where The HTML File Will Be Written
readonly HTML="${LOCATION}/public/complete/index.html";
# DATA (String) - Read & Store The Initial HTML Required HTML Tags, & HEAD Information & Store The Data In The DATA Variable
DATA=$(<"${LOCATION}/build/metadata.html");
# Write The Data Stored In The Initial DATA Variabele To The Final Build Location
echo -e "${DATA}" > "${HTML}";
# Output Progress To Terminal
echo "25% - Initial Head & Metadata Output Written";
# Read The Dapp Controller Compiled Script Starting From Line 2 To Skip The 1st Line Of Auto Generated Comments 
DATA=$(tail -n +2 "${LOCATION}/build/react/ipfs.js");
# Append The Main Controller To The HTML File
echo $'\t<script type=\"text/javascript\">\r\t\t'$DATA$'\r\t</script>' >> "${HTML}";
# Output Progress To Terminal
echo "50% - Controller Script Output Written";
# Read The Scripts File Into The DATA Variable
DATA=$(<"${LOCATION}/build/js/scripts.js");
# Append The Final Set Of Scripts To The HTML File
echo $'\t<script type=\"text/javascript\">\r\t\t'$DATA$'\r\t</script>' >> "${HTML}";
# Output Progress To Terminal
echo "75% - Extra Scripts Written";
# Read The Compiled & Compressed CSS Output To The DATA Variable Because The HTML Data Has Been Written & Is Not Needed
DATA=$(<"${LOCATION}/build/css/stylesheet.css");
# Append The CSS To The HTML Output File
echo $'\t<style type=\"text/css\">\r\t\t'$DATA$'\r\t</style>\r\r\t</head>\r\t<body>\r\r\t</body>\r</html>' >> "${HTML}";
# Output Progress To Terminal
echo "100% - Stylesheet Output Written";