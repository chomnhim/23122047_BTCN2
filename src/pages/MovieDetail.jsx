import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/api/movies/${id}`, {
          headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
        });
        if (!response.ok) throw new Error('Không thể tải thông tin phim');
        const result = await response.json();
        setMovie(result.data || result); 
      } catch (err) {
        console.error("Lỗi:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovieDetail();
  }, [id]);

  const getPosterURL = (m) => {
    if (!m) return '';
    let imgSrc = m.image || m.poster || m.poster_path;
    if (!imgSrc || imgSrc === 'N/A') return 'https://via.placeholder.com/500x750?text=No+Image';
    if (imgSrc.startsWith('http')) return imgSrc;
    return `https://image.tmdb.org/t/p/original${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
  };

  const getRating = (m) => {
     if (m.ratings && m.ratings.imDb) return m.ratings.imDb;
     if (m.ratings && m.ratings.theMovieDb) return m.ratings.theMovieDb;
     if (m.rate) return m.rate;
     if (m.vote_average) return m.vote_average;
     return 'N/A';
  };

  const getOverview = (m) => {
     if (m.plot_full) return m.plot_full.replace(/<[^>]*>?/gm, '');
     if (m.plot) return m.plot;
     if (m.short_description) return m.short_description;
     if (m.overview) return m.overview;
     return "No description available.";
  };

  const getDirectors = (m) => {
      if (!m.directors) return null;
      if (Array.isArray(m.directors)) return m.directors.map(d => d.name || d).join(', ');
      return m.directors;
  }

  const getActors = (m) => {
    if (!m.actors) return null;
    
    if (Array.isArray(m.actors)) {
        return m.actors
            .slice(0, 15) 
            .map(a => a.name || a) 
            .join(', ');
    }
    return m.actors;
  }

  if (loading) return <div style={{color:'#fff', textAlign:'center', marginTop: 50}}>Loading...</div>;
  if (error) return <div style={{color:'red', textAlign:'center', marginTop: 50}}>Error: {error}</div>;
  if (!movie) return null;

  const posterSrc = getPosterURL(movie);

  return (
    <div className="movie-detail-container">
      <div className="movie-backdrop" style={{ backgroundImage: `url(${posterSrc})` }}></div>

      <div className="movie-content">
        <div className="detail-poster">
          <img 
            src={posterSrc} 
            alt={movie.title} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x750?text=No+Image'; }}
          />
        </div>

        <div className="detail-info">
          <h1 className="detail-title">
            {movie.title || movie.full_title} <span className="detail-year">({movie.year})</span>
          </h1>

          <div className="detail-meta">
            {movie.genres && (
               <span className="meta-tag">
                 {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
               </span>
            )}
            <span className="meta-tag rating">⭐ {getRating(movie)}</span>
          </div>

          <div className="detail-section">
            <h3>Overview</h3>
            <div className="overview-box">
              <p>{getOverview(movie)}</p>
            </div>
          </div>

          <div className="detail-extra-grid">
             {getDirectors(movie) && (
                <div className="extra-item">
                    <strong>Director</strong> 
                    <span>{getDirectors(movie)}</span>
                </div>
             )}
             
             {movie.box_office && movie.box_office.cumulative_worldwide_gross && (
                <div className="extra-item">
                    <strong>Revenue</strong> 
                    <span style={{color: '#2ecc71'}}>{movie.box_office.cumulative_worldwide_gross}</span>
                </div>
             )}

             {getActors(movie) && (
                <div className="extra-item full-width">
                    <strong>Cast</strong> 
                    <span className="actor-list">{getActors(movie)}</span>
                </div>
             )}
          </div>

          <div style={{ marginTop: '30px' }}>
            <Link to="/" className="back-btn">← Back to Home</Link>
          </div>
        </div>
      </div>
      
      <style>{`
        .movie-detail-container { position: relative; min-height: 90vh; color: #fff; overflow: hidden; padding: 40px 20px; display: flex; justify-content: center; }
        .movie-backdrop { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: cover; background-position: center; filter: blur(25px) brightness(0.2); z-index: -1; transform: scale(1.1); }
        .movie-content { display: flex; max-width: 1000px; width: 100%; gap: 50px; z-index: 1; align-items: flex-start; margin-top: 20px; background: rgba(0, 0, 0, 0.4); padding: 30px; border-radius: 20px; backdrop-filter: blur(10px); }
        .detail-poster { flex-shrink: 0; width: 320px; border-radius: 12px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); }
        .detail-poster img { width: 100%; height: auto; display: block; }
        .detail-info { flex-grow: 1; }
        .detail-title { font-size: 2.5rem; font-weight: 800; margin: 0 0 10px 0; line-height: 1.1; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .detail-year { font-weight: 300; opacity: 0.7; font-size: 1.8rem; }
        .detail-meta { display: flex; gap: 15px; margin-bottom: 25px; align-items: center; flex-wrap: wrap; }
        .meta-tag { background: rgba(255,255,255,0.1); padding: 6px 14px; border-radius: 20px; font-size: 14px; border: 1px solid rgba(255,255,255,0.2); }
        .meta-tag.rating { background: rgba(241, 196, 15, 0.2); border-color: rgba(241, 196, 15, 0.6); color: #f1c40f; font-weight: bold; font-size: 16px; }
        .detail-section h3 { font-size: 1.2rem; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px; display: inline-block; color: #e74c3c; }
        
        /* KHUNG OVERVIEW */
        .overview-box {
          max-height: 150px; overflow-y: auto; background: rgba(0, 0, 0, 0.2);
          padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 25px;
        }
        .overview-box p { margin: 0; font-size: 1rem; line-height: 1.6; color: #e0e0e0; text-align: justify; }
        .overview-box::-webkit-scrollbar { width: 6px; }
        .overview-box::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
        .overview-box::-webkit-scrollbar-thumb { background: #e74c3c; border-radius: 3px; }

        /* GRID THÔNG TIN THÊM (ĐẠO DIỄN, DIỄN VIÊN) */
        .detail-extra-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
            gap: 20px; 
            background: rgba(0,0,0,0.2); 
            padding: 20px; 
            border-radius: 10px; 
        }
        .extra-item strong { color: #bbb; display: block; margin-bottom: 5px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
        .extra-item span { font-size: 1.05rem; font-weight: 500; }
        
        /* CSS CHO PHẦN CAST (FULL WIDTH) */
        .extra-item.full-width {
            grid-column: 1 / -1; /* Chiếm trọn bề ngang */
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 15px;
            margin-top: 5px;
        }
        .actor-list {
            line-height: 1.6;
            color: #ddd;
        }

        .back-btn { display: inline-block; padding: 10px 25px; background: #e74c3c; color: #fff; text-decoration: none; border-radius: 6px; transition: transform 0.2s, background 0.3s; font-weight: bold; font-size: 1rem; }
        .back-btn:hover { background: #c0392b; transform: translateY(-2px); }
        
        @media (max-width: 850px) { .movie-content { flex-direction: column; align-items: center; padding: 20px; } .detail-poster { width: 220px; } .detail-info { text-align: center; } .detail-meta { justify-content: center; } .detail-extra-grid { text-align: left; } }
      `}</style>
    </div>
  );
}