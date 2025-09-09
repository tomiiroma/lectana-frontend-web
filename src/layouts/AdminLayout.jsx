import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/">Lectana</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link to="/admin">Admin</Link>
      </nav>
      <Outlet />
    </div>
  );
}


