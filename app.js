//TEMPORARY 
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const modalForm = document.querySelector('.modal-content form');
const nameInput = document.querySelector('.modal-content .input-name');
const emailInput = document.querySelector('.modal-content .input-email');
const userName = document.querySelector('.sidebar-profile .user-name')
const userEmail = document.querySelector('.sidebar-profile .user-email')
const arrow = document.querySelector('.back-to-home');
const divCont = document.querySelector('.body-content');
const featured = document.querySelector('.artists');
const form = document.querySelector('form');
const songDiv = document.querySelector('.top-songs');
const searchBar = document.querySelector('#search-bar');
const button = document.querySelector('button');
const baseUrl = { shaz: "https://shazam.p.rapidapi.com/charts/", genius: "https://genius.p.rapidapi.com/", lyrics: "https://api.lyrics.ovh/v1/", download:"", city:"https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en"};
const iframe = document.getElementsByTagName("iframe")[0];
const songs = document.querySelector('.top-songs');
const params = new URLSearchParams(window.location.search);

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
  shazam1: {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "610ad29b0bmshfd6c939c7547495p1c3f93jsn2ca0556b4d1d",
      "x-rapidapi-host": "shazam.p.rapidapi.com"
    }
  },
  shazam2: {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "e747355dd1mshe2c4dcb5fe7cad9p12f3d4jsn327270b916ee",
        "x-rapidapi-host": "shazam.p.rapidapi.com"
    }
}
}

// type 1 === top 10 that need to be disoplayed
//type 2 === lyrics and download links for page 
//type 3 === artists
function display(data,type){
  if (type === 1) {
    data.forEach((song, i) => {
      songDiv.innerHTML += `
        <h1 class="number">${i + 1}</h1>
        <div class="song" data-id="${song.id}">
          <img src="${song.song_art_image_url}" width="200" height="200"/>
          <div class="overlay">
            <h3 class="title">${song.title}</h3>
            <h3 class="artist-name">${song.primary_artist.name}</h3>
          </div>
        <div>
        <div class="play-button">
          <a href="song.html"><span class="material-icons-outlined">play_arrow</span></a>
        </div>
        `
    });
    for ( const obj of data){
      //insert html
    }
  } else if (type === 2) {
    let item = getInfo(data);
    console.log(item);
  } else if (type === 3) {
    console.log(data);
    data.forEach(element => {
      featured.innerHTML += `
      <a href="artists-info.html?id=${element.id}">
        <div class="featured-song" data-artist-id="${element.id}">
        <img src="${element.image_url}"/>
        <h3>${element.name}</h3>
        </div>
      </a>
      `
    });
  }
}


async function getInfo(str) {
  let data = await fetch(`${baseUrl.genius}songs/${str}`, urlHeaders.genius2);
  data = await data.json();
  data = data.response.song;
  data = { media: data.media, id: data.id, appleMusic: data.apple_music_player_url, featured: data.featured_artists, primary: data.primary_artist, fullTitle: data.full_title, title: data.title, lyricsByGenius: data.url }
  data.lyrics = await fetch(`${baseUrl.lyrics}${data.primary.name}/${data.title}`);
  data.lyrics = await data.lyrics.json();
  data.lyrics = data.lyrics.lyrics;
  return data;
}


async function getSongsGenius(str) {
  str = str.split(" ").join("%20");
  let data = await fetch(`${baseUrl.genius}search?q=${str}`, urlHeaders.genius2);
  data = await data.json();
  return data;
}

async function getSongs(str) {
  let data = await getSongsGenius(str);
  divCont.innerHTML = "";
  divCont.innerHTML = `<div class="back-to-home"><i class="material-icons" style="font-size:48px;color:white">arrow_back</i></div>`
  divCont.innerHTML = `<h1>search results for ${str} </h1>`
  console.log(data)
  data.response.hits.forEach(song => {
    let songName = song.result.title_with_featured;
    let artistName = song.result.primary_artist.name;
    let images = song.result.header_image_thumbnail_url;
    let id = song.result.id;
    divCont.innerHTML += `
    <a href="song.html?id=${id}">
      <ul class="artists-song" data-id="${id}">
          <div class="left">
          <img src = "${images}"/>
          </div>
          <div class="right">
          <li class="song-name">
          ${songName}
          </li>
          <a href="artists-info.html?id=${song.result.primary_artist.id}">
            <li class="artist-name">
              ${artistName}
            </li>
          </a>
        <div>
      </ul>
      </a>
      `
  });
}

async function playMusicSample(id) {
  let data = await fetch(`${baseUrl.genius}songs/${id}`, urlHeaders.genius1);
  data = await data.json();
  iframe.src = `${data.response.song.apple_music_player_url}`;
}

//This is for the top 10's list
async function getCityId(coun) {
  let data = await fetch(`${baseUrl.shaz}list`, urlHeaders.shazam1);
  data = await data.json();

  let dataMusic;
  console.log(dataMusic);
  data.countries.forEach((e) => {
    if (e.name.toLowerCase() === coun.countryName.toLowerCase()) {
      dataMusic = e.cities.find((city) => {
        if (city.name.toLowerCase() === coun.city.toLowerCase()) {
          return true;
        }
      });

      if (dataMusic === undefined) {
        dataMusic = e.cities[0];
      }
    }
  });
  getTopSongs(dataMusic);
}


async function getArtists(data) {
  data = data.map((e) => e.primary_artist);
  display(data, 3);
}

async function getTopSongs(id){
  console.log(id);
  let data;
  if (id === undefined) {
    data = await fetch(`${baseUrl.shaz}track?locale=en-US&pageSize=10&startFrom=1`, urlHeaders.shazam2);
  } else {
    data = await fetch(`${baseUrl.shaz}track?locale=en-US&listId=${id.listid}&pageSize=10`, urlHeaders.shazam2);
  }
  data = await data.json();
  data = data.tracks.map(async (e) => {
    return await getSongsGenius(e.title);
  })
  data = await Promise.all(data);
  data = data.map((e) => e.response.hits[0].result);
  toptendata = data;
  display(data,1);
  getArtists(data);
}

async function cordToCity(loco) {
  if ("code" in loco) {
    loco.latitude = 43.6529;
    loco.longitude = -79.3849;
  }

  let data = await fetch(`${baseUrl.city}&latitude=${loco.latitude}&longitude=${loco.longitude}`)
  data = await data.json();
  getCityId(data);
}

 if (params.has("id")){
  display(params.get("id"),2);
} else {
  searchBar.onkeyup = (e) => {
    if (searchBar.value.length >= 3) {
      getSongs(searchBar.value);
    }
  }
  form.onsubmit = (e) => {
    if(searchBar.value.length > 0){
      getSongs(searchBar.value);
    }
    e.preventDefault();
  } 

  //change divCont const on top to the element that will hold all the songs searched DO NOT DELETE
   divCont.onclick = (e) => {
    console.log(e.target)
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
navigator.geolocation.getCurrentPosition(cordToCity, cordToCity
  , {enableHighAccuracy:true});
}

span.onclick = function() {
  modal.style.display = "none";
  userName.textContent = nameInput.value;
  userEmail.textContent = emailInput.value;
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    userName.textContent = nameInput.value;
    userEmail.textContent = emailInput.value;
  }
}