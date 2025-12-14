import MovieCard from "./MovieCard";

export default function MovieRow({ title }) {
  const movies = [
    {
      src: "https://via.placeholder.com/160x240?text=Movie+1",
      title: "Spider-Man"
    },
    {
      src: "https://via.placeholder.com/160x240?text=Movie+2",
      title: "The Little Mermaid (2023)"
    },
    {
      src: "https://via.placeholder.com/160x240?text=Movie+3",
      title: "Transformers"
    }
  ];

  return (
    <div className="section">
      <h3>{title}</h3> {/* ⭐ màu sẽ đổi đúng */}
      <div className="row">
        <span>‹</span>
        <div className="movies">
          {movies.map((m, i) => (
            <MovieCard key={i} {...m} />
          ))}
        </div>
        <span>›</span>
      </div>
    </div>
  );
}
