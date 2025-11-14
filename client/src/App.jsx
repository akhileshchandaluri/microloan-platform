import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar />
      <div className="pt-6 px-4 flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff'
          }
        }}
      />
    </div>
  );
}