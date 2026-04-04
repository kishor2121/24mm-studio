'use client';

import Link from 'next/link';

export default function TermsAndConditions() {
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
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-amber-500">Terms & Conditions</h1>
        <p className="text-gray-400 mb-12">Effective Date: March 31, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <div>
            <p className="text-lg sm:text-xl text-white mb-4">
              Welcome to 24mm Studio. By using our website, you agree to the following terms:
            </p>
          </div>

          {/* Section 1 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">1. General Use</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>This website is intended to provide information about our photography and videography services.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>By accessing this website, you agree to use it for lawful purposes only.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">2. Enquiries & Communication</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>All bookings are handled through direct contact (phone, WhatsApp, or email).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Submitting an enquiry through the website does not confirm a booking.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Our team will contact you to discuss availability, pricing, and requirements.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">3. Booking & Payments</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>A booking is confirmed only after mutual agreement and advance payment.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Payment terms will be discussed during confirmation.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Advance payments are non-refundable unless otherwise agreed.</span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">4. Cancellation & Rescheduling</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Cancellations should be informed at least 5 days in advance.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Rescheduling is subject to availability.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Last-minute cancellations may result in loss of advance payment.</span>
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">5. Delivery</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Photos and videos will be delivered within the agreed timeframe.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Delivery timelines may vary depending on the project scope and workload.</span>
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">6. Usage Rights</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>24mm Studio reserves the right to use photos/videos for portfolio, website, and promotional purposes.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Clients may use the delivered content for personal use only unless otherwise agreed.</span>
              </li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">7. Client Responsibility</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Clients are expected to cooperate during the shoot for the best results.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span>Any delays caused by the client may impact delivery timelines and output.</span>
              </li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-sm sm:text-base mb-4">
              While we strive to deliver the highest quality, we are not responsible for delays or issues caused by factors beyond our control (e.g., weather, technical issues, unforeseen circumstances).
            </p>
          </div>

          {/* Contact Section */}
          <div className="border-t border-gray-700 pt-8 mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
            <p className="text-sm sm:text-base mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
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
          <p className="mt-2">Professional  Photography & Cinematography</p>
        </div>
      </footer>
    </div>
  );
}
