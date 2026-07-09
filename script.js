// OMDb API & JSON Server

const API_KEY = "59a9ba1e";
const OMDB_URL = "https://www.omdbapi.com/";
const JSON_URL = "https://6a4f94b8f45d5352b6119eb0.mockapi.io/movies";

// HTML Elements
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieContainer = document.getElementById("movieContainer");
const savedMovies = document.getElementById("savedMovies");

// Search Movies

searchBtn.addEventListener("click", () => {

    const movieName = searchInput.value.trim();

    if(movieName===""){
        alert("Please enter a movie name");
        return;
    }

    searchMovies(movieName);

});

// Search Function

function searchMovies(movie){

    movieContainer.innerHTML="<h3>Loading...</h3>";

    fetch(`${OMDB_URL}?apikey=${API_KEY}&s=${movie}`)

    .then(res=>res.json())

    .then(data=>{

        movieContainer.innerHTML="";

        if(data.Response==="False"){

            movieContainer.innerHTML="<h2>No Movies Found</h2>";

            return;

        }

        data.Search.forEach(movie=>{

            movieContainer.innerHTML+=`

            <div class="card">

                <img src="${movie.Poster}" alt="">

                <div class="card-content">

                    <h3>${movie.Title}</h3>

                    <p><b>Year :</b> ${movie.Year}</p>

                    <p><b>Type :</b> ${movie.Type}</p>

                    <button class="saveBtn"
                    onclick="saveMovie('${movie.imdbID}')">

                    Save Movie

                    </button>

                </div>

            </div>

            `;

        });

    });

}

// Save Movie

function saveMovie(id){

    fetch(`${OMDB_URL}?apikey=${API_KEY}&i=${id}`)

    .then(res=>res.json())

    .then(movie=>{

        const newMovie={

            title:movie.Title,

            year:movie.Year,

            poster:movie.Poster,

            status:"Want to Watch"

        };


        fetch(JSON_URL,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(newMovie)

        })

        .then(()=>{

            alert("Movie Saved Successfully");

            loadMovies();

        });

    });

}


// Load Saved Movies

function loadMovies(){

    fetch(JSON_URL)

    .then(res=>res.json())

    .then(data=>{

        savedMovies.innerHTML="";

        data.forEach(movie=>{

            savedMovies.innerHTML += `

<div class="card">

    <img src="${movie.poster}" alt="${movie.title}">

    <div class="card-content">

        <h3>${movie.title}</h3>

        <p><b>Year:</b> ${movie.year}</p>

        <p><b>Status:</b> ${movie.status}</p>

        <button class="editBtn" onclick="editMovie('${movie.id}')">
            Edit
        </button>

        <button class="deleteBtn" onclick="deleteMovie('${movie.id}')">
            Delete
        </button>

    </div>

</div>

`;

        });

    });

}

loadMovies();
// Edit Movie

const modal = document.getElementById("editModal");
const close = document.getElementById("close");
const updateBtn = document.getElementById("updateBtn");
const movieStatus = document.getElementById("movieStatus");

let currentMovieId = null;

function editMovie(id){

    currentMovieId = id;

    modal.style.display = "block";

}

close.onclick = function(){

    modal.style.display = "none";

}

window.onclick = function(event){

    if(event.target == modal){

        modal.style.display = "none";

    }

}

// Update Movie

updateBtn.addEventListener("click", async () => {

    const status = movieStatus.value;

    const response = await fetch(`${JSON_URL}/${currentMovieId}`);
    const movie = await response.json();

    movie.status = status;

    await fetch(`${JSON_URL}/${currentMovieId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(movie)
    });

    alert("Movie Updated Successfully");

    modal.style.display="none";

    loadMovies();

});


// Delete Movie

async function deleteMovie(id) {

    if (!confirm("Are you sure you want to delete this movie?")) {
        return;
    }

    try {

        const response = await fetch(`${JSON_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Movie Deleted Successfully");
            loadMovies();
        } else {
            alert("Delete Failed");
        }

    } catch (error) {

        console.log(error);
        alert("Error deleting movie");

    }

}

// My Collection Button

const savedBtn = document.getElementById("savedBtn");

savedBtn.addEventListener("click",()=>{

    document.getElementById("savedMovies").scrollIntoView({

        behavior:"smooth"

    });

});

// Press Enter to Search

searchInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        searchBtn.click();

    }

});

// Initial Load
loadMovies();

// Changing Search Placeholder

const suggestions = [
    "Search for Avengers",
    "Search for Pushpa",
    "Search for RRR",
    "Search for Kalki 2898 AD",
    "Search for Salaar",
    "Search for Animation",
    "Search for Horror Movies",
    "Search for Comedy Movies",
    "Search for Romantic Movies",
    "Search for KGF"
];

let currentSuggestion = 0;

setInterval(() => {

    currentSuggestion++;

    if (currentSuggestion >= suggestions.length) {
        currentSuggestion = 0;
    }

    searchInput.placeholder = suggestions[currentSuggestion];

}, 2000);