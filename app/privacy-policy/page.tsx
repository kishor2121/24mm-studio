'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-widest">
            24mm STUDIO
          </Link>
          <Link 
            href="/"
            className="hover:text-amber-500 transition text-xs lg:text-sm uppercase tracking-wide"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-amber-500">Privacy Policy</h1>
        <p className="text-gray-400 mb-12">Effective Date: March 31, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <div>
            <p className="text-lg sm:text-xl text-white mb-4">
              At 24mm Studio, we value your privacy and are committed to protecting your personal information.
            </p>
          </div>

          {/* Section 1 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4 text-sm sm:text-base">We may collect:</p>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Name</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Phone number</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Email address</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Booking details</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>To communicate with you</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>To manage bookings and services</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>To improve our services</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Protection</h2>
            <p className="text-sm sm:text-base">
              We do not sell, trade, or share your personal information with third parties, except when required by law.
            </p>
          </div>

          {/* Section 4 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies</h2>
            <p className="text-sm sm:text-base">
              Our website may use cookies to improve user experience.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Links</h2>
            <p className="text-sm sm:text-base">
              We are not responsible for the privacy practices of external websites.
            </p>
          </div>

          {/* Section 6 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">6. Consent</h2>
            <p className="text-sm sm:text-base">
              By using our website, you agree to our Privacy Policy.
            </p>
          </div>

          {/* Contact Section */}
          <div className="border-t border-gray-700 pt-8 mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
            <p className="text-sm sm:text-base mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-center gap-3">
                <span className="text-amber-500 font-semibold">Email:</span>
                <a 
                  href="mailto:24mmvisuals@gmail.com"
                  className="text-amber-500 hover:text-amber-400 transition"
                >
                  24mmvisuals@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-amber-500 font-semibold">Phone:</span>
                <a 
                  href="tel:+916363967683"
                  className="text-amber-500 hover:text-amber-400 transition"
                >
                  +91 6363967683
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-16 text-center">
          <Link 
            href="/"
            className="inline-block bg-amber-600 hover:bg-amber-700 px-8 py-3 rounded font-semibold transition"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-gray-500 text-xs sm:text-sm">
          <p>&copy; 2026 24mm STUDIO. All rights reserved.</p>
          <p className="mt-2">Professional Wedding Photography & Videography</p>
        </div>
      </footer>
    </div>
  );
}
