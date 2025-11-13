import LoanForm from "../components/LoanForm.jsx";
import Footer from "../components/Footer.jsx";
import HeroSection from "../components/HeroSection.jsx";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="app-container mt-10">
        <LoanForm />
      </div>
      <Footer />
    </div>
  );
}
