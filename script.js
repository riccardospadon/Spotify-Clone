const contenuto = document.querySelector(".album-song-artist");
const searchInput = document.querySelector("#searchInput");

// gli endpoint devono essere 2:
// https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}
// https://deezerdevs-deezer.p.rapidapi.com/artist/search?q=${query}

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'a2f5c333dbmshc1692817bbb62fcp1575f6jsn2f39edc647dc',
		'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
	}
};
const getResult = async (query) => {
  try {
    const response = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, options);
    if(!response.ok){
      throw new Error(`Errore API: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Errore nella richiesta", err);
    return null
  }
};

// creazione card in base alla ricerca:

// card artista
const createArtistCard = (artist) => {
  return /*html*/ `
      <div class="card col-md-2 p-3 align-items-center" id="artist-card">
        <img src="${artist.picture_medium}" class="card-img-top rounded-circle" alt="${artist.name}">
        <div class="card-body text-center">
            <a href="../artist/artist.html?id=${artist.id}"><h6 class="card-title">${artist.name}</h6></a>
            <p class="card-text">${artist.type}</p>
        </div>
      </div>
    `;
};

// card canzoni
const createSongCard = (song) => {
  return /*html*/ `
      <div class="card col-md-2 p-3 align-items-center" id="song-card">
        <img src="${song.album.cover_medium}" class="card-img-top rounded-circle" alt="${song.title}">
        <div class="card-body text-center">
            <h3 class="card-title">${song.title}</h3>
            <span class="card-text">${song.type}<span> · <a href="../artist/artist.html?id=${song.artist.id}">${song.artist.name}</a>
        </div>
      </div>
    `;
};


const displayResult = (data) => {
  let htmlContent = "";
  let topResult = null;
  const artists = [];
  const albums = [];
  const tracks = [];

  data.forEach((item) => {
    if (item.type === "artist") {
      artists.push(item);
      if (!topResult && item.name.toLowerCase().includes(searchInput.value.toLowerCase())) {
        topResult = { type: "artist", item };
      }
    } else if (item.type === "album") {
      albums.push(item);
      if (!topResult && item.title.toLowerCase().includes(searchInput.value.toLowerCase())) {
        topResult = { type: "album", item };
      }
    } else if (item.type === "track") {
      tracks.push(item);
      if (!topResult && item.title.toLowerCase().includes(searchInput.value.toLowerCase())) {
        topResult = { type: "track", item };
      }
    }
  });

  if (topResult) {
    if (topResult.type === "artist") htmlContent += createArtistCard(topResult.item);
    if (topResult.type === "album") htmlContent += createAlbumCard(topResult.item);
    if (topResult.type === "track") htmlContent += createSongCard(topResult.item);
  }

  artists.forEach((artist) => (htmlContent += createArtistCard(artist)));
  albums.forEach((album) => (htmlContent += createAlbumCard(album)));
  tracks.forEach((track) => (htmlContent += createSongCard(track)));

  contenuto.innerHTML = htmlContent;
};


const searchContent = async () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    contenuto.innerHTML = "";
    return;
  }

  const result = await getResult(query);
  if (result && result.data) {
    displayResult(result.data);
  } else {
    contenuto.innerHTML = "<p>Errore nella ricerca. Riprova più tardi.</p>";
  }
};


// Debounce per evitare chiamate inutili
let debounceTimeout;
searchInput.addEventListener("keyup", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    searchContent();
  }, 150); // Ritardo di 150ms
});
