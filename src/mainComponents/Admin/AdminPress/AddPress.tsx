import { useState } from "react";
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
  Upload,
  Save,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useCreatePressArticleMutation,
  useUploadPressArticleMutation,
  useGetPressCategoriesQuery,
} from "@/redux-store/services/pressApi";
import { PressCreateData } from "@/types/press.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const AddPress = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const [formData, setFormData] = useState<PressCreateData>({
    title: "",
    source: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
    link: "",
    category: "other",
    author: "",
    readTime: "",
    content: "",
    excerpt: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");

  // API hooks
  const { data: categoriesData } = useGetPressCategoriesQuery();
  const [createPress, { isLoading: creating }] =
    useCreatePressArticleMutation();
  const [uploadPress, { isLoading: uploading }] =
    useUploadPressArticleMutation();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleInputChange = (field: keyof PressCreateData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    setFormData((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (uploadMethod === "upload" && selectedFile) {
        // Upload with file
        const uploadFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== "image") {
            uploadFormData.append(key, value);
          }
        });
        uploadFormData.append("image", selectedFile);

        await uploadPress({ formData: uploadFormData }).unwrap();
      } else if (uploadMethod === "url" && formData.image) {
        // Create with URL
        await createPress(formData).unwrap();
      } else {
        alert(
          "Please provide an image either by uploading a file or entering a URL"
        );
        return;
      }

      navigate("/admin/pressDashboard");
    } catch (error: any) {
      console.error("Failed to create press article:", error);
      alert(error.data?.message || "Failed to create press article");
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
              <h1 className='text-3xl font-bold text-slate-800'>
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
                      <Label htmlFor='author'>Author *</Label>
                      <Input
                        id='author'
                        value={formData.author}
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
                        value={formData.link}
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
                    <div>
                      <Label htmlFor='imageUrl'>Image URL</Label>
                      <Input
                        id='imageUrl'
                        type='url'
                        value={formData.image}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder='https://example.com/image.jpg'
                      />
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
                    <Label htmlFor='excerpt'>Excerpt *</Label>
                    <Textarea
                      id='excerpt'
                      value={formData.excerpt}
                      onChange={(e) =>
                        handleInputChange("excerpt", e.target.value)
                      }
                      placeholder='Brief summary of the article (max 500 characters)'
                      maxLength={500}
                      rows={3}
                      required
                    />
                    <p className='text-sm text-slate-500 mt-1'>
                      {formData.excerpt.length}/500 characters
                    </p>
                  </div>

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
