let data = JSON.parse(localStorage.getItem("data")) || [];;
let userData = JSON.parse(localStorage.getItem("userData")) || [];;
let movieDetails = JSON.parse(localStorage.getItem("movieDetails")) || null;;
const dataPanel = document.getElementById("movie-list");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search");

function openModel() {
    var model = document.getElementById("model");
    model.style.display = "block";
}

// Function to close the model
function closeModel() {
    var model = document.getElementById("model");
    model.style.display = "none";
}
function saveData(data) {
    localStorage.setItem("data", JSON.stringify(data));
}
function saveUserData(data) {
    localStorage.setItem("userData", JSON.stringify(userData));
}
function saveMovieData(data) {
    localStorage.setItem("movieDetails", JSON.stringify(movieDetails));
}
let currentPage = 1;
const moviesPerPage = 10;
async function getMoviesDetails(id) {
    const apiUrl = `https://www.omdbapi.com/?apikey=bc283c3a&i=${id.id}`;
    await getMovieById(apiUrl);
    var model = document.getElementById("model-movie-content");
    model.innerHTML = '';
    model.innerHTML = `<div class="movie-details-item">
    <p class="movie-details--title">${movieDetails.Title}</p>
    <img class="movie-details-img" src=${movieDetails.Poster == 'N/A' ? 'video-camera.png' : movieDetails.Poster} alt=""/>
    <div class='first-section'>
       <p class="movie-details-runtime">Duration ${movieDetails.Runtime}</p>
       <p class="movie-details-rating">Rating ${movieDetails.imdbRating}</p>
       <p class="movie-details-votes">Votes ${movieDetails.imdbVotes}</p>
       <p class="movie-details-year">Year ${movieDetails.Year}</p>
    </div>
    <span class='detail-section'>
       <p class="movie-details-item">${movieDetails.Plot}</p>
    </span>
    <span class='detail-section'>
       <span class='detail-section-label'>Genre</span>
       <p class="movie-details-item">${movieDetails.Genre}</p>
    </span>
    <span class='detail-section'>
       <span class='detail-section-label'>Actors</span>
       <p class="movie-details-item">${movieDetails.Actors}</p>
    </span>
    <span class='detail-section'>
       <span class='detail-section-label'>Awards</span>
       <p class="movie-details-item">${movieDetails.Awards}</p>
    </span>
    <span class='detail-section'>
       <span class='detail-section-label'>Country</span>
       <p class="movie-details-item">${movieDetails.Country}</p>
    </span>
    <span class='detail-section'>
       <span class='detail-section-label'>Director</span>
       <p class="movie-details-item">${movieDetails.Director}</p>
    </span>
    <span class='detail-section'>
       <span class='detail-section-label'>Language</span>
       <p class="movie-details-item">${movieDetails.Language}</p>
    </span>
    <span class='detail-section'>
       <span class='detail-section-label'>Released</span>
       <p class="movie-details-item">${movieDetails.Released}</p>
    </span>
    <span class='detail-section'>
       <span class='detail-section-label'>Writer</span>
       <p class="movie-details-item">${movieDetails.Writer}</p>
    </span>
    
    <div class='comment-section'>
    <input id='rate-input' class='comment-input' />
    <button class="movie-list-item-button" onclick="addRate(${movieDetails.imdbID})">Rate Us</button>
    </div>

    
    <div class="rating-box">
       <header>How was your experience?</header>
       <span id='user-rate' class='user-rate'/>
      
    </div>
    <div class='comment-section'> 
       <input id='comment-input' class='comment-input'></input>
       <button class="movie-list-item-button" onclick="addComment(${movieDetails.imdbID})">Comment</button>
    </div>
    <span id='comment-section' class='comment-div'></span>
 </div>`;
    renderRate(id.id);
    renderComment(id.id);


}
async function displayMoviesForPage(pageNumber) {
    const startIndex = (pageNumber - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    let movieName = searchInput.value
    if (movieName == '')
        movieName = 'harry'
    const apiUrl = `https://www.omdbapi.com/?apikey=bc283c3a&type=movie&s=${movieName}&page=${pageNumber}`;
    await getMovies(apiUrl);
    displayDataListModel(data);
    updatePaginationButtons(pageNumber);
}

function updatePaginationButtons(currentPage) {
    const totalPages = Math.ceil(data.totalResults / moviesPerPage);

    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            displayMoviesForPage(currentPage);
        });
        paginationDiv.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayMoviesForPage(currentPage);
        });
        paginationDiv.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.addEventListener('click', () => {
            currentPage++;
            displayMoviesForPage(currentPage);
        });
        paginationDiv.appendChild(nextButton);
    }
}
async function getMovieById(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    movieDetails = respData;
    saveMovieData(respData);
}
async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    data = respData;
    saveData(respData);
}
function renderRate(imdbID) {
    console.log('hey',imdbID)
    const commentDiv = document.getElementById('user-rate');
    commentDiv.innerHTML = '';
    const index = userData.findIndex(x => x.imdbID === imdbID);

    console.log(index)
    if (index != -1) {
        // console.log(userData[index].comments)
        commentDiv.innerText = userData[index].rate;
    }
    // openModel();
}
function renderComment(imdbID) {

    const commentDiv = document.getElementById('comment-section');
    commentDiv.innerHTML = '';
    const index = userData.findIndex(x => x.imdbID === imdbID);

    if (index != -1) {
        userData[index].comments.forEach((comment) => {
            const commentText = document.createElement('p');
            commentText.classList = 'comment';
            commentText.innerText = comment;
            commentDiv.appendChild(commentText);
        });
    }
    openModel();
};
function addComment(imdbID) {
    console.log(imdbID)
    const commentText = document.getElementById('comment-input');

    const index = userData.findIndex(x => x.imdbID === imdbID.id);
    if (index != -1) {
        userData[index].comments.push(commentText.value)
    } else {
        let obj = {};
        obj.imdbID = imdbID.id;
        obj.rate = 0;
        obj.comments = [commentText.value];
        userData.push(obj);
    }
    commentText.value = '';
    saveUserData();
    renderComment(imdbID.id)
}
function addRate(imdbID) {

    const rateText = document.getElementById('rate-input');
    console.log(rateText.value, imdbID.id);
    const index = userData.findIndex(x => x.imdbID === imdbID.id);
    if (index != -1) {
        userData[index].rate = rateText.value;
    } else {
        let obj = {};
        obj.imdbID = imdbID.id;
        obj.rate = rateText.value;
        obj.comments = [];
        userData.push(obj);
    }
    rateText.value = '';
    saveUserData();
    renderRate(imdbID.id)
}
function displayDataListModel(dataArray) {
    let htmlContent = "";
    dataArray.Search.forEach((item, index) => {
        // console.log(item);
        htmlContent += `
        <div class="movie-list-item">
                        <img class="movie-list-item-img" src=${item.Poster == 'N/A' ? 'video-camera.png' : item.Poster} alt=""/>
                        <p class="movie-list-item-title">${item.Title}</p>
                       
                        <button class="movie-list-item-button" id=${item.imdbID
            } onclick="getMoviesDetails(${item.imdbID})">Details</button>
        
</div>
    
    `;
    });
    dataPanel.innerHTML = htmlContent;
}
searchBtn.addEventListener("click", event => {
    event.preventDefault();
    if (searchInput.value != '')
        displayMoviesForPage(1);
});
displayMoviesForPage(1);
