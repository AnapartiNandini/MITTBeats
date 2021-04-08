//TEMPORARY 
const lyrics = document.querySelector('.lyrics')
const form = document.querySelector('form');
const searchBar = document.querySelector('#search-bar');
const baseUrl = { shaz: "https://shazam.p.rapidapi.com/", genius: "https://genius.p.rapidapi.com/", lyrics: "https://api.lyrics.ovh/v1/", download:"", city:"https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en"};
const iframe = document.querySelector("iframe");
const songs = document.querySelector('.top-songs');

navigator.geolocation.getCurrentPosition(function(ite){

}, function(ite){

}, {enableHighAccuracy:true})


const urlHeaders = {
  genius1: {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "2247980046msh68a22faa7c63535p109a44jsn81484c7d80bf",
		"x-rapidapi-host": "genius.p.rapidapi.com"
	  }
  }, 
 genius2: {
  "method": "GET",
  "headers": {
    "x-rapidapi-key": "4616b7ae9cmshb6e506f5ffff27ep1fe324jsn702dc6119fbe",
    "x-rapidapi-host": "genius.p.rapidapi.com"
  }
  }, 
  shazam1:{
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "4616b7ae9cmshb6e506f5ffff27ep1fe324jsn702dc6119fbe",
      "x-rapidapi-host": "shazam.p.rapidapi.com"
    }
  },
  shazam2:{
    "method": "GET",
    "headers": {
     "x-rapidapi-key": "2247980046msh68a22faa7c63535p109a44jsn81484c7d80bf",
     "x-rapidapi-host": "shazam.p.rapidapi.com"
    }
  }
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


//change lyrics const on top to the element that will hold all the songs searched DO NOT DELETE
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

async function cordToCity(loco) {
  if ("code" in loco) {
    loco.latitude = 43.6529;
    loco.longitude = -79.3849;
  }

  let data = await fetch(`${baseUrl.city}&latitude=${loco.latitude}&longitude=${loco.longitude}`)
  data = data.json();
  console.log(data);
}

navigator.geolocation.getCurrentPosition(cordToCity, cordToCity
  
, {enableHighAccuracy:true});

