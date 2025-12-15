import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`/api/api/persons/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': appToken
          }
        });

        if (!res.ok) throw new Error('Not found');

        const result = await res.json();
        const personData = result.data || result;

        setPerson(personData);
        setCredits(personData.known_for || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) fetchPerson();
  }, [id]);

  const getImage = (path) => {
    if (!path || path === 'string')
      return 'https://placehold.co/300x450?text=No+Image';

    if (path.startsWith('http')) return path;

    return `https://image.tmdb.org/t/p/original${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  if (error || !person) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Person not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="person-page">
      <div className="person-header">
        <div className="person-img">
          <img
            src={getImage(person.image)}
            alt={person.name}
            onError={(e) => {
              e.target.src = 'https://placehold.co/300x450?text=No+Image';
            }}
          />
        </div>

        <div className="person-info">
          <h1>{person.name}</h1>
          {person.role && <p><strong>Role:</strong> {person.role}</p>}
          {person.birth_date && (
            <p>
                <strong>Birth Date:</strong> {new Date(person.birth_date).toLocaleDateString('vi-VN')}
            </p>
        )}
          {person.height && <p><strong>Height:</strong> {person.height}</p>}
          <h3>Biography</h3>
          <p>{person.summary && person.summary !== 'string' ? person.summary : 'No biography available.'}</p>
        </div>
      </div>

      <div className="person-credits">
        <h2>Known For</h2>
        <div className="credits-grid">
          {credits.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="credit-card">
              <img
                src={getImage(movie.image || movie.poster_path)}
                alt={movie.title}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/200x300?text=No+Image';
                }}
              />
              <div className="credit-title">{movie.title}</div>
              {movie.character && <div className="credit-role">as {movie.character}</div>}
            </Link>
          ))}
        </div>

        {credits.length === 0 && <p>No movies found.</p>}
      </div>

      <style>{`
        .person-page {
          padding: 40px 20px;
          max-width: 1100px;
          margin: auto;
        }

        .person-header {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
        }

        .person-img img {
          width: 300px;
          border-radius: 12px;
        }

        .person-info {
          flex: 1;
        }

        .person-info h1 {
          margin-top: 0;
        }

        .person-credits {
          margin-top: 60px;
        }

        .credits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 20px;
        }

        .credit-card {
          text-decoration: none;
          color: inherit;
        }

        .credit-card img {
          width: 100%;
          aspect-ratio: 2/3;
          object-fit: cover;
          border-radius: 8px;
        }

        .credit-title {
          font-weight: bold;
          margin-top: 6px;
        }

        .credit-role {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .person-info p {
            line-height: 1.6;    
            color: #333;         
            margin-bottom: 10px;
            text-align: justify;
            }

        .dark .person-info p {
        color: #ddd;
        }
      `}</style>
    </div>
  );
}
