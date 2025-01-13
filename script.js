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

const displayResult = (result, contenuto) => {
  const songs = result.data;
  for (let i = 0; i < 1; i++) {
    const song = songs[i];
    console.log(song);
    contenuto.innerHTML += /*html*/ `
        <div class="card col-md-2 p-3 align-items-center" id="${song.id}">
        <img src="${song.artist.picture_small}" class="card-img-top" alt="...">
        <div class="card-body">
          <a class="artistPage" href="../artist/artist.html?id=${song.artist.id}"><h6 class="card-text">${song.artist.name}</h6></a>
          <p class="card-text">${song.artist.type}</p>
        </div>
      </div>
        `;
  }
};

const searchArtist = async () => {
  const query = searchInput.value.trim();
  if (query.length > 0) {
    const result = await getResult(query);
    contenuto.innerHTML = "";
    displayResult(result, contenuto);
  } else {
    contenuto.innerHTML = "";
  }
};

const fetchAlbums = async () => {
  try {
    const response = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/album/"
    );
    if (!response.ok) {
      throw new Error("Errore nella richiesta");
    }
    const data = await response.json();
    if (!Array.isArray(data.albums)) {
      throw new Error("Il dato non è un array");
    }

    data.albums.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      const cardContent = `
            <img src="${item.cover_medium}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-text">${item.title}</h5>
                    <span class="fs-6">${item.artist.name}</span>
                </div>
            `;
        card.innerHTML = cardContent;
        cardContent.appendChild(card)
    });
  } catch (error) {
    console.error("Errore nella chiamata API", error);
  }
};
