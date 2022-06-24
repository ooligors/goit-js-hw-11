const BASEURL = "https://pixabay.com/api/";
const APIKEY = "28151063-e7dd8a3e4997fffdb31b020c7";

const axios = require('axios');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const btnLoadMore = document.querySelector(".load-more");
btnLoadMore.style.display = "none";

searchForm.addEventListener("submit", fetchImages);
btnLoadMore.addEventListener("click", loadMore);
const perPage = 40;

let page = 1;
let searchQuery = '';

function loadMore(e) {
  page++;
  fetchImages(e);
}

console.log(searchForm);
async function fetchImages(e) {
  e.preventDefault();
  const inputValue = document.querySelector("[name='searchQuery']").value.trim();

  if (inputValue !== searchQuery) {
    gallery.innerHTML = "";
    page = 1;
    btnLoadMore.style.display = "none";
  }

  searchQuery = inputValue;

  try {
    // const response = await axios.get(`${BASEURL}?key=${APIKEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
    const response = await axios.get(BASEURL, {
      params: {
        q: inputValue,
        page: page,
        key: APIKEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage
      }
    });

    console.log(response);
    // if (inputValue === "") {
    //   page === 0;
    //   gallery.innerHTML = "";

    //   Notify.success("Please enter a search query");
    // }

    if (response.data.hits.length === 0) {
      Notify.info('Sorry, there are no images matching your search query.Please try again.');
    }
    let totalHits = response.data.totalHits;
    if (response.data.hits.length > 0 & page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (page === (Math.ceil(totalHits / perPage))) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }


    toogleShowLoadBtn(totalHits);

    response.data.hits.forEach(item => {
      const imgWeb = item.webformatURL
      const imgLarge = item.largeImageURL;
      const alt = item.tags;
      const likes = item.likes;
      const views = item.views;
      const comments = item.comments;
      const downloads = item.downloads;
      const obj = {
        imgWeb,
        imgLarge,
        alt,
        likes,
        views,
        comments,
        downloads
      }
      renderImages(obj)
    })

    toIncreaseImg();
  } catch (error) {
    console.error(error);
  }
}

function toogleShowLoadBtn(totalHits) {
  let display = "none";
  if (totalHits > (page * perPage)) {
    display = "block";
  }
  btnLoadMore.style.display = display;
}

function renderImages(img) {

  gallery.insertAdjacentHTML("beforeEnd", `<div class="photo-card">
  <a href="${img.imgLarge}"> <img src="${img.imgWeb}" alt="${img.alt}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes<br>${img.likes}</b>
    </p>
    <p class="info-item">
      <b>Views<br>${img.views}</b>
    </p>
    <p class="info-item">
      <b>Comments<br>${img.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads<br>${img.downloads}</b>
    </p>
  </div>
</div> `)
}

gallery.addEventListener("click", toIncreaseImg);

function toIncreaseImg(e) {
  console.log(e);
  // e.preventDefault();
  const lightbox = new SimpleLightbox('.gallery div a', { captionsData: 'alt', captionDelay: 250, });
}






