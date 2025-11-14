export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-700 bg-gray-900 py-6">
      <div className="app-container text-center text-sm text-slate-400">
        © {new Date().getFullYear()} MicroLoaner. All rights reserved.
      </div>
    </footer>
  );
}
