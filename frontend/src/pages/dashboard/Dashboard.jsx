import { useAuth } from "../../context/AuthContext";
import ClientDashboard from "./ClientDashboard";
import AgentDashboard from "./AgentDashboard";
import AdminDashboard from "./AdminDashboard";

function Dashboard() {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  console.log("Dashboard sees user.role:", user.role);

  switch (user.role?.toUpperCase().trim()) {
    case "CLIENT":
      return <ClientDashboard />;
    case "AGENT":
      return <AgentDashboard />;
    case "ADMIN":
      return <AdminDashboard />;
    default:
      return <div>Unknown role: {user.role}</div>;
  }
}

export default Dashboard;
