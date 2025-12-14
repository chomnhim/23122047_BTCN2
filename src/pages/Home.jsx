import { useEffect, useState } from "react";
import api from "../libs/api";
import HeroSlider from "../components/HeroSlider";
import MovieRow from "../components/MovieRow";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/movies'); 
        
        console.log("Dữ liệu API trả về:", response.data); 

        if (Array.isArray(response.data)) {
           setMovies(response.data);
        } 
        else if (response.data && Array.isArray(response.data.data)) {
           setMovies(response.data.data);
        }
        else if (response.data && Array.isArray(response.data.results)) {
           setMovies(response.data.results);
        }
        else {
           console.error("API không trả về mảng danh sách phim!");
           setMovies([]); 
        }

      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Đang tải phim...</div>;

  return (
    <>
      <HeroSlider />
      <MovieRow title="Most Popular" movies={movies?.slice(0, 5)} />
      <MovieRow title="Top Rating" movies={movies?.slice(5, 10)} />
    </>
  );
}