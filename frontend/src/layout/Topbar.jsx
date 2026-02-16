import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h3>Welcome, {user.name} ({user.role})</h3>
      </div>
      <div className="topbar-right">
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}
