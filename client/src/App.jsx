export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-green-100 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-700">
      <div className="bg-white/40 dark:bg-gray-800/60 backdrop-blur-xl shadow-2xl rounded-2xl p-12 text-center border border-white/30">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4 animate-bounce">
          Tailwind is Working 🎉
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
          You're now ready to build your advanced dynamic UI!
        </p>
      </div>
    </div>
  );
}

