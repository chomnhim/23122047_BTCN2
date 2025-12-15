import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TopRevenueMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

      try {
        const endpointsToTry = [
          '/api/api/movies/most-popular',
          '/api/api/movies',
        ];
        
        let response = null;
        
        for (const endpoint of endpointsToTry) {
          try {
            const testResponse = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'x-app-token': appToken
              }
            });
            
            if (testResponse.ok) {
              response = testResponse;
              break;
            }
          } catch (err) {
            continue;
          }
        }
        
        if (!response || !response.ok) {
          throw new Error('Không tìm thấy endpoint hợp lệ hoặc lỗi API');
        }

        const result = await response.json();
        const movieList = result.data || [];
        
        setMovies(movieList.slice(0, 5));
        setLoading(false);

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === movies.length - 1 ? 0 : prevIndex + 1));
  };

  if (loading) {
    return (
      <div className="top-revenue-section" style={{ padding: '20px' }}>
        <p style={{ color: '#888', fontStyle: 'italic' }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="top-revenue-section">Error: {error}</div>;
  }

  if (movies.length === 0) return null;

  const movie = movies[currentIndex];

  return (
    <div className="top-revenue-section" style={{ padding: '0 20px', margin: '10px 0 5px 0' }}>
      
      <div className="hero-slider-container">
        <button className="nav-btn prev-btn" onClick={handlePrev}>
          &#10094;
        </button>

        <div className="hero-content" key={movie.id}>
          
          <div className="poster-container">
             <Link to={`/movie/${movie.id}`} style={{ display: 'block', position: 'relative' }}>
               <img 
                 src={movie.image || movie.poster_path ? (movie.image || `https://image.tmdb.org/t/p/w500${movie.poster_path}`) : 'https://via.placeholder.com/300x450'} 
                 alt={movie.title} 
                 className="hero-poster"
                 onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
               />
               
               <div className="hero-overlay">
                  <div className="play-icon">▶</div>
               </div>
             </Link>
          </div>
          
          <div className="movie-info-center">
            <h2 className="hero-title">{movie.title}</h2>

            <div className="hero-meta">
              <span className="meta-item rating">
                ⭐ {movie.rate || movie.vote_average || 'N/A'}
              </span>

              <span className="dot-sep">•</span>

              <span className="meta-item">
                📅 {movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A')}
              </span>

              <span className="dot-sep">•</span>

              {movie.box_office_revenue && (
                <span className="meta-item revenue-text">
                  💰 {movie.box_office_revenue}
                </span>
              )}
            </div>
            
            <div className="hero-meta-extra">
            </div>
          </div>
        </div>

        <button className="nav-btn next-btn" onClick={handleNext}>
          &#10095;
        </button>
      </div>
      
      <div className="slider-dots">
        {movies.map((_, idx) => (
          <span 
            key={idx} 
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default TopRevenueMovies;