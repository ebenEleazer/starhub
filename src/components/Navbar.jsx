import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/">StarHub</Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/channels" className="text-gray-700 hover:text-blue-600">
          Channels
        </Link>
        <Link to="/articles" className="text-gray-700 hover:text-blue-600">
          Articles
        </Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">
          Profile
        </Link>
        {token && (
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}