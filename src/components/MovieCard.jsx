import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const getPosterURL = (posterPath) => {
    if (!posterPath || posterPath === "N/A") return "https://via.placeholder.com/160x240?text=No+Image";
    if (posterPath.startsWith("http")) return posterPath;
    return `https://image.tmdb.org/t/p/w500${posterPath.startsWith('/') ? '' : '/'}${posterPath}`;
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img 
        src={getPosterURL(movie.poster || movie.image || movie.poster_path)} 
        alt={movie.title} 
        referrerPolicy="no-referrer" 
        onError={(e) => { e.target.src = "https://via.placeholder.com/160x240?text=Error"; }}
      />
      <div className="movie-title">{movie.title}</div>
    </Link>
  );
}