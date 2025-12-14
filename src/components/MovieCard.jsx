export default function MovieCard({ src, title }) {
  return (
    <div className="movie-card">
      <img src={src} alt={title} />
      <div className="movie-title">{title}</div>
    </div>
  );
}
