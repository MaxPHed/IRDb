const cardHolder = document.querySelector("#card-holder");
let userArray = [];
const apiUrl = "https://localhost:7268/api/Movies";

// Initialize tooltips
initTooltips();

// Fetch movies on page load
fetchMovies();

//Selectors
const newMovieBtn = document.querySelector("#new-movie-btn");

//Event listeners
newMovieBtn.addEventListener("click", addNewMovie);

//Functions

// Enable Bootstrap tooltips, popovers, etc.
function initTooltips() {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  tooltipTriggerList.forEach(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}

// GET all movies in Db and make a card of them
async function fetchMovies() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    // Render movies on the UI
    renderMovies(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function renderMovies(movies) {
  const cardHolder = document.querySelector("#card-holder");
  movies.forEach((movie) => makeMovieCard(movie, cardHolder));
}

function addNewMovie() {
  // Create a new card with writable fields
  console.log("InAddnewmoviefunc");
  const newCard = createEditableCard();

  // Add the new card at the top left of the card holder
  const firstChild = cardHolder.firstElementChild;
  if (firstChild) {
    cardHolder.insertBefore(newCard, firstChild, true);
  }
}

//Functions for validating input
function inputIsEmpty(value, fieldName) {
  console.log(`Checking if ${fieldName} is empty. Received value: ${value}`);
  return !value ? `${fieldName} cannot be empty` : null;
}

function inputIsNotANumber(value, fieldName) {
  console.log(`Checking if ${fieldName} is a number. Received value: ${value}`);
  return isNaN(value) ? `${fieldName} must be a number` : null;
}

function validateInputs(title, director, year, genre, duration, rating) {
  const errors = {};

  // Check for empty values using inputIsEmpty function
  errors.title = inputIsEmpty(title, "Title");
  errors.director = inputIsEmpty(director, "Director");
  errors.year = inputIsEmpty(year, "Year");
  errors.genre = inputIsEmpty(genre, "Genre");
  errors.duration = inputIsEmpty(duration, "Duration");
  errors.rating = inputIsEmpty(rating, "Rating");

  // Check if year, duration, and rating are numbers using inputIsNotANumber function
  if (errors.year === null) {
    errors.year = inputIsNotANumber(year, "Year");
  }
  if (errors.duration === null) {
    errors.duration = inputIsNotANumber(duration, "Duration");
  }
  if (errors.rating === null) {
    errors.rating = inputIsNotANumber(rating, "Rating");
  }

  // Remove null entries from the errors object
  Object.keys(errors).forEach(
    (key) => errors[key] === null && delete errors[key]
  );

  return Object.keys(errors).length === 0 ? null : errors;
}

function removeErrorClass(inputField) {
  if (inputField.classList.contains("error")) {
    inputField.classList.remove("error");
  }
}

function displayErrorMessage(errors) {
  // Display error messages
  Object.keys(errors).forEach((fieldName) => {
    const errorMessage = errors[fieldName];
    const inputField = document.getElementById(
      `${fieldName.toLowerCase()}Input`
    );
    let errorContainer = document.getElementById(
      `${fieldName.toLowerCase()}Error`
    );

    if (!errorContainer) {
      errorContainer = document.createElement("div");
      //errorContainer.classList.add("error-message"); // Add a class for styling
      errorContainer.id = `${fieldName.toLowerCase()}Error`;
    }

    console.log("fieldName:", fieldName);
    console.log("inputField ID:", inputField.id);

    if (errorMessage !== null) {
      inputField.classList.add("error");
      errorContainer.innerText = errorMessage;
      errorContainer.style.display = "block";
      errorContainer.id = `${fieldName.toLowerCase()}Error`;

      inputField.parentNode.appendChild(errorContainer);

      console.log("errorContainer ID:", errorContainer.id);
    } else {
      inputField.classList.remove("error");
      errorContainer.innerText = "";
      errorContainer.style.display = "none";
    }
  });
}

//Function for creating an editable card
function createEditableCard() {
  const movieURL =
    "https://thumbs.dreamstime.com/z/gradient-shaded-cartoon-no-movies-allowed-sign-illustrated-146132964.jpg";
  //Create a card as a div and add ut to the cardHolder

  const card = createCard(movieURL);

  // Create a card body
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  card.appendChild(cardBody);

  // Create input fields for the new movie
  const titleInput = createInputField("Title", "Title");
  const directorInput = createInputField("Director", "Director");
  const yearInput = createInputField("Year", "Year");
  const durationInput = createInputField("Duration", "Duration");
  const genreInput = createInputField("Genre", "Genre");
  const ratingInput = createInputField("Rating", "Rating");

  // Append input fields to the card body
  cardBody.appendChild(titleInput);
  cardBody.appendChild(directorInput);
  cardBody.appendChild(yearInput);
  cardBody.appendChild(durationInput);
  cardBody.appendChild(genreInput);
  cardBody.appendChild(ratingInput);

  // Create a save button
  const saveButton = document.createElement("button");
  saveButton.classList.add("btn", "btn-primary");
  saveButton.innerText = "Save";
  cardBody.appendChild(saveButton);

  //Add event listener
  saveButton.addEventListener("click", async (event) => {
    //Read input content
    const title = titleInput.value;
    const director = directorInput.value;
    const year = yearInput.value;
    const genre = genreInput.value;
    const duration = durationInput.value;
    const rating = ratingInput.value;
    // Remove "error" class for all input fields
    removeErrorClass(titleInput);
    removeErrorClass(directorInput);
    removeErrorClass(yearInput);
    removeErrorClass(genreInput);
    removeErrorClass(durationInput);
    removeErrorClass(ratingInput);

    errors = validateInputs(title, director, year, genre, duration, rating);
    console.log(errors);
    if (errors !== null) {
      displayErrorMessage(errors);
    } else {
      const newMovie = {
        title: title,
        director: director,
        year: year,
        genre: genre,
        duration: duration,
        rating: rating,
      };
      const movieFromDb = await addMovieToDb(newMovie);
      console.log("The movie returned from DB is", movieFromDb);

      makeMovieCard(movieFromDb, cardHolder);
      card.remove();
    }
  });
  return card;
}

function createInputField(placeholder, fieldName) {
  const input = document.createElement("input");
  input.classList.add("form-control");
  input.placeholder = placeholder;
  input.id = `${fieldName.toLowerCase()}Input`;

  return input;
}

async function addMovieToDb(movie) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movie),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const addedMovie = await response.json(); // Parse the response JSON

    return addedMovie; // Return the added movie, including the ID
  } catch (error) {
    console.error("Error adding movie to the database:", error);
    throw error;
  }
}

