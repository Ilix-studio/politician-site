import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BJP_LOGO from "../../assets/bjp.png";
import {
  Users,
  Mail,
  Image,
  Video,
  FileText,
  LogOut,
  Eye,
  Calendar,
  TrendingUp,
  MessageCircle,
  Upload,
  Loader2,
  Delete,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

import { useSelector } from "react-redux";
import {
  selectAuth,
  selectIsAdmin,
  logout,
} from "@/redux-store/slices/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Import API hooks
import {
  useGetContactMessagesQuery,
  useMarkMessageAsReadMutation,
} from "@/redux-store/services/contactApi";
import { useGetPhotosQuery } from "@/redux-store/services/photoApi";
import { useGetVideosQuery } from "@/redux-store/services/videoApi";
import { useGetPressQuery } from "@/redux-store/services/pressApi";

// Import Visitor API hooks
import { useGetVisitorStatsQuery } from "@/redux-store/services/visitorApi";

const AdminDash = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  // API hooks
  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useGetContactMessagesQuery({
    page: 1,
    limit: 4, // Show 4 recent messages in dashboard
  });

  const [markMessageAsRead, { isLoading: markingAsRead }] =
    useMarkMessageAsReadMutation();

  // Get counts for photos, videos, and press articles
  const { data: photosData } = useGetPhotosQuery({
    page: 1,
    limit: 1, // We only need the count
  });

  const { data: videosData } = useGetVideosQuery({
    page: "1",
    limit: "1", // We only need the count
  });

  const { data: pressData } = useGetPressQuery({
    page: "1",
    limit: "1", // We only need the count
  });

  // Visitor API hooks
  const {
    data: visitorStatsData,
    isLoading: visitorStatsLoading,
    refetch: refetchVisitorStats,
  } = useGetVisitorStatsQuery();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMarkAsRead = async (
    messageId: string,
    currentReadStatus: boolean
  ) => {
    try {
      await markMessageAsRead({
        id: messageId,
        isRead: !currentReadStatus,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update message status:", error);
    }
  };

  const handleViewMessage = (id: string) => {
    navigate(`/admin/messages/${id}`);
    console.log("View message:", id);
  };

  // Dynamic stats with real data from APIs
  const stats = [
    {
      title: "Total Contact Messages",
      value: messagesData?.pagination?.total?.toString() || "0",
      change: messagesData?.unreadCount ? `+${messagesData.unreadCount}` : "0",
      icon: Mail,
      color: "text-green-600",
      loading: messagesLoading,
      error: messagesError,
      action: () => navigate("/admin/messages"),
    },
    {
      title: "Total Gallery Photos",
      value: photosData?.data?.pagination?.total?.toString() || "0",
      change: "+8",
      icon: Image,
      color: "text-purple-600",
      action: () => navigate("/admin/photoDashboard"),
    },
    {
      title: "Total Gallery Videos",
      value: videosData?.data?.pagination?.totalVideos?.toString() || "0",
      icon: Video,
      color: "text-orange-600",
      action: () => navigate("/admin/videoDashboard"),
    },
    {
      title: "Total Press Articles",
      value: pressData?.data?.pagination?.totalPress?.toString(),
      icon: Users,
      color: "text-blue-600",
      action: () => navigate("/admin/pressDashboard"),
    },
  ];

  const quickActions = [
    {
      title: "Upload Photo",
      icon: Upload,
      color: "bg-blue-500",
      action: () => navigate("/admin/addPhoto"),
    },
    {
      title: "Add Video",
      icon: Video,
      color: "bg-pink-500",
      action: () => navigate("/admin/addVideo"),
    },
    {
      title: "Write Article",
      icon: FileText,
      color: "bg-purple-500",
      action: () => navigate("/admin/addPress"),
    },
    {
      title: "Create Category",
      icon: FileText,
      color: "bg-green-500",
      action: () => navigate("/admin/categories"),
    },
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='relative h-16 w-16'>
              <img src={BJP_LOGO} alt='Logo' className='object-contain' />
            </div>
            <div>
              <h1 className='text-lg font-bold'>Admin Dashboard</h1>
              <p className='text-sm text-muted-foreground'>Biswajit Phukan</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {/* Refresh Visitor Stats Button */}
            <Button
              onClick={() => refetchVisitorStats()}
              variant='ghost'
              size='sm'
              className='flex items-center gap-1'
              disabled={visitorStatsLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  visitorStatsLoading ? "animate-spin" : ""
                }`}
              />
              <span className='hidden sm:inline'>Refresh Stats</span>
            </Button>

            <Button
              onClick={handleLogout}
              variant='ghost'
              className='flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'
            >
              <LogOut className='w-4 h-4' />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className='container py-3 px-4 sm:px-6'>
        {/* Welcome Section */}
        <motion.div
          className='mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>
            Welcome back, Admin
          </h2>
          <p className='text-slate-600'>
            Here's what's happening with your website today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <Card
              key={index}
              className='hover:shadow-lg transition-shadow cursor-pointer'
              onClick={stat.action}
            >
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      {stat.title}
                    </p>
                    <div className='flex items-center gap-2'>
                      <p className='text-2xl font-bold'>
                        {stat.loading ? (
                          <Loader2 className='w-6 h-6 animate-spin' />
                        ) : stat.error ? (
                          <span className='text-red-500 text-sm'>Error</span>
                        ) : (
                          stat.value
                        )}
                      </p>
                      {stat.error && (
                        <AlertTriangle className='w-4 h-4 text-red-500' />
                      )}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-full bg-slate-100 ${stat.color}`}
                  >
                    <stat.icon className='w-6 h-6' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        {/* Visitor Analytics Section */}
        {visitorStatsData?.data && (
          <motion.div
            className='mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='w-5 h-5 text-blue-600' />
                  Visitor Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='text-center p-4 bg-orange-50 rounded-lg'>
                    <p className='text-2xl font-bold text-orange-900'>
                      {visitorStatsData.data.totalVisitors?.toLocaleString() ||
                        "0"}
                    </p>
                    <p className='text-orange-600 text-sm'>Total Visitors</p>
                  </div>
                  <div className='text-center p-4 bg-blue-50 rounded-lg'>
                    <p className='text-2xl font-bold text-blue-900'>
                      {visitorStatsData.data.todayVisitors}
                    </p>
                    <p className='text-blue-600 text-sm'>Today's Visitors</p>
                  </div>
                  <div className='text-center p-4 bg-green-50 rounded-lg'>
                    <p className='text-2xl font-bold text-green-900'>
                      {visitorStatsData.data.weeklyStats.thisWeek}
                    </p>
                    <p className='text-green-600 text-sm'>This Week</p>
                  </div>
                  <div className='text-center p-4 bg-purple-50 rounded-lg'>
                    <p
                      className={`text-2xl font-bold ${
                        visitorStatsData.data.weeklyStats.growth >= 0
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      {visitorStatsData.data.weeklyStats.growth >= 0 ? "+" : ""}
                      {visitorStatsData.data.weeklyStats.growth}%
                    </p>
                    <p className='text-purple-600 text-sm'>Weekly Growth</p>
                  </div>
                </div>

                {visitorStatsData.data.lastVisit && (
                  <div className='mt-4 text-center text-sm text-gray-600'>
                    Last visitor:{" "}
                    {formatTimeAgo(visitorStatsData.data.lastVisit)}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Recent Messages */}
          <motion.div
            className='lg:col-span-2'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MessageCircle className='w-5 h-5 text-[#FF9933]' />
                  Recent Messages
                  {messagesData?.unreadCount &&
                    messagesData.unreadCount > 0 && (
                      <Badge variant='destructive' className='ml-2'>
                        {messagesData.unreadCount} new
                      </Badge>
                    )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messagesLoading ? (
                  <div className='flex items-center justify-center py-8'>
                    <Loader2 className='w-6 h-6 animate-spin' />
                    <span className='ml-2'>Loading messages...</span>
                  </div>
                ) : messagesError ? (
                  <div className='text-center py-8'>
                    <p className='text-red-600 mb-4'>Failed to load messages</p>
                    <Button onClick={refetchMessages} variant='outline'>
                      Retry
                    </Button>
                  </div>
                ) : messagesData?.data && messagesData.data.length > 0 ? (
                  <div className='space-y-4'>
                    {messagesData.data.map((message) => (
                      <div
                        key={message._id}
                        className='flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors'
                      >
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <p className='font-medium'>{message.name}</p>
                            {!message.isRead && (
                              <Badge variant='destructive' className='text-xs'>
                                New
                              </Badge>
                            )}
                          </div>
                          <p className='text-sm text-muted-foreground'>
                            {message.subject}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {formatTimeAgo(message.createdAt)}
                          </p>
                        </div>
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleViewMessage(message._id)}
                          >
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() =>
                              handleMarkAsRead(message._id, message.isRead)
                            }
                            disabled={markingAsRead}
                          >
                            {markingAsRead ? (
                              <Loader2 className='w-4 h-4 animate-spin' />
                            ) : (
                              <Delete className='w-4 h-4' />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <MessageCircle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600'>No messages found</p>
                  </div>
                )}

                <Button
                  className='w-full mt-4 bg-[#FF9933] hover:bg-[#FF9933]/90'
                  onClick={() => navigate("/admin/messages")}
                >
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className='mb-6'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='w-5 h-5 text-[#138808]' />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-3'>
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`${action.color} hover:opacity-90 text-white p-4 h-auto flex-col gap-2`}
                    >
                      <action.icon className='w-6 h-6' />
                      <span className='text-xs'>{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Site Status */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Calendar className='w-5 h-5 text-blue-600' />
                  Site Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Website Status</span>
                    <Badge className='bg-green-100 text-green-800'>
                      Online
                    </Badge>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Server Health</span>
                    <Badge className='bg-green-100 text-green-800'>Good</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
