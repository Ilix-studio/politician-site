import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit2,
  Trash2,
  Star,
  Play,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import { VideoDocument } from "@/types/video.types";

interface VideoCardProps {
  video: VideoDocument;
  onEdit?: (video: VideoDocument) => void;
  onDelete?: (videoId: string) => void;
  onView?: (video: VideoDocument) => void;
  onToggleFeatured?: (videoId: string) => void;
  showActions?: boolean;
  viewMode?: "grid" | "list";
  isDeleting?: boolean;
  isToggling?: boolean;
}

const VideoCard = ({
  video,
  onEdit,
  onDelete,
  onView,
  onToggleFeatured,
  showActions = false,
  viewMode = "grid",
  isDeleting = false,
  isToggling = false,
}: VideoCardProps) => {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <Card className='hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-4'>
              {/* Thumbnail */}
              <div className='relative w-32 h-20 flex-shrink-0'>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className='w-full h-full object-cover rounded-lg'
                />
                <div className='absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                  <Play className='w-6 h-6 text-white' />
                </div>
                {video.featured && (
                  <Star className='absolute top-1 right-1 w-4 h-4 text-yellow-400 fill-current' />
                )}
              </div>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-slate-900 truncate text-lg'>
                      {video.title}
                    </h3>
                    <p className='text-sm text-slate-600 mt-1 line-clamp-2'>
                      {video.description}
                    </p>
                  </div>

                  {showActions && (
                    <div className='flex items-center gap-2 ml-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onView?.(video)}
                      >
                        <Eye className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onEdit?.(video)}
                      >
                        <Edit2 className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onToggleFeatured?.(video._id)}
                        disabled={isToggling}
                        className={video.featured ? "bg-yellow-50" : ""}
                      >
                        {isToggling ? (
                          <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                          <Star
                            className={`w-4 h-4 ${
                              video.featured
                                ? "text-yellow-500 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        )}
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onDelete?.(video._id)}
                        disabled={isDeleting}
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        {isDeleting ? (
                          <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                          <Trash2 className='w-4 h-4' />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Meta information */}
                <div className='flex items-center gap-4 mt-3'>
                  <Badge className={getCategoryColor(video.category)}>
                    {video.category}
                  </Badge>

                  <div className='flex items-center gap-1 text-sm text-slate-500'>
                    <Calendar className='w-4 h-4' />
                    {formatDate(video.date)}
                  </div>

                  <div className='flex items-center gap-1 text-sm text-slate-500'>
                    <Clock className='w-4 h-4' />
                    {video.duration}
                  </div>

                  {video.views !== undefined && (
                    <div className='flex items-center gap-1 text-sm text-slate-500'>
                      <Eye className='w-4 h-4' />
                      {video.views} views
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className='hover:shadow-lg transition-shadow h-full flex flex-col'>
        {/* Thumbnail */}
        <div className='relative aspect-video'>
          <img
            src={video.thumbnail}
            alt={video.title}
            className='w-full h-full object-cover rounded-t-lg'
          />
          <div className='absolute inset-0 bg-black bg-opacity-20 rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
            <Play className='w-8 h-8 text-white' />
          </div>
          {video.featured && (
            <div className='absolute top-2 right-2'>
              <Star className='w-5 h-5 text-yellow-400 fill-current' />
            </div>
          )}
          <div className='absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded'>
            {video.duration}
          </div>
        </div>

        <CardContent className='p-4 flex-1 flex flex-col'>
          {/* Category Badge */}
          <Badge className={`${getCategoryColor(video.category)} w-fit mb-2`}>
            {video.category}
          </Badge>

          {/* Title */}
          <h3 className='font-semibold text-slate-900 line-clamp-2 text-lg mb-2'>
            {video.title}
          </h3>

          {/* Description */}
          <p className='text-sm text-slate-600 line-clamp-3 mb-4 flex-1'>
            {video.description}
          </p>

          {/* Meta information */}
          <div className='space-y-2 mb-4'>
            <div className='flex items-center gap-1 text-sm text-slate-500'>
              <Calendar className='w-4 h-4' />
              {formatDate(video.date)}
            </div>

            {video.views !== undefined && (
              <div className='flex items-center gap-1 text-sm text-slate-500'>
                <Eye className='w-4 h-4' />
                {video.views} views
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className='flex items-center gap-2 pt-2 border-t'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onView?.(video)}
                className='flex-1'
              >
                <Eye className='w-4 h-4 mr-1' />
                View
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onEdit?.(video)}
              >
                <Edit2 className='w-4 h-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onToggleFeatured?.(video._id)}
                disabled={isToggling}
                className={video.featured ? "bg-yellow-50" : ""}
              >
                {isToggling ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Star
                    className={`w-4 h-4 ${
                      video.featured
                        ? "text-yellow-500 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                )}
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onDelete?.(video._id)}
                disabled={isDeleting}
                className='text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                {isDeleting ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Trash2 className='w-4 h-4' />
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VideoCard;
