import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Star,
  Loader2,
  AlertCircle,
  Play,
  Tag,
  Share2,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useGetVideoQuery } from "@/redux-store/services/videoApi";

const ViewVideoId = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Redirect if no ID provided
  if (!id) {
    navigate("/");
    return null;
  }

  // Fetch video data
  const { data: videoData, isLoading, error } = useGetVideoQuery(id);

  const video = videoData?.data?.video;

  useEffect(() => {
    // Auto-hide controls after 3 seconds of inactivity
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  useEffect(() => {
    // Update video time
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => setCurrentTime(videoElement.currentTime);
    const updateDuration = () => setDuration(videoElement.duration);

    videoElement.addEventListener("timeupdate", updateTime);
    videoElement.addEventListener("loadedmetadata", updateDuration);

    return () => {
      videoElement.removeEventListener("timeupdate", updateTime);
      videoElement.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [video]);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "speech":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "event":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "initiative":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handlePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteUnmute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkip = (seconds: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = Math.max(
      0,
      Math.min(duration, currentTime + seconds)
    );
  };

  const handleFullscreen = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!isFullscreen) {
      videoElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleShare = async () => {
    if (navigator.share && video) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert("Video URL copied to clipboard!");
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Video URL copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center'>
        <Card className='w-96'>
          <CardContent className='flex flex-col items-center justify-center p-8'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-600 mb-4' />
            <p className='text-slate-600 dark:text-slate-400'>
              Loading video...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center'>
        <Card className='w-96'>
          <CardContent className='flex flex-col items-center justify-center p-8'>
            <AlertCircle className='w-12 h-12 text-red-500 mb-4' />
            <h2 className='text-xl font-bold text-slate-800 dark:text-slate-200 mb-2'>
              Video Not Found
            </h2>
            <p className='text-slate-600 dark:text-slate-400 text-center mb-4'>
              The video you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")} className='mt-4'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-6'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate("/")}
            className='flex items-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Back
          </Button>
          <h1 className='text-2xl font-bold text-slate-800 dark:text-slate-200'>
            Video Player
          </h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Video Player */}
          <div className='lg:col-span-2'>
            <Card className='overflow-hidden'>
              <div
                className='relative aspect-video bg-black group'
                onMouseMove={handleMouseMove}
              >
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  className='w-full h-full object-contain'
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Video Controls Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* Play/Pause Overlay */}
                  <div
                    className='absolute inset-0 flex items-center justify-center cursor-pointer'
                    onClick={handlePlayPause}
                  >
                    {!isPlaying && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='bg-black/30 rounded-full p-4 backdrop-blur-sm'
                      >
                        <Play className='w-12 h-12 text-white fill-white' />
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className='absolute bottom-0 left-0 right-0 p-4'>
                    {/* Progress Bar */}
                    <div className='mb-4'>
                      <input
                        type='range'
                        min='0'
                        max='100'
                        value={duration ? (currentTime / duration) * 100 : 0}
                        onChange={handleSeek}
                        className='w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider'
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={handlePlayPause}
                          className='text-white hover:bg-white/20'
                        >
                          {isPlaying ? (
                            <Pause className='w-4 h-4' />
                          ) : (
                            <Play className='w-4 h-4' />
                          )}
                        </Button>

                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => handleSkip(-10)}
                          className='text-white hover:bg-white/20'
                        >
                          <SkipBack className='w-4 h-4' />
                        </Button>

                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => handleSkip(10)}
                          className='text-white hover:bg-white/20'
                        >
                          <SkipForward className='w-4 h-4' />
                        </Button>

                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={handleMuteUnmute}
                          className='text-white hover:bg-white/20'
                        >
                          {isMuted ? (
                            <VolumeX className='w-4 h-4' />
                          ) : (
                            <Volume2 className='w-4 h-4' />
                          )}
                        </Button>

                        <span className='text-white text-sm font-medium'>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={handleFullscreen}
                        className='text-white hover:bg-white/20'
                      >
                        <Maximize className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Video Info */}
            <Card className='mt-4'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='text-xl font-bold text-slate-800 dark:text-slate-200 mb-2'>
                      {video.title}
                    </CardTitle>
                    <div className='flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-4 h-4' />
                        <span>{formatDate(video.date)}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='w-4 h-4' />
                        <span>{video.duration}</span>
                      </div>
                      {video.views && (
                        <div className='flex items-center gap-1'>
                          <Eye className='w-4 h-4' />
                          <span>{video.views.toLocaleString()} views</span>
                        </div>
                      )}
                    </div>
                    <div className='flex items-center gap-2 mb-4'>
                      <Badge className={getCategoryColor(video.category)}>
                        {video.category.charAt(0).toUpperCase() +
                          video.category.slice(1)}
                      </Badge>
                      {video.featured && (
                        <Badge
                          variant='secondary'
                          className='flex items-center gap-1'
                        >
                          <Star className='w-3 h-3' />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleShare}
                      className='flex items-center gap-2'
                    >
                      <Share2 className='w-4 h-4' />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Separator className='mb-4' />
                <div>
                  <h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-2'>
                    Description
                  </h3>
                  <p className='text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap'>
                    {video.description}
                  </p>
                </div>

                {video.tags && video.tags.length > 0 && (
                  <div className='mt-6'>
                    <h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2'>
                      <Tag className='w-4 h-4' />
                      Tags
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {video.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-xs'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Related Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-slate-600 dark:text-slate-400 text-sm'>
                  Related videos will be displayed here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVideoId;
