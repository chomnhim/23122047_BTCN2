import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function MovieDetail() {
  const { id } = useParams();
  const [s, setS] = useState({ m: null, r: [], l: true, e: null });

  useEffect(() => {
    const h = { 'Content-Type': 'application/json', 'x-app-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo" };
    const u = `/api/api/movies/${id}`;

    Promise.all([
      fetch(u, { headers: h }),
      fetch(`${u}/reviews?limit=10&sort=newest`, { headers: h })
    ])
    .then(async ([resM, resR]) => {
       if (!resM.ok) throw new Error(resM.status === 401 ? 'Token expired' : 'Error');
       const mData = await resM.json();
       const rData = resR.ok ? await resR.json() : { data: [] };
       setS({ m: mData.data || mData, r: rData.data || [], l: false, e: null });
    })
    .catch(e => setS({ m: null, r: [], l: false, e: e.toString() }));
  }, [id]);

  const m = s.m;

  const getUrl = () => {
    let u = m?.image || m?.poster || m?.poster_path;
    if (!u || u === 'N/A') return 'https://placehold.co/500x750?text=No+Image';
    if (u.match(/amazon|imdb/)) u = u.replace(/_V1_.*\.jpg$/, '_V1_.jpg');
    return u.startsWith('http') ? u : `https://image.tmdb.org/t/p/original${u.startsWith('/')?'':'/'}${u}`;
  };

  const renderList = (arr, limit) => {
    if (!arr) return null;
    return (Array.isArray(arr) ? arr : [arr]).filter(x => x).slice(0, limit || 99).map((x, i) => {
      const n = x.name || x.original_name || x;
      return <span key={i}>{i > 0 && ', '}{x.id ? <Link to={`/person/${x.id}`} className="person-link">{n}</Link> : n}</span>;
    });
  };

  if (s.l) return <div className="center">Loading...</div>;
  if (s.e || !m) return <div className="center err">{s.e || 'Not found'}</div>;

  const poster = getUrl();
  const desc = (m.plot_full || m.plot || m.short_description || m.overview || 'No description').replace(/<[^>]*>?/gm, '');
  const rate = m.ratings?.imDb || m.ratings?.theMovieDb || m.rate || m.vote_average || 'N/A';

  return (
    <div className="movie-detail-container">
      <div className="movie-backdrop" style={{ backgroundImage: `url(${poster})` }}></div>
      <div className="movie-content">
        <div className="detail-poster">
          <img src={poster} alt={m.title} referrerPolicy="no-referrer" onError={e => e.target.src='https://placehold.co/500x750?text=No+Image'} />
        </div>
        <div className="detail-info">
          <h1 className="detail-title">{m.title || m.full_title} <span className="detail-year">({m.year})</span></h1>
          <div className="detail-meta">
            {m.genres && <span className="meta-tag">{Array.isArray(m.genres) ? m.genres.join(', ') : m.genres}</span>}
            <span className="meta-tag rating">⭐ {rate}</span>
          </div>
          
          <div className="detail-section">
            <h3>Overview</h3>
            <div className="overview-box"><p>{desc}</p></div>
          </div>

          <div className="detail-extra-grid">
            {m.directors && <div className="extra-item"><strong>Director</strong><span>{renderList(m.directors)}</span></div>}
            {m.box_office?.cumulative_worldwide_gross && <div className="extra-item"><strong>Revenue</strong><span style={{color:'#2ecc71'}}>{m.box_office.cumulative_worldwide_gross}</span></div>}
            {m.actors && <div className="extra-item full-width"><strong>Cast</strong><span className="actor-list">{renderList(m.actors, 15)}</span></div>}
          </div>

          {/* Reviews Section */}
          <div className="detail-section" style={{marginTop: 30}}>
            <h3>Reviews ({s.r.length})</h3>
            <div className="reviews-list">
              {s.r.length > 0 ? s.r.map(rv => (
                <div key={rv.id} className="review-item">
                  <div className="rv-header">
                    <span className="rv-user">{rv.username}</span>
                    <span className="rv-rate">★ {rv.rate}</span>
                    <span className="rv-date">{new Date(rv.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {rv.warning_spoilers && <div className="rv-spoiler">⚠️ Spoiler Warning</div>}
                  <h4 className="rv-title">{rv.title}</h4>
                  <p className="rv-content">{rv.content}</p>
                </div>
              )) : <p style={{opacity:0.6}}>No reviews yet.</p>}
            </div>
          </div>

          <div style={{ marginTop: 30 }}><Link to="/" className="back-btn">← Back to Home</Link></div>
        </div>
      </div>
      <style>{`.movie-detail-container{position:relative;min-height:90vh;color:#fff;overflow:hidden;padding:40px 20px;display:flex;justify-content:center}.movie-backdrop{position:absolute;top:0;left:0;right:0;bottom:0;background-size:cover;background-position:center;filter:blur(25px) brightness(.2);z-index:-1;transform:scale(1.1)}.movie-content{display:flex;max-width:1000px;width:100%;gap:50px;z-index:1;align-items:flex-start;margin-top:20px;background:rgba(0,0,0,.4);padding:30px;border-radius:20px;backdrop-filter:blur(10px)}.detail-poster{flex-shrink:0;width:320px;border-radius:12px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.1)}.detail-poster img{width:100%;height:auto;display:block}.detail-info{flex-grow:1}.detail-title{font-size:2.5rem;font-weight:800;margin:0 0 10px;line-height:1.1;text-shadow:2px 2px 4px rgba(0,0,0,.5)}.detail-year{font-weight:300;opacity:.7;font-size:1.8rem}.detail-meta{display:flex;gap:15px;margin-bottom:25px;align-items:center;flex-wrap:wrap}.meta-tag{background:rgba(255,255,255,.1);padding:6px 14px;border-radius:20px;font-size:14px;border:1px solid rgba(255,255,255,.2)}.meta-tag.rating{background:rgba(241,196,15,.2);border-color:rgba(241,196,15,.6);color:#f1c40f;font-weight:700;font-size:16px}.detail-section h3{font-size:1.2rem;margin-bottom:15px;border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:5px;display:inline-block;color:#e74c3c}.overview-box{max-height:150px;overflow-y:auto;background:rgba(0,0,0,.25);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,.1);margin-bottom:25px}.overview-box p{margin:0;font-size:1rem;line-height:1.6;color:#e0e0e0;text-align:justify}.overview-box::-webkit-scrollbar{width:6px}.overview-box::-webkit-scrollbar-track{background:rgba(255,255,255,.05)}.overview-box::-webkit-scrollbar-thumb{background:#e74c3c;border-radius:3px}.detail-extra-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px;background:rgba(0,0,0,.2);padding:20px;border-radius:10px}.extra-item strong{color:#bbb;display:block;margin-bottom:5px;font-size:.85rem;text-transform:uppercase;letter-spacing:1px}.extra-item span{font-size:1.05rem;font-weight:500}.person-link{color:#fff;text-decoration:underline;transition:color .2s}.person-link:hover{color:#e74c3c}.extra-item.full-width{grid-column:1/-1;border-top:1px solid rgba(255,255,255,.1);padding-top:15px;margin-top:5px}.actor-list{line-height:1.6;color:#ddd;font-size:.95rem}.back-btn{display:inline-block;padding:10px 25px;background:#e74c3c;color:#fff;text-decoration:none;border-radius:6px;font-weight:700}.center{color:#fff;text-align:center;margin-top:50px}.center.err{color:red}.reviews-list{display:flex;flex-direction:column;gap:15px}.review-item{background:rgba(255,255,255,.05);padding:15px;border-radius:8px;border:1px solid rgba(255,255,255,.1)}.rv-header{display:flex;gap:10px;align-items:center;margin-bottom:8px;font-size:.9rem}.rv-user{font-weight:700;color:#3498db}.rv-rate{color:#f1c40f}.rv-date{opacity:.6;font-size:.8rem;margin-left:auto}.rv-title{margin:5px 0;font-size:1rem;font-weight:700}.rv-content{font-size:.95rem;opacity:.9;line-height:1.5;margin:0}.rv-spoiler{font-size:.8rem;color:#e74c3c;margin-bottom:5px;font-weight:700}@media(max-width:850px){.movie-content{flex-direction:column;align-items:center;padding:20px}.detail-poster{width:220px}.detail-info{text-align:center}.detail-meta{justify-content:center}.detail-extra-grid{text-align:left}}`}</style>
    </div>
  );
}