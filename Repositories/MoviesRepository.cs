using IRDb.Database;
using IRDb.Models;

namespace IRDb.Repositories
{
    public class MoviesRepository : IMoviesRepository
    {
        private readonly AppDbContext _context;
        //Lista med film att seeda databasen med om den är tom
        private readonly List<Movie> _movies = new List<Movie>
            {
                new Movie {Title = "The Shawshank Redemption", Director = "Frank Darabont", Year = 1994, Genre = "Drama", Duration = 142, Rating = 9.3 },
                new Movie {Title = "The Godfather", Director = "Francis Ford Coppola", Year = 1972, Genre = "Crime, Drama", Duration = 175, Rating = 9.2 },
                new Movie {Title = "The Dark Knight", Director = "Christopher Nolan", Year = 2008, Genre = "Action, Crime, Drama", Duration = 152, Rating = 9.0 },
                new Movie {Title = "Pulp Fiction", Director = "Quentin Tarantino", Year = 1994, Genre = "Crime, Drama", Duration = 154, Rating = 8.9 },
                new Movie {Title = "Fight Club", Director = "David Fincher", Year = 1999, Genre = "Drama", Duration = 139, Rating = 8.8 },
                new Movie {Title = "Forrest Gump", Director = "Robert Zemeckis", Year = 1994, Genre = "Drama, Romance", Duration = 142, Rating = 8.8 },
                new Movie {Title = "Inception", Director = "Christopher Nolan", Year = 2010, Genre = "Action, Adventure, Sci-Fi", Duration = 148, Rating = 8.7 },
                new Movie {Title = "The Matrix", Director = "Lana Wachowski, Lilly Wachowski", Year = 1999, Genre = "Action, Sci-Fi", Duration = 136, Rating = 8.7 },
                new Movie {Title = "Interstellar", Director = "Christopher Nolan", Year = 2014, Genre = "Adventure, Drama, Sci-Fi", Duration = 169, Rating = 8.6 },
                new Movie {Title = "The Lord of the Rings: The Fellowship of the Ring", Director = "Peter Jackson", Year = 2001, Genre = "Adventure, Drama, Fantasy", Duration = 178, Rating = 8.8 }
            };

        public MoviesRepository(AppDbContext context)
        {
            _context = context;

            // Kolla om databasen innehåller några filmer, och seeda databasen med en lista av film om den är tom.
            if (!_context.Movies.Any())
            {
                // Add movies to the DbSet
                _context.Movies.AddRange(_movies);

                _context.SaveChanges();
            }
        }

        public void DeleteMovie(int id)
        {
            Movie? movieToDelete = _context.Movies.FirstOrDefault(x => x.Id == id);
            if (movieToDelete != null)
            {
                _context.Movies.Remove(movieToDelete);
                _context.SaveChanges();
            }
        }

        public IEnumerable<Movie> GetAllMovies()
        {
            return _context.Movies.ToList();
        }

        public Movie GetOneMovie(int id)
        {
            Movie? movieToReturn = _context.Movies.FirstOrDefault(x => x.Id == id);
            return movieToReturn;
        }

        public Movie PostMovie(Movie movie)
        {
            //TODO Implementation som ger alla filmer samma utseende variabelmässigt. Stora bokstäver vid namn osv
            Movie movieToAdd = movie;
            _context.Movies.Add(movieToAdd);
            _context.SaveChanges();

            return movieToAdd;
        }

        public void UpdateMovie(int id, Movie movie)
        {
            Movie? movieToUpdate = _context.Movies.FirstOrDefault(x => x.Id == id);

            if (movieToUpdate != null)
            {
                movieToUpdate.Title = movie.Title;
                movieToUpdate.Year = movie.Year;
                movieToUpdate.Director = movie.Director;
                movieToUpdate.Duration = movie.Duration;
                movieToUpdate.Rating = movie.Rating;
                movieToUpdate.Genre = movie.Genre;
                _context.SaveChanges();
            }
        }
    }
}
