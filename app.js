//TEMPORARY 
let lyrics = document.querySelector('.lyrics')
let artistName = [];
let songName = [];
let images = [];
let newArray;
async function getArtists() {
  let response = await fetch("https://genius.p.rapidapi.com/search?q=katy%20perry", {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "4616b7ae9cmshb6e506f5ffff27ep1fe324jsn702dc6119fbe",
      "x-rapidapi-host": "genius.p.rapidapi.com"
    }
  });
  let data = await response.json();
  console.log(data.response.hits)
  data.response.hits.forEach(song => {
    songName.push(song.result.title_with_featured);
    artistName.push(song.result.primary_artist.name);
    images.push(song.result.header_image_thumbnail_url)
  });
  displayLyrics(songName, artistName, images)
  //formatArtist()
}

getArtists();

async function displaySongs(song, artist, images) {
  for(let x = 0; x < song.length; x++) {
    lyrics.innerHTML += `
    <ul>
      <img src = "${images[x]}"/>
      <li class="song-name">
      ${song[x]}
      </li>
      <li class="artist-name">
      ${artist[x]}
      </li>
    </ul>
    `
  }
}
//This is for the top 10's list
let num = 0;
async function getTopSongs(){
  let songs = document.querySelector('.top-songs');
  let response = await fetch("https://shazam.p.rapidapi.com/charts/track?locale=en-US&listId=ip-country-chart-CA&pageSize=20&startFrom=0", {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "4616b7ae9cmshb6e506f5ffff27ep1fe324jsn702dc6119fbe",
      "x-rapidapi-host": "shazam.p.rapidapi.com"
    }
  });
  let data = await response.json();
  console.log(data.tracks) 
  console.log(songs)
  data.tracks.length = 10
  data.tracks.forEach(song => {
    num++;
    songs.innerHTML += `
      <h2>${num}.</h2>
      <img src="${song.images.coverarthq}" width="200" height="200"/>
      <h3>${song.title}</h3>
      <h3>${song.subtitle}</h3>
    `
  });
}
getTopSongs();
//THIS IS THE HTML CODE
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <script src="app.js" defer></script>
//   <title>Document</title>
// </head>
// <body>
//   <h1>Top 10</h1>
//   <div>
//     <ul class="top-songs">

//     </ul>
//   </div>
// </body>
// </html>
