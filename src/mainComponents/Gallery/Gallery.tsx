import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Loader2, Play, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPhotosQuery, Photo } from "@/redux-store/services/photoApi";
import { useGetVideosQuery } from "@/redux-store/services/videoApi";
import { VideoDocument } from "@/types/video.types";

const Gallery = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");

  // API hooks for photos
  const {
    data: photosData,
    isLoading: loadingPhotos,
    error: photosError,
  } = useGetPhotosQuery({
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // API hooks for videos
  const {
    data: videosData,
    isLoading: loadingVideos,
    error: videosError,
  } = useGetVideosQuery({
    page: "1",
    limit: "20",
    sortBy: "date",
    sortOrder: "desc",
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      speech: "bg-blue-100 text-blue-800",
      event: "bg-green-100 text-green-800",
      interview: "bg-purple-100 text-purple-800",
      initiative: "bg-orange-100 text-orange-800",
      // Photo categories
      "community-events": "bg-blue-100 text-blue-800",
      "public-appearances": "bg-green-100 text-green-800",
      "development-projects": "bg-purple-100 text-purple-800",
      "cultural-events": "bg-yellow-100 text-yellow-800",
      "official-meetings": "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  const handlePhotoClick = (photo: Photo) => {
    navigate(`/view/photo/${photo._id}`);
  };

  const handleVideoClick = (video: VideoDocument) => {
    navigate(`/view/video/${video._id}`);
  };

  const isLoading = loadingPhotos || loadingVideos;
  const hasError = photosError || videosError;

  if (isLoading) {
    return (
      <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
        <div className='container px-4 sm:px-6'>
          <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
            <div className='inline-block px-4 py-1.5 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
              Gallery
            </div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
              Moments from the Journey
            </h2>
            <p className='text-muted-foreground mt-4 px-2'>
              A glimpse into our work, community engagement, and public events.
            </p>
          </div>
          <div className='flex justify-center'>
            <Loader2 className='w-8 h-8 animate-spin text-[#138808]' />
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
        <div className='container px-4 sm:px-6'>
          <div className='text-center max-w-3xl mx-auto'>
            <p className='text-red-600'>Failed to load gallery content.</p>
          </div>
        </div>
      </section>
    );
  }

  const photos = photosData?.data.photos || [];
  const videos = videosData?.data.videos || [];

  return (
    <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
      <div className='container px-4 sm:px-6'>
        <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
          <div className='inline-block px-4 py-1.5 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
            Gallery
          </div>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
            Moments from the Journey
          </h2>
          <p className='text-muted-foreground mt-4 px-2'>
            A glimpse into our work, community engagement, and public events.
          </p>
        </div>

        {/* Tabs for Photos and Videos */}
        <Tabs
          defaultValue='photos'
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "photos" | "videos")}
          className='w-full'
        >
          <TabsList className='grid w-full max-w-md mx-auto grid-cols-2 mb-8'>
            <TabsTrigger value='photos' className='flex items-center gap-2'>
              <span>📸</span>
              Photos ({photos.length})
            </TabsTrigger>
            <TabsTrigger value='videos' className='flex items-center gap-2'>
              <Play className='w-4 h-4' />
              Videos ({videos.length})
            </TabsTrigger>
          </TabsList>

          {/* Photos Tab Content */}
          <TabsContent value='photos' className='w-full'>
            {photos.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-muted-foreground text-lg'>
                  No photos available at the moment.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto'>
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo._id}
                    onClick={() => handlePhotoClick(photo)}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-900 ease-out cursor-pointer",
                      hovered !== null &&
                        hovered !== index &&
                        "blur-sm scale-[0.98]"
                    )}
                  >
                    <div className='absolute inset-0'>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300",
                        hovered === index ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <div className='text-white'>
                        <h3 className='text-xl md:text-2xl font-bold mb-2'>
                          {photo.title}
                        </h3>
                        <div className='flex items-center gap-4 text-sm opacity-90'>
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            {formatDate(photo.date)}
                          </div>
                          {photo.location && (
                            <div className='flex items-center gap-1'>
                              <MapPin className='h-4 w-4' />
                              {photo.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Videos Tab Content */}
          <TabsContent value='videos' className='w-full'>
            {videos.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-muted-foreground text-lg'>
                  No videos available at the moment.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto'>
                {videos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    onClick={() => handleVideoClick(video)}
                    onMouseEnter={() => setHovered(index + 1000)} // Offset to avoid conflicts with photos
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-900 ease-out cursor-pointer group",
                      hovered !== null &&
                        hovered !== index + 1000 &&
                        "blur-sm scale-[0.98]"
                    )}
                  >
                    <div className='absolute inset-0'>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className='w-full h-full object-cover'
                      />
                      {/* Play button overlay */}
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                          <Play className='w-8 h-8 text-[#FF9933] ml-1' />
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300",
                        hovered === index + 1000 ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <div className='text-white'>
                        <div className='flex items-center gap-2 mb-2'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              video.category
                            )}`}
                          >
                            {video.category.charAt(0).toUpperCase() +
                              video.category.slice(1)}
                          </span>
                          {video.featured && (
                            <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium'>
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
                          {video.title}
                        </h3>
                        <div className='flex items-center gap-4 text-sm opacity-90'>
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            {formatDate(video.date)}
                          </div>
                          <div className='flex items-center gap-1'>
                            <Clock className='h-4 w-4' />
                            {video.duration}
                          </div>
                          {video.views && (
                            <div className='flex items-center gap-1'>
                              <Eye className='h-4 w-4' />
                              {video.views}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Gallery;
