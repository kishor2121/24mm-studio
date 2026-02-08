'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface MediaItem {
  id: number;
  url: string;
  createdAt: string;
  photographerId: number;
}

interface Review {
  id: number;
  content: string;
  imageId?: number;
  videoId?: number;
  createdAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [tab, setTab] = useState<'image' | 'video'>('image');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const [imagesRes, videosRes] = await Promise.all([
        fetch('/api/images'),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Gallery</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Media Grid */}
          <div className="col-span-2">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-700">
              <button
                onClick={() => setTab('image')}
                className={`pb-2 px-4 font-semibold transition ${
                  tab === 'image'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setTab('video')}
                className={`pb-2 px-4 font-semibold transition ${
                  tab === 'video'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Videos
              </button>
            </div>

            {/* Media Grid Display */}
            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                <p className="text-slate-400">Loading media...</p>
              ) : tab === 'image' && images.length === 0 ? (
                <p className="text-slate-400">No images available</p>
              ) : tab === 'video' && videos.length === 0 ? (
                <p className="text-slate-400">No videos available</p>
              ) : (
                (tab === 'image' ? images : videos).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleMediaClick(item, tab)}
                    className={`cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 ${
                      selectedMedia?.id === item.id ? 'ring-2 ring-blue-400' : ''
                    }`}
                  >
                    {tab === 'image' ? (
                      <img
                        src={item.url}
                        alt="Gallery item"
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-48 object-cover bg-black"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="col-span-1">
            {selectedMedia ? (
              <div className="bg-slate-800 rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>

                {/* Review Form */}
                <form onSubmit={handleSubmitReview} className="mb-6">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Leave a review..."
                    className="w-full bg-slate-700 text-white rounded p-3 mb-3 resize-none"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={submittingReview || !reviewText.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded transition"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reviews.length === 0 ? (
                    <p className="text-slate-400 text-sm">No reviews yet</p>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-slate-700 p-3 rounded text-sm"
                      >
                        <p className="text-white">{review.content}</p>
                        <p className="text-slate-400 text-xs mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-6 sticky top-8 text-center">
                <p className="text-slate-400">Select a media item to see reviews</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
