import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      <h1 className="text-7xl font-extrabold text-red-500 mb-4">404</h1>
      <p className="text-2xl text-gray-300 mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}