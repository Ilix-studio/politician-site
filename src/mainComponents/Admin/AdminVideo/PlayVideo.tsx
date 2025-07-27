import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Eye,
  Star,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import { useGetVideoQuery } from "@/redux-store/services/videoApi";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const PlayVideo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Redirect if no ID provided
  if (!id) {
    return <Navigate to='/admin/videoDashboard' />;
  }

  const { data: videoData, isLoading, error, refetch } = useGetVideoQuery(id);

  const video = videoData?.data?.video;

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current && video) {
      videoRef.current.play().catch((error) => {
        console.log("Auto-play prevented:", error);
      });
    }
  }, [video]);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "speech":
        return "bg-blue-100 text-blue-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "initiative":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBackToVideos = () => {
    navigate("/admin/videos");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6 max-w-6xl mx-auto'>
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='w-8 h-8 animate-spin text-slate-600' />
            <span className='ml-2 text-slate-600'>Loading video...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !video) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6 max-w-6xl mx-auto'>
          <div className='flex items-center justify-center py-12'>
            <Card className='w-full max-w-md'>
              <CardContent className='p-6 text-center'>
                <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-red-700 mb-2'>
                  Video Not Found
                </h3>
                <p className='text-slate-600 mb-4'>
                  The video you're looking for doesn't exist or has been
                  removed.
                </p>
                <div className='flex gap-2 justify-center'>
                  <Button onClick={handleBackToVideos} variant='outline'>
                    Back to Videos
                  </Button>
                  <Button onClick={refetch}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6 max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Video Player */}
            <motion.div
              className='lg:col-span-2'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className='overflow-hidden'>
                <div className='relative aspect-video bg-black'>
                  <video
                    ref={videoRef}
                    controls
                    className='w-full h-full'
                    poster={video.thumbnail}
                  >
                    <source src={video.videoUrl} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>

                  {video.featured && (
                    <div className='absolute top-4 right-4'>
                      <Badge className='bg-yellow-500 text-white'>
                        <Star className='w-3 h-3 mr-1 fill-current' />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className='p-6'>
                  <div className='mb-4'>
                    <Badge className={getCategoryColor(video.category)}>
                      {video.category.charAt(0).toUpperCase() +
                        video.category.slice(1)}
                    </Badge>
                  </div>

                  <h1 className='text-2xl font-bold text-slate-900 mb-3'>
                    {video.title}
                  </h1>

                  <div className='flex items-center gap-6 text-sm text-slate-600 mb-4'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='w-4 h-4' />
                      {formatDate(video.date)}
                    </div>

                    <div className='flex items-center gap-1'>
                      <Clock className='w-4 h-4' />
                      {video.duration}
                    </div>

                    {video.views !== undefined && (
                      <div className='flex items-center gap-1'>
                        <Eye className='w-4 h-4' />
                        {video.views} views
                      </div>
                    )}
                  </div>

                  <Separator className='my-4' />

                  <div>
                    <h3 className='font-semibold text-slate-900 mb-2'>
                      Description
                    </h3>
                    <p className='text-slate-700 leading-relaxed whitespace-pre-wrap'>
                      {video.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <>
                      <Separator className='my-4' />
                      <div>
                        <h3 className='font-semibold text-slate-900 mb-2 flex items-center gap-2'>
                          <Tag className='w-4 h-4' />
                          Tags
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          {video.tags.map((tag, index) => (
                            <Badge key={index} variant='secondary'>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Video Details Sidebar */}
            <motion.div
              className='space-y-6'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Video Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Video Statistics</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-slate-600'>Status</span>
                    <Badge
                      className={
                        video.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {video.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-slate-600'>Created</span>
                    <span className='text-sm text-slate-700'>
                      {formatDate(video.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Technical Details</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='pt-2'>
                    <span className='text-sm text-slate-600 block mb-2'>
                      Video URL
                    </span>
                    <a
                      href={video.videoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-blue-600 hover:text-blue-800 break-all'
                    >
                      {video.videoUrl}
                    </a>
                  </div>

                  <div className='pt-2'>
                    <span className='text-sm text-slate-600 block mb-2'>
                      Thumbnail URL
                    </span>
                    <a
                      href={video.thumbnail}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-blue-600 hover:text-blue-800 break-all'
                    >
                      {video.thumbnail}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Thumbnail Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Thumbnail</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className='w-full rounded-lg shadow-sm'
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayVideo;
