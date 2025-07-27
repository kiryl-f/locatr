import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem", color: "#fff", background: "#000" }}>
      <h1>404 - Page Not Found</h1>
      <Link to="/" style={{ color: "#0f0" }}>← Back to Menu</Link>
    </div>
  );
}
