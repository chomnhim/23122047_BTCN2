export default function Header({ dark, toggleDark }) {
  return (
    <div className="header">
      <span>&lt;MSSV&gt;</span>
      <strong>Movies info</strong>
      <button onClick={toggleDark}>
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
