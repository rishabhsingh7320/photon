const auth = "563492ad6f91700001000001e7eb3e4509c34cc18fd0b553d5519380";
const gallery = document.querySelector(".gallery"); 
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");

let searchValue;
let isSearching;
let page = 1;


//Event Listener 
searchInput.addEventListener('input', updateInput);
form.addEventListener('submit', event => {
    event.preventDefault();
    searchPhotos(searchValue);
})


more.addEventListener('click',loadMore);

function updateInput(event) {
    searchValue = event.target.value;
}


async function fetchApi(url) {
    const dataFetch = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: auth
        }
    });
    return await dataFetch.json();
}



function generatePictures(data) {
    data.photos.forEach(photo => {
        const galleryImg = document.createElement("div");
        galleryImg.classList.add('gallery-img');
        galleryImg.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
        </div>
        <img src=${photo.src.large} ></img>
        `;
        gallery.appendChild(galleryImg);

    });
}

async function curatedPhotos() {
    const data = await fetchApi("https://api.pexels.com/v1/curated?per_page=15&page=1");
    const pictures = await generatePictures(data);
}


// Search functionality 
async function searchPhotos(query) {
    isSearching = query;
    console.log(`searching for images with query: ${query}`);
    clearCurrentGallery();
    const data = await fetchApi(`https://api.pexels.com/v1/search?query=${query}&per_page=15`);
    generatePictures(data);
}

function clearCurrentGallery() {
    gallery.innerHTML = '';
    searchInput.value = '';
}

async function loadMore() {
    page++;
    let fetchLink;
    if(isSearching) {
        fetchLink = `https://api.pexels.com/v1/search?query=${isSearching}&per_page=15&page=${page}`;
    } else {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    }
    const data = await fetchApi(fetchLink);
    generatePictures(data);

}





// Calling methods 
curatedPhotos();