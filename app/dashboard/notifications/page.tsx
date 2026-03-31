'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Photographer {
  id: number;
  name: string;
  email: string;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  icon: string;
  expiresAt?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '📢',
    expiresAt: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedPhotographer = localStorage.getItem('photographer');
    if (storedPhotographer) {
      setPhotographer(JSON.parse(storedPhotographer));
    } else {
      router.push('/auth/login');
    }
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (photographer) {
      loadNotifications();
    }
  }, [photographer]);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('Image size should be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !selectedImage) {
      setError('Please fill in all required fields including an image');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const requestFormData = new FormData();
      requestFormData.append('title', formData.title);
      requestFormData.append('description', formData.description);
      requestFormData.append('icon', formData.icon);
      requestFormData.append('file', selectedImage);
      if (formData.expiresAt) {
        requestFormData.append('expiresAt', formData.expiresAt);
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'x-photographer': JSON.stringify(photographer)
        },
        body: requestFormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create notification');
      }

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        icon: '📢',
        expiresAt: ''
      });
      setSelectedImage(null);
      setImagePreview(null);

      // Reload notifications
      setTimeout(() => {
        loadNotifications();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notification');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (notifId: number) => {
    if (!confirm('Delete this notification?')) return;

    try {
      const response = await fetch(`/api/notifications?id=${notifId}`, {
        method: 'DELETE',
        headers: {
          'x-photographer': JSON.stringify(photographer)
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setNotifications(prev => prev.filter(n => n.id !== notifId));
    } catch (err) {
      alert('Error deleting notification');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="text-amber-500 hover:text-amber-400 transition mb-8 inline-flex items-center gap-2"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">📢 Create Promotional Offers</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., New Bookings Open"
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write your offer or announcement..."
                    rows={4}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded focus:border-amber-500 focus:outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Image Upload *</label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-amber-500 transition cursor-pointer bg-slate-700 bg-opacity-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="imageInput"
                      required
                    />
                    <label htmlFor="imageInput" className="cursor-pointer block">
                      {imagePreview ? (
                        <div className="space-y-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <p className="text-amber-400 text-sm">Click to change image</p>
                          <p className="text-gray-400 text-xs">{selectedImage?.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-2xl">📸</p>
                          <p className="text-white font-semibold">Click to upload image</p>
                          <p className="text-gray-400 text-xs">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Icon Emoji</label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="📢"
                    maxLength={2}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded focus:border-amber-500 focus:outline-none text-2xl"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Expiry Date (Optional)</label>
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded focus:border-amber-500 focus:outline-none"
                  />
                  <p className="text-gray-400 text-xs mt-1">Leave empty for no expiry</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded text-green-300 text-sm">
                    ✓ Notification created successfully!
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition"
                >
                  {uploading ? 'Uploading...' : 'Create Offer 📢'}
                </button>
              </form>
            </div>
          </div>

          {/* Existing Notifications */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Your Active Offers</h2>
            {notifications.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center text-gray-400 border border-slate-700">
                No offers created yet. Create one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-amber-500 transition"
                  >
                    <div className="flex gap-4">
                      <img
                        src={notif.imageUrl}
                        alt={notif.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                              {notif.icon} {notif.title}
                            </h3>
                            <p className="text-gray-400 mt-1">{notif.description}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <div className="text-sm text-gray-500">
                            Created: {formatDate(notif.createdAt)}
                            {notif.expiresAt && (
                              <p className="text-amber-400 mt-1">
                                Expires: {formatDate(notif.expiresAt)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(notif.id)}
                            className="text-red-500 hover:text-red-400 transition font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
