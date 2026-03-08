'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';
// icons for floating action buttons (WhatsApp & phone)
import { FaWhatsapp, FaPhoneAlt, FaInstagram, FaCamera } from 'react-icons/fa';

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

// Fallback gallery images used when no uploads are available
// (currently not needed; commented out to avoid unused variable errors)
/*
const DUMMY_GALLERY = [
  { url: 'https://via.placeholder.com/600x400?text=Dummy+1' },
  { url: 'https://via.placeholder.com/600x400?text=Dummy+2' },
  { url: 'https://via.placeholder.com/600x400?text=Dummy+3' },
];
*/

// Home show images
const HOMESHOW_IMAGES: string[] = [
      '/homeshowimages/bujji.jpg',
      '/homeshowimages/flower.jpg',
      '/homeshowimages/girish.jpg',
      '/homeshowimages/tanuja1.jpeg',
      '/homeshowimages/tanujafamily.jpeg',
      '/homeshowimages/mokshiTanuja.jpeg',
      '/homeshowimages/mokshi1.jpeg',
      '/homeshowimages/mokshikrishna.jpg',
      '/homeshowimages/mokshi.jpeg',
      '/homeshowimages/ammu.jpeg',
      '/homeshowimages/ammu2.jpg',
      '/homeshowimages/ammu1.jpeg',
      '/homeshowimages/aray.jpeg',
      '/homeshowimages/aray1.jpeg',
       '/homeshowimages/aray3.jpg',
      '/homeshowimages/charu.jpg',
      '/homeshowimages/lisha2.png',
      '/homeshowimages/lisha4.png',   
      '/homeshowimages/pa1.jpg',
      '/homeshowimages/pa2.jpg',
      '/homeshowimages/pa3.jpg',

];

