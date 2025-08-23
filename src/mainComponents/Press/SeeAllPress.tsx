import React, { useState, useEffect } from "react";
import {
  Share2,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetPressQuery } from "@/redux-store/services/pressApi";
import { Press as PressType } from "@/types/press.types";
import { getCategoryColor } from "../Gallery/getColor";
import { getContentPreview } from "@/lib/helperfn";
import Footer from "../Footer";

const SeeAllPress = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [showFilters, setShowFilters] = useState(false);

  const articlesPerPage = 12;

  // Fetch press articles using Redux API
  const {
    data: pressData,
    isLoading,
    error,
    refetch,
  } = useGetPressQuery({
    page: currentPage,
    limit: articlesPerPage,
    search: searchQuery,
    category: selectedCategory,
    sortOrder,
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy !== "date") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (currentPage !== 1) params.set("page", currentPage.toString());

    setSearchParams(params);
  }, [
    searchQuery,
    selectedCategory,
    sortBy,
    sortOrder,
    currentPage,
    setSearchParams,
  ]);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedCategory, sortBy, sortOrder]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryName = (category: PressType["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category.name;
  };

  const handleShare = async (press: PressType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: press.title,
      url: `${window.location.origin}/press/${press._id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard?.writeText(shareData.url);
        alert("Press article link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      try {
        await navigator.clipboard?.writeText(shareData.url);
        alert("Press article link copied to clipboard!");
      } catch (clipboardError) {
        alert("Unable to share or copy link. Please copy the URL manually.");
      }
    }
  };

  const handlePressClick = (pressId: string) => {
    navigate(`/press/${pressId}`);
  };

  const handleBackToHome = () => {
    navigate("/", { state: { scrollTo: "press" } });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search will trigger automatically due to useEffect
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const pressArticles = pressData?.data?.press || [];
  const pagination = pressData?.data?.pagination;
  const totalPages = pagination
    ? Math.ceil(pagination.total / articlesPerPage)
    : 0;

  // Extract unique categories for filter dropdown
  const categories = [
    ...new Set(pressArticles.map((press) => getCategoryName(press.category))),
  ];

  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-50'>
        <div className='container mx-auto px-4 sm:px-6 py-8'>
          <div className='flex justify-center items-center py-20'>
            <div className='text-center'>
              <Loader2 className='w-12 h-12 animate-spin mx-auto mb-4 text-[#FF9933]' />
              <p className='text-muted-foreground text-lg'>
                Loading press articles...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-slate-50'>
        <div className='container mx-auto px-4 sm:px-6 py-8'>
          <div className='flex justify-center items-center py-20'>
            <div className='text-center'>
              <AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold mb-2'>
                Unable to Load Articles
              </h2>
              <p className='text-muted-foreground mb-6'>
                We're having trouble loading the press articles right now.
              </p>
              <div className='flex gap-4 justify-center'>
                <Button onClick={() => refetch()}>Try Again</Button>
                <Button variant='outline' onClick={handleBackToHome}>
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-slate-50'>
        <div className='container mx-auto px-4 sm:px-6 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-4 mb-6'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleBackToHome}
                className='flex items-center gap-2'
              >
                <ArrowLeft size={16} />
                Back to Home
              </Button>
            </div>

            <div className='text-center max-w-4xl mx-auto mb-8'>
              <div className='inline-block px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm mb-4'>
                All Press Coverage
              </div>
              <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-4'>
                Media Highlights
              </h1>
              <p className='text-muted-foreground text-lg'>
                Comprehensive collection of news articles and press coverage of
                our initiatives and accomplishments.
              </p>
              {pagination && (
                <p className='text-sm text-muted-foreground mt-2'>
                  {pagination.total} total articles
                </p>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className='bg-white rounded-lg shadow-sm border p-6 mb-8'>
            <div className='flex flex-col lg:flex-row gap-4'>
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className='flex-1'>
                <div className='relative'>
                  <Search
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={20}
                  />
                  <Input
                    type='text'
                    placeholder='Search press articles...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </form>

              {/* Filter Toggle */}
              <Button
                variant='outline'
                onClick={() => setShowFilters(!showFilters)}
                className='flex items-center gap-2'
              >
                <Filter size={16} />
                Filters
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className='mt-6 pt-6 border-t'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {/* Category Filter */}
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933]'
                    >
                      <option value=''>All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933]'
                    >
                      <option value='date'>Date</option>
                      <option value='title'>Title</option>
                      <option value='source'>Source</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Order
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) =>
                        setSortOrder(e.target.value as "asc" | "desc")
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933]'
                    >
                      <option value='desc'>Newest First</option>
                      <option value='asc'>Oldest First</option>
                    </select>
                  </div>
                </div>

                <div className='mt-4 flex gap-2'>
                  <Button variant='outline' size='sm' onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Press Articles Grid */}
          {pressArticles.length === 0 ? (
            <div className='text-center py-16'>
              <div className='max-w-md mx-auto'>
                <AlertCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-xl font-semibold mb-2'>
                  No Articles Found
                </h3>
                <p className='text-muted-foreground mb-6'>
                  {searchQuery || selectedCategory
                    ? "No press articles match your current filters. Try adjusting your search criteria."
                    : "No press articles are available at the moment."}
                </p>
                {(searchQuery || selectedCategory) && (
                  <Button variant='outline' onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
                {pressArticles.map((press: PressType) => {
                  const categoryName = getCategoryName(press.category);
                  const primaryImage = press.images?.[0];

                  return (
                    <div
                      key={press._id}
                      className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer'
                      onClick={() => handlePressClick(press._id)}
                    >
                      <div className='relative'>
                        {primaryImage ? (
                          <img
                            src={primaryImage.src}
                            alt={primaryImage.alt}
                            className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                          />
                        ) : (
                          <div className='w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                            <Calendar className='w-12 h-12 text-gray-400' />
                          </div>
                        )}

                        <div className='absolute top-2 left-2 bg-white py-1 px-2 text-xs rounded font-medium shadow-sm'>
                          {press.source}
                        </div>

                        <div className='absolute top-2 right-2'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              categoryName
                            )}`}
                          >
                            {categoryName.charAt(0).toUpperCase() +
                              categoryName.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className='p-4'>
                        <h3 className='font-semibold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-[#FF9933] transition-colors'>
                          {press.title}
                        </h3>

                        <p className='text-gray-600 text-sm line-clamp-3 mb-3'>
                          {getContentPreview(press.content)}
                        </p>

                        <div className='flex items-center justify-between text-xs text-gray-500 mb-3'>
                          <span>{press.readTime}</span>
                          <span>{formatDate(press.date)}</span>
                        </div>

                        <div className='flex justify-between items-center'>
                          <div className='flex-1' />
                          <button
                            className='text-gray-500 hover:text-[#FF9933] transition-colors p-2 -m-2'
                            aria-label='Share article'
                            onClick={(e) => handleShare(press, e)}
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && totalPages > 1 && (
                <div className='flex justify-center items-center gap-2 mt-12'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className='flex gap-1'>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size='sm'
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-[#FF9933] hover:bg-[#FF9933]/90 border-[#FF9933]"
                              : ""
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Results Info */}
              {pagination && (
                <div className='text-center mt-6'>
                  <p className='text-sm text-muted-foreground'>
                    Showing {(currentPage - 1) * articlesPerPage + 1} to{" "}
                    {Math.min(currentPage * articlesPerPage, pagination.total)}{" "}
                    of {pagination.total} articles
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SeeAllPress;
