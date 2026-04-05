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
  const [files, setFiles] = useState<File[]>([]);
  const [type, setType] = useState<'image' | 'video'>('image');
  const [section, setSection] = useState<'home' | 'gallery'>('gallery');
  const [service, setService] = useState('Pre-Wedding');
  const [eventName, setEventName] = useState('');
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const services = [
    'Pre-Wedding',
    'Maternity',
    'Baby Shoot',
    'Birthday Shoot',
    'Naming Ceremony',
    'Upanayana',
    'House Warming',
    'Mehndi',
    'Portfolio',
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
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    const validFiles: File[] = [];
    let hasError = false;

    for (let i = 0; i < selectedFiles.length; i++) {
      const selectedFile = selectedFiles[i];

      // Validate file type based on selected media type
      if (type === 'image' && !selectedFile.type.startsWith('image/')) {
        setError(`File "${selectedFile.name}" is not a valid image file`);
        hasError = true;
        continue;
      }
      if (type === 'video' && !selectedFile.type.startsWith('video/')) {
        setError(`File "${selectedFile.name}" is not a valid video file`);
        hasError = true;
        continue;
      }

      // Enforce max size for uploads (Cloudinary limits default to ~10MB)
      if (selectedFile.size > MAX_FILE_SIZE) {
        if (type === 'image') {
          const compressed = await compressImageFile(selectedFile);
          if (compressed.size > MAX_FILE_SIZE) {
            setError(`Image "${selectedFile.name}" is too large even after compression. Please choose a smaller file (< 10MB).`);
            hasError = true;
            continue;
          }
          validFiles.push(compressed);
        } else {
          setError(`File "${selectedFile.name}" is too large. Please upload a smaller file (< 10MB).`);
          hasError = true;
          continue;
        }
      } else {
        validFiles.push(selectedFile);
      }
    }

    if (validFiles.length > 0) {
      setFiles(validFiles);
      if (!hasError) {
        setError(null);
      }
    } else if (!hasError) {
      setError('No valid files selected');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress({ current: 0, total: files.length });

    let uploadedCount = 0;
    let uploadError: string | null = null;

    try {
      for (let i = 0; i < files.length; i++) {
        // Update progress before uploading
        setUploadProgress({ current: i + 1, total: files.length });

        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('type', type);
        formData.append('section', section);
        formData.append('service', service);
        formData.append('eventName', eventName);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'x-photographer': JSON.stringify(photographer),
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            uploadError = `Upload failed for "${files[i].name}": ${errorData.message || 'Unknown error'}`;
            break;
          }

          uploadedCount++;
        } catch (err) {
          uploadError = `Upload failed for "${files[i].name}": ${err instanceof Error ? err.message : 'Unknown error'}`;
          break;
        }
      }

      if (uploadError) {
        setError(`${uploadError} (${uploadedCount} of ${files.length} files uploaded)`);
      } else if (uploadedCount === files.length) {
        setSuccess(true);
        setFiles([]);
        setType('image');
        setUploadProgress({ current: 0, total: 0 });
        
        // Redirect to main dashboard after successful upload
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } finally {
      setLoading(false);
      setUploadProgress({ current: 0, total: 0 });
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
                    setFiles([]);
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
                    setFiles([]);
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
              Choose {type === 'image' ? 'Image' : 'Video'} Files (Multiple Allowed)
            </label>
            <div className="border-2 border-dashed border-amber-600 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-950 transition-all">
              <input
                type="file"
                onChange={handleFileChange}
                accept={type === 'image' ? 'image/*' : 'video/*'}
                multiple
                className="w-full cursor-pointer"
              />
              {files.length > 0 && (
                <div className="mt-6 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <p className="text-green-400 font-semibold text-lg">
                      {files.length} file{files.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-2 max-h-40 overflow-y-auto bg-slate-700 rounded p-3">
                    {files.map((f, idx) => (
                      <li key={idx} className="truncate flex items-center gap-2">
                        <span className="text-amber-400 font-bold w-6">{idx + 1}.</span>
                        <span className="truncate flex-1">{f.name}</span>
                        <span className="text-gray-500 text-xs whitespace-nowrap">
                          {(f.size / (1024 * 1024)).toFixed(1)}MB
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-red-600 border border-red-400 rounded-lg text-white shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 mt-1">⚠️</span>
                <div>
                  <p className="font-bold mb-1">Upload Error</p>
                  <p className="text-red-50 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {loading && uploadProgress.total > 0 && (
            <div className="mb-6 p-6 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center animate-spin">
                    <div className="w-6 h-6 rounded-full border-2 border-amber-100 border-t-white"></div>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">
                      Uploading {uploadProgress.current} of {uploadProgress.total}
                    </p>
                    <p className="text-amber-100 text-sm">
                      {Math.round((uploadProgress.current / uploadProgress.total) * 100)}% Complete
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-2xl">{uploadProgress.current}</p>
                  <p className="text-amber-100 text-xs">of {uploadProgress.total}</p>
                </div>
              </div>
              
              <div className="w-full bg-amber-900 bg-opacity-40 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                  }}
                ></div>
              </div>
              
              <p className="text-amber-100 text-xs mt-3 text-center">
                Please wait while your files are being uploaded to the cloud...
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-6 bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-xl font-bold">✓</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Upload Complete!</p>
                  <p className="text-green-100 text-sm">All files uploaded successfully. Redirecting...</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || files.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading {uploadProgress.current} of {uploadProgress.total}...</span>
                </>
              ) : files.length > 0 ? (
                <>
                  <span>📤 Upload {files.length} file{files.length !== 1 ? 's' : ''}</span>
                </>
              ) : (
                <span>Select files to upload</span>
              )}
            </div>
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
