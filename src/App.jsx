import Header from "./components/Header";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import MovieRow from "./components/MovieRow";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="app">
      <Header />
      <Navbar />
      <HeroSlider />
      <MovieRow title="Most Popular" />
      <MovieRow title="Top Rating" />
      <Footer />
    </div>
  );
}
