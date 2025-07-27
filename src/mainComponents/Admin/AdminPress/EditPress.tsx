import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Loader2,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetPressByIdQuery,
  useUpdatePressArticleMutation,
  useGetPressCategoriesQuery,
} from "@/redux-store/services/pressApi";
import { PressUpdateData } from "@/types/press.types";
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
    image: "",
    link: "",
    category: "other",
    author: "",
    readTime: "",
    content: "",
    excerpt: "",
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);

  // API hooks
  const {
    data: pressData,
    isLoading: loadingPress,
    error: pressError,
  } = useGetPressByIdQuery(id || "", { skip: !id });

  const { data: categoriesData } = useGetPressCategoriesQuery();
  const [updatePress, { isLoading: updating }] =
    useUpdatePressArticleMutation();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  if (!id) {
    return <Navigate to='/admin/dashboard' />;
  }

  // Populate form when press data loads
  useEffect(() => {
    if (pressData?.data?.press) {
      const press = pressData.data.press;
      const formattedDate = new Date(press.date).toISOString().split("T")[0];

      setFormData({
        title: press.title,
        source: press.source,
        date: formattedDate,
        image: press.image,
        link: press.link,
        author: press.author,
        readTime: press.readTime,
        content: press.content,
        excerpt: press.excerpt,
        isActive: press.isActive,
      });
      setImagePreview(press.image);
    }
  }, [pressData]);

  const handleInputChange = (
    field: keyof PressUpdateData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);

    // Update image preview if image URL changes
    if (field === "image" && typeof value === "string") {
      setImagePreview(value);
    }
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

  if (pressError || !pressData?.data?.press) {
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

  const press = pressData.data.press;

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
              <h1 className='text-3xl font-bold text-slate-800'>
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
                    <div className='flex items-center gap-2'>
                      <Label htmlFor='isActive' className='text-sm font-medium'>
                        Active
                      </Label>
                      <Switch
                        id='isActive'
                        checked={formData.isActive}
                        onCheckedChange={(checked) =>
                          handleInputChange("isActive", checked)
                        }
                      />
                    </div>
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

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='category'>Category *</Label>
                      <Select
                        value={formData.category || "other"}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesData?.data.categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor='link'>Original Article Link *</Label>
                      <Input
                        id='link'
                        type='url'
                        value={formData.link || ""}
                        onChange={(e) =>
                          handleInputChange("link", e.target.value)
                        }
                        placeholder='https://...'
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <ImageIcon className='w-5 h-5' />
                    Article Image
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='imageUrl'>Image URL</Label>
                    <Input
                      id='imageUrl'
                      type='url'
                      value={formData.image || ""}
                      onChange={(e) =>
                        handleInputChange("image", e.target.value)
                      }
                      placeholder='https://example.com/image.jpg'
                    />
                  </div>

                  {/* Current Image Preview */}
                  {imagePreview && (
                    <div className='space-y-2'>
                      <Label>Current Image</Label>
                      <div className='w-full h-48 bg-gray-100 rounded-lg overflow-hidden'>
                        <img
                          src={imagePreview}
                          alt='Article preview'
                          className='w-full h-full object-cover'
                          onError={() => setImagePreview("")}
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Info */}
                  {press.imagePublicId && (
                    <div className='text-sm text-slate-600'>
                      <span className='font-medium'>Image ID:</span>
                      <span className='ml-2 font-mono'>
                        {press.imagePublicId}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                    <div>
                      <span className='font-medium text-slate-600'>
                        Status:
                      </span>
                      <span className='ml-2'>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            formData.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {formData.isActive ? "Active" : "Inactive"}
                        </span>
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
                    type='button'
                    variant='outline'
                    onClick={() => navigate(`/admin/read/${id}`)}
                  >
                    <Eye className='w-4 h-4 mr-2' />
                    Preview
                  </Button>
                  <Button
                    type='submit'
                    disabled={updating || !hasChanges}
                    className='bg-gradient-to-r from-[#FF9933] to-[#138808] hover:from-[#FF9933]/90 hover:to-[#138808]/90'
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
