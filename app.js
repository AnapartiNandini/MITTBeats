//TEMPORARY 
const lyrics = document.querySelector('.lyrics')
const form = document.querySelector('form');
const searchBar = document.querySelector('#search-bar');

async function getArtists(str) {
  console.log(str);
  str = str.split(" ").join("%20");

  let data = await fetch(`https://genius.p.rapidapi.com/search?q=${str}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "4616b7ae9cmshb6e506f5ffff27ep1fe324jsn702dc6119fbe",
      "x-rapidapi-host": "genius.p.rapidapi.com"
    }
  });
  data = await data.json();
  lyrics.innerHTML = "";
  data.response.hits.forEach(song => {
    let songName = song.result.title_with_featured;
    let artistName = song.result.primary_artist.name;
    let images = song.result.header_image_thumbnail_url;
      lyrics.innerHTML += `
      <ul>
        <img src = "${images}"/>
        <li class="song-name">
        ${songName}
        </li>
        <li class="artist-name">
        ${artistName}
        </li>
      </ul>
      `
  });
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

