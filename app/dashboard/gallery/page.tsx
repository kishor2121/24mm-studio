'use client';

import { useEffect, useState } from 'react';
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

export default function GalleryPage() {
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

  const displayImages = images.length > 0 ? images : DUMMY_GALLERY;
  const usingDefault = images.length === 0;

  useEffect(() => {
    loadMedia();
  }, [categoryTab]);

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

  // Filter images by service if query param exists
  const filteredImages = serviceFilter 
    ? images.filter(img => img.service === serviceFilter)
    : images;

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
      <div className="bg-gradient-to-b from-gray-900 via-black to-black pt-16 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-wider mb-2">
            K A R T H I K
            <span className="block mt-2">F R A M E S</span>
          </h1>
          <p className="text-amber-500 text-lg tracking-widest font-semibold">CLICKS</p>
          <p className="text-gray-400 mt-4 text-lg">Explore our curated collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {mediaTab === 'image' && usingDefault && (
          <div className="bg-amber-900 bg-opacity-30 border border-amber-600 rounded-lg p-4 mb-8 text-amber-200 text-center">
            Showing default images. Upload some from dashboard to see them here.
          </div>
        )}
        
        {/* Category & Media Type Navigation */}
        <div className="mb-8 space-y-6">
          {/* Category Tabs */}
          <div className="flex gap-8 border-b border-gray-800 pb-4">
            <button
              onClick={() => setCategoryTab('home')}
              className={`text-lg font-semibold tracking-wide transition-all duration-300 pb-2 border-b-2 ${
                categoryTab === 'home'
                  ? 'text-amber-400 border-amber-400'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => setCategoryTab('gallery')}
              className={`text-lg font-semibold tracking-wide transition-all duration-300 pb-2 border-b-2 ${
                categoryTab === 'gallery'
                  ? 'text-amber-400 border-amber-400'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              GALLERY
            </button>
          </div>

          {/* Media Type Tabs */}
          <div className="flex gap-8 border-b border-gray-800 pb-4">
            <button
              onClick={() => setMediaTab('image')}
              className={`text-lg font-semibold tracking-wide transition-all duration-300 pb-2 border-b-2 ${
                mediaTab === 'image'
                  ? 'text-white border-white'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              IMAGES
            </button>
            <button
              onClick={() => setMediaTab('video')}
              className={`text-lg font-semibold tracking-wide transition-all duration-300 pb-2 border-b-2 ${
                mediaTab === 'video'
                  ? 'text-white border-white'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              VIDEOS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Media Grid */}
          <div className="lg:col-span-3">
            {/* Media Grid Display */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {loading ? (
                <p className="text-gray-400 col-span-full text-center py-12">Loading media...</p>
              ) : mediaTab === 'image' && filteredImages.length === 0 ? (
                <p className="text-gray-400 col-span-full text-center py-12">{serviceFilter ? `No images for ${serviceFilter}` : 'No images available'}</p>
              ) : mediaTab === 'video' && videos.length === 0 ? (
                <p className="text-gray-400 col-span-full text-center py-12">No videos available</p>
              ) : (
                (mediaTab === 'image' ? filteredImages : videos).map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handleMediaClick(item, mediaTab)}
                    className={`group relative overflow-hidden aspect-square rounded-none transition-all duration-500 cursor-pointer ${
                      selectedMedia?.id === item.id 
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black' 
                        : 'ring-1 ring-gray-800 hover:ring-amber-400'
                    } ${idx % 3 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                  >
                    {mediaTab === 'image' ? (
                      <img
                        src={item.url}
                        alt="Gallery item"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover bg-black group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-1">
            {selectedMedia ? (
              <div className="bg-gray-900 border border-gray-800 rounded-none p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6 tracking-wide">REVIEWS</h2>

                {/* Review Form */}
                <form onSubmit={handleSubmitReview} className="mb-6 space-y-4">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-none p-3 resize-none focus:outline-none focus:border-amber-400 placeholder-gray-500 text-sm"
                    rows={4}
                  />
                  <button
                    type="submit"
                    disabled={submittingReview || !reviewText.trim()}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-700 text-white font-semibold py-2 rounded-none transition duration-300 text-sm uppercase tracking-wide"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit'}
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No reviews yet</p>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-gray-800 border border-gray-700 p-4 text-sm space-y-2"
                      >
                        <p className="text-white leading-relaxed">{review.content}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-none p-6 sticky top-8 text-center">
                <p className="text-gray-400 text-sm">Select an image to view reviews</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
