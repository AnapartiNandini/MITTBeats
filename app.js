//TEMPORARY 
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const modalForm = document.querySelector('.modal-content form');
const nameInput = document.querySelector('.modal-content .input-name');
const emailInput = document.querySelector('.modal-content .input-email');
const userName = document.querySelector('.sidebar-profile .user-name')
const userEmail = document.querySelector('.sidebar-profile .user-email')
const arrow = document.querySelector('.back-to-home');
const featured = document.querySelector('.artists');
const options = document.querySelector('.options');
const form = document.querySelector('form');
const songDiv = document.querySelector('.top-songs');
const searchBar = document.querySelector('#search-bar');
const button = document.querySelector('button');
const baseUrl = { geniusArt: "https://genius.p.rapidapi.com/artists/", shaz: "https://shazam.p.rapidapi.com/charts/", genius: "https://genius.p.rapidapi.com/", lyrics: "https://api.lyrics.ovh/v1/", download: "https://www.yt2mp3s.me/@api/button/mp3/", city: "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en" };
const iframe = document.getElementsByTagName("iframe")[0];
const songs = document.querySelector('.top-songs');
const artist = document.querySelector('.artist-profile');
const artistText = document.querySelector('.artist-text')
const artistSongs = document.querySelector('.artist-top-songs')
const params = new URLSearchParams(window.location.search);

let divCont = document.querySelector('.body-content');
if (divCont === null){
  divCont = document.querySelector(".container");
  console.log(divCont);
}
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
      "x-rapidapi-key":  "7392255746msh57a53e0966959e4p1efa96jsncf706ab578df",
      "x-rapidapi-host": "shazam.p.rapidapi.com"
    }
  },
  shazam2: {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "8eb2b2d59dmsh29a8df3428b500fp16d509jsnfb6b13258dbe",
      "x-rapidapi-host": "shazam.p.rapidapi.com"
    }
  }
}

