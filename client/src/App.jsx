import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="pt-6">
        <Outlet />
      </main>
    </div>
  );
}
