export default function MovieCard({ src }) {
  return (
    <div className="movie-card">
      <img src={src} alt="movie" />
    </div>
  );
}
