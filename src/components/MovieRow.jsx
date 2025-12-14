import MovieCard from "./MovieCard";

export default function MovieRow({ title }) {
  const posters = [
    "https://via.placeholder.com/160x240?text=Movie+1",
    "https://via.placeholder.com/160x240?text=Movie+2",
    "https://via.placeholder.com/160x240?text=Movie+3"
  ];

  return (
    <div className="section">
      <h3>{title}</h3>
      <div className="row">
        <span>‹</span>
        <div className="movies">
          {posters.map((p, i) => (
            <MovieCard key={i} src={p} />
          ))}
        </div>
        <span>›</span>
      </div>
    </div>
  );
}
