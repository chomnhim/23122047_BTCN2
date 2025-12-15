import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PersonDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    fetch(`/api/api/persons/${id}`, {
      headers: { 'Content-Type': 'application/json', 'x-app-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo" }
    })
      .then(res => res.ok ? res.json() : Promise.reject('Not found'))
      .then(d => setState({ data: d.data || d, loading: false, error: null }))
      .catch(e => setState({ data: null, loading: false, error: e.toString() }));
  }, [id]);

  const getImg = (src) => src?.startsWith('http') ? src : src ? `https://image.tmdb.org/t/p/original${src}` : 'https://placehold.co/300x450?text=No+Image';

  if (state.loading) return <div className="center">Loading...</div>;
  if (state.error) return <div className="center"><h2>Not found</h2><Link to="/">Back</Link></div>;

  const p = state.data;
  const credits = p.known_for || [];

  return (
    <div className="person-page">
      <div className="person-header">
        <div className="person-img">
          <img src={getImg(p.image)} alt={p.name} onError={e => e.target.src='https://placehold.co/300x450?text=No+Image'}/>
        </div>
        <div className="person-info">
          <h1>{p.name}</h1>
          {p.role && <p><strong>Role:</strong> {p.role}</p>}
          {p.birth_date && <p><strong>Birth Date:</strong> {new Date(p.birth_date).toLocaleDateString('vi-VN')}</p>}
          {p.height && <p><strong>Height:</strong> {p.height}</p>}
          <h3>Biography</h3>
          <p>{p.summary?.length > 5 ? p.summary : 'No biography available.'}</p>
        </div>
      </div>
      <div className="person-credits">
        <h2>Known For</h2>
        <div className="credits-grid">
          {credits.map(m => (
            <Link to={`/movie/${m.id}`} key={m.id} className="credit-card">
              <img src={getImg(m.image || m.poster_path)} alt={m.title} onError={e => e.target.src='https://placehold.co/200x300?text=No+Image'}/>
              <div className="credit-title">{m.title}</div>
              {m.character && <div className="credit-role">as {m.character}</div>}
            </Link>
          ))}
        </div>
        {!credits.length && <p>No movies found.</p>}
      </div>
      <style>{`.person-page{padding:40px 20px;max-width:1100px;margin:auto}.person-header{display:flex;gap:40px;flex-wrap:wrap}.person-img img{width:300px;border-radius:12px}.person-info{flex:1}.person-info h1{margin-top:0}.person-info p{line-height:1.6;color:#333;margin-bottom:10px;text-align:justify}.dark .person-info p{color:#ddd}.person-credits{margin-top:60px}.credits-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:20px}.credit-card{text-decoration:none;color:inherit}.credit-card img{width:100%;aspect-ratio:2/3;object-fit:cover;border-radius:8px}.credit-title{font-weight:bold;margin-top:6px}.credit-role{font-size:.85rem;opacity:.8}.center{padding:40px;text-align:center}`}</style>
    </div>
  );
}