import { Outlet } from "react-router-dom";
import Header from "../../../components/layout/Header/Header.jsx";
import Sidebar from "../../../components/layout/Sidebar/Sidebar.jsx";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Header />

      <div className="dashboard-layout__body">
        <Sidebar />

        <main className="dashboard-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