const PHONE_NUMBER = '6363967683';
const WHATSAPP_MESSAGE = 'Hi! I would like to get a quick quote for photography services.';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedService, setSelectedService] = useState('all');
  const [selectedServiceType, setSelectedServiceType] = useState('all');

  const backgroundImages = ['/homelogo/karthik.png', '/homelogo/homelogo1.jpg', '/homelogo/homelogo3.jpg','/homelogo/homelogo2.jpg', '/homelogo/homelogo4.jpg', '/homelogo/homelogo7.jpg','/homelogo/homelogo5.jpg','/homelogo/homelogo6.jpg', '/homelogo/24mm.png'];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [displayedText, setDisplayedText] = useState('');

  const galleryServices = ['all', 'Wedding', 'Engagement', 'Pre-Wedding', 'Maternity', 'Baby Shower', 'Portfolio', 'Corporate Events'];
  
  const serviceTypes = [
    { name: 'Weddings', category: 'wedding' },
    { name: 'Hamarlok Weddings', category: 'wedding' },
    { name: 'Engagement', category: 'wedding' },
    { name: 'Pre Weddings', category: 'wedding' },
    { name: 'Maternity', category: 'baby' },
    { name: 'Baby Shower', category: 'baby' },
    { name: 'New Born', category: 'baby' },
    { name: 'Baby Shoot', category: 'baby' },
    { name: 'Birthday', category: 'celebration' },
    { name: 'Naming Ceremony', category: 'celebration' },
    { name: 'House Warming', category: 'celebration' },
    { name: 'Portfolio Shoot', category: 'corporate' },
    { name: 'Product Shoot', category: 'corporate' },
    { name: 'Corporate Events', category: 'corporate' },
    { name: 'Car/Bike Delivery Shoot', category: 'corporate' },
  ];

  const filteredServices = selectedServiceType === 'all' 
    ? serviceTypes 
    : serviceTypes.filter(s => s.category === selectedServiceType);

  // determine which set of images to show in the gallery (now loading only 'home' images)
  const filteredImages = images.filter(img => {
    if (selectedService === 'all') return true;
    return img.service === selectedService;
  });
  
  // When there are no filtered images, simply use an empty list
  const galleryImages = (filteredImages && filteredImages.length > 0) ? filteredImages : [];
  const usingDefaultGallery = !(filteredImages && filteredImages.length > 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if photographer is logged in
  useEffect(() => {
    const photographer = localStorage.getItem('photographer');
    setIsLoggedIn(!!photographer);
  }, []);

  // Fetch uploaded images from API and use the latest as the hero background
  useEffect(() => {
    let mounted = true;
    async function loadImages() {
      try {
        const res = await fetch('/api/images?section=home');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data)) setImages(data);
      } catch (e) {
        // ignore
      }
    }
    loadImages();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgOpacity(0);
      setTimeout(() => {
        setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
        setBgOpacity(1);
      }, 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  // Preload background images
  useEffect(() => {
    backgroundImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Preload home show images
  useEffect(() => {
    HOMESHOW_IMAGES.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Typing animation for title
  useEffect(() => {
    const fullText = 'K A R T H I K   F R A M E S';
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        {/* WhatsApp Button */}
      <div className="relative group">
        <a
          href={`https://wa.me/91${PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-[#25D366] hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 hover:ring-4 hover:ring-offset-2 hover:ring-green-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-300"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="w-8 h-8 text-white" />
        </a>
        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Message us on WhatsApp
        </span>
      </div>
        {/* Phone Call Button */}
      <div className="relative group">
        <a
          href={`tel:+91${PHONE_NUMBER}`}
          className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 hover:ring-4 hover:ring-offset-2 hover:ring-blue-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-300"
          title="Call us"
          aria-label="Call us"
        >
          <FaPhoneAlt className="w-8 h-8 text-white" />
        </a>
        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Give us a call
        </span>
      </div>
      {/* Instagram Button */}
      <div className="relative group">
        <a
          href="https://www.instagram.com/karthi.frames?igsh=d3VtNDcyMmU1cmo0"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 hover:ring-4 hover:ring-offset-2 hover:ring-pink-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-pink-300"
          title="Visit our Instagram"
          aria-label="Visit our Instagram"
        >
          <FaInstagram className="w-8 h-8 text-white" />
        </a>
        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Follow us on Instagram
        </span>
      </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black bg-opacity-95 backdrop-blur' : 'bg-black bg-opacity-40 backdrop-blur'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-widest">
            24mm STUDIO
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
            {!isLoggedIn && (
              <Link 
                href="/auth/login"
                className="hover:text-amber-500 transition text-xs lg:text-sm uppercase tracking-wide"
              >
                Login
              </Link>
            )}
            {isLoggedIn && (
              <Link 
                href="/dashboard/upload"
                className="bg-amber-600 hover:bg-amber-700 px-4 lg:px-6 py-2 rounded transition text-xs lg:text-sm uppercase tracking-wide"
              >
                Upload
              </Link>
            )}
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
              {!isLoggedIn && (
                <Link href="/auth/login" className="block hover:text-amber-500 transition text-sm uppercase tracking-wide py-2">
                  Login
                </Link>
              )}
              {isLoggedIn && (
                <Link href="/dashboard/upload" className="block bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded transition text-sm uppercase tracking-wide">
                  Upload
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 sm:px-6"
      >
        {/* Background Image with Fade */}
        <img
          src={backgroundImages[currentBgIndex]}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-2000"
          style={{ opacity: bgOpacity, animation: 'zoom 10s ease-in-out infinite' }}
          onError={() => {
            console.log('Background image failed to load:', backgroundImages[currentBgIndex]);
            // Skip to next image if current fails
            setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
          }}
        />

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {backgroundImages.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentBgIndex ? 'bg-amber-500' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-center w-full px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-widest text-white leading-tight">
            <span className="inline-flex items-center justify-center w-12 h-12 bg-amber-500 rounded-full mr-3 animate-bounce">
              <FaCamera className="text-black text-xl" />
            </span> {displayedText}
            <span className="block text-amber-500 mt-2 sm:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Not just pictures — Emotions in Focus</span>
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce z-20">
          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Gallery Grid Section - Show all uploaded images (or fallbacks) */}
      <section className="py-12 sm:py-20 bg-black relative">
        <div className="w-full px-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 uppercase tracking-wide text-white">
          </h2>
          <p className="text-center text-gray-400 mb-8 text-lg">
            Explore our latest photography and videography work
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {HOMESHOW_IMAGES.map((url, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden cursor-pointer"
              >
                <NextImage
                  src={url}
                  alt={`Gallery ${idx + 1}`}
                  width={2000}
                  height={1333}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading={idx > 5 ? 'lazy' : 'eager'}
                  priority={idx < 3}
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-gray-950 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16 uppercase tracking-wide">
            Why Choose 24mm STUDIO?
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

      {/* Secondary gallery/dummy section requested by user */}
      {/*
      <section className="py-12 sm:py-20 bg-gray-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {DUMMY_GALLERY.map((image, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg h-64 sm:h-72 md:h-80 cursor-pointer"
              >
                <img
                  src={image.url}
                  alt={`Dummy ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

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

          {/* Service Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => setSelectedServiceType('all')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 ${
                selectedServiceType === 'all'
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setSelectedServiceType('wedding')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 ${
                selectedServiceType === 'wedding'
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Wedding Services
            </button>
            <button
              onClick={() => setSelectedServiceType('baby')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 ${
                selectedServiceType === 'baby'
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Baby Services
            </button>
            <button
              onClick={() => setSelectedServiceType('celebration')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 ${
                selectedServiceType === 'celebration'
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Celebrations
            </button>
            <button
              onClick={() => setSelectedServiceType('corporate')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 ${
                selectedServiceType === 'corporate'
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Corporate & Portfolio
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {filteredServices.map((service, idx) => {
              const serviceIcons: Record<string, string> = {
                'Weddings': 'https://photocrewpictures.com/pics/services/pht2.png',
                'Hamarlok Weddings': 'https://photocrewpictures.com/pics/services/hamarlok.png',
                'Engagement': 'https://photocrewpictures.com/pics/services/engagement-icon.jpg',
                'Pre Weddings': 'https://photocrewpictures.com/pics/services/pre-wedding.png',
                'Maternity': 'https://photocrewpictures.com/pics/services/maternity.png',
                'Baby Shower': 'https://photocrewpictures.com/pics/services/baby-shower.png',
                'New Born': 'https://photocrewpictures.com/pics/services/newborn.png',
                'Baby Shoot': 'https://photocrewpictures.com/pics/services/baby_shoot.png',
                'Birthday': 'https://photocrewpictures.com/pics/services/birthday.png',
                'Naming Ceremony': 'https://photocrewpictures.com/pics/services/naming_cermony.png',
                'House Warming': 'https://photocrewpictures.com/pics/services/house_warming.webp',
                'Portfolio Shoot': 'https://photocrewpictures.com/pics/services/portfolio.png',
                'Product Shoot': 'https://photocrewpictures.com/pics/services/product_shoot.png',
                'Corporate Events': 'https://photocrewpictures.com/pics/services/corporate_events.png',
                'Car/Bike Delivery Shoot': 'https://photocrewpictures.com/pics/services/caricon.png',
              };

              const animationClass = service.category === 'wedding' ? 'wedding-animation' 
                : service.category === 'baby' ? 'baby-animation' 
                : service.category === 'celebration' ? 'celebration-animation' 
                : 'corporate-animation';

              return (
                <div key={idx} className={`service-card ${animationClass} text-center cursor-pointer`} onClick={() => {
                  const serviceMap: Record<string, string> = {
                    'Weddings': 'Wedding',
                    'Hamarlok Weddings': 'Wedding',
                    'Engagement': 'Engagement',
                    'Pre Weddings': 'Pre-Wedding',
                    'Maternity': 'Maternity',
                    'Baby Shower': 'Baby Shower',
                    'New Born': 'Baby Shower',
                    'Baby Shoot': 'Baby Shoot',
                    'Birthday': 'Birthday',
                    'Naming Ceremony': 'Naming Ceremony',
                    'House Warming': 'House Warming',
                    'Portfolio Shoot': 'Portfolio',
                    'Product Shoot': 'Product',
                    'Corporate Events': 'Corporate',
                    'Car/Bike Delivery Shoot': 'Corporate',
                  };
                  const serviceValue = serviceMap[service.name] || service.name;
                  window.location.href = `/dashboard/gallery?service=${encodeURIComponent(serviceValue)}`;
                }}>
                  <div className="service-box bg-gray-900 rounded-lg p-6 mb-4 flex items-center justify-center h-32 border border-gray-800 transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-400/20">
                    <img src={serviceIcons[service.name] || 'https://via.placeholder.com/80'} alt={service.name} className="service-icon w-20 h-20 object-contain transition-all duration-300" />
                  </div>
                  <p className="text-white font-semibold">{service.name}</p>
                </div>
              );
            })}
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
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">24mm STUDIO</h3>
                <p className="text-base sm:text-lg text-amber-600 mb-4 sm:mb-6">"Celebrating Love"</p>
              </div>
              
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                At <span className="font-semibold text-white">24mm STUDIO</span> We Specialize In Wedding Photography And Videography, Ensuring That Every Precious Moment Of Your Special Day Is Beautifully Preserved. From The Intimate Glances To The Grand Celebrations, Our Team Is Dedicated To Capturing The Essence And Emotion Of Your Events.
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
                    <p className="text-xs">24mm STUDIO<br />Professional Photography Studio</p>
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
            <p>&copy; 2026 24mm STUDIO. All rights reserved.</p>
            <p className="mt-2">Professional Wedding Photography & Videography</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
