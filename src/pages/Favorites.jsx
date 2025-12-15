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
      fetch('/api/api/users/favorites', {
        headers: { 'Content-Type': 'application/json', 'x-app-token': appToken, 'Authorization': `Bearer ${user.token}` }
      })
      .then(res => res.ok ? res.json() : { data: [] })
      .then(d => { setFavs(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const removeFav = async (id) => {
    if (!window.confirm('Xóa phim này khỏi danh sách?')) return;
    try {
      const res = await fetch(`/api/api/users/favorites/${id}`, {
        method: 'DELETE',
        headers: { 'x-app-token': appToken, 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) setFavs(favs.filter(m => m.id !== id));
    } catch (e) {}
  };

  const getImg = (p) => p ? (p.startsWith('http') ? p : `https://image.tmdb.org/t/p/w300${p}`) : 'https://placehold.co/200x300?text=No+Image';

  if (loading) return <div className="loading-box"><div className="spinner"></div><style>{`.loading-box{min-height:80vh;display:flex;justify-content:center;align-items:center;color:#333}.spinner{width:50px;height:50px;border:5px solid rgba(0,0,0,.1);border-top:5px solid #e74c3c;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
  if (!user) return <div style={{padding:50,textAlign:'center',color:'#333',minHeight:'50vh',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>Vui lòng đăng nhập để xem danh sách yêu thích.</div>;

  return (
    <div className="fav-page">
      <h2 className="page-title">Danh sách yêu thích ({favs.length})</h2>
      <div className="grid">
        {favs.map(m => (
          <div key={m.id} className="card">
            <Link to={`/movie/${m.id}`} className="img-link">
              <img src={getImg(m.image || m.poster_path)} alt={m.title} onError={e=>e.target.src='https://placehold.co/200x300?text=Error'}/>
            </Link>
            <div className="info">
              <Link to={`/movie/${m.id}`} className="title">{m.title}</Link>
              <button onClick={() => removeFav(m.id)} className="del-btn">Xóa</button>
            </div>
          </div>
        ))}
      </div>
      {favs.length === 0 && <div className="empty-state"><p>Chưa có phim nào trong danh sách.</p><Link to="/" className="home-btn">Quay lại trang chủ</Link></div>}
      <style>{`.fav-page{max-width:1100px;margin:auto;padding:20px;min-height:80vh}.page-title{color:#333;margin-bottom:20px}.app.dark .page-title{color:#fff}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:20px}.card{background:#222;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,.1);transition:transform .2s}.card:hover{transform:translateY(-5px)}.img-link{display:block;aspect-ratio:2/3;overflow:hidden}.card img{width:100%;height:100%;object-fit:cover;transition:.3s}.card:hover img{transform:scale(1.05)}.info{padding:10px;display:flex;flex-direction:column;gap:8px}.title{color:#fff!important;text-decoration:none;font-weight:700;font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.del-btn{background:#e74c3c;color:#fff;border:none;padding:5px;border-radius:4px;cursor:pointer;font-size:.8rem;transition:.2s}.del-btn:hover{background:#c0392b}.empty-state{text-align:center;margin-top:50px;color:#555}.home-btn{display:inline-block;margin-top:10px;padding:8px 20px;background:#3498db;color:#fff;text-decoration:none;border-radius:5px}`}</style>
    </div>
  );
}