let artist = document.querySelector('.artist-profile');
let artistText = document.querySelector('.artist-text')
let artistSongs = document.querySelector('.artist-top-songs')
let artistname;
async function getArtistID(url) {
  let id = url.split('=');
  getArtistInfo(id[1])
  getArtistTopSongs(id[1])
}

getArtistID(location.href)

async function getArtistInfo(id) {
  let response = await fetch(`https://genius.p.rapidapi.com/artists/${id}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "e747355dd1mshe2c4dcb5fe7cad9p12f3d4jsn327270b916ee",
      "x-rapidapi-host": "genius.p.rapidapi.com"
    }
  });
  let data = await response.json();
  console.log(data)
  console.log(artist)
  artistname = data.response.artist.name;
  artist.innerHTML = `
  <img src="${data.response.artist.image_url}">
  <div class="artist-text">
  <h3 id="artist">artist</h3>
  <h3>${data.response.artist.name}</h3>
  </div>
  `
}

async function getArtistTopSongs(id) {
  let response = await fetch(`https://genius.p.rapidapi.com/artists/${id}/songs`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "e747355dd1mshe2c4dcb5fe7cad9p12f3d4jsn327270b916ee",
      "x-rapidapi-host": "genius.p.rapidapi.com"
    }
  })
  let data = await response.json();
  let output =  data.response.songs.filter(song => song.primary_artist.name == artistname);
  if(output.length > 5){
    output.forEach(song => {
      artistSongs.innerHTML += `
      <a href="song.html?id=${id}">
        <ul class="artists-song" data-id="${song.id}">
            <div class="left">
            <img src = "${song.song_art_image_thumbnail_url}"/>
            </div>
            <div class="right">
            <li class="song-name">
            ${song.title}
            </li>
            <li class="artist-name">
              ${song.primary_artist.name}
            </li>
          <div>
        </ul>
        </a>
      `
    });
  } else if (output.length < 5) {
    data.response.songs.forEach(song => {
      artistSongs.innerHTML += `
      <a href="song.html?id=${id}">
        <ul class="artists-song" data-id="${song.id}">
            <div class="left">
            <img src = "${song.song_art_image_thumbnail_url}"/>
            </div>
            <div class="right">
            <li class="song-name">
            ${song.title}
            </li>
            <li class="artist-name">
              ${song.primary_artist.name}
            </li>
          <div>
        </ul>
        </a>
      `
    });
  }
}