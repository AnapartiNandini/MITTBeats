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

async function displayLyrics(song, artist, images) {
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
