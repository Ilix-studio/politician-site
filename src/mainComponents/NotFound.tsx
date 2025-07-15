import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, Mail, Users } from "lucide-react";
import { useEffect, useState } from "react";

const NotFound = () => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden'>
      {/* Background decorative elements matching theme */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-20 w-32 h-32 bg-[#FF9933]/10 rounded-full animate-pulse'></div>
        <div className='absolute bottom-20 right-20 w-24 h-24 bg-[#138808]/10 rounded-full animate-pulse'></div>
        <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-blue-100 rounded-full animate-bounce'></div>
        <div className='absolute bottom-1/3 right-1/3 w-20 h-20 bg-orange-100 rounded-full animate-pulse'></div>
      </div>

      {/* Header matching site theme */}
      <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between'>
          <a
            href='/'
            className='flex items-center gap-2 hover:opacity-80 transition-opacity'
          >
            <div className='relative h-16 w-16'>
              <img
                src='https://i.postimg.cc/0Qrhpj56/BJPico.png'
                alt='BJP Logo'
                className='object-contain'
              />
            </div>
            <span className='text-lg font-bold'>Biswajit Phukan</span>
          </a>

          <Button
            onClick={() => window.history.back()}
            variant='ghost'
            className='flex items-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Go Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6'>
        <motion.div
          className='max-w-2xl mx-auto text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 with Indian flag colors */}
          <motion.div
            className='relative mb-8'
            animate={{
              y: [0, -10, 0],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className='text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text'>
              404
            </div>
            <div className='absolute inset-0 text-8xl md:text-9xl font-bold text-slate-200 -z-10 translate-x-1 translate-y-1'>
              404
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            className='mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className='text-3xl md:text-4xl font-bold text-slate-800 mb-4'>
              Page Not Found
            </h1>
            <p className='text-lg text-slate-600 mb-2'>
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className='text-sm text-slate-500'>
              Let's get you back to exploring our work and initiatives.
            </p>
          </motion.div>

          {/* Action Buttons matching theme */}
          <motion.div
            className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <a href='/'>
              <Button
                size='lg'
                className='bg-[#FF9933] hover:bg-[#FF9933]/90 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
              >
                <Home className='w-5 h-5 mr-2' />
                Go to Homepage
              </Button>
            </a>

            <a href='/about'>
              <Button
                size='lg'
                variant='outline'
                className='border-2 border-[#138808] text-[#138808] hover:bg-[#138808] hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300'
              >
                <Search className='w-5 h-5 mr-2' />
                Learn About Us
              </Button>
            </a>
          </motion.div>

          {/* Quick Links Grid */}
          <motion.div
            className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {[
              { to: "/", label: "Home", icon: Home, color: "text-[#FF9933]" },
              {
                to: "/about",
                label: "About",
                icon: Users,
                color: "text-[#138808]",
              },
              {
                to: "/photo-gallery",
                label: "Gallery",
                icon: Search,
                color: "text-blue-600",
              },
              {
                to: "/#contact",
                label: "Contact",
                icon: Mail,
                color: "text-purple-600",
              },
            ].map(({ to, label, icon: Icon, color }) => (
              <a
                key={to}
                href={to}
                className='p-4 bg-white rounded-xl shadow-md hover:shadow-lg border border-slate-200 hover:border-[#FF9933]/30 transition-all duration-300 group'
              >
                <Icon
                  className={`w-6 h-6 ${color} group-hover:text-[#FF9933] mx-auto mb-2 transition-colors`}
                />
                <div className='text-sm font-medium text-slate-700 group-hover:text-[#FF9933] transition-colors'>
                  {label}
                </div>
              </a>
            ))}
          </motion.div>

          {/* Auto-redirect with Indian theme */}
          <motion.div
            className='p-4 bg-gradient-to-r from-[#FF9933]/10 via-white/50 to-[#138808]/10 border border-[#FF9933]/20 rounded-xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className='text-sm text-slate-700 mb-2'>
              Redirecting to homepage in{" "}
              <span className='font-bold text-[#FF9933]'>{countdown}</span>{" "}
              seconds
            </p>
            <div className='w-full bg-slate-200 rounded-full h-2'>
              <div
                className='bg-gradient-to-r from-[#FF9933] to-[#138808] h-2 rounded-full transition-all duration-1000 ease-linear'
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer matching site theme */}
      <footer className='border-t bg-slate-50'>
        <div className='container py-8 md:py-12 px-4 sm:px-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='relative h-8 w-8'>
                <img
                  src='https://i.postimg.cc/0Qrhpj56/BJPico.png'
                  alt='Logo'
                  className='object-contain'
                />
              </div>
              <div className='text-sm text-muted-foreground'>
                © {new Date().getFullYear()} Biswajit Phukan. All rights
                reserved.
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <a
                href='/contact'
                className='text-sm text-muted-foreground hover:text-[#FF9933] transition-colors'
              >
                Contact Support
              </a>
              <a
                href='/about'
                className='text-sm text-muted-foreground hover:text-[#138808] transition-colors'
              >
                About Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
