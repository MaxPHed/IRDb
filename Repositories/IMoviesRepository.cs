using IRDb.Models;

namespace IRDb.Repositories
{
    public interface IMoviesRepository
    {
        public IEnumerable<Movie> GetAllMovies();
        public Movie PostMovie(Movie movie);
        public void DeleteMovie(int id);
        public Movie GetOneMovie(int id);
        public void UpdateMovie(int id, Movie movie);
    }
}
