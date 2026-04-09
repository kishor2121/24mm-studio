'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface MediaItem {
  id: number;
  url: string;
  createdAt: string;
  photographerId: number;
  service?: string;
  eventName?: string;
}

interface Review {
  id: number;
  content: string;
  imageId?: number;
  videoId?: number;
  createdAt: string;
}

// dummy images used when there are no uploads
const DUMMY_GALLERY: MediaItem[] = [
  { id: -1, url: 'https://images.unsplash.com/photo-1628519592419-bf…8MHxzZWFyY2h8M3x8c3BvcnRzJTIwY2FyfGVufDB8fDB8fHww', createdAt: '', photographerId: 0 },
  { id: -2, url: 'https://via.placeholder.com/600x400?text=Dummy+2', createdAt: '', photographerId: 0 },
  { id: -3, url: 'https://via.placeholder.com/600x400?text=Dummy+3', createdAt: '', photographerId: 0 },
];

function GalleryContent() {
  const searchParams = useSearchParams();
  const serviceFilter = searchParams.get('service');
  const normalizedServiceFilter = serviceFilter ? serviceFilter.trim().toLowerCase() : '';
  
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxItems, setLightboxItems] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [mediaTab, setMediaTab] = useState<'image' | 'video'>('image');
  const [categoryTab, setCategoryTab] = useState<'home' | 'gallery'>('gallery');
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [photographer, setPhotographer] = useState<{ id: number; name: string } | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);

  const displayImages = images.length > 0 ? images : DUMMY_GALLERY;
  const usingDefault = !loading && images.length === 0;

  useEffect(() => {
    loadMedia();
    loadEventNames();
    loadServiceTypes();

    const stored = localStorage.getItem('photographer');
    if (stored) {
      try {
        setPhotographer(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, [categoryTab]);

  const loadServiceTypes = async () => {
    try {
      const response = await fetch(`/api/services?section=${categoryTab}`);
      if (response.ok) {
        const services = await response.json();
        setServiceTypes(services);
      }
    } catch (error) {
      console.error('Failed to load service types:', error);
    }
  };

  const loadEventNames = async () => {
    try {
      const response = await fetch(`/api/events?section=${categoryTab}`);
      if (response.ok) {
        const events = await response.json();
        setEventNames(events);
      }
    } catch (error) {
      console.error('Failed to load event names:', error);
    }
  };

  const loadMedia = async () => {
    try {
      setLoading(true);
      const [imagesRes, videosRes] = await Promise.all([
        fetch(`/api/images?section=${categoryTab}`),
        fetch('/api/videos'),
      ]);

      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        setImages(imagesData);
      }

      if (videosRes.ok) {
        const videosData = await videosRes.json();
        setVideos(videosData);
      }
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter images by service if query param exists, and by selected filters
  const filteredImages = images.filter(img => {
    if (normalizedServiceFilter && img.service?.trim().toLowerCase() !== normalizedServiceFilter) return false;
    if (selectedServiceType && img.service !== selectedServiceType) return false;
    if (selectedEvent && img.eventName !== selectedEvent) return false;
    return true;
  });

  // Group images by event name (for event cards)
  const eventsGrouped = filteredImages.reduce((acc, img) => {
    const key = img.eventName || 'Others';
    if (!acc[key]) acc[key] = [];
    acc[key].push(img);
    return acc;
  }, {} as Record<string, MediaItem[]>);

  const eventCards = Object.entries(eventsGrouped).map(([eventName, imgs]) => ({
    eventName,
    count: imgs.length,
    cover: imgs[0],
    service: imgs[0]?.service || 'Unknown',
    images: imgs,
  }));

  const handleMediaClick = async (item: MediaItem, type: 'image' | 'video', allItems?: MediaItem[]) => {
    setSelectedMedia(item);
    setMediaType(type);
    
    // Set lightbox items and find current index
    if (allItems) {
      const itemIndex = allItems.findIndex(i => i.id === item.id);
      setLightboxItems(allItems);
      setLightboxIndex(itemIndex >= 0 ? itemIndex : 0);
    } else {
      setLightboxItems([item]);
      setLightboxIndex(0);
    }
    
    // Fetch reviews for this media
    try {
      const response = await fetch(
        `/api/reviews?${type === 'image' ? 'imageId' : 'videoId'}=${item.id}`
      );
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!photographer) return;
    if (!confirm('Are you sure you want to delete this image?')) return;

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
          // If the image was already deleted in the backend, remove it from local UI state too.
          setImages((prev) => prev.filter((img) => img.id !== imageId));
          setSelectedMedia((prev) => (prev?.id === imageId ? null : prev));
        }

        alert(errorData.message || 'Could not delete image. Please try again.');
        return;
      }

      // remove deleted image from state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setSelectedMedia((prev) => (prev?.id === imageId ? null : prev));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Could not delete image. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventName: string) => {
    if (!photographer) return;
    if (!confirm(`Delete all photos from "${eventName}"? This cannot be undone.`)) return;

    setDeletingEvent(eventName);
    try {
      const eventImages = images.filter(img => (img.eventName || 'Others') === eventName);
      const deletePromises = eventImages.map(img =>
        fetch(`/api/images?id=${img.id}`, {
          method: 'DELETE',
          headers: { 'x-photographer': JSON.stringify(photographer) },
        })
      );

      const results = await Promise.all(deletePromises);
      const allSuccess = results.every(res => res.ok);

      if (allSuccess) {
        setImages((prev) => prev.filter(img => (img.eventName || 'Others') !== eventName));
        setSelectedEvent('');
        setSelectedMedia(null);
      } else {
        alert('Some images could not be deleted. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Could not delete event. Please try again.');
    } finally {
      setDeletingEvent(null);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMedia || !mediaType || !reviewText.trim()) {
      return;
    }

    setSubmittingReview(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: reviewText,
          imageId: mediaType === 'image' ? selectedMedia.id : null,
          videoId: mediaType === 'video' ? selectedMedia.id : null,
        }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setReviewText('');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-gray-900 via-black to-black pt-16 pb-12 px-0">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-widest mb-4 text-center">
            K A R T H I K&nbsp;F R A M E S
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold rounded shadow-lg transition"
            >
              ← Back to Home
            </a>
            <a
              href="https://wa.me/916363967683?text=Hi!%20I%20would%20like%20to%20enquire%20about%20photography%20services."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded shadow-lg transition"
            >
              Contact Us
            </a>
            <a
              href="tel:+916363967683"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded shadow-lg transition"
            >
              Enquire Now
            </a>
          </div>

          <p className="text-gray-300 text-center text-lg max-w-3xl mx-auto">
            From the first hello to a forever promise – our journey together continues.
          </p>
        </div>
      </div>

      <div className="w-full px-0 py-8">
        {normalizedServiceFilter && (
          <div className="max-w-7xl mx-auto px-6 mb-6">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-600/10 px-5 py-3 text-amber-100 text-center">
              Showing gallery for <span className="font-semibold text-white">{serviceFilter}</span>
            </div>
          </div>
        )}
        {!loading && usingDefault && (
          <div className="bg-amber-900 bg-opacity-30 border border-amber-600 rounded-lg p-4 mb-8 text-amber-200 text-center">
            Showing default images. Upload some from dashboard to see them here.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 rounded-3xl border border-amber-500/20 bg-black/80 p-10 text-center shadow-2xl shadow-amber-500/10">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-amber-500 text-3xl">📸</div>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">Please wait — loading your gallery</p>
                <p className="text-gray-400 max-w-lg mx-auto mt-2">
                  Preparing related photography images and service collections now.
                </p>
              </div>
            </div>
          ) : selectedEvent ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedEvent}</h2>
                <p className="text-gray-300 text-sm">{filteredImages.length} photos</p>
                <div className="flex gap-3 justify-center mt-4 flex-wrap">
                  <button
                    onClick={() => setSelectedEvent('')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-white font-semibold"
                  >
                    Back to Events
                  </button>
                  {photographer && (
                    <button
                      onClick={() => handleDeleteEvent(selectedEvent)}
                      disabled={deletingEvent === selectedEvent}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded text-white font-semibold transition"
                    >
                      {deletingEvent === selectedEvent ? 'Deleting...' : '🗑️ Delete Event'}
                    </button>
                  )}
                </div>
              </div>

              <div className="sm:max-w-2xl sm:mx-auto grid grid-cols-1 gap-4">
                {filteredImages.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handleMediaClick(item, 'image', filteredImages)}
                    className={`group relative overflow-hidden rounded-none transition-all duration-500 cursor-pointer flex items-center justify-center bg-black ${
                      selectedMedia?.id === item.id
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black'
                        : 'ring-1 ring-gray-800 hover:ring-amber-400'
                    }`}
                    style={{ minHeight: '60vh' }}
                  >
                    <img
                      src={item.url}
                      alt="Gallery item"
                      className="max-w-full max-h-full object-contain object-center transition-transform duration-500"
                    />

                    {photographer && photographer.id === item.photographerId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(item.id);
                        }}
                        className="absolute top-2 right-2 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        title="Delete image"
                      >
                        🗑️
                      </button>
                    )}

                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-black/70 text-white text-sm sm:text-base px-4 py-2 rounded-lg font-semibold tracking-wide">
                        Click to preview
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : eventCards.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No events found</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {eventCards.map((event) => (
                <div
                  key={event.eventName}
                  onClick={() => setSelectedEvent(event.eventName)}
                  className="group relative overflow-hidden rounded-none transition-all duration-500 cursor-pointer flex items-center justify-center bg-black ring-1 ring-gray-800 hover:ring-amber-400"
                  style={{ minHeight: '40vh' }}
                >
                  <img
                    src={event.cover.url}
                    alt={event.eventName}
                    className="max-w-full max-h-full object-contain object-center transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-2 sm:p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 rounded-lg p-2 sm:p-4">
                      <h3 className="text-white font-bold text-sm sm:text-xl tracking-wide truncate">{event.eventName}</h3>
                      <p className="text-gray-200 text-xs sm:text-sm mt-1">
                        {event.count} photos • {event.service}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMediaClick(event.cover, 'image', event.images);
                          }}
                          className="bg-amber-500 hover:bg-amber-400 text-black text-xs sm:text-sm uppercase tracking-wide font-semibold px-3 py-2 rounded transition"
                        >
                          Preview
                        </button>
                        {photographer && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event.eventName);
                            }}
                            disabled={deletingEvent === event.eventName}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-xs sm:text-sm uppercase tracking-wide font-semibold px-2 py-2 rounded transition"
                            title="Delete entire event"
                          >
                            {deletingEvent === event.eventName ? '...' : '🗑️'}
                          </button>
                        )}
                      </div>
                      <span className="text-amber-200 text-xs sm:text-sm font-semibold">See All Photos</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && lightboxItems.length > 0 && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-amber-500 text-3xl font-bold transition z-60"
            >
              ✕
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 text-white font-semibold text-lg bg-black/50 px-4 py-2 rounded">
              {lightboxIndex + 1} of {lightboxItems.length}
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center">
              <img
                src={lightboxItems[lightboxIndex]?.url}
                alt={`Gallery ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Previous Button */}
            <button
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 transition shadow-lg z-60"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % lightboxItems.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 transition shadow-lg z-60"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-amber-500 text-3xl">📸</div>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-2xl font-semibold">Loading gallery…</p>
          <p className="text-gray-400 max-w-sm mx-auto">Please wait while we prepare your photography showcase.</p>
        </div>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
