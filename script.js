const contenuto = document.querySelector(".album-song-artist");
const searchInput = document.querySelector("#searchInput");

const getResult = async (query) => {
  try {
    const response = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
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
            <h1 class="card-title">${song.title}</h1>
            <p class="card-text">${song.type} · <a href="../artist/artist.html?id=${song.artist.id}">${song.artist.name}</p>
        </div>
      </div>
    `;
};

// card album
const createAlbumCard = (album) => {
  const releaseYear = album.release_date
    ? album.release_date.split("-")[0]
    : "N/A";
  return /*html*/ `
      <div class="card col-md-2 p-3 align-items-center" id="album-card">
        <img src="${album.cover_medium}" class="card-img-top rounded-circle" alt="${album.title}">
        <div class="card-body text-center">
            <a href="../album/album.html?id=${album.id}"><h1 class="card-title">${album.title}</h1></a>
            <p class="card-text">${releaseYear} · <a href="../artist/artist.html?id=${album.artist.id}">${album.artist.name}</a></p>
        </div>
      </div>
    `;
};

const displayResult = (result, contenuto) => {
  const items = result.data;
  contenuto.innerHTML = "";

  items.forEach((item) => {
    if (item.type === "artist") {
      contenuto.innerHTML += createArtistCard(item);
    } else if (item.type === "track") {
      contenuto.innerHTML += createSongCard(item);
    } else if (item.type === "album") {
      contenuto.innerHTML += createAlbumCard(item);
    }
  });
};

const searchContent = async () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  const result = await getResult(query);
  contenuto.innerHTML = "";
  const { data } = result;

  let topResult = null;
  let artists = [];
  let tracks = [];
  let albums = [];

  //top result
  data.forEach((item) => {
    if (item.type === "artist") {
      artists.push(item);
      if (!topResult && item.name.toLowerCase() === query) {
        topResult = { type: "artist", item };
      }
    } else if (item.type === "album") {
      albums.push(item);
      if (!topResult && item.title.toLowerCase() === query) {
        topResult = { type: "album", item };
      }
    } else if (item.type === "track") {
      tracks.push(item);
      if (!topResult && item.title.toLowerCase() === query) {
        topResult = { type: "track", item };
      }
    }
  });


  // mostra il match esatto se esiste
  if (topResult) {
    if (topResult.type === "artist") {
      contenuto.innerHTML += createArtistCard(topResult.item);
    } else if (topResult.type === "album") {
      contenuto.innerHTML += createAlbumCard(topResult.item);
    } else if (topResult.type === "track") {
      contenuto.innerHTML += createSongCard(topResult.item);
    }
  }

  // mostra gli artisti
  if(artists.length > 0) {
    artists.forEach((artist) => {
      if(topResult && artist.id === topResult.item.id) return; // per evitare duplicati
      contenuto.innerHTML += createArtistCard(artist);
    })
  }

  // mostra gli album 
  if(albums.length > 0) {
    albums.forEach((album) => {
      if(topResult && album.id === topResult.item.id) return; // per evitare duplicati
      contenuto.innerHTML += createAlbumCard(album);
    })
  }

  // mostra le canzoni
  if(tracks.length > 0) {
    tracks.forEach((track) => {
      if(topResult && track.id === topResult.item.id) return; // per evitare duplicati
      contenuto.innerHTML += createSongCard(track);
    })
  }
};
