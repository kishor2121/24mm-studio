'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Dummy image URLs - Using professional photography images
const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1537633552985-caf2b95f7f60?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1465056836917-7d440af63f23?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1551798181-a3b34ce1981b?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1465146072230-91cabc968266?w=1200&h=800&fit=crop',
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Change background image every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black bg-opacity-95 backdrop-blur' : 'bg-black bg-opacity-40 backdrop-blur'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-widest">
            STUDIO 24MM
          </Link>
          <div className="flex gap-8 items-center">
            <Link 
              href="/"
              className="hover:text-amber-500 transition text-sm uppercase tracking-wide"
            >
              Home
            </Link>
            <Link 
              href="/dashboard/gallery"
              className="hover:text-amber-500 transition text-sm uppercase tracking-wide"
            >
              Gallery
            </Link>
            <Link 
              href="/dashboard/gallery"
              className="hover:text-amber-500 transition text-sm uppercase tracking-wide"
            >
              Films
            </Link>
            <Link 
              href="#services"
              className="hover:text-amber-500 transition text-sm uppercase tracking-wide"
            >
              Services
            </Link>
            <Link 
              href="/auth/login"
              className="hover:text-amber-500 transition text-sm uppercase tracking-wide"
            >
              Login
            </Link>
            <Link 
              href="/dashboard/upload"
              className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded transition text-sm uppercase tracking-wide"
            >
              Upload
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Carousel Background Images */}
        <div className="absolute inset-0 z-0">
          {CAROUSEL_IMAGES.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Capture Your
            <span className="block text-amber-500 mt-2">Precious Moments</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional photography and videography for weddings, events, and special occasions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/gallery"
              className="bg-amber-600 hover:bg-amber-700 px-8 py-4 rounded text-lg font-semibold transition transform hover:scale-105 uppercase tracking-wide"
            >
              View Gallery
            </Link>
            <Link
              href="/auth/login"
              className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-black px-8 py-4 rounded text-lg font-semibold transition uppercase tracking-wide"
            >
              Upload Media
            </Link>
          </div>
        </div>

        {/* Image Counter Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {CAROUSEL_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition ${
                index === currentImageIndex
                  ? 'bg-amber-500 w-8'
                  : 'bg-white bg-opacity-50 w-2 hover:bg-opacity-100'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce z-20">
          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-950 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-wide">
            Why Choose Studio 24MM?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-black p-8 rounded-lg border border-amber-700 hover:border-amber-500 transition">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-2xl font-bold mb-3">Professional Quality</h3>
              <p className="text-gray-400">
                Stunning images and videos captured with professional equipment and expertise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-black p-8 rounded-lg border border-amber-700 hover:border-amber-500 transition">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold mb-3">Images & Videos</h3>
              <p className="text-gray-400">
                Browse both stunning photographs and videography from our extensive collection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-black p-8 rounded-lg border border-amber-700 hover:border-amber-500 transition">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-3">Community Reviews</h3>
              <p className="text-gray-400">
                Share your thoughts and read reviews from other visitors about our work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-wide">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Service 1 */}
            <div className="group relative overflow-hidden rounded-lg h-80 bg-gray-900 cursor-pointer">
              <div className="w-full h-full bg-gradient-to-br from-amber-900 to-black flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl mb-4">💍</p>
                  <p className="text-gray-300 font-semibold">Wedding Photography</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                <Link
                  href="/dashboard/gallery"
                  className="opacity-0 group-hover:opacity-100 bg-amber-600 px-6 py-3 rounded font-semibold transition"
                >
                  View Portfolio
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="group relative overflow-hidden rounded-lg h-80 bg-gray-900 cursor-pointer">
              <div className="w-full h-full bg-gradient-to-br from-amber-900 to-black flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl mb-4">🎉</p>
                  <p className="text-gray-300 font-semibold">Event Coverage</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                <Link
                  href="/dashboard/gallery"
                  className="opacity-0 group-hover:opacity-100 bg-amber-600 px-6 py-3 rounded font-semibold transition"
                >
                  View Portfolio
                </Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="group relative overflow-hidden rounded-lg h-80 bg-gray-900 cursor-pointer">
              <div className="w-full h-full bg-gradient-to-br from-amber-900 to-black flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl mb-4">🎥</p>
                  <p className="text-gray-300 font-semibold">Videography</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                <Link
                  href="/dashboard/gallery"
                  className="opacity-0 group-hover:opacity-100 bg-amber-600 px-6 py-3 rounded font-semibold transition"
                >
                  View Portfolio
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/dashboard/gallery"
              className="bg-amber-600 hover:bg-amber-700 px-8 py-3 rounded text-lg font-semibold inline-block transition uppercase tracking-wide"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-950 border-t border-amber-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-wide">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Upload your images and videos to our gallery and let the world see your creativity.
          </p>
          <Link
            href="/auth/login"
            className="bg-amber-600 hover:bg-amber-700 px-10 py-4 rounded text-lg font-semibold inline-block transition transform hover:scale-105 uppercase tracking-wide"
          >
            Start Uploading Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500">
          <p>&copy; 2026 Studio 24MM. All rights reserved.</p>
          <p className="mt-2">Professional Photography & Videography</p>
        </div>
      </footer>
    </div>
  );
}