function createCard(movieURL) {
  //Create a card as a div and add ut to the cardHolder
  const card = document.createElement("div");
  card.classList.add("card");
  card.style.width = "18rem";

  //Create an img and append to the card
  const img = document.createElement("img");
  img.classList.add("card-img-top");
  img.src = movieURL;
  card.appendChild(img);

  return card;
}

async function makeMovieCard(movie, cardDiv) {
  //Get an img URL
  const movieURL = await GetMovieUrl(`${movie.title}`);

  const card = createCard(movieURL);
  cardDiv.appendChild(card);

  //Add a card body
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  card.appendChild(cardBody);

  //Add a name to the cardBody
  const title = document.createElement("h5");
  title.classList.add("card-title");
  title.innerText = `${movie.title}`;
  cardBody.appendChild(title);

  const director = document.createElement("p");
  director.classList.add("card-text");
  director.innerText = `By ${movie.director}`;
  cardBody.appendChild(director);

  //Create and add unsorted list to the card
  const listGroup = document.createElement("ul");
  listGroup.classList.add("list-group");
  listGroup.classList.add("list-group-flush");
  card.appendChild(listGroup);

  //   //Add attrubutes to the UL
  const listIYear = document.createElement("li");
  listIYear.classList.add("list-group-item");
  listIYear.innerText = `Year : ${movie.year}`;
  listGroup.appendChild(listIYear);

  const listIDuration = document.createElement("li");
  listIDuration.classList.add("list-group-item");
  listIDuration.innerText = `Duration: ${movie.duration} minutes`;
  listGroup.appendChild(listIDuration);

  const listIGenre = document.createElement("li");
  listIGenre.classList.add("list-group-item");
  listIGenre.innerText = `Genre: ${movie.genre}`;
  listGroup.appendChild(listIGenre);

  const listIRating = document.createElement("li");
  listIRating.classList.add("list-group-item");
  listIRating.innerText = `Rating: ${movie.rating} of 10`;
  listGroup.appendChild(listIRating);

  // Create and add a dropdown menu to the cardBody
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");
  cardBody.appendChild(dropdown);

  const dropdownButton = document.createElement("button");
  dropdownButton.classList.add("btn", "btn-secondary", "dropdown-toggle");
  dropdownButton.type = "button";
  dropdownButton.setAttribute("data-bs-toggle", "dropdown");
  dropdownButton.innerText = "Actions";
  dropdown.appendChild(dropdownButton);

  const dropdownMenu = document.createElement("div");
  dropdownMenu.classList.add("dropdown-menu");
  dropdown.appendChild(dropdownMenu);

  // Add dropdown items (Edit and Delete)
  const editItem = document.createElement("a");
  editItem.classList.add("dropdown-item");
  editItem.href = "#";
  editItem.innerText = "Edit";
  editItem.setAttribute("data-movie-id", movie.id);
  dropdownMenu.appendChild(editItem);

  const deleteItem = document.createElement("a");
  deleteItem.classList.add("dropdown-item");
  deleteItem.href = "#";
  deleteItem.innerText = "Delete";
  deleteItem.setAttribute("data-movie-id", movie.id);
  dropdownMenu.appendChild(deleteItem);

  // Add event listeners for dropdown items
  editItem.addEventListener("click", (event) => {
    // Handle edit action
    console.log("Edit clicked for movie:", movie.title);
    event.preventDefault();

    // Replace the text content with input fields
    title.innerText = "";
    const titleInput = createInputField("Title", "Title");
    titleInput.classList.add("form-control");
    titleInput.placeholder = movie.title;
    title.appendChild(titleInput);

    director.innerText = "";
    const directorInput = createInputField("Director", "Director");
    directorInput.classList.add("form-control");
    directorInput.placeholder = movie.director;
    director.appendChild(directorInput);

    listIYear.innerText = "";
    const yearInput = createInputField("Year", "Year");
    yearInput.classList.add("form-control");
    yearInput.placeholder = movie.year;
    listIYear.appendChild(yearInput);

    listIDuration.innerText = "";
    const durationInput = createInputField("Duration", "Duration");
    durationInput.classList.add("form-control");
    durationInput.placeholder = movie.duration;
    listIDuration.appendChild(durationInput);

    listIGenre.innerText = "";
    const genreInput = createInputField("Genre", "Genre");
    genreInput.classList.add("form-control");
    genreInput.placeholder = movie.genre;
    listIGenre.appendChild(genreInput);

    listIRating.innerText = "";
    const ratingInput = createInputField("Rating", "Rating");
    ratingInput.classList.add("form-control");
    ratingInput.placeholder = movie.rating;
    listIRating.appendChild(ratingInput);

    // Add save button
    const saveButton = document.createElement("button");
    saveButton.classList.add("btn", "btn-primary");
    saveButton.innerText = "Save";
    cardBody.appendChild(saveButton);

    // Add event listener for save button
    saveButton.addEventListener("click", async () => {
      // Handle save action
      console.log("Save clicked for movie:", movie.title);

      // Collect updated values
      const updatedTitle = titleInput.value || movie.title;
      const updatedDirector = directorInput.value || movie.director;
      const updatedYear = yearInput.value || movie.year;
      const updatedGenre = genreInput.value || movie.genre;
      const updatedDuration = durationInput.value || movie.duration;
      const updatedRating = ratingInput.value || movie.rating;
      // Remove "error" class for all input fields
      removeErrorClass(titleInput);
      removeErrorClass(directorInput);
      removeErrorClass(yearInput);
      removeErrorClass(genreInput);
      removeErrorClass(durationInput);
      removeErrorClass(ratingInput);

      //Check for invalid input
      errors = validateInputs(
        updatedTitle,
        updatedDirector,
        updatedYear,
        updatedGenre,
        updatedDuration,
        updatedRating
      );
      console.log(errors);
      if (errors !== null) {
        displayErrorMessage(errors);
      } else {
        try {
          // Update the movie in the API
          const response = await updateMovie(movie.id, {
            title: updatedTitle,
            director: updatedDirector,
            year: updatedYear,
            genre: updatedGenre,
            duration: updatedDuration,
            rating: updatedRating,
          });

          if (response.ok) {
            card.remove();
            await getOneMovieByIdAndCreateCard(movie.id);
          } else {
            // Waiting for DB to update and try again
            await new Promise((resolve) => setTimeout(resolve, 1000));
            card.remove();
            await getOneMovieByIdAndCreateCard(movie.id);
          }
        } catch (error) {
          console.error("Error updating movie:", error);
        }
      }
    });
  });

  // Add event listener for delete button
  deleteItem.addEventListener("click", () => {
    const movieId = deleteItem.getAttribute("data-movie-id");
    deleteMovie(movieId, card);
  });
}

