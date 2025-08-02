import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  ArrowLeft,
  AlertCircle,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Star,
  Tag,
} from "lucide-react";
import { useGetVideoQuery } from "@/redux-store/services/videoApi";
import { getVideoCategoryName } from "@/types/video.types";

const ViewVideoId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: videoData, isLoading, error } = useGetVideoQuery(id!);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    if (!videoData?.success) return;

    const video = videoData.data.video;

    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container mx-auto p-4 pt-8'>
          <Card className='max-w-4xl mx-auto'>
            <CardContent className='p-6 space-y-6'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-8 w-32' />
                <div className='flex gap-2'>
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                </div>
              </div>
              <Skeleton className='aspect-video w-full rounded-lg' />
              <div className='space-y-2'>
                <Skeleton className='h-8 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <Skeleton className='h-20 w-full' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !videoData?.success) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container mx-auto p-4 pt-8'>
          <Alert variant='destructive' className='max-w-4xl mx-auto'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Failed to load video. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const video = videoData.data.video;
  const categoryName = getVideoCategoryName(video.category);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
      {/* Header */}
      <div className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
        <div className='container flex h-16 items-center justify-between px-4'>
          <Button variant='ghost' onClick={handleBack}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={handleShare}>
              <Share2 className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='container mx-auto p-4 pt-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='max-w-4xl mx-auto'
        >
          <Card className='overflow-hidden shadow-xl'>
            <CardContent className='p-0'>
              {/* Video Header */}
              <div className='p-6 pb-4'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='space-y-2 flex-1'>
                    <div className='flex items-center gap-3'>
                      <h1 className='text-3xl font-bold text-gray-900'>
                        {video.title}
                      </h1>
                      {video.featured && (
                        <Badge
                          variant='secondary'
                          className='bg-yellow-100 text-yellow-800'
                        >
                          <Star className='w-3 h-3 mr-1' />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className='flex items-center gap-4'>
                      <Badge variant='outline' className='text-sm'>
                        {categoryName.toUpperCase()}
                      </Badge>
                      <div className='flex items-center gap-1 text-sm text-gray-500'>
                        <Calendar className='w-4 h-4' />
                        {formatDate(video.date)}
                      </div>
                      <div className='flex items-center gap-1 text-sm text-gray-500'>
                        <Clock className='w-4 h-4' />
                        {video.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className='relative bg-black'>
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  className='w-full aspect-video'
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Video Controls Overlay */}
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4'>
                  {/* Progress Bar */}
                  <div className='mb-3'>
                    <input
                      type='range'
                      min={0}
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className='w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer'
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                          (currentTime / duration) * 100
                        }%, rgba(255,255,255,0.3) ${
                          (currentTime / duration) * 100
                        }%, rgba(255,255,255,0.3) 100%)`,
                      }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={togglePlay}
                        className='text-white hover:bg-white/20'
                      >
                        {isPlaying ? (
                          <Pause className='w-5 h-5' />
                        ) : (
                          <Play className='w-5 h-5' />
                        )}
                      </Button>

                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={toggleMute}
                        className='text-white hover:bg-white/20'
                      >
                        {isMuted ? (
                          <VolumeX className='w-5 h-5' />
                        ) : (
                          <Volume2 className='w-5 h-5' />
                        )}
                      </Button>

                      <span className='text-white text-sm'>
                        {formatDuration(currentTime)} /{" "}
                        {formatDuration(duration)}
                      </span>
                    </div>

                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={toggleFullscreen}
                      className='text-white hover:bg-white/20'
                    >
                      <Maximize className='w-5 h-5' />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Video Information */}
              <div className='p-6'>
                <div className='space-y-4'>
                  <div>
                    <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                      Description
                    </h2>
                    <p className='text-gray-700 leading-relaxed'>
                      {video.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <div>
                      <h3 className='text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1'>
                        <Tag className='w-4 h-4' />
                        Tags
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {video.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='text-xs'
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewVideoId;
