import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MovieRow = ({ title, type }) => {
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  
  const [isAnimating, setIsAnimating] = useState(false); 

  useEffect(() => {
    const fetchMovies = async () => {
      const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";
      const endpointSuffix = type === 'top_rated' ? 'top-rated' : 'most-popular';
      const endpointsToTry = [
        `/api/movies/${endpointSuffix}`,
        `/api/api/movies/${endpointSuffix}`,
      ];

      let response = null;
      for (const endpoint of endpointsToTry) {
        try {
          const testResponse = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
          });
          if (testResponse.ok) {
            response = testResponse;
            break;
          }
        } catch (err) { continue; }
      }

      if (response && response.ok) {
        const result = await response.json();
        const movieList = result.data || result.results || [];
        setMovies(movieList); 
      }
    };
    fetchMovies();
  }, [type]);

  const itemsPerPage = 3; 

  const handlePageChange = (direction) => {
    if (isAnimating) return; 

    setIsAnimating(true); 
    setTimeout(() => {
      if (direction === 'next') {
        if (startIndex + itemsPerPage < movies.length) {
          setStartIndex(prev => prev + itemsPerPage);
        }
      } else {
        if (startIndex > 0) {
          setStartIndex(prev => prev - itemsPerPage);
        }
      }
      setIsAnimating(false);
    }, 300);
  };

  const getPosterURL = (movie) => {
    const imgSrc = movie.image || movie.poster || movie.poster_path;
    if (!imgSrc) return 'https://via.placeholder.com/300x450?text=No+Image';
    if (imgSrc.startsWith('http')) return imgSrc;
    return `https://image.tmdb.org/t/p/w500${imgSrc}`;
  };

  if (movies.length === 0) return null;

  const visibleMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="movie-row-section" style={{ margin: '30px 0' }}>
      <h3 style={{ 
        textAlign: 'left', marginLeft: '40px', fontSize: '24px', fontWeight: 'bold',
        borderLeft: '5px solid #e74c3c', paddingLeft: '15px', marginBottom: '20px'
      }}>
        {title}
      </h3>
      
      <div className="row-wrapper">
        
        {startIndex > 0 && (
          <button className="row-btn prev" onClick={() => handlePageChange('prev')}>&#10094;</button>
        )}

        <div className={`row-slider ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          {visibleMovies.map((movie) => (
            <div key={movie.id} className="movie-card-container">
              <Link to={`/movie/${movie.id}`} className="movie-card-link">
                <div className="movie-card-content">
                    <img 
                      src={getPosterURL(movie)} 
                      alt={movie.title} 
                      className="card-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                    />
                    <div className="card-overlay">
                        <h4 className="card-title">{movie.title}</h4>
                        <div className="card-meta">
                            {movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A')}
                        </div>
                        <div className="play-icon">▶</div>
                    </div>
                </div>
              </Link>
            </div>
          ))}
          
          {[...Array(itemsPerPage - visibleMovies.length)].map((_, i) => (
             <div key={`empty-${i}`} className="movie-card-container empty-placeholder"></div>
          ))}
        </div>

        {startIndex + itemsPerPage < movies.length && (
          <button className="row-btn next" onClick={() => handlePageChange('next')}>&#10095;</button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;