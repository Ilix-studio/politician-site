import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Upload,
  Video,
  Image,
  Loader2,
  X,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import { useUploadVideoMutation } from "@/redux-store/services/videoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { VideoUploadData } from "@/types/video.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const AddVideo = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const videoFileRef = useRef<HTMLInputElement>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);

  // Fetch video categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesByTypeQuery("video");

  // Form state
  const [formData, setFormData] = useState<VideoUploadData>({
    title: "",
    description: "",
    category: "",
    date: "",
    duration: "",
    featured: false,
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [uploadVideo, { isLoading: uploading }] = useUploadVideoMutation();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleInputChange = (field: keyof VideoUploadData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);

      // Auto-populate duration if possible (this is a basic implementation)
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        setFormData((prev) => ({
          ...prev,
          duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
        }));
      };
      video.src = url;
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
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (!videoFile) {
      newErrors.videoFile = "Video file is required";
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
      const uploadData = {
        videoFile: videoFile!,
        thumbnailFile: thumbnailFile || undefined,
        data: formData,
      };

      await uploadVideo(uploadData).unwrap();

      // Success - navigate back to dashboard
      navigate("/admin/videoDashboard");
    } catch (error: any) {
      console.error("Upload failed:", error);
      setErrors({
        submit:
          error.data?.message || "Failed to upload video. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    // Clean up object URLs
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    navigate("/admin/videoDashboard");
  };

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
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
                        <select
                          id='category'
                          value={formData.category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.category ? "border-red-500" : ""
                          }`}
                        >
                          <option value='' disabled>
                            Select category
                          </option>
                          {categoriesLoading ? (
                            <option value='' disabled>
                              Loading categories...
                            </option>
                          ) : categoriesError ? (
                            <option value='' disabled>
                              Error loading categories
                            </option>
                          ) : categories.length === 0 ? (
                            <option value='' disabled>
                              No categories available
                            </option>
                          ) : (
                            categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))
                          )}
                        </select>
                        {errors.category && (
                          <p className='text-sm text-red-600 mt-1'>
                            {errors.category}
                          </p>
                        )}
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

              {/* File Upload Sidebar */}
              <motion.div
                className='space-y-6'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Video Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Upload className='w-5 h-5' />
                      Video File *
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <input
                        ref={videoFileRef}
                        type='file'
                        accept='video/*'
                        onChange={handleVideoFileChange}
                        className='hidden'
                      />

                      {!videoFile ? (
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => videoFileRef.current?.click()}
                          className='w-full h-24 border-dashed'
                        >
                          <div className='text-center'>
                            <Video className='w-8 h-8 mx-auto mb-2 text-slate-400' />
                            <p className='text-sm'>Click to upload video</p>
                          </div>
                        </Button>
                      ) : (
                        <div className='space-y-2'>
                          <video
                            src={videoPreview}
                            controls
                            className='w-full rounded-lg'
                            style={{ maxHeight: "200px" }}
                          />
                          <div className='flex items-center justify-between'>
                            <p className='text-sm text-slate-600 truncate'>
                              {videoFile.name}
                            </p>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setVideoFile(null);
                                setVideoPreview("");
                                if (videoFileRef.current) {
                                  videoFileRef.current.value = "";
                                }
                              }}
                            >
                              <X className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      )}

                      {errors.videoFile && (
                        <p className='text-sm text-red-600'>
                          {errors.videoFile}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Thumbnail Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Image className='w-5 h-5' />
                      Thumbnail (Optional)
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

                      {!thumbnailFile ? (
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => thumbnailFileRef.current?.click()}
                          className='w-full h-24 border-dashed'
                        >
                          <div className='text-center'>
                            <Image className='w-8 h-8 mx-auto mb-2 text-slate-400' />
                            <p className='text-sm'>Click to upload thumbnail</p>
                            <p className='text-xs text-slate-400'>
                              Will auto-generate if not provided
                            </p>
                          </div>
                        </Button>
                      ) : (
                        <div className='space-y-2'>
                          <img
                            src={thumbnailPreview}
                            alt='Thumbnail preview'
                            className='w-full rounded-lg'
                          />
                          <div className='flex items-center justify-between'>
                            <p className='text-sm text-slate-600 truncate'>
                              {thumbnailFile.name}
                            </p>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setThumbnailFile(null);
                                setThumbnailPreview("");
                                if (thumbnailFileRef.current) {
                                  thumbnailFileRef.current.value = "";
                                }
                              }}
                            >
                              <X className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Actions */}
                <Card>
                  <CardContent className='p-4'>
                    <div className='space-y-3'>
                      <Button
                        type='submit'
                        className='w-full'
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className='w-4 h-4 mr-2' />
                            Upload Video
                          </>
                        )}
                      </Button>

                      <Button
                        type='button'
                        variant='outline'
                        onClick={handleCancel}
                        disabled={uploading}
                        className='w-full'
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVideo;
