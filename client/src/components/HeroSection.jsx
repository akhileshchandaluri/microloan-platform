export default function HeroSection() {
  return (
    <header className="py-12">
      <div className="app-container flex items-center justify-between">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-extrabold">Empower Your Finances</h1>
          <p className="mt-4 text-slate-300 text-lg">
            Apply, track and manage microloans — instant EMI calculator and admin approval workflow.
          </p>
          <a href="#apply" className="inline-block mt-6 px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white">
            Get Started
          </a>
        </div>
        <div className="hidden md:block w-96 h-64 rounded-lg card">
          {/* Placeholder for image or illustration */}
          <div className="h-full flex items-center justify-center text-slate-400">Finance illustration</div>
        </div>
      </div>
    </header>
  );
}
