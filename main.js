import API_KEY from "./config.js";
// import API_KEY from "./key.js";

let baseUrl = "https://api.themoviedb.org/3/";
let movieList = document.getElementById("movie-list");
let api_URL = baseUrl + "/trending/all/day?api_key=" + API_KEY;
let currentPage = 1;
let previousPage = document.getElementById("previous-page");
let nextPage = document.getElementById("next-page");
let previousPageSearch = document.getElementById("previous-page-search");
let nextPageSearch = document.getElementById("next-page-search");

nextPageSearch.style.display = "none";
previousPageSearch.style.display = "none";

function getMovies(url, currentPage) {
  url = url + "&page=" + currentPage;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      showMovies(data.results);
      console.log(data.results);
    });
}
document.getElementById("home-btn").addEventListener("click", () => {
  currentPage = 1;
  nextPageSearch.style.display = "none";
  previousPageSearch.style.display = "none";
  nextPage.style.display = "inline";
  previousPage.style.display = "inline";

  getMovies(api_URL, currentPage);
  console.log("clicked");
});
function addDelay(btn, delay) {
  setTimeout(() => {
    btn.disabled = false;
  }, delay);
}
nextPage.addEventListener("click", () => {
  currentPage++;
  console.log(currentPage);
  getMovies(api_URL, currentPage);
  nextPage.disabled = true;
  addDelay(nextPage, 250);
});
previousPage.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies(api_URL, currentPage);
  } else {
    return;
  }
  previousPage.disabled = true;
  addDelay(previousPage, 250);
});
nextPageSearch.addEventListener("click", () => {
  nextPageSearch.disabled = true;
  let search = document.getElementById("search-bar").value;
  currentPage++;
  let search_url =
    baseUrl +
    `search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${search}`;
  getMovies(search_url, currentPage);
});

previousPageSearch.addEventListener("click", () => {
  nextPageSearch.disabled = false;
  let search = document.getElementById("search-bar").value;
  let search_url =
    baseUrl +
    `search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${search}`;
  if (currentPage > 1) {
    currentPage--;
    getMovies(search_url, currentPage);
  } else {
    return;
  }
  previousPageSearch.disabled = true;
  addDelay(previousPageSearch, 250);
});
function showMovies(data) {
  console.log(currentPage);
  movieList.innerHTML = "";
  if (data.length === 0) {
    movieList.innerHTML = "<h1>No Movies Found</h1>";
    nextPageSearch.disabled = true;
    return;
  }
  addDelay(nextPageSearch, 250);
  data.forEach((movie) => {
    let poster_link = "";
    const { id, title, name, vote_average, poster_path, overview } = movie;
    if (poster_path === null) {
      poster_link = "https://via.placeholder.com/400";
    } else {
      poster_link = `https://image.tmdb.org/t/p/w500/${poster_path}`;
    }
    movieList.innerHTML += `
    <div class="movie">
    
      <img id="movie-img" src="${poster_link}"/>
      <div class="movie-info">
          <h3>${name || title}</h3>
          <span class="${getColor(vote_average)}">${
      Math.round(vote_average * 100) / 100
    }
            </span>
      </div>
      <div class="overview">
          <h3>Overview</h3>
          ${overview}
      </div>
    </div>
    `;
  });
}

//when the search button is clicked
document.getElementById("search-btn").addEventListener("click", () => {
  nextPageSearch.disabled = false;

  currentPage = 1;
  document.query;
  let search = document.getElementById("search-bar").value;
  if (search == "") {
    return;
  } else {
    nextPage.style.display = "none";
    previousPage.style.display = "none";
    nextPageSearch.style.display = "inline";
    previousPageSearch.style.display = "inline";
    let search_url =
      baseUrl +
      `search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${search}`;
    getMovies(search_url, currentPage);
  }
});

document
  .getElementById("search-bar")
  .addEventListener("keyup", function (event) {
    currentPage = 1;
    const searchTerm = event.target.value;
    if (
      event.keyCode === 13 &&
      document.getElementById("search-bar").value != ""
    ) {
      nextPageSearch.disabled = false;

      nextPage.style.display = "none";
      previousPage.style.display = "none";
      nextPageSearch.style.display = "inline";
      previousPageSearch.style.display = "inline";
      event.preventDefault();
      getMovies(
        baseUrl +
          `search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${searchTerm}`
      );
    }
  });
function getColor(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote >= 4) {
    return "orange";
  } else {
    return "red";
  }
}
getMovies(api_URL, currentPage);
setTimeout(() => {
  let moviePosters = document.querySelectorAll(".movie");
  console.log(moviePosters);
}, 50);
