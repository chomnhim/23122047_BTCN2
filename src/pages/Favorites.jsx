import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const { user } = useAuth();
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      fetch('/api/api/users/favorites', {
        headers: {
          'Content-Type': 'application/json',
          'x-app-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo",
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(res => res.ok ? res.json() : { data: [] })
      .then(d => { setFavs(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const removeFav = async (id) => {
    if (!window.confirm('Remove from favorites?')) return;
    try {
      const res = await fetch(`/api/api/users/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'x-app-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo",
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (res.ok) setFavs(favs.filter(m => m.id !== id));
    } catch (e) {}
  };

  const getImg = (p) => p ? (p.startsWith('http') ? p : `https://image.tmdb.org/t/p/w500${p}`) : 'https://placehold.co/200x300?text=No+Image';

  if (loading) return <div className="center">Loading...</div>;
  if (!user) return <div className="center">Please login to view favorites.</div>;

  return (
    <div className="fav-page">
      <h2>My Favorites ({favs.length})</h2>
      <div className="grid">
        {favs.map(m => (
          <div key={m.id} className="card">
            <Link to={`/movie/${m.id}`}>
              <img src={getImg(m.image || m.poster_path)} alt={m.title} onError={e=>e.target.src='https://placehold.co/200x300?text=Error'}/>
            </Link>
            <div className="info">
              <Link to={`/movie/${m.id}`} className="title">{m.title}</Link>
              <button onClick={() => removeFav(m.id)} className="del-btn">Remove</button>
            </div>
          </div>
        ))}
      </div>
      {favs.length === 0 && <p className="center">No favorites yet.</p>}
      <style>{`.fav-page{max-width:1100px;margin:auto;padding:20px;color:#fff}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px;margin-top:20px}.card{background:#222;border-radius:8px;overflow:hidden;transition:transform .2s}.card:hover{transform:scale(1.03)}.card img{width:100%;aspect-ratio:2/3;object-fit:cover}.info{padding:10px;display:flex;flex-direction:column;gap:5px}.title{color:#fff;text-decoration:none;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.del-btn{background:#e74c3c;color:#fff;border:none;padding:5px;border-radius:4px;cursor:pointer}.del-btn:hover{background:#c0392b}.center{text-align:center;padding:40px;color:#fff}`}</style>
    </div>
  );
}