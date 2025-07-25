import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  LogOut,
  Calendar,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuth,
  selectIsAdmin,
  logout,
} from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetPressQuery,
  useGetPressCategoriesQuery,
  useDeletePressArticleMutation,
} from "@/redux-store/services/pressApi";
import { PressQueryParams, PressDocument } from "@/types/press.types";

const PressDash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const [queryParams, setQueryParams] = useState<PressQueryParams>({
    page: "1",
    limit: "10",
    category: "all",
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

  const { data: categoriesData } = useGetPressCategoriesQuery();

  const [deletePress, { isLoading: deleting }] =
    useDeletePressArticleMutation();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryParams((prev) => ({ ...prev, page: "1" }));
  };

  const handleCategoryFilter = (category: string) => {
    setQueryParams((prev) => ({ ...prev, category, page: "1" }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page: page.toString() }));
  };

  // const formatDate = (date: string) => {
  //   return new Date(date).toLocaleDateString();
  // };

  const getCategoryColor = (category: string) => {
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
    return colors[category] || colors.other;
  };

  return (
    <>
      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              onClick={() => navigate("/admin/dashboard")}
              variant='ghost'
              className='flex items-center gap-2'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Dashboard
            </Button>
          </div>

          <Button
            onClick={() => dispatch(logout())}
            variant='ghost'
            className='flex items-center gap-2 text-red-600 hover:text-red-700'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </Button>
        </div>
      </header>

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Page Header */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-slate-800'>
                Press Dashboard
              </h1>
              <p className='text-slate-600 mt-1'>
                Manage press articles and media coverage
              </p>
            </div>

            <Button
              onClick={() => navigate("/admin/addPress")}
              className='bg-gradient-to-r from-[#FF9933] to-[#138808] hover:from-[#FF9933]/90 hover:to-[#138808]/90'
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Press Article
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex flex-col lg:flex-row gap-4'>
                {/* Search */}
                <form onSubmit={handleSearch} className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <Input
                      placeholder='Search press articles...'
                      value={queryParams.search || ""}
                      onChange={(e) =>
                        setQueryParams((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      className='pl-10'
                    />
                  </div>
                </form>

                {/* Category Filter */}
                <div className='flex flex-wrap gap-2'>
                  <Button
                    variant={
                      queryParams.category === "all" ? "default" : "outline"
                    }
                    size='sm'
                    onClick={() => handleCategoryFilter("all")}
                  >
                    All
                  </Button>
                  {categoriesData?.data.categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        queryParams.category === category
                          ? "default"
                          : "outline"
                      }
                      size='sm'
                      onClick={() => handleCategoryFilter(category)}
                      className='capitalize'
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center gap-3'>
                  <FileText className='w-8 h-8 text-blue-600' />
                  <div>
                    <p className='text-sm text-slate-600'>Total Articles</p>
                    <p className='text-2xl font-bold'>
                      {pressData?.data.pagination.totalPress || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center gap-3'>
                  <Calendar className='w-8 h-8 text-green-600' />
                  <div>
                    <p className='text-sm text-slate-600'>This Month</p>
                    <p className='text-2xl font-bold'>
                      {pressData?.data.press.filter(
                        (p) =>
                          new Date(p.date).getMonth() === new Date().getMonth()
                      ).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center gap-3'>
                  <Filter className='w-8 h-8 text-purple-600' />
                  <div>
                    <p className='text-sm text-slate-600'>Categories</p>
                    <p className='text-2xl font-bold'>
                      {categoriesData?.data.categories.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Press Articles */}
          {isLoading ? (
            <div className='flex justify-center items-center py-8'>
              <Loader2 className='w-8 h-8 animate-spin' />
            </div>
          ) : error ? (
            <Card>
              <CardContent className='p-6 text-center'>
                <p className='text-red-600'>Error loading press articles</p>
              </CardContent>
            </Card>
          ) : (
            <div className='grid gap-6'>
              {pressData?.data.press.map((press: PressDocument) => (
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
                        <img
                          src={press.image}
                          alt={press.title}
                          className='w-full h-full object-cover'
                        />
                      </div>

                      {/* Content */}
                      <div className='flex-1 space-y-3'>
                        <div className='flex flex-wrap items-start justify-between gap-2'>
                          <h3 className='text-lg font-semibold text-slate-800 line-clamp-2'>
                            {press.title}
                          </h3>
                          <Badge className={getCategoryColor(press.category)}>
                            {press.category}
                          </Badge>
                        </div>

                        <p className='text-slate-600 line-clamp-2'>
                          {press.excerpt}
                        </p>

                        <div className='flex flex-wrap items-center gap-4 text-sm text-slate-500'>
                          <span>By {press.author}</span>
                          <span>•</span>
                          <span>{press.source}</span>
                          <span>•</span>
                          {/* <span>{formatDate(press.date)}</span> */}
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
                            onClick={() => window.open(press.link, "_blank")}
                          >
                            <ExternalLink className='w-4 h-4 mr-1' />
                            Original
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
          {pressData?.data.pagination &&
            pressData.data.pagination.totalPages > 1 && (
              <div className='flex justify-center gap-2'>
                <Button
                  variant='outline'
                  disabled={!pressData.data.pagination.hasPrevPage}
                  onClick={() =>
                    handlePageChange(pressData.data.pagination.currentPage - 1)
                  }
                >
                  Previous
                </Button>

                {Array.from(
                  { length: pressData.data.pagination.totalPages },
                  (_, i) => (
                    <Button
                      key={i + 1}
                      variant={
                        pressData.data.pagination.currentPage === i + 1
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  )
                )}

                <Button
                  variant='outline'
                  disabled={!pressData.data.pagination.hasNextPage}
                  onClick={() =>
                    handlePageChange(pressData.data.pagination.currentPage + 1)
                  }
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