async function GetMovieUrl(title) {
  const apiKey = "6bac3e70c1dda2f2bb915ac335eef15f";
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`;
  const noLuckImg =
    "https://thumbs.dreamstime.com/z/gradient-shaded-cartoon-no-movies-allowed-sign-illustrated-146132964.jpg";

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    if (
      data.results &&
      data.results.length > 0 &&
      data.results[0].poster_path
    ) {
      const baseUrl = "https://image.tmdb.org/t/p/original";
      const posterPath = data.results[0].poster_path;
      const posterUrl = `${baseUrl}${posterPath}`;
      return posterUrl;
    } else {
      console.log("No results or backdrop_path found for the given title.");
      return noLuckImg;
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    return noLuckImg;
  }
}

// Function to delete a movie by ID
function deleteMovie(movieId, card) {
  console.log("In the delete function");
  // Make a DELETE request to delete the movie
  fetch(`${apiUrl}?id=${movieId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      console.log(`Movie with ID ${movieId} deleted successfully.`);
      if (card) {
        card.remove();
        console.log("Card removed from the UI.");
      }
    })
    .catch((error) => {
      console.error("Error deleting movie:", error);
    });
}

async function updateMovie(movieId, updatedMovie) {
  console.log("Movie ID before update:", movieId);
  try {
    const res = await fetch(`${apiUrl}?id=${movieId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMovie),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    console.log(`Movie with ID ${movieId} updated successfully.`);
    return res; // Return the response object
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error; // Propagate the error
  }
}

async function getOneMovieByIdAndCreateCard(movieId) {
  try {
    const response = await fetch(`${apiUrl}/${movieId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedMovie = await response.json();
    console.log(updatedMovie, "is from getOneMovieByIdAndCreateCards");
    // Create and append the new card
    makeMovieCard(updatedMovie, cardHolder);
  } catch (error) {
    console.error("Error fetching updated movie data:", error);
  }
}
