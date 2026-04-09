'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';

interface MediaItem {
  id: number;
  url: string;
  createdAt: string;
  photographerId: number;
  service?: string;
  eventName?: string;
}

export default function RecentWorkPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [photographer, setPhotographer] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    const loadRecentWork = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/images?section=recent-work');
        if (response.ok) {
          const data = await response.json();
          setImages(data || []);
        }
      } catch (error) {
        console.error('Failed to load recent work:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentWork();

    const stored = localStorage.getItem('photographer');
    if (stored) {
      try {
        setPhotographer(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  const handleDeleteImage = async (imageId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!photographer) return;
    if (!confirm('Are you sure you want to delete this image?')) return;

    setDeleting(imageId);
    try {
      const response = await fetch(`/api/images?id=${imageId}`, {
        method: 'DELETE',
        headers: {
          'x-photographer': JSON.stringify(photographer),
        },
      });

      const errorData = await response.json();
      if (!response.ok) {
        console.error('Delete image failed:', errorData.message || errorData);

        if (errorData.message === 'Image not found') {
          setImages((prev) => prev.filter((img) => img.id !== imageId));
          setSelectedImageIndex(null);
        }

        alert(errorData.message || 'Could not delete image. Please try again.');
        return;
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      if (selectedImageIndex !== null) {
        setSelectedImageIndex(null);
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Could not delete image. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="w-full py-12">
        <div className="mb-10 px-4 sm:px-6">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-[0.28em] sm:tracking-[0.45em] md:tracking-[0.6em] uppercase whitespace-nowrap leading-tight">
              K A R T H I K&nbsp;F R A M E S
            </p>
            <h2 className="mt-3 text-sm sm:text-base md:text-lg text-gray-300 uppercase tracking-[0.24em]">
              Recent Work
            </h2>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-black px-5 py-3 rounded-full font-semibold uppercase tracking-wide shadow-lg shadow-amber-500/20 transition"
            >
              <span className="text-lg">🏠</span>
              Back to Home
            </Link>
            <Link
              href="/dashboard/gallery"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-full font-semibold uppercase tracking-wide border border-white/10 shadow-lg shadow-white/5 transition"
            >
              <span className="text-lg">🖼️</span>
              Back to Gallery
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Recent Work Yet</h2>
            <p className="text-gray-400">Please come back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4 sm:px-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative overflow-hidden cursor-pointer bg-gray-900 group rounded-lg"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image.url}
                  alt="Recent Work"
                  className="block w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={index < 6 ? 'eager' : 'lazy'}
                />
                {photographer && photographer.id === image.photographerId && (
                  <button
                    onClick={(e) => handleDeleteImage(image.id, e)}
                    disabled={deleting === image.id}
                    className="absolute top-2 right-2 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-red-600 disabled:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    title="Delete image"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex items-center gap-3 self-end mb-4">
            {photographer && photographer.id === selectedImage.photographerId && (
              <button
                onClick={() => {
                  const id = selectedImage.id;
                  setSelectedImageIndex(null);
                  handleDeleteImage(id);
                }}
                disabled={deleting === selectedImage.id}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-full p-3 transition"
                title="Delete image"
              >
                {deleting === selectedImage.id ? '...' : '🗑️'}
              </button>
            )}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="bg-black/70 hover:bg-black rounded-full p-3 transition text-white"
            >
              ✕
            </button>
          </div>
          <div className="relative z-10 w-full max-w-6xl h-full max-h-[90vh]">
            <div className="mb-4 text-center">
              <p className="text-sm sm:text-base uppercase tracking-[0.55em] text-amber-300">K A R T H I K F R A M E S</p>
              <p className="text-xs sm:text-sm text-white/80 mt-2">Recent Work Preview</p>
            </div>
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
              <NextImage
                src={selectedImage.url}
                alt="Preview"
                fill
                unoptimized={true}
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}