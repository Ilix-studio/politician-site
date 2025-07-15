import { useState } from "react";
import { Play, X, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BackNavigation } from "../AboutMe/BackNavigation";
import { Video, videoData } from "@/MockData/videoGalleryData";
import { convertToEmbedUrl } from "@/lib/youtubeUtils";

const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = [
    { key: "all", label: "All Videos" },
    { key: "speech", label: "Speeches" },
    { key: "event", label: "Events" },
    { key: "interview", label: "Interviews" },
    { key: "initiative", label: "Initiatives" },
  ];

  const filteredVideos =
    activeFilter === "all"
      ? videoData
      : videoData.filter((video) => video.category === activeFilter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "speech":
        return "bg-[#FF9933]/10 text-[#FF9933]";
      case "event":
        return "bg-[#138808]/10 text-[#138808]";
      case "interview":
        return "bg-blue-100 text-blue-700";
      case "initiative":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <BackNavigation />

      <section id='video-gallery' className='py-12 md:py-16 lg:py-24 bg-white'>
        <div className='container px-4 sm:px-6'>
          {/* Header */}
          <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
            <div className='inline-block px-4 py-1.5 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm mb-4'>
              Video Gallery
            </div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
              Watch Our Journey
            </h2>
            <p className='text-muted-foreground mt-4 px-2'>
              Explore speeches, events, and initiatives through our video
              collection.
            </p>
          </div>

          {/* Category Filter */}
          <div className='flex flex-wrap justify-center gap-2 mb-8'>
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={activeFilter === category.key ? "default" : "outline"}
                size='sm'
                onClick={() => setActiveFilter(category.key)}
                className={`${
                  activeFilter === category.key
                    ? "bg-[#FF9933] hover:bg-[#FF9933]/90"
                    : "hover:bg-[#FF9933]/10"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Video Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className='group overflow-hidden hover:shadow-lg transition-shadow duration-300'
              >
                <div className='relative'>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                  />

                  {/* Play Button Overlay */}
                  <div className='absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <Button
                      size='lg'
                      className='bg-[#FF9933] hover:bg-[#FF9933]/90 text-white rounded-full p-4'
                      onClick={() => openVideoModal(video)}
                    >
                      <Play className='h-6 w-6' />
                    </Button>
                  </div>

                  {/* Duration Badge */}
                  <div className='absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded'>
                    {video.duration}
                  </div>

                  {/* Category Badge */}
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                      video.category
                    )}`}
                  >
                    {video.category.charAt(0).toUpperCase() +
                      video.category.slice(1)}
                  </div>
                </div>

                <CardContent className='p-4'>
                  <h3 className='font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#FF9933] transition-colors'>
                    {video.title}
                  </h3>
                  <p className='text-muted-foreground text-sm mb-3 line-clamp-2'>
                    {video.description}
                  </p>

                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-3 w-3' />
                      <span>{video.date}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Eye className='h-3 w-3' />
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-12'>
            <Button
              variant='outline'
              size='lg'
              className='px-8 py-3 border-2 border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white transition-all duration-300 font-semibold'
            >
              See More Videos
            </Button>
            <Link to='/photo-gallery'>
              <Button
                size='lg'
                className='px-8 py-3 bg-[#138808] hover:bg-[#138808]/90 text-white font-semibold transition-all duration-300'
              >
                View All Photos
              </Button>
            </Link>
          </div>

          {/* Video Modal */}
          {selectedVideo && (
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75'>
              <div className='relative w-full max-w-4xl mx-auto bg-white rounded-lg overflow-hidden'>
                {/* Close Button */}
                <Button
                  variant='ghost'
                  size='sm'
                  className='absolute top-2 right-2 z-10 bg-white/90 hover:bg-white'
                  onClick={closeVideoModal}
                >
                  <X className='h-4 w-4' />
                </Button>

                {/* Video Player */}
                <div className='aspect-video'>
                  <iframe
                    src={convertToEmbedUrl(selectedVideo.videoUrl)} // Convert URL here
                    title={selectedVideo.title}
                    className='w-full h-full'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                </div>

                {/* Video Info */}
                <div className='p-6'>
                  <div
                    className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getCategoryColor(
                      selectedVideo.category
                    )}`}
                  >
                    {selectedVideo.category.charAt(0).toUpperCase() +
                      selectedVideo.category.slice(1)}
                  </div>
                  <h3 className='text-xl font-bold mb-2'>
                    {selectedVideo.title}
                  </h3>
                  <p className='text-muted-foreground mb-4'>
                    {selectedVideo.description}
                  </p>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      <span>{selectedVideo.date}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Eye className='h-4 w-4' />
                      <span>{selectedVideo.views} views</span>
                    </div>
                    <span>{selectedVideo.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default VideoGallery;
