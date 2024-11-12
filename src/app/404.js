// For Next.js `pages` or `app` directory
"use client";
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
        <p className="mt-4 text-lg">Oops! The page you not looking for does not exist.</p>
        <button
          onClick={() => router.push('/')} // Redirect to homepage
          className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
