let contenuto = document.querySelector('.album');

const getAlbums = async () => {
    try {
        const response = await fetch('https://striveschool-api.herokuapp.com/api/deezer/search?q=marracash', {
            method: 'GET',
            redirect: "follow"
        })
        const result = await response.json()
        return result
    } catch (err) {
        console.error(err)
    }
}

const displayAlbum = (result) => {
    
}