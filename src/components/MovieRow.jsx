import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const MovieRow = ({ title, type }) => {
  const [movies, setMovies] = useState([]);
  const sliderRef = useRef(null);

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

      if (response && response.ok) {
        const result = await response.json();
        const movieList = result.data || result.results || [];
        setMovies(movieList.slice(0, 20));
      }
    };

    fetchMovies();
  }, [type, title]);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.7;
      
      const scrollTo = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const getPosterURL = (movie) => {
    const imgSrc = movie.image || movie.poster || movie.poster_path;

    if (!imgSrc) return 'https://via.placeholder.com/200x300?text=No+Image';

    if (imgSrc.startsWith('http')) {
        return imgSrc;
    }

    return `https://image.tmdb.org/t/p/w200${imgSrc}`;
  };

  if (movies.length === 0) return null;

  return (
    <div className="movie-row-section" style={{ margin: '30px 0' }}>
      <h3 style={{ 
        textAlign: 'left', 
        marginLeft: '20px', 
        fontSize: '20px', 
        fontWeight: 'bold',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        {title}
      </h3>
      
      <div className="row-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        
        <button 
          className="row-nav-btn left" 
          onClick={() => handleScroll('left')}
          style={{
            position: 'absolute', left: 0, zIndex: 10,
            background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
            height: '100%', width: '40px', cursor: 'pointer',
            fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          &#10094;
        </button>

        <div 
          className="row-slider" 
          ref={sliderRef}
          style={{
            display: 'flex',
            gap: '15px',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            padding: '10px 40px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {movies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="movie-card-item" style={{ minWidth: '160px', maxWidth: '160px', position: 'relative' }}>
                <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                  <img 
                    src={getPosterURL(movie)} 
                    alt={movie.title} 
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Image'; }}
                  />
                </div>
                <h4 style={{ 
                  fontSize: '14px', margin: '8px 0 4px 0', 
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  textAlign: 'center', fontWeight: 'bold'
                }}>
                  {movie.title}
                </h4>
                <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', margin: 0 }}>
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <button 
          className="row-nav-btn right" 
          onClick={() => handleScroll('right')}
          style={{
            position: 'absolute', right: 0, zIndex: 10,
            background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
            height: '100%', width: '40px', cursor: 'pointer',
            fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          &#10095;
        </button>
      </div>
      
      <style>{`
        .row-slider::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default MovieRow;