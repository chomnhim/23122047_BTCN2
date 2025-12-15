import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const { user } = useAuth();
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      fetch('/api/api/users/favorites', {
        headers: { 'Content-Type': 'application/json', 'x-app-token': appToken, 'Authorization': `Bearer ${user.token}` }
      })
      .then(r => r.json())
      .then(async (d) => {
        const list = Array.isArray(d) ? d : (d.data || []);
        
        // Gọi API /movies/{id} cho từng phim để lấy thông tin chi tiết nhất
        const detailPromises = list.map(async (item) => {
            const mid = item.movieId || item.id;
            try {
                const res = await fetch(`/api/api/movies/${mid}`, {
                    headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
                });
                const json = await res.json();
                const detail = json.data || json;
                return { ...item, ...detail, id: mid }; // Gộp thông tin, ưu tiên từ API movies
            } catch (e) {
                return item;
            }
        });

        const fullList = await Promise.all(detailPromises);
        setFavs(fullList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else setLoading(false);
  }, [user]);

  const removeFav = async (m) => {
    if (!window.confirm(`Xóa "${m.title}"?`)) return;
    try {
      const res = await fetch(`/api/api/users/favorites/${m.id}`, {
        method: 'DELETE',
        headers: { 'x-app-token': appToken, 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) setFavs(favs.filter(x => x.id !== m.id));
    } catch (e) {}
  };

  const getImg = (m) => {
    const s = m.image || m.poster || m.poster_path;
    return s ? (s.startsWith('http') ? s : `https://image.tmdb.org/t/p/w300${s}`) : 'https://placehold.co/200x300?text=No+Image';
  };

  if (loading) return <div className="c-box"><div className="spin"></div><style>{`.c-box{min-height:60vh;display:flex;justify-content:center;align-items:center}.spin{width:40px;height:40px;border:4px solid #ddd;border-top-color:#e74c3c;border-radius:50%;animation:s 1s infinite}@keyframes s{to{transform:rotate(360deg)}}`}</style></div>;
  if (!user) return <div className="c-box"><h3>Vui lòng đăng nhập.</h3></div>;

  return (
    <div className="fav-con">
      <h2 className="ti">Danh sách yêu thích ({favs.length})</h2>
      {favs.length === 0 ? (
        <div className="empty"><p>Chưa có phim nào.</p><Link to="/" className="btn">Tìm phim</Link></div>
      ) : (
        <div className="grid">
          {favs.map((m, i) => (
            <div key={i} className="card">
              <Link to={`/movie/${m.id}`} className="img"><img src={getImg(m)} alt={m.title} onError={e=>e.target.src='https://placehold.co/200x300'}/></Link>
              <div className="body">
                <Link to={`/movie/${m.id}`} className="name">{m.title}</Link>
                <div className="meta"><span>{m.year}</span><span className="star">⭐ {m.ratings?.imDb || m.rate || 'N/A'}</span></div>
                <button onClick={()=>removeFav(m)} className="del">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`.fav-con{max-width:1200px;margin:0 auto;padding:30px 20px;min-height:80vh}.ti{margin-bottom:25px;border-bottom:2px solid #eee;padding-bottom:10px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:25px}.card{background:#2c3e50;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,.2);transition:transform .2s;display:flex;flex-direction:column}.card:hover{transform:translateY(-5px)}.img{width:100%;aspect-ratio:2/3;display:block;background:#000}.img img{width:100%;height:100%;object-fit:cover}.body{padding:12px;flex:1;display:flex;flex-direction:column;color:#fff}.name{font-weight:700;font-size:1rem;margin-bottom:5px;color:#fff;text-decoration:none;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.meta{display:flex;justify-content:space-between;font-size:.85rem;color:#bdc3c7;margin-bottom:12px}.star{color:#f1c40f}.del{margin-top:auto;background:#e74c3c;color:#fff;border:none;padding:8px;border-radius:4px;cursor:pointer;font-weight:600}.del:hover{background:#c0392b}.empty{text-align:center;margin-top:50px;color:#7f8c8d}.btn{display:inline-block;margin-top:15px;padding:10px 25px;background:#3498db;color:#fff;text-decoration:none;border-radius:4px}`}</style>
    </div>
  );
}