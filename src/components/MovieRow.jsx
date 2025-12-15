import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MovieRow = ({ title, type }) => {
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); 

  // Token API
  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  useEffect(() => {
    const fetchMovies = async () => {
      const endpointSuffix = type === 'top_rated' ? 'top-rated' : 'most-popular';
      const baseUrl = `/api/api/movies/${endpointSuffix}`; 

      try {
        // BƯỚC 1: Lấy danh sách Top Rated sơ bộ (chỉ có ID, Title...)
        const resPage1 = await fetch(`${baseUrl}?page=1`, {
          headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
        });

        if (!resPage1.ok) throw new Error("API Error");

        const dataPage1 = await resPage1.json();
        let simpleMovies = dataPage1.data || [];
        
        // Lấy thêm trang 2, 3, 4 nếu cần để đủ số lượng
        const totalPages = dataPage1.pagination ? dataPage1.pagination.total_pages : 1;
        const maxPagesToFetch = Math.min(totalPages, 4); 

        if (maxPagesToFetch > 1) {
          const promises = [];
          for (let page = 2; page <= maxPagesToFetch; page++) {
            promises.push(
              fetch(`${baseUrl}?page=${page}`, {
                headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
              }).then(res => res.json()).catch(() => ({ data: [] }))
            );
          }
          const responses = await Promise.all(promises);
          responses.forEach(res => {
            if (res.data) simpleMovies = [...simpleMovies, ...res.data];
          });
        }

        // Cắt lấy 30 phim đầu tiên
        const top30 = simpleMovies.slice(0, 30);

        // BƯỚC 2: "NÂNG CẤP" DỮ LIỆU
        // Gọi API chi tiết cho từng phim để lấy thông tin Năm sản xuất chính xác
        const detailedMovies = await Promise.all(
          top30.map(async (movie) => {
            try {
              // Gọi endpoint chi tiết: /api/api/movies/{id}
              const detailRes = await fetch(`/api/api/movies/${movie.id}`, {
                 headers: { 'Content-Type': 'application/json', 'x-app-token': appToken }
              });
              
              if (detailRes.ok) {
                const detailData = await detailRes.json();
                // API chi tiết thường trả về dữ liệu đầy đủ có trường 'year'
                // Ưu tiên dữ liệu chi tiết, nếu lỗi thì dùng lại dữ liệu cũ
                return detailData.data || detailData || movie;
              }
            } catch (err) {
              console.warn(`Lỗi lấy chi tiết phim ${movie.id}`, err);
            }
            return movie; // Trả về phim gốc nếu không lấy được chi tiết
          })
        );

        setMovies(detailedMovies);

      } catch (err) {
        console.error("Lỗi tải danh sách phim:", err);
      }
    };

    fetchMovies();
  }, [type]);

  // --- HÀM XỬ LÝ NĂM (Vẫn giữ logic mạnh mẽ để parse mọi định dạng) ---
  const getMovieYear = (movie) => {
    if (!movie) return 'N/A';
    
    // 1. Kiểm tra trường 'year' (Giờ đây đã có nhờ Bước 2)
    if (movie.year && !isNaN(movie.year)) return movie.year;

    // 2. Quét các trường ngày tháng khác để dự phòng
    const dateCandidates = [
        movie.release_date, 
        movie.releaseDate, 
        movie.first_air_date,
        movie.premiere_date
    ];

    for (const rawDate of dateCandidates) {
        if (rawDate) {
            const yearMatch = String(rawDate).match(/\d{4}/);
            if (yearMatch) return yearMatch[0];
        }
    }
    
    return 'N/A';
  };
  // -----------------------------------------------------

  const getPosterURL = (movie) => {
    const imgSrc = movie.image || movie.poster || movie.poster_path;
    if (!imgSrc || imgSrc === 'N/A') return 'https://via.placeholder.com/300x450?text=No+Image';
    if (imgSrc.startsWith('http')) return imgSrc;
    return `https://image.tmdb.org/t/p/w500${imgSrc}`;
  };

  // --- LOGIC SLIDER GIỮ NGUYÊN ---
  const itemsPerPage = 3; 

  const handlePageChange = (direction) => {
    if (isAnimating) return; 
    setIsAnimating(true); 
    setTimeout(() => {
      if (direction === 'next') {
        if (startIndex + itemsPerPage < movies.length) setStartIndex(prev => prev + itemsPerPage);
      } else {
        if (startIndex > 0) setStartIndex(prev => prev - itemsPerPage);
      }
      setIsAnimating(false);
    }, 300);
  };

  if (movies.length === 0) return null;
  const visibleMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="movie-row-section" style={{ margin: '5px 0 10px 0' }}>
      <h3 style={{ 
        textAlign: 'left', marginLeft: '40px', fontSize: '20px', fontWeight: 'bold',
        borderLeft: '4px solid #e74c3c', paddingLeft: '5px', marginBottom: '10px'
      }}>
        {title}
      </h3>
      
      <div className="row-wrapper">
        {startIndex > 0 && (
          <button className="row-btn prev" onClick={() => handlePageChange('prev')}>&#10094;</button>
        )}

        <div className={`row-slider ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          {visibleMovies.map((movie) => (
            <div key={movie.id} className="movie-card-container">
              <Link to={`/movie/${movie.id}`} className="movie-card-link">
                <div className="movie-card-content">
                    <img 
                      src={getPosterURL(movie)} 
                      alt={movie.title} 
                      className="card-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                    />
                    <div className="card-overlay">
                        <h4 className="card-title">{movie.title}</h4>
                        
                        <div className="card-meta">
                            {/* Giờ đây thông tin năm sẽ chính xác hơn rất nhiều */}
                            {getMovieYear(movie)}
                        </div>
                        
                        <div className="play-icon">▶</div>
                    </div>
                </div>
              </Link>
            </div>
          ))}
          
          {[...Array(itemsPerPage - visibleMovies.length)].map((_, i) => (
             <div key={`empty-${i}`} className="movie-card-container empty-placeholder"></div>
          ))}
        </div>

        {startIndex + itemsPerPage < movies.length && (
          <button className="row-btn next" onClick={() => handlePageChange('next')}>&#10095;</button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;