import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [allReviews, setAllReviews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);

  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";
  const headers = { 'Content-Type': 'application/json', 'x-app-token': appToken };

  useEffect(() => {
    setLoading(true);
    const u = `/api/api/movies/${id}`;
    
    Promise.all([
      fetch(u, { headers }),
      fetch(`${u}/reviews?limit=50&sort=newest`, { headers }) 
    ])
    .then(async ([resM, resR]) => {
       if (!resM.ok) throw new Error('Movie not found');
       const mData = await resM.json();
       const rData = resR.ok ? await resR.json() : { data: [] };
       
       setMovie(mData.data || mData);
       setAllReviews(rData.data || []);
       setLoading(false);
    })
    .catch(e => {
       setError(e.toString());
       setLoading(false);
    });

    if (user?.token) {
      fetch('/api/api/users/favorites', { headers: { ...headers, 'Authorization': `Bearer ${user.token}` } })
        .then(r => r.json())
        .then(d => { 
          const list = d.data || d;
          if (Array.isArray(list) && list.some(x => x.id == id || x.movieId == id)) {
            setIsFav(true);
          }
        })
        .catch(() => {});
    }
  }, [id, user]);

  const toggleFav = async () => {
    if (!user) return alert('Vui lòng đăng nhập!');
    
    const method = isFav ? 'DELETE' : 'POST';
    const url = `/api/api/users/favorites/${id}`;
    
    const options = {
      method,
      headers: { ...headers, 'Authorization': `Bearer ${user.token}` }
    };

    if (method === 'POST' && movie) {
      options.body = JSON.stringify({
        id: movie.id,
        movieId: movie.id, 
        title: movie.title,
        image: movie.image || movie.poster || movie.poster_path,
        poster_path: movie.image || movie.poster || movie.poster_path,
        rate: movie.ratings?.imDb || movie.rate || 0,
        year: movie.year,
        release_date: movie.releaseDate || movie.release_date || `${movie.year}-01-01`
      });
    }

    try {
      const res = await fetch(url, options);
      if (res.ok) setIsFav(!isFav);
      else alert('Không thể lưu trạng thái. Thử lại sau.');
    } catch (e) {
      alert('Lỗi kết nối server!');
    }
  };

  const getUrl = () => {
    let u = movie?.image || movie?.poster || movie?.poster_path;
    if (!u || u === 'N/A') return 'https://placehold.co/500x750?text=No+Image';
    if (u.match(/amazon|imdb/)) u = u.replace(/_V1_.*\.jpg$/, '_V1_.jpg');
    return u.startsWith('http') ? u : `https://image.tmdb.org/t/p/original${u.startsWith('/')?'':'/'}${u}`;
  };

  const renderList = (arr, limit) => (!arr ? null : (Array.isArray(arr) ? arr : [arr]).filter(x=>x).slice(0,limit||99).map((x,i)=><span key={i}>{i>0&&', '}{x.id?<Link to={`/person/${x.id}`} className="person-link">{x.name||x}</Link>:x.name||x}</span>));

  const handleReviewPageChange = (newPage) => {
    setReviewPage(newPage);
  };

  if (loading) return <div className="loading-box"><div className="spinner"></div><style>{`.loading-box{min-height:80vh;display:flex;justify-content:center;align-items:center}.spinner{width:50px;height:50px;border:5px solid rgba(255,255,255,.1);border-top:5px solid #e74c3c;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
  if (error || !movie) return <div className="center err" style={{textAlign:'center', padding:50}}><h3>Not found</h3><Link to="/" className="back-btn">Go Home</Link></div>;

  const poster = getUrl();
  const desc = (movie.plot_full || movie.plot || movie.overview || 'No description').replace(/<[^>]*>?/gm, '');

  const totalReviewPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  const currentReviews = allReviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE);

  return (
    <div className="movie-detail-container">
      <div className="movie-backdrop" style={{ backgroundImage: `url(${poster})` }}></div>
      <div className="movie-content">
        <div className="detail-poster"><img src={poster} alt={movie.title} referrerPolicy="no-referrer" onError={e=>e.target.src='https://placehold.co/500x750'}/></div>
        <div className="detail-info">
          <h1 className="detail-title">{movie.title} <span className="detail-year">({movie.year})</span></h1>
          <div className="detail-meta">
            {movie.genres && <span className="meta-tag">{Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}</span>}
            <span className="meta-tag rating">⭐ {movie.ratings?.imDb || movie.rate || 'N/A'}</span>
            <button onClick={toggleFav} className={`fav-btn ${isFav?'active':''}`}>{isFav ? '❤️ Saved' : '🤍 Add to Favorites'}</button>
          </div>
          <div className="detail-section"><h3>Overview</h3><div className="overview-box"><p>{desc}</p></div></div>
          <div className="detail-extra-grid">
            {movie.directors && <div className="extra-item"><strong>Director: </strong><span>{renderList(movie.directors)}</span></div>}
            {movie.actors && <div className="extra-item full-width"><strong>Cast: </strong><span className="actor-list">{renderList(movie.actors, 15)}</span></div>}
          </div>
          <div style={{marginTop:30}}><Link to="/" className="back-btn">← Back to Home</Link></div>
        </div>
      </div>

      <div className="reviews-container">
        <h3>User Reviews ({allReviews.length})</h3>
        
        {allReviews.length > 0 ? (
            <>
                <div className="reviews-list">
                    {currentReviews.map((rv, idx) => (
                        <div key={rv.id || idx} className="review-item">
                            <div className="rv-header">
                                <span className="rv-user">{rv.username || 'User'}</span>
                                <span className="rv-rate">★ {rv.rate || '?'}</span>
                            </div>
                            <h4 className="rv-title">{rv.title}</h4>
                            <p className="rv-content">{rv.content}</p>
                        </div>
                    ))}
                </div>

                {totalReviewPages > 1 && (
                    <div className="pagination">
                        <button onClick={() => handleReviewPageChange(reviewPage - 1)} disabled={reviewPage === 1} className="page-btn smaller">&laquo; Prev</button>
                        <span className="page-info">Page {reviewPage} of {totalReviewPages}</span>
                        <button onClick={() => handleReviewPageChange(reviewPage + 1)} disabled={reviewPage === totalReviewPages} className="page-btn smaller">Next &raquo;</button>
                    </div>
                )}
            </>
        ) : (
            <p style={{color:'#ccc'}}>No reviews yet.</p>
        )}
      </div>

      <style>{`.movie-detail-container{position:relative;min-height:90vh;color:#fff;overflow-x:hidden;padding:40px 20px;display:flex;flex-direction:column;align-items:center}.movie-backdrop{position:fixed;top:0;left:50%;right:50%;bottom:0;background-size:cover;background-position:center;filter:blur(25px) brightness(.2);z-index:-1;transform:scale(1.1)}.movie-content{display:flex;max-width:1000px;width:100%;gap:50px;z-index:1;align-items:flex-start;margin-top:20px;background:rgba(0,0,0,.4);padding:30px;border-radius:20px;backdrop-filter:blur(10px)}.detail-poster{flex-shrink:0;width:320px;border-radius:12px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,.6)}.detail-poster img{width:100%;display:block}.detail-info{flex:1}.detail-title{font-size:2.5rem;font-weight:800;margin:0 0 10px;line-height:1.1}.detail-meta{display:flex;gap:15px;margin-bottom:25px;align-items:center;flex-wrap:wrap}.meta-tag{background:rgba(255,255,255,.1);padding:6px 14px;border-radius:20px;font-size:14px;border:1px solid rgba(255,255,255,.2)}.meta-tag.rating{color:#f1c40f;font-weight:700}.fav-btn{background:#fff;border:none;padding:8px 16px;border-radius:20px;cursor:pointer;font-weight:700;transition:.2s}.fav-btn.active{background:#e74c3c;color:#fff}.fav-btn:hover{transform:scale(1.05)}.overview-box{max-height:150px;overflow-y:auto;background:rgba(0,0,0,.25);padding:15px;border-radius:8px;margin-bottom:25px}.detail-extra-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px;background:rgba(0,0,0,.2);padding:20px;border-radius:10px}.person-link{color:#fff;text-decoration:underline}.reviews-container{max-width:1000px;width:100%;margin-top:30px;background:rgba(0,0,0,.4);padding:30px;border-radius:20px}.review-item{background:rgba(255,255,255,.05);padding:15px;border-radius:8px;margin-bottom:15px}.rv-header{display:flex;gap:10px;font-weight:700;margin-bottom:5px;color:#3498db}.rv-rate{color:#f1c40f}.back-btn{display:inline-block;padding:10px 25px;background:#e74c3c;color:#fff;text-decoration:none;border-radius:6px;font-weight:700}
      .pagination { display: flex; justify-content: center; gap: 15px; margin-top: 20px; align-items: center; }
      .page-btn { padding: 8px 16px; background: #e74c3c; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
      .page-btn:disabled { background: #555; opacity: 0.5; cursor: not-allowed; }
      .page-btn.smaller { padding: 5px 10px; font-size: 0.9rem; }
      .page-info { color: #ccc; font-weight: bold; }
      @media(max-width:850px){.movie-content{flex-direction:column;align-items:center;padding:20px}.detail-poster{width:220px}.detail-info{text-align:center}.detail-meta{justify-content:center}}`}</style>
    </div>
  );
}