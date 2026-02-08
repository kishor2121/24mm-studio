'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Add smooth scrolling styles
const scrollbarStyles = `
  .scrollbar-smooth::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  .scrollbar-smooth::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
    border-radius: 10px;
  }
  .scrollbar-smooth::-webkit-scrollbar-thumb {
    background: rgba(217, 119, 6, 0.6);
    border-radius: 10px;
  }
  .scrollbar-smooth::-webkit-scrollbar-thumb:hover {
    background: rgba(217, 119, 6, 0.9);
  }
`;

// Testimonials Component
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', text: '', rating: 5 });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setTestimonials(data || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', text: '', rating: 5 });
        setShowForm(false);
        fetchTestimonials();
        alert('Thank you for your review!');
      }
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  const visibleTestimonials = testimonials
    .sort((a, b) => (b.rating || 5) - (a.rating || 5));

  return (
    <section className="py-12 sm:py-20 bg-black relative">
      <style>{scrollbarStyles}</style>
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=600&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16 uppercase tracking-wide">
          ** Reviews **
        </h2>

        {/* All Reviews - Horizontal Scrolling */}
        <div className="mb-8 sm:mb-12 overflow-hidden">
          <div className="overflow-x-auto scrollbar-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-6 sm:gap-8 pb-4 min-w-max">
              {visibleTestimonials.length > 0 ? (
                visibleTestimonials.map((testimonial, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-600 rounded-lg p-8 sm:p-10 hover:border-amber-500 transition bg-black bg-opacity-40 flex-shrink-0 w-80 sm:w-96"
                  >
                    {/* Star Rating */}
                    <div className="flex gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-2xl ${star <= (testimonial.rating || 5) ? 'text-amber-500' : 'text-gray-700'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-400 text-5xl sm:text-6xl mb-6 leading-none">"</p>
                    <p className="text-gray-300 italic mb-8 text-sm sm:text-base leading-relaxed">
                      {testimonial.content}
                    </p>
                    <p className="text-amber-500 font-semibold text-sm sm:text-base">— {testimonial.name}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 w-full py-8">
                  <p>No testimonials yet. Be the first to share!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition ${
                idx < 3
                  ? 'bg-amber-500 w-3'
                  : 'bg-gray-600 w-2 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Add Review Button */}
        {!showForm ? (
          <div className="text-center mb-12">
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber-600 hover:bg-amber-700 px-8 py-3 rounded text-lg font-semibold transition"
            >
              Add Your Review
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-gray-900 border border-amber-600 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Share Your Experience</h3>
            <form onSubmit={handleSubmitReview}>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-gray-800 text-white px-4 py-3 rounded mb-4 border border-gray-700 focus:border-amber-600 focus:outline-none"
              />
              
              {/* Star Rating Input */}
              <div className="mb-4">
                <label className="text-white text-sm font-semibold block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-3xl transition cursor-pointer ${
                        star <= formData.rating ? 'text-amber-500' : 'text-gray-600 hover:text-amber-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                placeholder="Your Review"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                rows={5}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded mb-4 border border-gray-700 focus:border-amber-600 focus:outline-none"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded font-semibold transition"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quote Section */}
        <div className="mt-16 text-center border-t border-gray-800 pt-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            True Emotions. True Moments. True Love Stories.
          </h3>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Your Wedding Day Is A Celebration Of Love, Laughter, And Once-In-A-Lifetime Moments. We Specialize In Capturing Those Raw, Real Emotions Through Candid Photography And Cinematic Videography—So You Can Relive The Magic, Again And Again.
          </p>
        </div>
      </div>
    </section>
  );
}

// Local image URLs from public/images folder
const CAROUSEL_IMAGES = [
  '/images/wed.jpeg',
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-widest">
            STUDIO 24MM
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-amber-500 hover:text-amber-400 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 lg:gap-8 items-center">
            <Link 
              href="/"
              className="hover:text-amber-500 transition text-xs lg:text-sm uppercase tracking-wide"
            >
              Home
            </Link>
            <Link 
              href="/dashboard/gallery"
              className="hover:text-amber-500 transition text-xs lg:text-sm uppercase tracking-wide"
            >
              Gallery
            </Link>
            <Link 
              href="/dashboard/gallery"
              className="hover:text-amber-500 transition text-xs lg:text-sm uppercase tracking-wide"
            >
              Films
            </Link>
            <Link 
              href="#services"
              className="hover:text-amber-500 transition text-xs lg:text-sm uppercase tracking-wide"
            >
              Services
            </Link>
            <Link 
              href="/auth/login"
              className="hover:text-amber-500 transition text-xs lg:text-sm uppercase tracking-wide"
            >
              Login
            </Link>
            <Link 
              href="/dashboard/upload"
              className="bg-amber-600 hover:bg-amber-700 px-4 lg:px-6 py-2 rounded transition text-xs lg:text-sm uppercase tracking-wide"
            >
              Upload
            </Link>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-95 border-t border-gray-800">
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block hover:text-amber-500 transition text-sm uppercase tracking-wide py-2">
                Home
              </Link>
              <Link href="/dashboard/gallery" className="block hover:text-amber-500 transition text-sm uppercase tracking-wide py-2">
                Gallery
              </Link>
              <Link href="/dashboard/gallery" className="block hover:text-amber-500 transition text-sm uppercase tracking-wide py-2">
                Films
              </Link>
              <Link href="#services" className="block hover:text-amber-500 transition text-sm uppercase tracking-wide py-2">
                Services
              </Link>
              <Link href="/auth/login" className="block hover:text-amber-500 transition text-sm uppercase tracking-wide py-2">
                Login
              </Link>
              <Link href="/dashboard/upload" className="block bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded transition text-sm uppercase tracking-wide">
                Upload
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Carousel Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 sm:px-6">
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
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-center w-full px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest text-white leading-tight">
            K A R T H I K F R A M E S
            <span className="block text-amber-500 mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl">Clicks</span>
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
      <section className="py-12 sm:py-20 bg-gray-950 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16 uppercase tracking-wide">
            Why Choose Studio 24MM?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-black p-6 sm:p-8 rounded-lg border border-amber-700 hover:border-amber-500 transition">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📸</div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3">Professional Quality</h3>
              <p className="text-gray-400 text-sm">
                Stunning images and videos captured with professional equipment and expertise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-black p-6 sm:p-8 rounded-lg border border-amber-700 hover:border-amber-500 transition">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎬</div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3">Images & Videos</h3>
              <p className="text-gray-400 text-sm">
                Browse both stunning photographs and videography from our extensive collection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-black p-6 sm:p-8 rounded-lg border border-amber-700 hover:border-amber-500 transition">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⭐</div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3">Community Reviews</h3>
              <p className="text-gray-400 text-sm">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16 uppercase tracking-wide">
            What We Do?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
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

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer Section */}
      <footer className="bg-black border-t border-gray-800 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Left Column - Company Info */}
            <div>
              <div className="mb-6 sm:mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">STUDIO 24MM</h3>
                <p className="text-base sm:text-lg text-amber-600 mb-4 sm:mb-6">"Celebrating Love"</p>
              </div>
              
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                At <span className="font-semibold text-white">STUDIO 24MM</span> We Specialize In Wedding Photography And Videography, Ensuring That Every Precious Moment Of Your Special Day Is Beautifully Preserved. From The Intimate Glances To The Grand Celebrations, Our Team Is Dedicated To Capturing The Essence And Emotion Of Your Events.
              </p>
            </div>

            {/* Middle Column - Links */}
            <div className="flex flex-col items-start sm:items-center justify-start pt-6 sm:pt-8">
              <nav className="flex flex-col gap-3 sm:gap-4 text-gray-300 text-xs sm:text-sm">
                <a href="#" className="hover:text-amber-500 transition uppercase tracking-wide">
                  Terms & Conditions
                </a>
                <a href="#" className="hover:text-amber-500 transition uppercase tracking-wide">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-amber-500 transition uppercase tracking-wide">
                  Contact Us
                </a>
              </nav>
            </div>

            {/* Right Column - Location Map & Contact */}
            <div>
              <div className="mb-4 sm:mb-6">
                <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 h-40 sm:h-48 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <p className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">📍 Studio Location</p>
                    <p className="text-xs">Studio 24MM<br />Professional Photography Studio</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  <a href="#" className="text-amber-600 hover:text-amber-500">View larger map</a>
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-xs sm:text-sm">
                <p className="text-gray-300">
                  <a href="mailto:24mmstudio@gamil.com" className="text-gray-300 hover:text-amber-500 transition">
                    24mmstudio@gamil.com
                  </a>
                </p>
                <p className="text-gray-300">
                  <a href="tel:+919060144016" className="text-gray-300 hover:text-amber-500 transition">
                    +91 6363967683
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs sm:text-sm">
            <p>&copy; 2026 Studio 24MM. All rights reserved.</p>
            <p className="mt-2">Professional Wedding Photography & Videography</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
