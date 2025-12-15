import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) return;
      setLoading(true);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const endpointsToTry = [
          `/api/movies/search?q=${encodeURIComponent(query)}&page=${page}`,
          `/api/api/movies/search?q=${encodeURIComponent(query)}&page=${page}`,
        ];

        let foundData = false;

        for (const endpoint of endpointsToTry) {
          try {
            const response = await fetch(endpoint, {
              headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
            });

            if (response.ok) {
              const result = await response.json();
              const searchResults = result.data || result.results || [];
              
              if (result.pagination && result.pagination.total_pages) {
                setTotalPages(result.pagination.total_pages);
              }

              if (Array.isArray(searchResults)) {
                 setMovies(searchResults);
                 foundData = true;
                 break; 
              }
            }
          } catch (err) {
            console.error("Lỗi endpoint:", endpoint, err);
          }
        }

        if (!foundData) setMovies([]);

      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]); 
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getMovieYear = (movie) => {
    if (!movie) return 'N/A';
    if (movie.year && !isNaN(movie.year)) return movie.year;
    const dateCandidates = [movie.release_date, movie.releaseDate, movie.first_air_date, movie.premiere_date];
    for (const rawDate of dateCandidates) {
        if (rawDate) {
            const yearMatch = String(rawDate).match(/\d{4}/);
            if (yearMatch) return yearMatch[0];
        }
    }
    return 'N/A';
  };

  const getPosterURL = (movie) => {
    let imgSrc = movie.poster_path || movie.poster || movie.image;
    if (!imgSrc || imgSrc === "string" || imgSrc === "N/A") return null;
    if (imgSrc.startsWith('http')) return imgSrc;
    if (!imgSrc.startsWith('/')) imgSrc = `/${imgSrc}`;
    return `https://image.tmdb.org/t/p/w500${imgSrc}`;
  };

  const formatGenres = (genres) => {
    if (!genres) return '';
    if (Array.isArray(genres) && genres.length > 0) return `[${genres.join(', ')}]`;
    if (typeof genres === 'string' && genres.trim() !== "" && genres !== 'N/A') return `[${genres}]`;
    return '';
  };

  return (
    <div className="search-page-container">
      <div className="search-header">
        <h2>Kết quả tìm kiếm</h2>
        <p className="search-query">Từ khóa: "{query}"</p>
      </div>
      
      {loading ? (
        <div className="loading-state">Đang tìm kiếm...</div>
      ) : movies.length > 0 ? (
        <>
          <div className="search-grid">
            {movies.map(movie => {
              const posterSrc = getPosterURL(movie);
              const displayYear = getMovieYear(movie); 
              
              return (
                <Link to={`/movie/${movie.id}`} key={movie.id} className="search-card">
                  <div className="card-image-wrapper">
                    {posterSrc ? (
                      <img 
                        src={posterSrc} 
                        alt={movie.title} 
                        onError={(e) => { 
                          e.target.style.display = 'none';
                          e.target.parentNode.classList.add('fallback-active');
                        }}
                      />
                    ) : (
                      <div className="fallback-placeholder">
                          <span className="fallback-icon">🎬</span>
                      </div>
                    )}
                    <div className="fallback-placeholder hidden-fallback">
                        <span className="fallback-icon">🎬</span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="movie-title">
                      {movie.title} <span style={{ fontWeight: 'normal', color: '#888' }}>({displayYear})</span>
                    </h3>
                    <div className="movie-genre">{formatGenres(movie.genres)}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
                className="page-btn"
              >
                &laquo; Trước
              </button>
              
              <span className="page-info">Trang {page} / {totalPages}</span>
              
              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages}
                className="page-btn"
              >
                Sau &raquo;
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-results">
            <p>Không tìm thấy phim nào khớp với từ khóa "{query}".</p>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .search-page-container { padding: 30px 40px; min-height: 80vh; background-color: var(--bg); }
        .search-header { margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 15px; }
        .search-header h2 { margin: 0; font-size: 24px; color: var(--title); }
        .search-query { margin: 5px 0 0; color: #888; font-style: italic; }
        .search-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px; }
        
        .search-card { 
          text-decoration: none; color: var(--text); background: var(--card); 
          border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
          transition: transform 0.3s ease; display: flex; flex-direction: column; 
          border: 1px solid rgba(0,0,0,0.05); height: 100%;
        }
        .search-card:hover { transform: translateY(-5px); }
        .card-image-wrapper { width: 100%; aspect-ratio: 2/3; position: relative; background: #e0e0e0; overflow: hidden; }
        .card-image-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .fallback-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #333; color: #555; }
        .fallback-icon { font-size: 40px; opacity: 0.5; }
        .hidden-fallback { position: absolute; top: 0; left: 0; display: none; }
        .card-image-wrapper.fallback-active .hidden-fallback { display: flex; }
        
        .card-content { padding: 12px; text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: flex-start; }
        .movie-title { font-size: 15px; font-weight: bold; margin: 0 0 5px 0; line-height: 1.3; color: var(--title); }
        .movie-genre { font-size: 13px; color: #888; font-style: italic; margin-top: 2px; }
        .loading-state, .no-results { text-align: center; padding: 50px 20px; color: #666; font-size: 16px; }

        /* Style cho Pagination */
        .pagination { display: flex; justify-content: center; align-items: center; margin-top: 40px; gap: 20px; }
        .page-btn { padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .page-btn:disabled { background: #ccc; cursor: not-allowed; opacity: 0.7; }
        .page-btn:hover:not(:disabled) { background: #c0392b; }
        .page-info { font-weight: bold; color: var(--title); }

        .dark .search-card { background: #1f2327; border-color: #333; }
        .dark .card-image-wrapper { background: #2c3e50; }
        .dark .movie-genre { color: #aaa; }
        .dark .loading-state, .dark .no-results { color: #999; }
        .dark .page-info { color: #fff; }
      `}</style>
    </div>
  );
}