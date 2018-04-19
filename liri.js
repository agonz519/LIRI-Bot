const dotenv = require('dotenv').config(),
  keys = require('./keys.js'),
  request = require('request'),
  fs = require('fs'),
  Twitter = require('twitter'),
  Spotify = require('node-spotify-api'),
  spotify = new Spotify(keys.spotify),
  client = new Twitter(keys.twitter);
let command = process.argv[2];
let parameter = process.argv[3];

const switchFunction = () => {
  switch(command.toLowerCase()) {

    case 'my-tweets':
      let params = {screen_name: 'agonz519'};
      client.get('statuses/user_timeline', params, (error, tweets, response) => {
        if (error) throw error;
        console.log('These are my last 20 tweets!');
        console.log('-----------------------------------------------------------------');
        for (let i = 0; i < tweets.length; i++) {
          console.log(i + 1 + '. "' + tweets[i].text + '" created at: ' + tweets[i].created_at);
          if (i === 20) {
            break;
          }
        }
      });
      break;

    case 'spotify-this-song':
      if (parameter === undefined) {
        parameter = 'The Sign Ace of Base';
        console.log('Since you didn\'t specify a song, I\'ve chosen "The Sign" by "Ace of Base" for you!\n');
      }
      spotify.search({type: 'track', query: parameter}, (error, data) => {
        if (error) throw error;
        console.log('Here is the song information...');
        console.log('-----------------------------------------------------------------');
        console.log('Artist: ' + data.tracks.items[0].artists[0].name);
        console.log('"' + data.tracks.items[0].name + '" from the album: ' + data.tracks.items[0].album.name);
        if (data.tracks.items[0].preview_url !== null) {
          console.log('Preview the song here: ' + data.tracks.items[0].preview_url);
        } else {
          console.log('Sorry, this song does not have a preview url');
        }

      });
      break;

    case 'movie-this':
      if (parameter === undefined) {
        parameter = 'Mr Nobody';
        console.log('Since you didn\'t specify a movie, I\'ve chosen "Mr. Nobody" for you!\n');
      }
      request("http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=trilogy", (error, response, body) => {
        if (error) throw error;
        console.log('Here is the movie information...');
        console.log('-----------------------------------------------------------------');
        console.log('Title: ' + JSON.parse(body).Title);
        console.log('Year Released: ' + JSON.parse(body).Year);
        console.log('IMDB Rating: ' + JSON.parse(body).Ratings[0].Value);
        console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
        console.log('Production Country: ' + JSON.parse(body).Country);
        console.log('Language: ' + JSON.parse(body).Language);
        console.log('Plot: ' + JSON.parse(body).Plot);
        console.log('Actors: ' + JSON.parse(body).Actors);
      });
      break;

    case 'do-what-it-says':
      fs.readFile('random.txt', 'utf-8', (error, data) => {
        if (error) throw error;
        console.log('Following instructions from random.txt file!\n');
        let dataArray = data.split(',');
        command = dataArray[0];
        parameter = dataArray[1];
        switchFunction();
      });
      break;

    default:
      console.log('How did you get here?');
  }
};

switchFunction();