# Catch-Me-FrontEnd
Web page is a front end application which allows to analyse a KataGo game and check if there is a cheater or not.

## Table of contents
* [Disclaimer](#disclaimer)
* [Screenshots](#screenshots)
* [General info](#general-info)
* [Requirements](#requirements)
* [Technologies](#technologies)
* [Output](#output)
* [Cheating Algorithm](#algorithm)
* [Setup](#setup)


## Disclaimer
This Program isn't Finished. The function which checks for chearts needs to be imporved since at this time there is only a 20% chance to detect a GO cheater.
However, you a free to take on this challenge and try to improve the cheat detection.
## Screenshots
![](GameKataGo.png?v=4&s=200)


![](KataGo_Analysis.png?v=4&s=200)
## General info
The webpage allows to drag and drop your SGF file and send it to a KataGo backend (set up as a rest-service), with the response from KataGo the webpage allows you 
to create graphs to analyse the scorelead/utility which increases or decreased depending on the turn number. The graphs are split up into player black and white. In addition,
the Cheat detection alogorithm shows a percentage on how mutch a player cheated.

## Requirements
The SGF file and the analysed katago file. A working backend with KataGo set up on localhost (expect if you change the url in the code) which allows sending post requests to KataGo from the webpage. An installed Web-Browser such as Google Chrome where the webpage was tested on.

## Technologies
The code is writtin in plain HTML,Css and Javascipt and works in your favorite Web-Browser. The webpage was tested on Google Chrome and no other Browser.

## Output
Graphs on the utility,scorelead and the percentage of how mutch the player cheated as shown in the screenshots.

## Algorithm
The basic idea of the alogorithm is to check if in the Go game a player played 20% of the moves as the KataGo AI. If yes it should be tagged as a cheater. The values taken from 
KataGo are the PVs suggested next moves based on the previous move of the player.


## Setup
Download, the project and open in in your foavorite IDE. You are required to start the webpage on a server if you are using Visul Studio code you can easily launch it in a live server. In addition, you might be required to change the url where your KataGo backend is located to make the program properly work.

