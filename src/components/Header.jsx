export default function Header({ dark, toggleDark }) {
  return (
    <div className="header">
      <span>&lt;MSSV&gt;</span>

      <span style={{ fontWeight: "bold" }}>
        Movies info
      </span>

      <button onClick={toggleDark}>
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
