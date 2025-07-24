import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Building,
  ExternalLink,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Share2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetPressByIdQuery,
  useDeletePressArticleMutation,
} from "@/redux-store/services/pressApi";

const ReadPress = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Redirect if no ID provided
  if (!id) {
    return <Navigate to='/admin/press' />;
  }

  const { data: pressData, isLoading, error } = useGetPressByIdQuery(id);

  const [deletePress, { isLoading: deleting }] =
    useDeletePressArticleMutation();

  const press = pressData?.data?.press;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  const handleDelete = async () => {
    if (!press) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this press article? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await deletePress(press._id).unwrap();
        navigate("/admin/press");
      } catch (error: any) {
        console.error("Delete failed:", error);
        alert(error.data?.message || "Failed to delete press article");
      }
    }
  };

  const handleEdit = () => {
    if (press) {
      navigate(`/admin/press/edit/${press._id}`);
    }
  };

  const handleExternalLink = () => {
    if (press?.link) {
      window.open(press.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = async () => {
    if (press && navigator.share) {
      try {
        await navigator.share({
          title: press.title,
          text: press.excerpt,
          url: press.link,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else if (press) {
      // Fallback to clipboard
      navigator.clipboard.writeText(press.link);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
          <p className='text-slate-600'>Loading press article...</p>
        </div>
      </div>
    );
  }

  if (error || !press) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center'>
        <Card className='max-w-md'>
          <CardContent className='p-6 text-center'>
            <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-slate-800 mb-2'>
              Article Not Found
            </h2>
            <p className='text-slate-600 mb-4'>
              The press article you're looking for doesn't exist or has been
              removed.
            </p>
            <Button onClick={() => navigate("/admin/press")}>
              Back to Press Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur'>
        <div className='container flex h-16 items-center justify-between'>
          <Button
            onClick={() => navigate("/admin/press")}
            variant='ghost'
            className='flex items-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Press Dashboard
          </Button>

          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={handleShare}>
              <Share2 className='w-4 h-4 mr-1' />
              Share
            </Button>
            <Button variant='outline' size='sm' onClick={handleEdit}>
              <Edit className='w-4 h-4 mr-1' />
              Edit
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleDelete}
              disabled={deleting}
              className='text-red-600 hover:text-red-700'
            >
              {deleting ? (
                <Loader2 className='w-4 h-4 mr-1 animate-spin' />
              ) : (
                <Trash2 className='w-4 h-4 mr-1' />
              )}
              Delete
            </Button>
          </div>
        </div>
      </header>

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='max-w-4xl mx-auto p-4 py-8'>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-8'
          >
            {/* Article Header */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Badge className={getCategoryColor(press.category)}>
                  {press.category.charAt(0).toUpperCase() +
                    press.category.slice(1)}
                </Badge>
                {!press.isActive && (
                  <Badge
                    variant='secondary'
                    className='bg-gray-100 text-gray-600'
                  >
                    Inactive
                  </Badge>
                )}
              </div>

              <h1 className='text-3xl md:text-4xl font-bold text-slate-800 leading-tight'>
                {press.title}
              </h1>

              <p className='text-lg text-slate-600 leading-relaxed'>
                {press.excerpt}
              </p>

              {/* Meta Information */}
              <div className='flex flex-wrap items-center gap-6 text-sm text-slate-500'>
                <div className='flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  <span className='font-medium'>{press.author}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Building className='w-4 h-4' />
                  <span>{press.source}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <span>{formatDate(press.date)}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Clock className='w-4 h-4' />
                  <span>{press.readTime}</span>
                </div>
              </div>

              <Separator />
            </div>

            {/* Featured Image */}
            <div className='w-full h-64 md:h-96 bg-gray-100 rounded-xl overflow-hidden'>
              <img
                src={press.image}
                alt={press.title}
                className='w-full h-full object-cover'
              />
            </div>

            {/* Article Content */}
            <Card>
              <CardContent className='p-8'>
                <div className='prose prose-slate max-w-none'>
                  <div className='whitespace-pre-wrap text-slate-700 leading-relaxed'>
                    {press.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Actions */}
            <Card>
              <CardContent className='p-6'>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                  <div className='flex items-center gap-2 text-sm text-slate-600'>
                    <Calendar className='w-4 h-4' />
                    <span>Published: {formatDate(press.date)}</span>
                    {press.createdAt && (
                      <>
                        <span>•</span>
                        <span>Added: {formatDate(press.createdAt)}</span>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={handleExternalLink}
                    className='bg-gradient-to-r from-[#FF9933] to-[#138808] hover:from-[#FF9933]/90 hover:to-[#138808]/90'
                  >
                    <ExternalLink className='w-4 h-4 mr-2' />
                    Read Original Article
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Article Metadata */}
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold text-slate-800 mb-4'>
                  Article Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='font-medium text-slate-600'>ID:</span>
                    <span className='ml-2 text-slate-800 font-mono'>
                      {press._id}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-slate-600'>Status:</span>
                    <span className='ml-2'>
                      <Badge variant={press.isActive ? "default" : "secondary"}>
                        {press.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </span>
                  </div>
                  {press.imagePublicId && (
                    <div>
                      <span className='font-medium text-slate-600'>
                        Image ID:
                      </span>
                      <span className='ml-2 text-slate-800 font-mono'>
                        {press.imagePublicId}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className='font-medium text-slate-600'>Created:</span>
                    <span className='ml-2 text-slate-800'>
                      {press.createdAt ? formatDate(press.createdAt) : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-slate-600'>Updated:</span>
                    <span className='ml-2 text-slate-800'>
                      {press.updatedAt ? formatDate(press.updatedAt) : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-slate-600'>
                      Original Link:
                    </span>
                    <a
                      href={press.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='ml-2 text-blue-600 hover:text-blue-800 underline break-all'
                    >
                      {press.link}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.article>
        </div>
      </div>
    </>
  );
};

export default ReadPress;
