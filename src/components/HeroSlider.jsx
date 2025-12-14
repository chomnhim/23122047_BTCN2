import React, { useState, useEffect } from 'react';

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
    <div className="top-revenue-section" style={{ padding: '0 20px', margin: '20px 0' }}>
      
      <div className="hero-slider-container">
        <button className="nav-btn prev-btn" onClick={handlePrev}>
          &#10094;
        </button>

        <div className="hero-content">
          <div className="poster-container">
             <img 
               src={movie.image || 'https://via.placeholder.com/300x450?text=No+Image'} 
               alt={movie.title} 
               className="hero-poster"
               onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
             />
          </div>
          
          <div className="movie-info-center">
            
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