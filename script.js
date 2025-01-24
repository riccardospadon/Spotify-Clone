const contenuto = document.querySelector(".album-song-artist");
const searchInput = document.querySelector("#searchInput");

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'a2f5c333dbmshc1692817bbb62fcp1575f6jsn2f39edc647dc',
		'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
	}
};

const getRandomData = async () => {
  try{
    const response = await fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=queen', options);
    if(!response.ok){
      throw new Error(`Errore API: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.data
  } catch(err) {
    console.error('Errore nella richiesta', err);
    return []
  }
}

const selectRandomItems = (array, numItems) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
}

const loadRandomContent = async () => {
  const randomData = await getRandomData();
  if(randomData.length > 0) {
    const randomItems = selectRandomItems(randomData, 8);
    displayResult(randomItems)
  } else {
    contenuto.innerHTML = "<p>Errore nel caricamento...</p>";
  }
}

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
  const tracks = [];

  data.forEach((item) => {
    if(item.type === "track") {
      tracks.push(item);
    }
  });

  tracks.forEach((track) => (htmlContent += createSongCard(track)));

  contenuto.innerHTML = htmlContent || "<p>Nessun risultato trovato</p>";
};

document.addEventListener("DOMContentLoaded", loadRandomContent)

const searchContent = async () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    contenuto.innerHTML = "";
    return;
  }

  const result = await getResult(query);
  if(result && result.data) {
    displayResult(result.data)
  } else {
    contenuto.innerHTML = "<p>Nessun risultato trovato</p>";
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