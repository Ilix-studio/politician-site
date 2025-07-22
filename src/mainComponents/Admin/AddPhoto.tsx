import React, { useState } from "react";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Image as ImageIcon,
  X,
  Calendar,
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import {
  useUploadPhotoMutation,
  PhotoUploadData,
} from "@/redux-store/services/photoApi";
import { useSelector } from "react-redux";
import { logout, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { useDispatch } from "react-redux";

const AddPhoto: React.FC = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);
  const [uploadPhoto, { isLoading: isUploading }] = useUploadPhotoMutation();

  const [formData, setFormData] = useState<PhotoUploadData>({
    title: "",
    category: "",
    location: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const categories = [
    { value: "political-events", label: "Political Events" },
    { value: "community-service", label: "Community Service" },
    { value: "public-rallies", label: "Public Rallies" },
    { value: "meetings", label: "Meetings" },
    { value: "awards", label: "Awards" },
    { value: "personal", label: "Personal" },
    { value: "campaigns", label: "Campaigns" },
    { value: "speeches", label: "Speeches" },
    { value: "other", label: "Other" },
  ];

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Alert className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Access denied. Admin authentication required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleInputChange = (field: keyof PhotoUploadData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, file: "Please select an image file" }));
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          file: "File size must be less than 10MB",
        }));
        return;
      }

      setSelectedFile(file);
      setErrors((prev) => ({ ...prev, file: "" }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Auto-fill title if empty
      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        setFormData((prev) => ({ ...prev, title: fileName }));
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = "Please select a photo to upload";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (formData.location && formData.location.length > 100) {
      newErrors.location = "Location must be less than 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      const uploadData: PhotoUploadData = {
        ...formData,
      };

      await uploadPhoto({
        file: selectedFile!,
        data: uploadData,
      }).unwrap();

      // Success - reset form
      setFormData({
        title: "",
        category: "",

        location: "",
        description: "",

        date: new Date().toISOString().split("T")[0],
      });
      removeFile();
      setSuccessMessage("Photo uploaded successfully!");

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      const errorMessage =
        error.data?.message || error.message || "Failed to upload photo";
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    }
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  const handleHomeRedirect = () => {
    window.location.href = "/admin/photoDashboard";
  };

  return (
    <>
      <header className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-4'>
              <Button
                onClick={handleHomeRedirect}
                variant='ghost'
                className='group flex items-center gap-3 px-4 py-2 hover:bg-gradient-to-r hover:from-[#FF9933]/10 hover:to-[#138808]/10 rounded-xl transition-all duration-300'
              >
                <div className='relative'>
                  <ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300' />
                  <div className='absolute inset-0 bg-[#FF9933] rounded-full opacity-0 group-hover:opacity-20 animate-ping'></div>
                </div>
                <span className='font-medium'>Back to Photo Dashboard</span>
              </Button>

              <div className='hidden sm:block w-px h-6 bg-gray-300'></div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant='ghost'
            className='flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </Button>
        </div>
      </header>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-2xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className='shadow-xl'>
              <CardHeader className='text-center'>
                <CardTitle className='text-2xl font-bold text-slate-800 flex items-center justify-center gap-2'>
                  <ImageIcon className='w-6 h-6 text-blue-600' />
                  Add New Photo
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-6'>
                {/* Success Message */}
                {successMessage && (
                  <Alert className='border-green-200 bg-green-50'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <AlertDescription className='text-green-800'>
                      {successMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Error */}
                {errors.submit && (
                  <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* File Upload */}
                  <div className='space-y-2'>
                    <Label htmlFor='photo' className='text-sm font-medium'>
                      Photo *
                    </Label>

                    {!selectedFile ? (
                      <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors'>
                        <input
                          id='photo'
                          type='file'
                          accept='image/*'
                          onChange={handleFileChange}
                          className='hidden'
                        />
                        <Label
                          htmlFor='photo'
                          className='cursor-pointer flex flex-col items-center gap-2'
                        >
                          <Upload className='w-8 h-8 text-gray-400' />
                          <span className='text-sm text-gray-600'>
                            Click to upload or drag and drop
                          </span>
                          <span className='text-xs text-gray-400'>
                            PNG, JPG, GIF up to 10MB
                          </span>
                        </Label>
                      </div>
                    ) : (
                      <div className='relative'>
                        <img
                          src={previewUrl}
                          alt='Preview'
                          className='w-full h-48 object-cover rounded-lg'
                        />
                        <Button
                          type='button'
                          variant='destructive'
                          size='sm'
                          className='absolute top-2 right-2'
                          onClick={removeFile}
                        >
                          <X className='w-4 h-4' />
                        </Button>
                        <div className='mt-2 text-sm text-gray-600'>
                          {selectedFile.name} (
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </div>
                      </div>
                    )}

                    {errors.file && (
                      <p className='text-sm text-red-600'>{errors.file}</p>
                    )}
                  </div>

                  {/* Title */}
                  <div className='space-y-2'>
                    <Label htmlFor='title' className='text-sm font-medium'>
                      Title *
                    </Label>
                    <Input
                      id='title'
                      type='text'
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder='Enter photo title'
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className='text-sm text-red-600'>{errors.title}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.category ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className='text-sm text-red-600'>{errors.category}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='date'
                      className='text-sm font-medium flex items-center gap-2'
                    >
                      <Calendar className='w-4 h-4' />
                      Date
                    </Label>
                    <Input
                      id='date'
                      type='date'
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                    />
                  </div>

                  {/* Location */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='location'
                      className='text-sm font-medium flex items-center gap-2'
                    >
                      <MapPin className='w-4 h-4' />
                      Location
                    </Label>
                    <Input
                      id='location'
                      type='text'
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder='Where was this photo taken?'
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && (
                      <p className='text-sm text-red-600'>{errors.location}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='description'
                      className='text-sm font-medium'
                    >
                      Description
                    </Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe what's happening in this photo"
                      rows={3}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className='text-sm text-red-600'>
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type='submit'
                    disabled={isUploading}
                    className='w-full'
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Uploading Photo...
                      </>
                    ) : (
                      <>
                        <Upload className='w-4 h-4 mr-2' />
                        Upload Photo
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AddPhoto;
