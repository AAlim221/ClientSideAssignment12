import React from 'react'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      {/* SVG or image */}
      <img
        src="https://i.ibb.co/9wZzJg7/404-error.svg"
        alt="404"
        className="w-72 md:w-96 mb-8 animate-pulse"
      />

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Oops! Page Not Found
      </h1>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md">
        The page you’re looking for doesn’t exist or has been moved. Please check the URL or go back to the homepage.
      </p>

      {/* Button */}
      <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
        ⬅ Go to Home
      </Link>
    </div>
  )
}
