import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12; 

  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  useEffect(() => {
    setLoading(true);
    setPage(1); 

    fetch(`/api/api/persons/${id}`, {
      headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
    })
      .then(res => res.ok ? res.json() : Promise.reject('Not found'))
      .then(d => {
        setPerson(d.data || d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.toString());
        setLoading(false);
      });
  }, [id]);

  const getImg = (src) => src?.startsWith('http') ? src : src ? `https://image.tmdb.org/t/p/w500${src}` : 'https://placehold.co/300x450?text=No+Image';

  const handlePageChange = (newPage) => {
    setPage(newPage);
    document.getElementById('known-for-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="center">Loading...</div>;
  if (error || !person) return <div className="center"><h2>Not found</h2><Link to="/">Back</Link></div>;

  const allMovies = person.known_for || [];
  const totalPages = Math.ceil(allMovies.length / ITEMS_PER_PAGE);
  const currentMovies = allMovies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="person-page">
      <div className="person-header">
        <div className="person-img">
          <img src={getImg(person.image)} alt={person.name} onError={e => e.target.src='https://placehold.co/300x450?text=No+Image'}/>
        </div>
        <div className="person-info">
          <h1>{person.name}</h1>
          {person.role && <p><strong>Role:</strong> {person.role}</p>}
          {person.birth_date && <p><strong>Birth Date:</strong> {new Date(person.birth_date).toLocaleDateString('vi-VN')}</p>}
          {person.height && <p><strong>Height:</strong> {person.height}</p>}
          <h3>Biography</h3>
          <p>{person.summary?.length > 5 ? person.summary : 'No biography available.'}</p>
        </div>
      </div>

      <div className="person-credits" id="known-for-section">
        <h2>Known For ({allMovies.length})</h2>
        
        {allMovies.length > 0 ? (
          <>
            <div className="credits-grid">
              {currentMovies.map((m, idx) => (
                <Link to={`/movie/${m.id}`} key={`${m.id}-${idx}`} className="credit-card">
                  <div className="img-wrapper">
                    <img src={getImg(m.image || m.poster_path)} alt={m.title} onError={e => e.target.src='https://placehold.co/200x300?text=No+Image'}/>
                  </div>
                  <div className="credit-title">{m.title}</div>
                  {m.character && <div className="credit-role">as {m.character}</div>}
                </Link>
              ))}
            </div>

            {totalPages >= 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(page - 1)} 
                  disabled={page === 1}
                  className="page-btn"
                >
                  &laquo; Prev
                </button>
                
                <span className="page-info">Page {page} of {totalPages}</span>
                
                <button 
                  onClick={() => handlePageChange(page + 1)} 
                  disabled={page === totalPages}
                  className="page-btn"
                >
                  Next &raquo;
                </button>
              </div>
            )}
          </>
        ) : (
          <p>No movies found.</p>
        )}
      </div>

      <style>{`
        .person-page{padding:40px 20px;max-width:1100px;margin:auto;min-height:80vh}
        .person-header{display:flex;gap:40px;flex-wrap:wrap}
        .person-img img{width:300px;border-radius:12px}
        .person-info{flex:1}
        .person-info h1,.person-info h3,.person-credits h2{margin-top:0;color:#333}
        .person-info p{line-height:1.6;color:#333;margin-bottom:10px;text-align:justify}
        .person-info strong{color:#000}
        .person-credits{margin-top:60px}
        .credits-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:20px}
        .credit-card{text-decoration:none;color:inherit;display:block}
        .img-wrapper{width:100%;aspect-ratio:2/3;background:#eee;border-radius:8px;overflow:hidden}
        .img-wrapper img{width:100%;height:100%;object-fit:cover;transition:.3s}
        .credit-card:hover img{transform:scale(1.05)}
        .credit-title{font-weight:700;margin-top:6px;color:#333}
        .credit-role{font-size:.85rem;opacity:.8;color:#666}
        .center{padding:40px;text-align:center}
        
        /* Pagination CSS */
        .pagination { display: flex; justify-content: center; align-items: center; margin-top: 40px; gap: 15px; }
        .page-btn { padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .page-btn:disabled { background: #ccc; cursor: not-allowed; opacity: 0.6; }
        .page-btn:hover:not(:disabled) { background: #c0392b; }
        .page-info { font-weight: bold; color: #555; }

        /* Dark Mode Support */
        .app.dark .person-info h1,.app.dark .person-info h3,.app.dark .person-credits h2,.app.dark .credit-title,.app.dark .center,.app.dark .page-info{color:#fff}
        .app.dark .person-info p{color:#ddd}
        .app.dark .person-info strong{color:#fff}
        .app.dark .credit-role{color:#aaa}
        .app.dark .img-wrapper{background:#333}
      `}</style>
    </div>
  );
}