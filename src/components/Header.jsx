import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ dark, toggleDark }) {
  const { user, logout } = useAuth();

  return (
    <div className="header">
      <div className="left"><span>23122047</span></div>
      <Link to="/" className="logo">Movies Info</Link>
      <div className="right">
        {user ? (
          <>
            <span className="wel">Hi, <strong>{user.username || "User"}</strong></span>
            <Link to="/profile" className="btn">Profile</Link>
            <button onClick={logout} className="btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
        <button onClick={toggleDark} className="theme">{dark ? "☀️" : "🌙"}</button>
      </div>
      <style>{`.header{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 20px;height:60px;box-shadow:0 1px 3px rgba(0,0,0,.1)}.left{justify-self:start;font-weight:500}.logo{justify-self:center;text-decoration:none;color:inherit;font-weight:800;font-size:1.5rem;white-space:nowrap}.right{justify-self:end;display:flex;align-items:center;gap:15px}.btn{text-decoration:none;color:inherit;font-weight:500;cursor:pointer;background:0 0;border:none;font-size:1rem;padding:0}.btn:hover{color:#e74c3c}.theme{background:0 0;border:none;cursor:pointer;font-size:1.2rem;padding-left:5px}@media(max-width:700px){.header{display:flex;justify-content:space-between}.left,.wel{display:none}}`}</style>
    </div>
  );
}