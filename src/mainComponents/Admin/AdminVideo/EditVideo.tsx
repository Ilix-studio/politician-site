import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowLeft,
  Save,
  Video,
  Image,
  Loader2,
  Calendar,
  Clock,
  AlertCircle,
  Upload,
  Eye,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetVideoQuery,
  useUpdateVideoMutation,
} from "@/redux-store/services/videoApi";
import { VideoUpdateData, VIDEO_CATEGORIES } from "@/types/video.types";

const EditVideo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const thumbnailFileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<VideoUpdateData>({
    title: "",
    description: "",
    category: "speech",
    date: "",
    duration: "",
    featured: false,
    tags: [],
    isActive: true,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Redirect if no ID provided
  if (!id) {
    return <Navigate to='/admin/videos' />;
  }

  const {
    data: videoData,
    isLoading: loadingVideo,
    error: videoError,
    refetch,
  } = useGetVideoQuery(id);

  const [updateVideo, { isLoading: updating }] = useUpdateVideoMutation();

  const video = videoData?.data?.video;

  // Populate form when video data is loaded
  useEffect(() => {
    if (video) {
      const formattedDate = new Date(video.date).toISOString().split("T")[0];

      setFormData({
        title: video.title,
        description: video.description,
        category: video.category,
        date: formattedDate,
        duration: video.duration,
        featured: video.featured || false,
        tags: video.tags || [],
        isActive: video.isActive,
      });
      setThumbnailPreview(video.thumbnail);
    }
  }, [video]);

  const handleInputChange = (field: keyof VideoUpdateData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      setHasChanges(true);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.duration?.trim()) {
      newErrors.duration = "Duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updateData: VideoUpdateData = { ...formData };

      // If a new thumbnail is uploaded, we would need to handle the upload
      // For now, we'll just update the text fields
      // In a full implementation, you might want to add thumbnail upload functionality

      await updateVideo({
        id: id!,
        data: updateData,
      }).unwrap();

      // Success - navigate to video view
      navigate(`/admin/videos/view/${id}`);
    } catch (error: any) {
      console.error("Update failed:", error);
      setErrors({
        submit:
          error.data?.message || "Failed to update video. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) return;
    }

    // Clean up object URL if new thumbnail was selected
    if (thumbnailFile && thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    navigate(`/admin/videos/view/${id}`);
  };

  const handleViewVideo = () => {
    navigate(`/admin/videos/view/${id}`);
  };

  // Loading state
  if (loadingVideo) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='w-8 h-8 animate-spin text-slate-600' />
            <span className='ml-2 text-slate-600'>Loading video...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (videoError || !video) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
          <div className='flex items-center justify-center py-12'>
            <Card className='w-full max-w-md'>
              <CardContent className='p-6 text-center'>
                <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-red-700 mb-2'>
                  Video Not Found
                </h3>
                <p className='text-slate-600 mb-4'>
                  The video you're trying to edit doesn't exist or has been
                  removed.
                </p>
                <div className='flex gap-2 justify-center'>
                  <Button
                    onClick={() => navigate("/admin/videos")}
                    variant='outline'
                  >
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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
      <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
        {/* Header */}
        <motion.div
          className='mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className='flex items-center justify-between mb-4'>
            <Button
              onClick={handleCancel}
              variant='ghost'
              className='flex items-center gap-2'
              disabled={updating}
            >
              <ArrowLeft className='w-4 h-4' />
              Back
            </Button>

            <Button
              onClick={handleViewVideo}
              variant='outline'
              className='flex items-center gap-2'
            >
              <Eye className='w-4 h-4' />
              View Video
            </Button>
          </div>

          <div>
            <h1 className='text-3xl font-bold text-slate-900'>Edit Video</h1>
            <p className='text-slate-600 mt-1'>
              Update video details and settings
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Main Form */}
            <motion.div
              className='lg:col-span-2'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Video className='w-5 h-5' />
                    Video Details
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Title */}
                  <div>
                    <Label htmlFor='title'>Title *</Label>
                    <Input
                      id='title'
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder='Enter video title'
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className='text-sm text-red-600 mt-1'>
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor='description'>Description *</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder='Enter video description'
                      className={`min-h-[120px] ${
                        errors.description ? "border-red-500" : ""
                      }`}
                    />
                    {errors.description && (
                      <p className='text-sm text-red-600 mt-1'>
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Category and Date */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='category'>Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                        <SelectContent>
                          {VIDEO_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor='date'>Date *</Label>
                      <div className='relative'>
                        <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                        <Input
                          id='date'
                          type='date'
                          value={formData.date}
                          onChange={(e) =>
                            handleInputChange("date", e.target.value)
                          }
                          className={`pl-10 ${
                            errors.date ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.date && (
                        <p className='text-sm text-red-600 mt-1'>
                          {errors.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <Label htmlFor='duration'>Duration *</Label>
                    <div className='relative'>
                      <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                      <Input
                        id='duration'
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        placeholder='e.g., 5:30 or 1:25:45'
                        className={`pl-10 ${
                          errors.duration ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.duration && (
                      <p className='text-sm text-red-600 mt-1'>
                        {errors.duration}
                      </p>
                    )}
                  </div>

                  {/* Error Messages */}
                  {errors.submit && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                      <div className='flex items-center gap-2'>
                        <AlertCircle className='w-5 h-5 text-red-600' />
                        <p className='text-red-700'>{errors.submit}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className='space-y-6'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Current Video Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Video className='w-5 h-5' />
                    Current Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <video
                    controls
                    className='w-full rounded-lg'
                    poster={video.thumbnail}
                  >
                    <source src={video.videoUrl} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                </CardContent>
              </Card>

              {/* Thumbnail Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Image className='w-5 h-5' />
                    Thumbnail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <input
                      ref={thumbnailFileRef}
                      type='file'
                      accept='image/*'
                      onChange={handleThumbnailFileChange}
                      className='hidden'
                    />

                    {/* Current/Preview Thumbnail */}
                    <div className='space-y-2'>
                      <img
                        src={thumbnailPreview}
                        alt='Thumbnail'
                        className='w-full rounded-lg'
                      />

                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => thumbnailFileRef.current?.click()}
                        className='w-full'
                      >
                        <Upload className='w-4 h-4 mr-2' />
                        {thumbnailFile
                          ? "Change Thumbnail"
                          : "Update Thumbnail"}
                      </Button>

                      {thumbnailFile && (
                        <p className='text-sm text-slate-600'>
                          New file: {thumbnailFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Actions */}
              <Card>
                <CardContent className='p-4'>
                  <div className='space-y-3'>
                    <Button
                      type='submit'
                      className='w-full'
                      disabled={updating || !hasChanges}
                    >
                      {updating ? (
                        <>
                          <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className='w-4 h-4 mr-2' />
                          Save Changes
                        </>
                      )}
                    </Button>

                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleCancel}
                      disabled={updating}
                      className='w-full'
                    >
                      Cancel
                    </Button>

                    {hasChanges && (
                      <p className='text-sm text-amber-600 text-center'>
                        You have unsaved changes
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVideo;
