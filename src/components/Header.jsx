import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ dark, toggleDark }) {
  const { user, logout } = useAuth();

  return (
    <div className="header">
      <span>23122047</span>
      <Link to="/" className="logo">Movies Info</Link>
      <div className="actions">
        {user ? (
          <>
            <span className="welcome">Hi, <strong>{user.username}</strong></span>
            <button onClick={logout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-link">Login</Link>
            <Link to="/register" className="btn-link">Register</Link>
          </>
        )}
        <button onClick={toggleDark} className="theme-btn">{dark ? "☀️" : "🌙"}</button>
      </div>
      <style>{`.header{display:flex;justify-content:space-between;align-items:center;padding:0 20px;height:60px}.logo{text-decoration:none;color:inherit;font-weight:700;font-size:1.5rem;position:absolute;left:50%;transform:translateX(-50%)}.actions{display:flex;align-items:center;gap:15px}.btn-link{text-decoration:none;color:inherit;font-weight:500;cursor:pointer;background:none;border:none;font-size:1rem}.btn-link:hover{opacity:.7}.theme-btn{background:none;border:none;cursor:pointer;font-size:1.2rem;padding:5px}@media(max-width:600px){.header span:first-child,.welcome{display:none}}`}</style>
    </div>
  );
}