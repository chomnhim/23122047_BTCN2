import MovieCard from "./MovieCard";

export default function MovieSlider({ title }) {
  const fakeMovies = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    title: `${title} Movie ${i + 1}`,
    rating: "8.5",
    length: "120 min"
  }));

  return (
    <section className="container">
      <h3>{title}</h3>
      <div className="movie-row">
        {fakeMovies.map(m => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
