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
            <p class="card-text">${song.type} · <a href="../artist/artist.html?id=${artist.id}">${song.artist.name}</p>
        </div>
      </div>
    `;
};

// card album
const createAlbumCard = (album) => {
    const releaseYear = album.release_date ? album.release_date.split("-")[0] : "N/A";
    return /*html*/ `
      <div class="card col-md-2 p-3 align-items-center" id="album-card">
        <img src="${album.cover_medium}" class="card-img-top rounded-circle" alt="${album.title}">
        <div class="card-body text-center">
            <a href="../album/album.html?id=${album.id}"><h1 class="card-title">${album.title}</h1></a>
            <p class="card-text">${releaseYear} · <a href="../artist/artist.html?id=${artist.id}">${album.artist.name}</a></p>
        </div>
      </div>
    `;
}

const displayResult = (result, contenuto) => {
  const songs = result.data;
  contenuto.innerHTML = "";

  songs.forEach((song) => {
    if (item.type === "artist") {
      contenuto.innerHTML += createArtistCard(item.artist);
    } else if (item.type === "track") {
      contenuto.innerHTML += createSongCard(item);
    } else if (item.type === "album") {
      contenuto.innerHTML += createAlbumCard(item.album);
    }
  });
};

const searchContent = async () => {
  const query = searchInput.value.trim();
  if (query.length > 0) {
    const result = await getResult(query);
    contenuto.innerHTML = "";
    displayResult(result, contenuto);
  } else {
    contenuto.innerHTML = "<h1> Inserisci un termine di ricerca </h1>";
  }
};
