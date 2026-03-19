'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Photographer {
  id: number;
  name: string;
  email: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'image' | 'video'>('image');
  const [section, setSection] = useState<'home' | 'gallery'>('gallery');
  const [service, setService] = useState('Wedding');
  const [eventName, setEventName] = useState('');
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const services = [
    'Wedding',
    'Engagement',
    'Pre-Wedding',
    'Maternity',
    'Baby Shower',
    'Baby Shoot',
    'Birthday Shoot',
    'Naming Ceremony',
    'House Warming',
    'Upanayana',
    'Portfolio',
    'Product Shoot',
    'Corporate Events',
    'Hamarlok Weddings',
    'Car/Bike Delivery Shoot',
  ];

  useEffect(() => {
    // Check if photographer is logged in
    const storedPhotographer = localStorage.getItem('photographer');
    if (storedPhotographer) {
      setPhotographer(JSON.parse(storedPhotographer));
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    // Load existing event names for the selected section (home/gallery)
    const loadEventNames = async () => {
      try {
        const response = await fetch(`/api/events?section=${section}`);
        if (response.ok) {
          const data = await response.json();
          setEventNames(data || []);
        }
      } catch (err) {
        console.error('Failed to load event names:', err);
      }
    };

    loadEventNames();
  }, [section]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-300 mb-8">You must be logged in to upload media.</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/login"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const compressImageFile = async (file: File): Promise<File> => {
    // Resize / compress image to reduce size (if possible)
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        const maxDimension = 1920;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const attemptCompress = async (quality: number): Promise<File> => {
          return new Promise((res) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) return res(file);
                const newFile = new File([blob], file.name, { type: file.type });
                res(newFile);
              },
              'image/jpeg',
              quality
            );
          });
        };

        let compressed = await attemptCompress(0.9);
        let quality = 0.9;

        while (compressed.size > MAX_FILE_SIZE && quality > 0.4) {
          quality -= 0.1;
          compressed = await attemptCompress(quality);
        }

        resolve(compressed);
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type based on selected media type
      if (type === 'image' && !selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        setFile(null);
        return;
      }
      if (type === 'video' && !selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file');
        setFile(null);
        return;
      }

      // Enforce max size for uploads (Cloudinary limits default to ~10MB)
      if (selectedFile.size > MAX_FILE_SIZE) {
        if (type === 'image') {
          const compressed = await compressImageFile(selectedFile);
          if (compressed.size > MAX_FILE_SIZE) {
            setError('Image is too large even after compression. Please choose a smaller file (< 10MB).');
            setFile(null);
            return;
          }
          setFile(compressed);
          setError(null);
          return;
        }

        setError('File size too large. Please upload a smaller file (< 10MB).');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('section', section);
      formData.append('service', service);
      formData.append('eventName', eventName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-photographer': JSON.stringify(photographer),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      setSuccess(true);
      setFile(null);
      setType('image');
      
      // Redirect to gallery after successful upload
      setTimeout(() => {
        router.push('/dashboard/gallery');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('photographer');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-amber-500">
            24mm STUDIO
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-300 text-sm">Welcome</p>
              <p className="text-white font-semibold">{photographer.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Upload Media</h1>
        
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg shadow-lg p-8">
          {/* Media Type Selection */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-4">Media Type</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="image"
                  checked={type === 'image'}
                  onChange={(e) => {
                    setType('image' as 'image' | 'video');
                    setFile(null);
                    setError(null);
                  }}
                  className="w-4 h-4 mr-2"
                />
                <span className="text-white">Image</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="video"
                  checked={type === 'video'}
                  onChange={(e) => {
                    setType('video' as 'image' | 'video');
                    setFile(null);
                    setError(null);
                  }}
                  className="w-4 h-4 mr-2"
                />
                <span className="text-white">Video</span>
              </label>
            </div>
          </div>

          {/* Section/Tag Selection */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-4">Display Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as 'home' | 'gallery')}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded mb-4 border border-slate-600 focus:border-amber-600 focus:outline-none"
            >
              <option value="gallery">Gallery (default)</option>
              <option value="home">Home</option>
            </select>
          </div>

          {/* Service Type Selection */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-4">Service Type</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded mb-4 border border-slate-600 focus:border-amber-600 focus:outline-none"
            >
              {services.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          {/* Event/Couple Name */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-4">
              Event Name (e.g., "Arjun & Jasmeet" or "Wedding Reception")
            </label>
            <input
              list="event-names"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Select or enter couple/event name..."
              className="w-full bg-slate-700 text-white px-4 py-3 rounded border border-slate-600 focus:border-amber-600 focus:outline-none"
            />
            <datalist id="event-names">
              {eventNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <p className="text-gray-400 text-sm mt-2">
              Choose an existing event name or type a new one to create a new group.
            </p>
          </div>

          {/* File Input */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-4">
              Choose {type === 'image' ? 'Image' : 'Video'} File
            </label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition">
              <input
                type="file"
                onChange={handleFileChange}
                accept={type === 'image' ? 'image/*' : 'video/*'}
                className="w-full cursor-pointer"
              />
              {file && (
                <p className="text-green-400 mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded text-green-300">
              Upload successful! Redirecting to gallery...
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/dashboard/gallery"
            className="text-amber-500 hover:text-amber-400 transition"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
