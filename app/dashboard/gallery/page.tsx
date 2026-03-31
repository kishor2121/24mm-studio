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
  
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
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

  const displayImages = images.length > 0 ? images : DUMMY_GALLERY;
  const usingDefault = images.length === 0;

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
    if (serviceFilter && img.service !== serviceFilter) return false;
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

  const handleMediaClick = async (item: MediaItem, type: 'image' | 'video') => {
    setSelectedMedia(item);
    setMediaType(type);
    
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Delete failed');
      }

      // remove deleted image from state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setSelectedMedia((prev) => (prev?.id === imageId ? null : prev));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Could not delete image. Please try again.');
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
        {usingDefault && (
          <div className="bg-amber-900 bg-opacity-30 border border-amber-600 rounded-lg p-4 mb-8 text-amber-200 text-center">
            Showing default images. Upload some from dashboard to see them here.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <p className="text-gray-400 text-center py-12">Loading media...</p>
          ) : selectedEvent ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedEvent}</h2>
                <p className="text-gray-300 text-sm">{filteredImages.length} photos</p>
                <button
                  onClick={() => setSelectedEvent('')}
                  className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-white font-semibold"
                >
                  Back to Events
                </button>
              </div>

              <div className="sm:max-w-2xl sm:mx-auto grid grid-cols-1 gap-4">
                {filteredImages.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden aspect-video rounded-none transition-all duration-500 cursor-pointer ${
                      selectedMedia?.id === item.id
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black'
                        : 'ring-1 ring-gray-800 hover:ring-amber-400'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt="Gallery item"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onClick={() => handleMediaClick(item, 'image')}
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
                  className="group relative overflow-hidden aspect-square rounded-none transition-all duration-500 cursor-pointer ring-1 ring-gray-800 hover:ring-amber-400"
                >
                  <img
                    src={event.cover.url}
                    alt={event.eventName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-2 sm:p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 rounded-lg p-2 sm:p-4">
                      <h3 className="text-white font-bold text-sm sm:text-xl tracking-wide truncate">{event.eventName}</h3>
                      <p className="text-gray-200 text-xs sm:text-sm mt-1">
                        {event.count} photos • {event.service}
                      </p>
                      <p className="text-gray-300 text-xs mt-1">Click to view all</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
