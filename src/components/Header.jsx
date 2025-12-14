import { Link } from "react-router-dom";

export default function Header({ dark, toggleDark }) {
  return (
    <div className="header">
      <span>23122047</span>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
        Movies Info
      </Link>
      <button onClick={toggleDark}>
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}