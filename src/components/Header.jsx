import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ dark, toggleDark }) {
  const { user, logout } = useAuth();
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px',
      padding: '0 20px',
      backgroundColor: dark ? '#2c3e50' : '#fae8ea', 
      color: dark ? '#fff' : '#000',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    sideSection: {
      flex: 1, 
      display: 'flex',
      alignItems: 'center'
    },
    rightSection: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end', 
      gap: '15px'
    },
    logo: {
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      color: 'inherit',
      whiteSpace: 'nowrap'
    },
    btn: {
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sideSection}>
        <span>23122047</span>
      </div>

      <Link to="/" style={styles.logo}>Movies Info</Link>

      <div style={styles.rightSection}>
        {user ? (
          <>
            <span style={{ marginRight: 5 }} className="mobile-hide">
              Hi, <strong>{user.username}</strong>
            </span>
            <Link to="/profile" style={styles.btn}>Profile</Link>
            <button onClick={logout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.btn}>Login</Link>
            <Link to="/register" style={styles.btn}>Register</Link>
          </>
        )}
        <button onClick={toggleDark} style={{...styles.btn, fontSize: '1.2rem', marginLeft: '5px'}}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .mobile-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}