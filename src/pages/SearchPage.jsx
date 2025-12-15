import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  const getMovieYear = (movie) => {
    if (!movie) return 'N/A';
    
    if (movie.year != null && movie.year !== '' && movie.year !== 'N/A') {
      return movie.year;
    }

    if (movie.release_date && movie.release_date !== 'N/A') {
      if (/^\d{4}$/.test(String(movie.release_date))) return movie.release_date;
      const date = new Date(movie.release_date);
      if (!isNaN(date.getTime())) return date.getFullYear();
    }

    // 3. Kiểm tra 'first_air_date'
    if (movie.first_air_date && movie.first_air_date !== 'N/A') {
      if (/^\d{4}$/.test(String(movie.first_air_date))) return movie.first_air_date;
      const date = new Date(movie.first_air_date);
      if (!isNaN(date.getTime())) return date.getFullYear();
    }
    
    // 4. Kiểm tra 'releaseDate'
    if (movie.releaseDate && movie.releaseDate !== 'N/A') {
      if (/^\d{4}$/.test(String(movie.releaseDate))) return movie.releaseDate;
      const date = new Date(movie.releaseDate);
      if (!isNaN(date.getTime())) return date.getFullYear();
    }
    
    return 'N/A';
  };

  useEffect(() => {
    const fetchAllAndFilter = async () => {
      if (!query.trim()) return;
      setLoading(true);

      try {
        const firstPageRes = await fetch('/api/api/movies?page=1', {
          headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
        });

        if (!firstPageRes.ok) throw new Error("API Error");

        const firstPageData = await firstPageRes.json();
        let rawMovies = firstPageData.data || [];
        
        const totalPages = firstPageData.pagination ? firstPageData.pagination.total_pages : 1;

        if (totalPages > 1) {
          const promises = [];
          for (let page = 2; page <= totalPages; page++) {
            promises.push(
              fetch(`/api/api/movies?page=${page}`, {
                headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
              }).then(res => res.json()).catch(() => ({ data: [] }))
            );
          }
          const otherPagesData = await Promise.all(promises);
          otherPagesData.forEach(result => {
            if (result.data) {
              rawMovies = [...rawMovies, ...result.data];
            }
          });
        }

        const uniqueMoviesMap = new Map();
        rawMovies.forEach(movie => {
            if (movie.id && !uniqueMoviesMap.has(movie.id)) {
                uniqueMoviesMap.set(movie.id, movie);
            }
        });
        const uniqueMovies = Array.from(uniqueMoviesMap.values());

        const lowerQuery = query.toLowerCase().trim();
        const filteredResults = uniqueMovies.filter(movie => {
          const safeText = (text) => (text ? String(text).toLowerCase() : "");
          
          const yearStr = String(getMovieYear(movie) || '');

          const matchGenre = Array.isArray(movie.genres) 
             ? movie.genres.some(g => safeText(g).includes(lowerQuery))
             : safeText(movie.genres).includes(lowerQuery);

          return safeText(movie.title).includes(lowerQuery) || 
                 safeText(movie.director).includes(lowerQuery) || 
                 (Array.isArray(movie.cast) ? movie.cast.some(actor => safeText(actor).includes(lowerQuery)) : safeText(movie.cast).includes(lowerQuery)) ||
                 yearStr.includes(lowerQuery) || 
                 matchGenre;
        });

        setMovies(filteredResults);

      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAndFilter();
  }, [query]);

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
        <div className="search-grid">
          {movies.map(movie => {
            const posterSrc = getPosterURL(movie);
            
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
                    {movie.title}
                  </h3>
                  
                  <div className="movie-genre">
                      {formatGenres(movie.genres)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="no-results">
            <p>Không tìm thấy phim nào khớp với từ khóa "{query}".</p>
        </div>
      )}

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
        
        .movie-title { 
            font-size: 15px; font-weight: bold; margin: 0 0 5px 0; line-height: 1.3; color: var(--title); 
        }
        
        .movie-genre { 
            font-size: 13px; color: #888; font-style: italic; margin-top: 2px;
        }
        
        .loading-state, .no-results { 
          text-align: center; padding: 50px 20px; color: #666; font-size: 16px; 
        }
        
        .dark .search-card { background: #1f2327; border-color: #333; }
        .dark .card-image-wrapper { background: #2c3e50; }
        .dark .movie-genre { color: #aaa; }
        .dark .loading-state, .dark .no-results { color: #999; }
      `}</style>
    </div>
  );
}