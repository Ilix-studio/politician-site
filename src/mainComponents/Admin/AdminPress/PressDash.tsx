import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
  Loader2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetPressQuery,
  useDeletePressMutation,
} from "@/redux-store/services/pressApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { PressQueryParams, Press } from "@/types/press.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const PressDash = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const [queryParams, setQueryParams] = useState<PressQueryParams>({
    page: 1,
    limit: 10,
    category: "",
    search: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  // API hooks
  const {
    data: pressData,
    isLoading,
    error,
    refetch,
  } = useGetPressQuery(queryParams);

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesByTypeQuery("press");

  const [deletePress, { isLoading: deleting }] = useDeletePressMutation();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Handle error state
  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <Alert className='max-w-md mx-auto mt-8' variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load press articles. Please try again.
          </AlertDescription>
        </Alert>
        <div className='flex justify-center mt-4'>
          <Button onClick={() => refetch()} variant='outline'>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this press article?")) return;

    try {
      await deletePress(id).unwrap();
      refetch();
    } catch (error: any) {
      console.error("Delete failed:", error.data?.message || "Delete failed");
    }
  };

  const handleSearch = (search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setQueryParams((prev) => ({
      ...prev,
      category: categoryId === "all" ? "" : categoryId,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleAddPress = () => {
    navigate("/admin/addPress");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryName = (category: Press["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category.name;
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      politics: "bg-red-100 text-red-800",
      economy: "bg-green-100 text-green-800",
      development: "bg-blue-100 text-blue-800",
      social: "bg-purple-100 text-purple-800",
      environment: "bg-emerald-100 text-emerald-800",
      education: "bg-yellow-100 text-yellow-800",
      healthcare: "bg-pink-100 text-pink-800",
      infrastructure: "bg-gray-100 text-gray-800",
      other: "bg-orange-100 text-orange-800",
    };
    return colors[categoryName.toLowerCase()] || colors.other;
  };

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Page Header */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div>
              <h1 className='text-2xl font-bold text-slate-800'>
                Press Dashboard
              </h1>
              <p className='text-slate-600 mt-1'>
                Manage press articles and media coverage
              </p>
            </div>
          </div>

          {/* Stats Card */}
          <Card>
            <CardContent className='pt-6'>
              <div className='grid grid-cols-3 md:grid-cols-3 gap-4 text-center'>
                <div>
                  <h3 className='text-2xl font-bold text-blue-600'>
                    {pressData?.data.pagination.total || 0}
                  </h3>
                  <p className='text-sm text-gray-600'>Total Articles</p>
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-green-600'>
                    {categories.length}
                  </h3>
                  <p className='text-sm text-gray-600'>Categories</p>
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-purple-600'>
                    {pressData?.data.press.filter(
                      (p) =>
                        new Date(p.date).getMonth() === new Date().getMonth()
                    ).length || 0}
                  </h3>
                  <p className='text-sm text-gray-600'>This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input
                      placeholder='Search press articles...'
                      value={queryParams.search || ""}
                      onChange={(e) => handleSearch(e.target.value)}
                      className='pl-10'
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Select
                  value={queryParams.category || "all"}
                  onValueChange={handleCategoryFilter}
                  disabled={isLoading || categoriesLoading}
                >
                  <SelectTrigger className='w-48'>
                    <SelectValue placeholder='Filter by category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Press Articles */}
          {isLoading ? (
            <div className='flex justify-center items-center py-8'>
              <Loader2 className='w-8 h-8 animate-spin' />
            </div>
          ) : pressData?.data.press.length === 0 ? (
            <Card>
              <CardContent className='text-center py-12'>
                <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 mb-4'>No press articles found.</p>
                <Button onClick={handleAddPress} variant='outline'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Your First Press Article
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className='grid gap-6'>
              {pressData?.data.press.map((press: Press) => (
                <motion.div
                  key={press._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow'
                >
                  <div className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-6'>
                      {/* Image */}
                      <div className='lg:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                        {press.images?.[0] && (
                          <img
                            src={press.images[0].src}
                            alt={press.images[0].alt}
                            className='w-full h-full object-cover'
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className='flex-1 space-y-3'>
                        <div className='flex flex-wrap items-start justify-between gap-2'>
                          <h3 className='text-lg font-semibold text-slate-800 line-clamp-2'>
                            {press.title}
                          </h3>
                          <Badge
                            className={getCategoryColor(
                              getCategoryName(press.category)
                            )}
                          >
                            {getCategoryName(press.category)}
                          </Badge>
                        </div>

                        <div className='flex flex-wrap items-center gap-4 text-sm text-slate-500'>
                          <span>By {press.author}</span>
                          <span>•</span>
                          <span>{press.source}</span>
                          <span>•</span>
                          <span>{formatDate(press.date)}</span>
                          <span>•</span>
                          <span>{press.readTime}</span>
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-2 pt-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => navigate(`/admin/read/${press._id}`)}
                          >
                            <Eye className='w-4 h-4 mr-1' />
                            View
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              navigate(`/admin/editPress/${press._id}`)
                            }
                          >
                            <Edit className='w-4 h-4 mr-1' />
                            Edit
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDelete(press._id)}
                            disabled={deleting}
                            className='text-red-600 hover:text-red-700'
                          >
                            <Trash2 className='w-4 h-4 mr-1' />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading &&
            pressData?.data.pagination &&
            pressData.data.pagination.pages > 1 && (
              <div className='flex justify-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(queryParams.page! - 1)}
                  disabled={!pressData.data.pagination.hasPrev}
                >
                  Previous
                </Button>

                {Array.from(
                  { length: Math.min(pressData.data.pagination.pages, 5) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={
                          queryParams.page === page ? "default" : "outline"
                        }
                        size='sm'
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  }
                )}

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(queryParams.page! + 1)}
                  disabled={!pressData.data.pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default PressDash;
