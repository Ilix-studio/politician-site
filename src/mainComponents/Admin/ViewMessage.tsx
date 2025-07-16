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
  BookMarkedIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetContactMessageByIdQuery,
  useMarkMessageAsReadMutation,
  useDeleteContactMessageMutation,
} from "@/redux-store/services/contactApi";

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
    return <Navigate to='/admin/dashboard' />;
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

    const confirmed = window.confirm(
      "Are you sure you want to delete this message? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await deleteMessage(messageData.data._id).unwrap();
        navigate("/admin/dashboard");
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
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

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
              <p className='text-muted-foreground'>Loading message...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <Card className='w-full max-w-md'>
              <CardContent className='p-6 text-center'>
                <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>
                  Message Not Found
                </h3>
                <p className='text-muted-foreground mb-4'>
                  The message you're looking for doesn't exist or has been
                  deleted.
                </p>
                <div className='flex gap-2 justify-center'>
                  <Button
                    onClick={() => navigate("/admin/dashboard")}
                    variant='outline'
                  >
                    Back to Dashboard
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
    return <Navigate to='/admin/dashboard' />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
      <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
        {/* Header */}
        <motion.div
          className='mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className='flex items-center justify-between mb-4'>
            <Button
              onClick={() => navigate("/admin/dashboard")}
              variant='ghost'
              className='flex items-center gap-2'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Dashboard
            </Button>

            <div className='flex items-center gap-2'>
              <Badge variant={message.isRead ? "secondary" : "destructive"}>
                {message.isRead ? "Read" : "Unread"}
              </Badge>
            </div>
          </div>

          <h1 className='text-3xl font-bold text-slate-800'>Message Details</h1>
        </motion.div>

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className='shadow-lg'>
            <CardHeader className='pb-4'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <CardTitle className='text-xl mb-2 flex items-center gap-2'>
                    <MessageCircle className='w-5 h-5 text-[#FF9933]' />
                    {message.subject}
                  </CardTitle>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-2'>
                      <User className='w-4 h-4' />
                      <span className='font-medium'>{message.name}</span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Mail className='w-4 h-4' />
                      <a
                        href={`mailto:${message.email}`}
                        className='text-blue-600 hover:underline'
                      >
                        {message.email}
                      </a>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      <span>Received: {formatDate(message.createdAt)}</span>
                    </div>

                    {message.updatedAt !== message.createdAt && (
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4' />
                        <span>Updated: {formatDate(message.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-2 ml-4'>
                  <Button
                    onClick={handleMarkAsRead}
                    disabled={markingAsRead}
                    variant='outline'
                    size='sm'
                  >
                    {markingAsRead ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <BookMarkedIcon className='w-4 h-4' />
                    )}
                    {message.isRead ? "Mark Unread" : "Mark Read"}
                  </Button>

                  <Button onClick={handleReply} variant='outline' size='sm'>
                    <Reply className='w-4 h-4' />
                    Reply
                  </Button>

                  <Button
                    onClick={handleDelete}
                    disabled={deleting}
                    variant='destructive'
                    size='sm'
                  >
                    {deleting ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <Trash2 className='w-4 h-4' />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className='pt-6'>
              <div className='space-y-4'>
                <div>
                  <h3 className='font-semibold mb-2 text-slate-700'>
                    Message Content:
                  </h3>
                  <div className='bg-slate-50 rounded-lg p-4 border'>
                    <p className='text-slate-800 whitespace-pre-wrap leading-relaxed'>
                      {message.message}
                    </p>
                  </div>
                </div>

                {/* Message Metadata */}
                <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
                  <div className='text-sm'>
                    <span className='font-medium text-slate-600'>
                      Message ID:
                    </span>
                    <p className='text-slate-500 font-mono text-xs mt-1'>
                      {message._id}
                    </p>
                  </div>

                  <div className='text-sm'>
                    <span className='font-medium text-slate-600'>Status:</span>
                    <p className='mt-1'>
                      <Badge
                        variant={message.isRead ? "secondary" : "destructive"}
                      >
                        {message.isRead ? "Read" : "Unread"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          className='mt-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
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
                  View All Messages
                </Button>

                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  variant='destructive'
                >
                  {deleting ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <Trash2 className='w-4 h-4 mr-2' />
                  )}
                  Delete Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewMessage;
