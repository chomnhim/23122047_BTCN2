import { useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import SearchPage from "./pages/SearchPage"; 
import PersonDetail from "./pages/PersonDetail"; 
import Login from "./pages/Login";
import Register from "./pages/Register";

const Layout = ({ dark, toggleDark }) => (
  <div className={`app ${dark ? "dark" : ""}`}>
    <Header dark={dark} toggleDark={toggleDark} />
    <Navbar />
    <div style={{ minHeight: "80vh" }}><Outlet /></div>
    <Footer />
  </div>
);

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <AuthProvider> 
      <Routes>
        <Route path="/" element={<Layout dark={dark} toggleDark={() => setDark(!dark)} />}>
          <Route index element={<Home />} />
          <Route path="movie/:id" element={<MovieDetail />} />
          <Route path="person/:id" element={<PersonDetail />} />
          <Route path="search" element={<SearchPage />} /> 
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
             <Route path="profile" element={<div className="center"><h1>Profile Page</h1></div>} />
             <Route path="favorites" element={<div className="center"><h1>Favorites Page</h1></div>} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}