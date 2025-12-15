import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PersonDetail() {
  const { id } = useParams();
  const [s, setS] = useState({ d: null, l: true, e: null });

  useEffect(() => {
    fetch(`/api/api/persons/${id}`, {
      headers: { 'Content-Type': 'application/json', 'x-app-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo" }
    })
      .then(res => res.ok ? res.json() : Promise.reject('Not found'))
      .then(d => setS({ d: d.data || d, l: false, e: null }))
      .catch(e => setS({ d: null, l: false, e: e.toString() }));
  }, [id]);

  const getImg = (src) => src?.startsWith('http') ? src : src ? `https://image.tmdb.org/t/p/w500${src}` : 'https://placehold.co/300x450?text=No+Image';

  if (s.l) return <div className="center">Loading...</div>;
  if (s.e) return <div className="center"><h2>Not found</h2><Link to="/">Back</Link></div>;

  const p = s.d;
  const c = p.known_for || [];

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
          {c.map(m => (
            <Link to={`/movie/${m.id}`} key={m.id} className="credit-card">
              <div className="img-wrapper">
                <img src={getImg(m.image || m.poster_path)} alt={m.title} onError={e => e.target.src='https://placehold.co/200x300?text=No+Image'}/>
              </div>
              <div className="credit-title">{m.title}</div>
              {m.character && <div className="credit-role">as {m.character}</div>}
            </Link>
          ))}
        </div>
        {!c.length && <p>No movies found.</p>}
      </div>
      <style>{`.person-page{padding:40px 20px;max-width:1100px;margin:auto}.person-header{display:flex;gap:40px;flex-wrap:wrap}.person-img img{width:300px;border-radius:12px}.person-info{flex:1}.person-info h1,.person-info h3,.person-credits h2{margin-top:0;color:#333}.person-info p{line-height:1.6;color:#333;margin-bottom:10px;text-align:justify}.person-info strong{color:#000}.person-credits{margin-top:60px}.credits-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:20px}.credit-card{text-decoration:none;color:inherit;display:block}.img-wrapper{width:100%;aspect-ratio:2/3;background:#eee;border-radius:8px;overflow:hidden}.img-wrapper img{width:100%;height:100%;object-fit:cover;transition:.3s}.credit-card:hover img{transform:scale(1.05)}.credit-title{font-weight:700;margin-top:6px;color:#333}.credit-role{font-size:.85rem;opacity:.8;color:#666}.center{padding:40px;text-align:center}.app.dark .person-info h1,.app.dark .person-info h3,.app.dark .person-credits h2,.app.dark .credit-title,.app.dark .center{color:#fff}.app.dark .person-info p{color:#ddd}.app.dark .person-info strong{color:#fff}.app.dark .credit-role{color:#aaa}.app.dark .img-wrapper{background:#333}`}</style>
    </div>
  );
}