import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";

function Layout({ dark, toggleDark }) {
  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <Header dark={dark} toggleDark={toggleDark} />
      <Navbar />
      <div style={{ minHeight: "80vh" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Layout dark={dark} toggleDark={() => setDark(!dark)} />}>
        <Route index element={<Home />} />
        <Route path="movie/:id" element={<MovieDetail />} />
      </Route>
    </Routes>
  );
}