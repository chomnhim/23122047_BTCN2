import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img src={movie.poster || "https://via.placeholder.com/160x240"} alt={movie.title} />
      <div className="movie-title">{movie.title}</div>
    </Link>
  );
}