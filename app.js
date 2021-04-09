//TEMPORARY 
<<<<<<< HEAD
const divCont = document.querySelector('.body-content')
||||||| daad787
const divCont = document.querySelector('.item')
=======
const divCont = document.querySelector('.item');
>>>>>>> 808f54b32a8ff09e766925c129d1ae8064ac7b10
const form = document.querySelector('form');
<<<<<<< HEAD
const songDiv = document.querySelector('.top-songs');
const searchBar = document.querySelector('input');
||||||| daad787
const songDiv = document.querySelector('.top-songs');
const searchBar = document.querySelector('#search-bar');
=======
const searchBar = document.querySelector('#search-bar');
const button = document.querySelector('button');
>>>>>>> 808f54b32a8ff09e766925c129d1ae8064ac7b10
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

// type 1 === top 10 that need to be disoplayed
//type 2 === lyrics and download links for page 
//type 3 === artists
function display(data,type){
  if (type === 1) {
    for ( const obj of data){
      //insert html
    }
  } else if (type === 2) {
    let item = getInfo(data);
  } else if (type === 3) {
    //insertHtml
  }
}

async function getInfo(str){
  let data = await fetch(`${baseUrl.genius}songs/${str}`, urlHeaders.genius2);
  data = await data.json();
  data = data.response.song;
  data = {media:data.media,id:data.id, appleMusic: data.apple_music_player_url, featured: data.featured_artists, primary:data.primary_artist, fullTitle: data.full_title,title: data.title, lyricsByGenius: data.url}
  data.lyrics = await fetch(`${baseUrl.lyrics}${data.primary.name}/${data.title}`);
  data.lyrics = await data.lyrics.json();
  data.lyrics = data.lyrics.lyrics;
  return data;
}


async function getSongsGenius(str){
  str = str.split(" ").join("%20");
  let data = await fetch(`${baseUrl.genius}search?q=${str}`, urlHeaders.genius2);
  data = await data.json();
  return data;
}

async function getSongs(str) {
  let data = await getSongsGenius(str);
  divCont.innerHTML = "";
  data.response.hits.forEach(song => {
    let songName = song.result.title_with_featured;
    let artistName = song.result.primary_artist.name;
    let images = song.result.header_image_thumbnail_url;
    let id = song.result.id;
    divCont.innerHTML += `
      <ul class="artists-song" data-id="${id}">
        <div class="left">
          <a href="song.html?id=${id}"><img src = "${images}"/></a>
        </div>
        <div class="right">
          <li class="song-name">
          ${songName}
          </li>
          <li class="artist-name">
            ${artistName}
          </li>
        <div>
      </ul>
      `
  });
}

async function playMusicSample(id){
  let data = await fetch(`${baseUrl.genius}songs/${id}`, urlHeaders.genius1);
  data = await data.json();
  iframe.src = `${data.response.song.apple_music_player_url}`;
}



//This is for the top 10's list
async function getCityId(coun){
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
  if (id === undefined){
   data = await fetch(`${baseUrl.shaz}track?locale=en-US&pageSize=10&startFrom=1`, urlHeaders.shazam2);
  } else {
    data = await fetch(`${baseUrl.shaz}track?locale=en-US&listId=${id.listid}&pageSize=10`, urlHeaders.shazam2);
  }
  data = await data.json();
  data = data.tracks.map(async (e) =>{
    return await getSongsGenius(e.title);
  })
  data = await Promise.all(data);
  data = data.map((e) => e.response.hits[0].result);
  display(data);
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

/* if (params.has("id")){
  display(params.get("id"),2);
} else {
  searchBar.onkeyup  = (e) => {
    if(searchBar.value.length >= 3){
      getSongs(searchBar.value);
    }
  }
  
  form.onsubmit = (e) => {
    if(searchBar.value.length > 0){
      getSongs(searchBar.value);
    }
    e.preventDefault();
<<<<<<< HEAD
  } 
  
  //change divCont const on top to the element that will hold all the songs searched DO NOT DELETE
   /* divCont.onclick = (e) => {
||||||| daad787
  } */
  
  //change divCont const on top to the element that will hold all the songs searched DO NOT DELETE
   /* divCont.onclick = (e) => {
=======
  } */

/*   //change divCont const on top to the element that will hold all the songs searched DO NOT DELETE
   divCont.onclick = (e) => {
>>>>>>> 808f54b32a8ff09e766925c129d1ae8064ac7b10
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
  }  */
navigator.geolocation.getCurrentPosition(cordToCity, cordToCity
  , {enableHighAccuracy:true});


//uncoment top 2 lines to activate top 10

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

/* songs.innerHTML += `
<h2>${num}.</h2>
<img src="${song.images.coverarthq}" width="200" height="200"/>
<h3>${song.title}</h3>
<h3>${song.subtitle}</h3> */