// type 1 === top 10 that need to be disoplayed
//type 2 === lyrics and download links for page 
//type 3 === artists
//type 4 === artists page
async function display(data, type) {
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
          <a href="#"><span class="material-icons-outlined">play_arrow</span></a>
        </div>
        <div>
        </div>
        `
    });
  } else if (type === 2) {
    let item = await getInfo(data);
    divCont.innerHTML = `
    <div class="backImage">
      <img src="${item.primary.image_url}" />
      <div class="song-audio">
        <iframe height="50" width="500" src="${item.appleMusic}"></iframe>
      </div>
    </div>
    <div class="song-lyrics">
      <div class="song-info">
        <h1>${item.title}</h1>
        <a href="artists-info.html?id=${item.primary.id}&artist"><p>${item.primary.name}</p></a>
      </div>
      <div class="lyrics">
        ${item.lyrics}
      </div>    
      <a class="button" href="#popup1">Download here</a>
      <div id="popup1" class="overlay">
        <div class="popup">
          <a class="close" href="#">&times;</a>
          <div class="content">
            <iframe class="button-api-frame" src="https://www.yt2mp3s.me/@api/button/mp3/${item.you}" width="115px" height="115px" allowtransparency="true" scrolling="no" style="border:none"></iframe>
            <iframe class="button-api-frame" src="https://www.yt2mp3s.me/@api/button/videos/${item.you}" width="100%" height="100%" allowtransparency="true" scrolling="no" style="border:none"></iframe>
          </div>
        </div>
      </div>
    </div>
  `
  } else if (type === 3) {
    console.log(data);
    data.forEach(element => {
      featured.innerHTML += `
      <a href="artists-info.html?id=${element.id}&artist">
        <div class="featured-song" data-artist-id="${element.id}">
        <img src="${element.image_url}"/>
        <h3>${element.name}</h3>
        </div>
      </a>
      `
    });
  } else if (type === 4) {
    let artistData = await getArtistInfo(data);
    artist.innerHTML = `
     <img src="${artistData.response.artist.image_url}">
     <div class="artist-text">
     <h3 id="artist">artist</h3>
     <h3>${artistData.response.artist.name}</h3>
     </div>
     `
    console.log(artistData);
    let output = artistData.songs.filter(song => song.primary_artist.name == artistData.response.artist.name);
    if (output.length > 5) {
      output.forEach(song => {
        artistSongs.innerHTML += `
      <a href="song.html?id=${song.id}">
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
      artistData.songs.forEach(song => {
        artistSongs.innerHTML += `
      <a href="song.html?id=${song.id}">
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
}
async function getArtistInfo(id) {
  let data = await fetch(`${baseUrl.geniusArt}${id}`, urlHeaders.genius2);
  data = await data.json();

  let music = await fetch(`${baseUrl.geniusArt}${id}/songs?sort=popularity`, urlHeaders.genius2);
  music = await music.json();
  data.songs = music.response.songs;
  return data;
}

async function getInfo(str) {
  let data = await fetch(`${baseUrl.genius}songs/${str}`, urlHeaders.genius2);
  data = await data.json();
  data = data.response.song;
  data = { media: data.media, id: data.id, appleMusic: data.apple_music_player_url, featured: data.featured_artists, primary: data.primary_artist, fullTitle: data.full_title, title: data.title, lyricsByGenius: data.url }
  data.lyrics = await fetch(`${baseUrl.lyrics}${data.primary.name}/${data.title}`);
  data.you = data.media.find((e) => e.provider === "youtube");
  console.log(data.you);
  data.you = data.you.url;
  data.you = data.you.split("=");
  data.you = data.you.pop();
  data.lyrics = await data.lyrics.json();
  data.lyrics = data.lyrics.lyrics;
  if (data.lyrics === undefined){
    data.lyrics = `<a href="${data.lyricsByGenius}">Lyrics</a>`;
  } 
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
  divCont.innerHTML = `<div class="back-to-home"><a href="index.html"><i class="material-icons" style="font-size:48px;color:white">arrow_back</i></a></div>`
  arrowExists = true;
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
          <a href="artists-info.html?id=${song.result.primary_artist.id}&artist">
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

async function getTopSongs(id) {
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
  display(data, 1);
  getArtists(data);
}

async function cordToCity(loco) {
  if ("code" in loco) {
    loco.latitude = 43.6529;
    loco.longitude = -79.3849;
  } else{
    sessionStorage.setItem("loco", JSON.stringify(loco));
  }
  let data = await fetch(`${baseUrl.city}&latitude=${loco.latitude}&longitude=${loco.longitude}`)
  data = await data.json();
  getCityId(data);
}

if (params.has("id")) {
  if (!params.has("artist")) {
    display(params.get("id"), 2);
  } else {
    display(params.get("id"), 4);
  }

} else {
  // When the user clicks on <span> (x), close the modal
  if(localStorage.getItem('name') === null) {
  span.onclick = function () {
    modal.style.display = "none";
    localStorage.setItem('name', nameInput.value)
    localStorage.setItem('email', emailInput.value)
    userName.textContent = nameInput.value;
    userEmail.textContent = emailInput.value;
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {

    if (event.target == modal) {
      modal.style.display = "none";
      localStorage.setItem('name', nameInput.value)
      localStorage.setItem('email', emailInput.value)
      userName.textContent = nameInput.value;
      userEmail.textContent = emailInput.value;
    }
  }
} else {
  modal.style.display = "none";
  userName.textContent = localStorage.getItem("name");
  userEmail.textContent = localStorage.getItem("email");
  
}
if (sessionStorage.getItem('loco') === null){
  navigator.geolocation.getCurrentPosition(cordToCity, cordToCity
    , { enableHighAccuracy: true });
} else {
  cordToCity(JSON.parse(sessionStorage.getItem("loco")));
}
  //change divCont const on top to the element that will hold all the songs searched DO NOT DELETE
  divCont.onclick = (e) => {
    const close = e.target.closest(".play-button");
    const ite = e.target.closest(".song").dataset.id;
    if (close != undefined) {
      playMusicSample(ite);
    } else {
      window.location.replace(`song.html?id=${ite}`);
    }
  }
}

searchBar.onkeyup = (e) => {
  if (searchBar.value.length >= 3) {
    getSongs(searchBar.value);
  }
}

form.onsubmit = (e) => {
  if (searchBar.value.length > 0) {
    getSongs(searchBar.value);
  }
  e.preventDefault();
}

