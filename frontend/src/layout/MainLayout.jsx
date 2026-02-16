import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./layout.css";

export default function MainLayout({ children, sidebarLinks, topbarContent }) {
  return (
    <div className="layout">
      <Sidebar links={sidebarLinks} />
      <div className="main-content">
        <Topbar
          userName={topbarContent.userName}
          userRole={topbarContent.userRole}
          onLogout={topbarContent.onLogout}
        />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
