//TEMPORARY 
const lyrics = document.querySelector('.lyrics')
const form = document.querySelector('form');
const searchBar = document.querySelector('#search-bar');
const baseUrl = { shaz: "https://shazam.p.rapidapi.com/", genius: "https://genius.p.rapidapi.com/", lyrics: "https://api.lyrics.ovh/v1/", download:""};
const iframe = document.querySelector("iframe");
const urlHeaders = {genius1: {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "2247980046msh68a22faa7c63535p109a44jsn81484c7d80bf",
		"x-rapidapi-host": "genius.p.rapidapi.com"
	}}, 
 genius2: {
  "method": "GET",
  "headers": {
    "x-rapidapi-key": "4616b7ae9cmshb6e506f5ffff27ep1fe324jsn702dc6119fbe",
    "x-rapidapi-host": "genius.p.rapidapi.com"
  }}
}

async function getArtists(str) {
  str = str.split(" ").join("%20");

  let data = await fetch(`${baseUrl.genius}search?q=${str}`, urlHeaders.genius2);
  data = await data.json();
  lyrics.innerHTML = "";
  data.response.hits.forEach(song => {
    let songName = song.result.title_with_featured;
    let artistName = song.result.primary_artist.name;
    let images = song.result.header_image_thumbnail_url;
    let id = song.result.id;
      lyrics.innerHTML += `
      <ul data-id="${id}">
        <img src = "${images}"/>
        <li class="song-name">
        ${songName}
        </li>
        <li class="artist-name">
        ${artistName}
        </li>
        <li class="song-name">
        <i class="fas fa-play"></i>
        </li>
      </ul>
      `
  });
}

async function playMusicSample(id){
  let data = await fetch(`${baseUrl.genius}songs/${id}`, urlHeaders.genius1);
  data = await data.json();
  console.log(data);
  console.log(data.response.song.apple_music_player_url);
  iframe.src = `${data.response.song.apple_music_player_url}`;
}

searchBar.onkeyup  = (e) => {
  if(searchBar.value.length >= 3){
    getArtists(searchBar.value);
  }
}

form.onsubmit = (e) => {
  if(searchBar.value.length > 0){
    getArtists(searchBar.value);
  }
  e.preventDefault();
}

lyrics.onclick = (e) => {
  console.log(e.target);
  let close = e.target.closest("ul");
  console.log(close);
  if (close != undefined && e.target.classList.contains("fa-play")) {
    playMusicSample(close.dataset.id);
    e.target.classlist.toggle("fa-play", "fa-pause");

  } else if (close != undefined && e.target.classList.contains("fa-pause")){
    e.target.classlist.toggle("fa-play", "fa-pause");
  } else if (close != undefined ){

  }
}