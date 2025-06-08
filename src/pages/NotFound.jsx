export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-4">Page not found.</p>
      <a href="/" className="text-blue-600 underline">Go to homepage</a>
    </div>
  );
}