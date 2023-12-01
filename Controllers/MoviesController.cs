using IRDb.Models;
using IRDb.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace IRDb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IMoviesRepository _repo;

        public MoviesController(IMoviesRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public IEnumerable<Movie> Get()
        {
            return _repo.GetAllMovies();
        }

        [HttpPost]
        public ActionResult<Movie> Post([FromBody] Movie movie)
        {
            // Perform any necessary validation or processing
            if (movie == null)
            {
                return BadRequest("Invalid movie data");
            }

            // Save the movie to the database
            _repo.PostMovie(movie);

            // Return the movie with the assigned ID
            var movieVar = CreatedAtAction(nameof(GetOne), new { id = movie.Id }, movie);
            return CreatedAtAction(nameof(GetOne), new { id = movie.Id }, movie);
        }

        [HttpDelete]
        public void Delete(int id)
        {
            _repo.DeleteMovie(id);
        }

        [HttpGet("{id}")]
        public ActionResult<Movie> GetOne(int id)
        {
            Movie? movie = _repo.GetOneMovie(id);
            if (movie != null)
            {
                return Ok(movie);
            }

            return NotFound("Could not find Movie :(");
        }

        [HttpPut]
        public void Update(int id, Movie movie)
        {
            _repo.UpdateMovie(id, movie);
        }
    }
}
