'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Local image URLs from public/images folder
const CAROUSEL_IMAGES = [
  '/images/wed.jpeg',
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
        {CAROUSEL_IMAGES.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Carousel ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

        {/* Content */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-center w-full px-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-widest text-white">
            K A R T H I K F R A M E S
            <span className="block text-amber-500 mt-4 text-4xl">Clicks</span>
          </h1>
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

      {/* Services Section - What We Do */}
      <section id="services" className="py-20 bg-gray-950 relative">
        <style>{`
          /* Wedding Animation - Rotating */
          @keyframes weddingRotate {
            0%, 100% { transform: rotateY(0deg); }
            50% { transform: rotateY(360deg); }
          }
          
          /* Baby Animation - Gentle Float */
          @keyframes babyFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-15px) scale(1.05); }
          }
          
          /* Celebration Animation - Bounce */
          @keyframes celebrationBounce {
            0%, 100% { transform: translateY(0px); }
            25% { transform: translateY(-20px); }
            50% { transform: translateY(0px); }
            75% { transform: translateY(-10px); }
          }
          
          /* Corporate Animation - Pulse */
          @keyframes corporatePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          
          /* Apply animations on hover */
          .wedding-animation:hover .service-icon {
            animation: weddingRotate 1.2s ease-in-out infinite;
          }
          
          .baby-animation:hover .service-icon {
            animation: babyFloat 1s ease-in-out infinite;
          }
          
          .celebration-animation:hover .service-icon {
            animation: celebrationBounce 1.2s ease-in-out infinite;
          }
          
          .corporate-animation:hover .service-icon {
            animation: corporatePulse 0.8s ease-in-out infinite;
          }
          
          .service-card {
            position: relative;
            transition: all 0.3s ease;
          }
          .service-card:hover .service-box {
            background: linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
            box-shadow: 0 0 30px rgba(20, 184, 166, 0.5), inset 0 0 30px rgba(20, 184, 166, 0.1);
            border: 1px solid rgba(20, 184, 166, 0.5);
          }
          .service-card:hover .service-icon {
            filter: brightness(1.3) drop-shadow(0 0 10px rgba(20, 184, 166, 0.8));
          }
        `}</style>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-wide">
            What We Do?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Weddings - Rotating Animation */}
            <div className="service-card wedding-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/pht2.png" alt="Weddings" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Weddings</p>
            </div>

            {/* Hamarlok Weddings - Rotating Animation */}
            <div className="service-card wedding-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/hamarlok.png" alt="Hamarlok Weddings" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Hamarlok Weddings</p>
            </div>

            {/* Engagement - Rotating Animation */}
            <div className="service-card wedding-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/engagement-icon.jpg" alt="Engagement" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Engagement</p>
            </div>

            {/* Pre Weddings - Rotating Animation */}
            <div className="service-card wedding-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/pre-wedding.png" alt="Pre Weddings" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Pre Weddings</p>
            </div>

            {/* Maternity - Baby Float Animation */}
            <div className="service-card baby-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/maternity.png" alt="Maternity" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Maternity</p>
            </div>

            {/* Baby Shower - Baby Float Animation */}
            <div className="service-card baby-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/baby-shower.png" alt="Baby Shower" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Baby Shower</p>
            </div>

            {/* New Born - Baby Float Animation */}
            <div className="service-card baby-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/newborn.png" alt="New Born" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">New Born</p>
            </div>

            {/* Baby Shoot - Baby Float Animation */}
            <div className="service-card baby-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/baby_shoot.png" alt="Baby Shoot" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Baby Shoot</p>
            </div>

            {/* Birthday - Celebration Bounce Animation */}
            <div className="service-card celebration-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/birthday.png" alt="Birthday" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Birthday</p>
            </div>

            {/* Naming Ceremony - Celebration Bounce Animation */}
            <div className="service-card celebration-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/naming_cermony.png" alt="Naming Ceremony" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Naming Ceremony</p>
            </div>

            {/* House Warming - Celebration Bounce Animation */}
            <div className="service-card celebration-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/house_warming.webp" alt="House Warming" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">House Warming</p>
            </div>

            {/* Portfolio Shoot - Corporate Pulse Animation */}
            <div className="service-card corporate-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/portfolio.png" alt="Portfolio Shoot" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Portfolio Shoot</p>
            </div>

            {/* Product Shoot - Corporate Pulse Animation */}
            <div className="service-card corporate-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/product_shoot.png" alt="Product Shoot" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Product Shoot</p>
            </div>

            {/* Corporate Events - Corporate Pulse Animation */}
            <div className="service-card corporate-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/corporate_events.png" alt="Corporate Events" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Corporate Events</p>
            </div>

            {/* Car/Bike Shoot - Corporate Pulse Animation */}
            <div className="service-card corporate-animation text-center">
              <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300">
                <img src="https://photocrewpictures.com/pics/services/caricon.png" alt="Car/Bike Shoot" className="service-icon w-20 h-20 object-contain transition-all duration-300" />
              </div>
              <p className="text-white font-semibold">Car/Bike Shoot</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        {/* Background Camera Image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop" 
            alt="Camera Background" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {/* Stat 1 - Weddings Covered */}
            <div className="group">
              <div className="mb-4 flex justify-center">
                <div className="text-6xl text-amber-500 group-hover:scale-110 transition duration-300">
                  📷
                </div>
              </div>
              <h3 className="text-5xl font-bold text-white mb-2 group-hover:text-amber-500 transition">
                50<span className="text-amber-500">+</span>
              </h3>
              <p className="text-gray-400 uppercase tracking-widest font-semibold">Weddings Covered</p>
            </div>

            {/* Stat 2 - Events Covered */}
            <div className="group">
              <div className="mb-4 flex justify-center">
                <div className="text-6xl text-amber-500 group-hover:scale-110 transition duration-300">
                  🎥
                </div>
              </div>
              <h3 className="text-5xl font-bold text-white mb-2 group-hover:text-amber-500 transition">
                30<span className="text-amber-500">+</span>
              </h3>
              <p className="text-gray-400 uppercase tracking-widest font-semibold">Events Covered</p>
            </div>

            {/* Stat 3 - Videos Edited */}
            <div className="group">
              <div className="mb-4 flex justify-center">
                <div className="text-6xl text-amber-500 group-hover:scale-110 transition duration-300">
                  📺
                </div>
              </div>
              <h3 className="text-5xl font-bold text-white mb-2 group-hover:text-amber-500 transition">
                100<span className="text-amber-500">+</span>
              </h3>
              <p className="text-gray-400 uppercase tracking-widest font-semibold">Videos Edited</p>
            </div>

            {/* Stat 4 - Happy Customers */}
            <div className="group">
              <div className="mb-4 flex justify-center">
                <div className="text-6xl text-amber-500 group-hover:scale-110 transition duration-300">
                  👥
                </div>
              </div>
              <h3 className="text-5xl font-bold text-white mb-2 group-hover:text-amber-500 transition">
                500<span className="text-amber-500">+</span>
              </h3>
              <p className="text-gray-400 uppercase tracking-widest font-semibold">Happy Customers</p>
            </div>
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
