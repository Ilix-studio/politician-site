import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  MessageCircle,
  Loader2,
  AlertCircle,
  Trash2,
  Reply,
  BookMarked,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetContactMessageByIdQuery,
  useMarkMessageAsReadMutation,
  useDeleteContactMessageMutation,
} from "@/redux-store/services/contactApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ViewMessage = () => {
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
    return <Navigate to='/admin/messages' />;
  }

  const {
    data: messageData,
    isLoading,
    error,
    refetch,
  } = useGetContactMessageByIdQuery(id);

  const [markAsRead, { isLoading: markingAsRead }] =
    useMarkMessageAsReadMutation();
  const [deleteMessage, { isLoading: deleting }] =
    useDeleteContactMessageMutation();

  const handleMarkAsRead = async () => {
    if (!messageData?.data) return;

    try {
      await markAsRead({
        id: messageData.data._id,
        isRead: !messageData.data.isRead,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update message status:", error);
    }
  };

  const handleDelete = async () => {
    if (!messageData?.data) return;

    try {
      await deleteMessage(messageData.data._id).unwrap();
      navigate("/admin/messages"); // Navigate back to messages list
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleReply = () => {
    if (messageData?.data?.email) {
      window.location.href = `mailto:${messageData.data.email}?subject=Re: ${messageData.data.subject}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const messageDate = new Date(dateString);
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
        <div className='container py-6 px-4 sm:px-6'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <Loader2 className='w-8 h-8 animate-spin text-[#FF9933] mx-auto mb-4' />
              <p className='text-gray-600'>Loading message...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
        <div className='container py-6 px-4 sm:px-6'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <Card className='w-full max-w-md'>
              <CardContent className='p-6 text-center'>
                <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>
                  Message Not Found
                </h3>
                <p className='text-gray-600 mb-4'>
                  The message you're looking for doesn't exist or has been
                  deleted.
                </p>
                <div className='flex gap-2 justify-center'>
                  <Button
                    onClick={() => navigate("/admin/messages")}
                    variant='outline'
                  >
                    Back to Messages
                  </Button>
                  <Button onClick={refetch}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const message = messageData?.data;

  if (!message) {
    return <Navigate to='/admin/messages' />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                onClick={() => navigate("/admin/messages")}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='w-4 h-4' />
                Back to Messages
              </Button>
              <Separator orientation='vertical' className='h-6' />
              <div>
                <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                  <MessageCircle className='w-6 h-6 text-[#FF9933]' />
                  Message Details
                </h1>
                <p className='text-gray-600 text-sm'>
                  View and manage this contact message
                </p>
              </div>
            </div>
            <Badge
              variant={message.isRead ? "secondary" : "destructive"}
              className='text-sm'
            >
              {message.isRead ? "Read" : "Unread"}
            </Badge>
          </div>
        </div>
      </div>

      <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
        {/* Message Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className='mb-6'>
            <CardHeader className='pb-4'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <CardTitle className='text-xl mb-2 flex items-center gap-2'>
                    <User className='w-5 h-5 text-[#FF9933]' />
                    {message.name}
                  </CardTitle>
                  <div className='space-y-2'>
                    <p className='text-gray-600 flex items-center gap-2'>
                      <Mail className='w-4 h-4' />
                      <a
                        href={`mailto:${message.email}`}
                        className='hover:text-[#FF9933] transition-colors'
                      >
                        {message.email}
                      </a>
                    </p>
                    <p className='text-gray-600 flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      {formatDate(message.createdAt)}
                    </p>
                    <p className='text-gray-500 flex items-center gap-2 text-sm'>
                      <Clock className='w-4 h-4' />
                      {formatTimeAgo(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-2'>
                    Subject
                  </label>
                  <div className='p-3 bg-gray-50 rounded-lg border'>
                    <p className='font-medium'>{message.subject}</p>
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-2'>
                    Message
                  </label>
                  <div className='p-4 bg-gray-50 rounded-lg border min-h-[120px]'>
                    <p className='whitespace-pre-wrap leading-relaxed'>
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-3'>
                <Button
                  onClick={handleReply}
                  className='bg-[#138808] hover:bg-[#138808]/90'
                >
                  <Reply className='w-4 h-4 mr-2' />
                  Reply via Email
                </Button>

                <Button
                  onClick={handleMarkAsRead}
                  disabled={markingAsRead}
                  variant='outline'
                >
                  {markingAsRead ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <BookMarked className='w-4 h-4 mr-2' />
                  )}
                  {message.isRead ? "Mark as Unread" : "Mark as Read"}
                </Button>

                <Button
                  onClick={() => navigate("/admin/messages")}
                  variant='outline'
                >
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  All Messages
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive' disabled={deleting}>
                      {deleting ? (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      ) : (
                        <Trash2 className='w-4 h-4 mr-2' />
                      )}
                      Delete Message
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Message</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this message from{" "}
                        {message.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className='bg-red-600 hover:bg-red-700'
                      >
                        Delete Message
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewMessage;
