import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../libs/api";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    api.get(`/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!movie) return <div style={{ padding: 20 }}>Loading detail...</div>;

  return (
    <div className="container" style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <img 
          src={movie.poster} 
          alt={movie.title} 
          style={{ width: 300, borderRadius: 10 }} 
        />
        <div>
          <h1>{movie.title}</h1>
          <p><strong>Year:</strong> {movie.year}</p>
          <p><strong>Description:</strong> {movie.description}</p>
        </div>
      </div>
    </div>
  );
}