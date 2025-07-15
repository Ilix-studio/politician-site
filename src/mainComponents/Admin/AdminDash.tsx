import { useState } from "react";
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
  Settings,
  LogOut,
  Eye,
  Calendar,
  TrendingUp,
  MessageCircle,
  Upload,
  Edit,
} from "lucide-react";

const AdminDash = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Total Visitors",
      value: "12,458",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Contact Messages",
      value: "24",
      change: "+3",
      icon: Mail,
      color: "text-green-600",
    },
    {
      title: "Gallery Photos",
      value: "186",
      change: "+8",
      icon: Image,
      color: "text-purple-600",
    },
    {
      title: "Videos",
      value: "32",
      change: "+2",
      icon: Video,
      color: "text-orange-600",
    },
  ];

  const recentMessages = [
    {
      id: 1,
      name: "Rajesh Kumar",
      subject: "Infrastructure Query",
      time: "2 hours ago",
      status: "unread",
    },
    {
      id: 2,
      name: "Priya Sharma",
      subject: "Education Support",
      time: "4 hours ago",
      status: "read",
    },
    {
      id: 3,
      name: "Amit Das",
      subject: "Healthcare Access",
      time: "6 hours ago",
      status: "unread",
    },
    {
      id: 4,
      name: "Meera Patil",
      subject: "Job Opportunity",
      time: "1 day ago",
      status: "read",
    },
  ];

  const quickActions = [
    {
      title: "Upload Photo",
      icon: Upload,
      color: "bg-blue-500",
      action: () => alert("Photo upload"),
    },
    {
      title: "Add Video",
      icon: Video,
      color: "bg-green-500",
      action: () => alert("Video upload"),
    },
    {
      title: "New Post",
      icon: FileText,
      color: "bg-purple-500",
      action: () => alert("New post"),
    },
    {
      title: "Settings",
      icon: Settings,
      color: "bg-gray-500",
      action: () => alert("Settings"),
    },
  ];

  const logout = () => {
    window.location.href = "/";
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

          <Button
            onClick={logout}
            variant='ghost'
            className='flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </Button>
        </div>
      </header>

      <div className='container py-6 px-4 sm:px-6'>
        {/* Welcome Section */}
        <motion.div
          className='mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-bold text-slate-800 mb-2'>
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
            <Card key={index} className='hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      {stat.title}
                    </p>
                    <p className='text-2xl font-bold'>{stat.value}</p>
                    <p className='text-xs text-green-600'>{stat.change}</p>
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className='flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors'
                    >
                      <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                          <p className='font-medium'>{message.name}</p>
                          {message.status === "unread" && (
                            <Badge variant='destructive' className='text-xs'>
                              New
                            </Badge>
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {message.subject}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {message.time}
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline'>
                          <Eye className='w-4 h-4' />
                        </Button>
                        <Button size='sm' variant='outline'>
                          <Edit className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className='w-full mt-4 bg-[#FF9933] hover:bg-[#FF9933]/90'>
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
                    <span className='text-sm'>Last Backup</span>
                    <span className='text-sm text-muted-foreground'>
                      2 hours ago
                    </span>
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

        {/* Content Management */}
        <motion.div
          className='mt-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='w-5 h-5 text-purple-600' />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='p-4 border rounded-lg hover:bg-slate-50 transition-colors'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='font-medium'>Gallery Photos</h3>
                    <Badge>186</Badge>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    Manage photo gallery
                  </p>
                  <div className='flex gap-2'>
                    <Button size='sm' variant='outline'>
                      <Eye className='w-4 h-4' />
                    </Button>
                    <Button size='sm' variant='outline'>
                      <Upload className='w-4 h-4' />
                    </Button>
                  </div>
                </div>

                <div className='p-4 border rounded-lg hover:bg-slate-50 transition-colors'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='font-medium'>Videos</h3>
                    <Badge>32</Badge>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    Manage video content
                  </p>
                  <div className='flex gap-2'>
                    <Button size='sm' variant='outline'>
                      <Eye className='w-4 h-4' />
                    </Button>
                    <Button size='sm' variant='outline'>
                      <Upload className='w-4 h-4' />
                    </Button>
                  </div>
                </div>

                <div className='p-4 border rounded-lg hover:bg-slate-50 transition-colors'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='font-medium'>Press Articles</h3>
                    <Badge>24</Badge>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    Manage press releases
                  </p>
                  <div className='flex gap-2'>
                    <Button size='sm' variant='outline'>
                      <Eye className='w-4 h-4' />
                    </Button>
                    <Button size='sm' variant='outline'>
                      <Edit className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
export default AdminDash;
