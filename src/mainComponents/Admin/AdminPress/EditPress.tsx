import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Save,
  Loader2,
  Image as ImageIcon,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetPressByIdQuery,
  useUpdatePressMutation,
} from "@/redux-store/services/pressApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { PressUpdateData, Press } from "@/types/press.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const EditPress = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const [formData, setFormData] = useState<PressUpdateData>({
    title: "",
    source: "",
    date: "",
    category: "",
    author: "",
    readTime: "",
    content: "",
    excerpt: "",
    isActive: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // API hooks
  const {
    data: pressData,
    isLoading: loadingPress,
    error: pressError,
  } = useGetPressByIdQuery(id || "", { skip: !id });

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesByTypeQuery("press");

  const [updatePress, { isLoading: updating }] = useUpdatePressMutation();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  if (!id) {
    return <Navigate to='/admin/dashboard' />;
  }

  // Helper functions
  const getCategoryId = (category: Press["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category._id;
  };

  const getCategoryName = (category: Press["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category.name;
  };

  // Populate form when press data loads
  useEffect(() => {
    if (pressData?.data) {
      const press = pressData.data;
      const formattedDate = new Date(press.date).toISOString().split("T")[0];

      setFormData({
        title: press.title,
        source: press.source,
        date: formattedDate,
        category: getCategoryId(press.category),
        author: press.author,
        readTime: press.readTime,
        content: press.content,
        excerpt: press.excerpt,
        isActive: press.isActive,
      });
    }
  }, [pressData]);

  const handleInputChange = (
    field: keyof PressUpdateData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      await updatePress({ id, data: formData }).unwrap();
      setHasChanges(false);
      navigate(`/admin/read/${id}`);
    } catch (error: any) {
      console.error("Failed to update press article:", error);
      alert(error.data?.message || "Failed to update press article");
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) return;
    }
    navigate(`/admin/read/${id}`);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loadingPress) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
          <p className='text-slate-600'>Loading press article...</p>
        </div>
      </div>
    );
  }

  if (pressError || !pressData?.data) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center'>
        <Card className='max-w-md'>
          <CardContent className='p-6 text-center'>
            <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-slate-800 mb-2'>
              Article Not Found
            </h2>
            <p className='text-slate-600 mb-4'>
              The press article you're trying to edit doesn't exist or has been
              removed.
            </p>
            <Button onClick={() => navigate("/admin/pressDashboard")}>
              Back to Press Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const press = pressData.data;

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-4xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-6'
          >
            {/* Page Header */}
            <div>
              <h1 className='text-2xl font-bold text-slate-800'>
                Edit Press Article
              </h1>
              <p className='text-slate-600 mt-1'>
                Last updated: {formatDate(press.updatedAt)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Status & Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                      <FileText className='w-5 h-5' />
                      Basic Information
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='title'>Title *</Label>
                      <Input
                        id='title'
                        value={formData.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder='Enter article title'
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor='source'>Source *</Label>
                      <Input
                        id='source'
                        value={formData.source || ""}
                        onChange={(e) =>
                          handleInputChange("source", e.target.value)
                        }
                        placeholder='e.g., Times of India, BBC'
                        required
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <Label htmlFor='author'>Author *</Label>
                      <Input
                        id='author'
                        value={formData.author || ""}
                        onChange={(e) =>
                          handleInputChange("author", e.target.value)
                        }
                        placeholder='Author name'
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor='date'>Date *</Label>
                      <Input
                        id='date'
                        type='date'
                        value={formData.date || ""}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor='readTime'>Read Time *</Label>
                      <Input
                        id='readTime'
                        value={formData.readTime || ""}
                        onChange={(e) =>
                          handleInputChange("readTime", e.target.value)
                        }
                        placeholder='e.g., 5 min'
                        required
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4'>
                    <div>
                      <Label htmlFor='category'>Category *</Label>
                      <select
                        id='category'
                        name='category'
                        value={formData.category || ""}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        required
                        disabled={categoriesLoading}
                      >
                        <option value=''>
                          {categoriesLoading
                            ? "Loading categories..."
                            : "Select category"}
                        </option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images Display */}
              {press.images && press.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <ImageIcon className='w-5 h-5' />
                      Article Images ({press.images.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {press.images.map((image, index) => (
                        <div key={index} className='space-y-2'>
                          <div className='w-full h-32 bg-gray-100 rounded-lg overflow-hidden'>
                            <img
                              src={image.src}
                              alt={image.alt}
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <p className='text-xs text-gray-600 truncate'>
                            {image.alt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='excerpt'>Excerpt *</Label>
                    <Textarea
                      id='excerpt'
                      value={formData.excerpt || ""}
                      onChange={(e) =>
                        handleInputChange("excerpt", e.target.value)
                      }
                      placeholder='Brief summary of the article (max 500 characters)'
                      maxLength={500}
                      rows={3}
                      required
                    />
                    <p className='text-sm text-slate-500 mt-1'>
                      {(formData.excerpt || "").length}/500 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor='content'>Full Content *</Label>
                    <Textarea
                      id='content'
                      value={formData.content || ""}
                      onChange={(e) =>
                        handleInputChange("content", e.target.value)
                      }
                      placeholder='Full article content...'
                      rows={12}
                      maxLength={10000}
                      required
                    />
                    <p className='text-sm text-slate-500 mt-1'>
                      {(formData.content || "").length}/10000 characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Article Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Article Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='font-medium text-slate-600'>
                        Article ID:
                      </span>
                      <span className='ml-2 text-slate-800 font-mono'>
                        {press._id}
                      </span>
                    </div>
                    <div>
                      <span className='font-medium text-slate-600'>
                        Category:
                      </span>
                      <span className='ml-2 text-slate-800'>
                        {getCategoryName(press.category)}
                      </span>
                    </div>
                    <div>
                      <span className='font-medium text-slate-600'>
                        Images:
                      </span>
                      <span className='ml-2 text-slate-800'>
                        {press.images?.length || 0}
                      </span>
                    </div>
                    <div>
                      <span className='font-medium text-slate-600'>
                        Created:
                      </span>
                      <span className='ml-2 text-slate-800'>
                        {formatDate(press.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className='font-medium text-slate-600'>
                        Last Updated:
                      </span>
                      <span className='ml-2 text-slate-800'>
                        {formatDate(press.updatedAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className='flex justify-between items-center'>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  Cancel
                </Button>

                <div className='flex gap-3'>
                  <Button
                    type='submit'
                    disabled={updating || !hasChanges}
                    className='bg-orange-700'
                  >
                    {updating ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className='w-4 h-4 mr-2' />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Unsaved Changes Warning */}
              {hasChanges && (
                <Card className='border-amber-200 bg-amber-50'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2 text-amber-800'>
                      <AlertCircle className='w-4 h-4' />
                      <span className='text-sm font-medium'>
                        You have unsaved changes. Don't forget to save your
                        work!
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EditPress;
