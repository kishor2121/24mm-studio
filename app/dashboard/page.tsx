'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MediaItem {
  id: number;
  url: string;
  createdAt: string;
  photographerId: number;
  service?: string;
  eventName?: string;
}

interface Photographer {
  id: number;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const recentNotifications = [
    {
      id: 1,
      icon: '🎉',
      title: 'New Bookings Open',
      message: 'Q2 2025 bookings are now available!',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: '📸',
      title: 'Maternity Shoots',
      message: 'Check out our new maternity packages',
      time: '5 hours ago'
    },
    {
      id: 3,
      icon: '🎬',
      title: 'Film Reels Available',
      message: 'Latest cinematic wedding films ready',
      time: '1 day ago'
    }
  ];

  useEffect(() => {
    // Check if photographer is logged in
    const storedPhotographer = localStorage.getItem('photographer');
    if (storedPhotographer) {
      setPhotographer(JSON.parse(storedPhotographer));
    } else {
      router.push('/auth/login');
    }
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (!photographer) return;

    const loadMedia = async () => {
      try {
        setLoading(true);
        const [imagesRes, videosRes] = await Promise.all([
          fetch('/api/images?section=gallery'),
          fetch('/api/videos'),
        ]);

        if (imagesRes.ok) {
          const data = await imagesRes.json();
          setImages(data || []);
        }

        if (videosRes.ok) {
          const data = await videosRes.json();
          setVideos(data || []);
        }
      } catch (error) {
        console.error('Failed to load media:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [photographer]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown date';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('photographer');
    router.push('/');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-amber-500">
            24mm STUDIO
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-white text-sm">
              Welcome, <span className="font-semibold text-amber-500">{photographer?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/dashboard/upload"
            className="group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg p-8 text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">📤</div>
            <h3 className="text-white font-bold text-xl mb-2">Upload Media</h3>
            <p className="text-blue-100 text-sm">Add new images and videos</p>
          </Link>

          <Link
            href="/dashboard/gallery"
            className="group bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg p-8 text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">🖼️</div>
            <h3 className="text-white font-bold text-xl mb-2">View Gallery</h3>
            <p className="text-purple-100 text-sm">Browse all your content</p>
          </Link>

          <Link
            href="/"
            className="group bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-lg p-8 text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">🏠</div>
            <h3 className="text-white font-bold text-xl mb-2">Visit Website</h3>
            <p className="text-amber-100 text-sm">View public website</p>
          </Link>

          <Link
            href="/dashboard/notifications"
            className="group bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 rounded-lg p-8 text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">📢</div>
            <h3 className="text-white font-bold text-xl mb-2">Create Offers</h3>
            <p className="text-rose-100 text-sm">Upload promotional notifications</p>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-amber-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">Total Images</p>
                <p className="text-4xl font-bold text-white mt-2">{images.length}</p>
              </div>
              <div className="text-5xl opacity-50">📸</div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-amber-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">Total Videos</p>
                <p className="text-4xl font-bold text-white mt-2">{videos.length}</p>
              </div>
              <div className="text-5xl opacity-50">🎬</div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-amber-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">Total Content</p>
                <p className="text-4xl font-bold text-white mt-2">{images.length + videos.length}</p>
              </div>
              <div className="text-5xl opacity-50">📁</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Images */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              📸 Recent Images
            </h2>
            {loading ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center text-gray-400">
                Loading images...
              </div>
            ) : images.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">No images uploaded yet</p>
                <Link
                  href="/dashboard/upload"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Upload Images
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {images.slice(0, 5).map((image) => (
                  <div
                    key={image.id}
                    className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-amber-500 transition flex gap-4"
                  >
                    <img
                      src={image.url}
                      alt={image.service}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-white font-semibold">{image.service || 'Untitled'}</h3>
                          <p className="text-sm text-gray-400">{image.eventName || 'No event specified'}</p>
                        </div>
                        <span className="text-xs bg-amber-600 text-white px-3 py-1 rounded-full">
                          {formatDate(image.createdAt)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {image.id}
                      </div>
                    </div>
                  </div>
                ))}
                {images.length > 5 && (
                  <Link
                    href="/dashboard/gallery"
                    className="text-center text-amber-500 hover:text-amber-400 font-semibold py-2"
                  >
                    View all {images.length} images →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Notifications Sidebar */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              📢 Notifications
            </h2>
            <div className="space-y-4">
              {recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-amber-500 transition"
                >
                  <div className="flex gap-3">
                    <span className="text-3xl flex-shrink-0">{notif.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm">{notif.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                      <p className="text-gray-500 text-xs mt-2">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Videos */}
            <h2 className="text-2xl font-bold text-white mt-8 mb-6 flex items-center gap-2">
              🎬 Recent Videos
            </h2>
            {videos.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-6 text-center text-gray-400 text-sm">
                No videos uploaded yet
              </div>
            ) : (
              <div className="space-y-3">
                {videos.slice(0, 3).map((video) => (
                  <div
                    key={video.id}
                    className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-amber-500 transition"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">
                          {video.service || 'Video'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(video.createdAt)}
                        </p>
                      </div>
                      <span className="text-2xl flex-shrink-0">🎥</span>
                    </div>
                  </div>
                ))}
                {videos.length > 3 && (
                  <p className="text-center text-amber-500 text-xs font-semibold">
                    {videos.length - 3} more videos
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
