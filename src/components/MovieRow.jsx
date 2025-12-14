import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies }) { 
  const safeMovies = Array.isArray(movies) ? movies : [];

  return (
    <div className="section">
      <h3>{title}</h3>
      <div className="row">
        <span>‹</span>
        <div className="movies">
          {safeMovies.length > 0 ? (
            safeMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <p style={{color: '#999', padding: '10px'}}>Đang cập nhật phim...</p>
          )}
        </div>
        <span>›</span>
      </div>
    </div>
  );
}