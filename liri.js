//Required
require("dotenv").config();
var fs = require('file-system');
var request = require('request');
var keys = require('./keys.js');

// Creates Search Term
var searchArray = [];
for (i=3; i< process.argv.length; i++){
    searchArray.push(process.argv[i]);
};

//Command Line (movie-this, spotify-this-song, my-tweets, do-what-it-says)
var commandLine = process.argv[2];
//Search (user Search)
var search = searchArray.join(" ");

//Do What it says
function doWhatItSays(){
    if (commandLine == "do-what-it-says"){
        fs.readFile("random.txt", "utf8", function(error, data){
            if (!error){
                textInfo=data.split(",");
                commandLine=textInfo[0];
                search= textInfo[1];
                // spotify();
                switch(commandLine){
                    case "my-tweets":
                        twitterFunction();
                        console.log("twitter was called");
                        break;
                    case "spotify-this-song":
                        spotifyFunction();
                        console.log("spotify was called");
                        break;
                    case "movie-this":
                        movieFunction();
                        console.log("movies was called");
                        break;
                    default:
                        console.log("please enter a valid request!!!");
                }
            }
            else{
               console.log("An Error Occured with this File. We are very, truly sorry!");
            }
            
        });
    }  
}
//Spotify Function
function spotifyFunction(){
    if (commandLine == "spotify-this-song"){

        //require spotify api
        var Spotify = require('node-spotify-api');
        var spotify = new Spotify({
            id: keys.spotify.id,
            secret: keys.spotify.secret
        });
        //if user doesn't enter a search term
        if (search == ""){
            //set search to "the sign" by Ace of Base
            search = "the sign ace of base"
        }
        //Search and return JSON for spotify callback
        spotify.search({ type: 'track', limit: 1, query: search }, function(err, data) {
            var spotifySongInfo = (
                "\n" +
                "=================== SPOTIFY SEARCH =====================" + "\n" +
                "name: " + data.tracks.items[0].artists[0].name + "\n" +
                "Song Title: " + data.tracks.items[0].name + "\n" +
                "Preview Link: " + data.tracks.items[0].preview_url + "\n" +
                "Album: " + data.tracks.items[0].album.name + "\n" +
                "======================= Log Info =======================" + "\n" +
                ""
            );
            fs.appendFile('log.txt', spotifySongInfo, (err) =>{
                if (err) throw err;
            });
            console.log(spotifySongInfo);

        });
    }
}
//Twitter Function
function twitterFunction(){
    if (commandLine == "my-tweets"){
        var Twitter = require("twitter");
        var client = new Twitter({
            consumer_key: keys.twitter.consumer_key,
            consumer_secret: keys.twitter.consumer_secret,
            access_token_key: keys.twitter.access_token_key,
            access_token_secret: keys.twitter.access_token_secret
        });
        //set params for my username and maximum of 20 tweets
        var params = {
            screen_name: 'alexbrunermusic',
            count: 20
        };
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error && response.statusCode == 200){
               
                //create tweetsArray to hold data from my-tweets
                var tweetsArray = ["\n" + "=================== My Tweets =====================" + "\n"];
                for (i=0; i<tweets.length; i++){
                    tweetsArray[i+1]=(
                        " \n" +
                        "Tweet #"+ (i + 1) + " \n" +
                        "Date: " +tweets[i].created_at + " \n" +
                        "Message: " + tweets[i].text + " \n "
                    );
                }
                tweetsArray.push("\n " + "=================== End of Tweets =====================" + "\n");
                
                //Console.log tweetsArray
                for (i=0; i<tweetsArray.length; i++){
                    //console.log
                    console.log(tweetsArray[i]);
                    //write to log.txt
                    fs.appendFile('log.txt', tweetsArray[i], (err) =>{
                        if (err) throw err;
                    });
                }
            }
        });
    }
}
//Movie Fuction
function movieFunction(){
    if (process.argv[3] == undefined){search = "flubber";}
    // HTTP GET request
	request("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&r=json&apikey=trilogy", function(error, response, body) {
        console.log("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&r=json&apikey=trilogy");

        var movieInfo = JSON.parse(body);
        var displayMovieInfo = (
            "\n" +
            "======================= MOVIE INFO ===========================" + "\n" +
            "Title: " + movieInfo.Title + "\n" +
            "Year: " + movieInfo.Year + "\n" +
            "IMDB Rating:  " + movieInfo.Ratings[0].Value + "\n" +
            "Rotten Rating: " + movieInfo.Ratings[1].Value + "\n" +
            "Country: " + movieInfo.Country + "\n" +
            "Plot: " + movieInfo.Plot + "\n" +
            "Actors: " + movieInfo.Actors + "\n" +
            
            "======================= END MOVIE Info =======================" + "\n" +
            ""
        );
        console.log(displayMovieInfo);
        fs.appendFile('log.txt', displayMovieInfo, (err) =>{
            if (err) throw err;
        });
    });
}

switch(commandLine){
    case "do-what-it-says":
        doWhatItSays();
        break;
    case "my-tweets":
        twitterFunction();
        console.log("twitter was called");
        break;
    case "spotify-this-song":
        spotifyFunction();
        console.log("spotify was called");
        break;
    case "movie-this":
        movieFunction();
        console.log("movies was called");
        break;
    default:
        console.log("please enter a valid request!!!");
}