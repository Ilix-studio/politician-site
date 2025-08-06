import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Upload,
  Save,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Plus,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useCreatePressMutation,
  useUploadPressMutation,
} from "@/redux-store/services/pressApi";
import {
  useGetCategoriesByTypeQuery,
  useCreateCategoryMutation,
} from "@/redux-store/services/categoryApi";
import { PressCreateData } from "@/types/press.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";
import toast from "react-hot-toast";

const AddPress = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const [formData, setFormData] = useState<
    Omit<PressCreateData, "images"> & { images?: any }
  >({
    title: "",
    source: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    readTime: "",
    content: "",
  });

  const [urlFormData, setUrlFormData] = useState({
    imageUrl: "",
    alt: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");

  // Category management state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // API hooks
  const {
    data: pressCategories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesByTypeQuery("press");
  const [createPress, { isLoading: creating }] = useCreatePressMutation();
  const [uploadPress, { isLoading: uploading }] = useUploadPressMutation();
  const [createCategory, { isLoading: creatingCategory }] =
    useCreateCategoryMutation();

  // Debug logging
  console.log("Press categories:", pressCategories);
  console.log("Categories loading:", categoriesLoading);
  console.log("Categories error:", categoriesError);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        type: "press",
      }).unwrap();

      console.log("Created category:", result);
      toast.success("Category created successfully");
      setNewCategoryName("");
      setShowAddCategory(false);

      // Auto-select the newly created category
      setFormData((prev) => ({ ...prev, category: result._id }));
    } catch (error: any) {
      console.error("Create category error:", error);
      toast.error(
        error?.data?.message || error?.message || "Failed to create category"
      );
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setUrlFormData((prev) => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      if (uploadMethod === "upload" && selectedFile) {
        // Upload with file - using correct field structure
        const uploadData = {
          title: formData.title,
          source: formData.source,
          date: formData.date,
          category: formData.category,
          readTime: formData.readTime,
          content: formData.content,
          alt: urlFormData.alt || formData.title,
        };

        await uploadPress({ file: selectedFile, data: uploadData }).unwrap();
      } else if (uploadMethod === "url" && urlFormData.imageUrl) {
        // Create with URL
        const createData: PressCreateData = {
          ...formData,
          images: [
            {
              src: urlFormData.imageUrl,
              alt: urlFormData.alt || formData.title,
              cloudinaryPublicId: "", // Will be empty for URL method
            },
          ],
        };

        await createPress(createData).unwrap();
      } else {
        toast.error(
          "Please provide an image either by uploading a file or entering a URL"
        );
        return;
      }

      toast.success("Press article created successfully!");
      navigate("/admin/pressDashboard");
    } catch (error: any) {
      console.error("Failed to create press article:", error);
      toast.error(error.data?.message || "Failed to create press article");
    }
  };

  const isLoading = creating || uploading;

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
                Add Press Article
              </h1>
              <p className='text-slate-600 mt-1'>
                Create a new press article entry
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <FileText className='w-5 h-5' />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='title'>Title *</Label>
                      <Input
                        id='title'
                        value={formData.title}
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
                        value={formData.source}
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
                      <Label htmlFor='date'>Date *</Label>
                      <Input
                        id='date'
                        type='date'
                        value={formData.date}
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
                        value={formData.readTime}
                        onChange={(e) =>
                          handleInputChange("readTime", e.target.value)
                        }
                        placeholder='e.g., 5 min'
                        required
                      />
                    </div>
                  </div>

                  {/* Category with Add Button */}
                  <div>
                    <Label htmlFor='category'>Category *</Label>
                    <div className='flex gap-2'>
                      <select
                        id='category'
                        name='category'
                        value={formData.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className='flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        required
                        disabled={categoriesLoading}
                      >
                        <option value=''>
                          {categoriesLoading
                            ? "Loading categories..."
                            : pressCategories?.length === 0
                            ? "No categories available"
                            : "Select category"}
                        </option>
                        {!categoriesLoading &&
                          !categoriesError &&
                          pressCategories?.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                      <Button
                        type='button'
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        className='px-3 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1'
                        title='Add new category'
                      >
                        <Plus className='w-4 h-4' />
                      </Button>
                    </div>

                    {/* Add Category Input */}
                    {showAddCategory && (
                      <div className='mt-2 p-3 bg-gray-50 rounded-lg border'>
                        <div className='flex gap-2'>
                          <Input
                            type='text'
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder='Enter category name'
                            className='flex-1'
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleCreateCategory()
                            }
                          />
                          <Button
                            type='button'
                            onClick={handleCreateCategory}
                            disabled={creatingCategory}
                            className='px-3 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1'
                          >
                            {creatingCategory ? (
                              <Loader2 className='w-4 h-4 animate-spin' />
                            ) : (
                              <Check className='w-4 h-4' />
                            )}
                          </Button>
                          <Button
                            type='button'
                            onClick={() => {
                              setShowAddCategory(false);
                              setNewCategoryName("");
                            }}
                            className='px-3 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors'
                          >
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    )}

                    {categoriesError && (
                      <p className='text-sm text-red-500 mt-1'>
                        Failed to load categories. Please refresh and try again.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <ImageIcon className='w-5 h-5' />
                    Article Image
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Upload Method Toggle */}
                  <div className='flex gap-4'>
                    <Button
                      type='button'
                      variant={
                        uploadMethod === "upload" ? "default" : "outline"
                      }
                      onClick={() => setUploadMethod("upload")}
                      className='flex items-center gap-2'
                    >
                      <Upload className='w-4 h-4' />
                      Upload File
                    </Button>
                    <Button
                      type='button'
                      variant={uploadMethod === "url" ? "default" : "outline"}
                      onClick={() => setUploadMethod("url")}
                      className='flex items-center gap-2'
                    >
                      <LinkIcon className='w-4 h-4' />
                      Image URL
                    </Button>
                  </div>

                  {uploadMethod === "upload" ? (
                    <div>
                      <Label htmlFor='imageFile'>Upload Image</Label>
                      <Input
                        id='imageFile'
                        type='file'
                        accept='image/*'
                        onChange={handleFileSelect}
                        className='file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100'
                      />
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='imageUrl'>Image URL</Label>
                        <Input
                          id='imageUrl'
                          type='url'
                          value={urlFormData.imageUrl}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          placeholder='https://example.com/image.jpg'
                        />
                      </div>
                      <div>
                        <Label htmlFor='alt'>Image Alt Text</Label>
                        <Input
                          id='alt'
                          value={urlFormData.alt}
                          onChange={(e) =>
                            setUrlFormData((prev) => ({
                              ...prev,
                              alt: e.target.value,
                            }))
                          }
                          placeholder='Describe the image (optional)'
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className='mt-4'>
                      <Label>Preview</Label>
                      <div className='mt-2 w-full h-48 bg-gray-100 rounded-lg overflow-hidden'>
                        <img
                          src={imagePreview}
                          alt='Preview'
                          className='w-full h-full object-cover'
                        />
                      </div>
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
                    <Label htmlFor='content'>Full Content *</Label>
                    <Textarea
                      id='content'
                      value={formData.content}
                      onChange={(e) =>
                        handleInputChange("content", e.target.value)
                      }
                      placeholder='Full article content...'
                      rows={10}
                      maxLength={10000}
                      required
                    />
                    <p className='text-sm text-slate-500 mt-1'>
                      {formData.content.length}/10000 characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className='flex justify-end gap-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate("/admin/pressDashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='bg-gradient-to-r from-[#FF9933] to-[#138808] hover:from-[#FF9933]/90 hover:to-[#138808]/90'
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className='w-4 h-4 mr-2' />
                      Create Article
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AddPress;
