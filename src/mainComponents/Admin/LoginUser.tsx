import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

import BJP_LOGO from "../../assets/bjp.png";
import { useLoginAdminMutation } from "@/redux-store/services/adminApi";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux-store/slices/authSlice";
import { Label } from "@/components/ui/label";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(selectAuth);

  // Use the RTK Query mutation hook
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    try {
      const result = await loginAdmin({ email, password }).unwrap();
      if (!result.success) {
        setErrorMessage(result.message || "Login failed");
      }
    } catch (err: any) {
      setErrorMessage(err.data?.message || "Login failed. Please try again.");
    }
  };
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-20 w-32 h-32 bg-[#FF9933]/10 rounded-full animate-pulse'></div>
        <div className='absolute bottom-20 right-20 w-24 h-24 bg-[#138808]/10 rounded-full animate-pulse'></div>
        <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-blue-100 rounded-full animate-bounce'></div>
        <div className='absolute bottom-1/3 right-1/3 w-20 h-20 bg-orange-100 rounded-full animate-pulse'></div>
      </div>

      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between'>
          <Link
            to='/'
            className='flex items-center gap-2 hover:opacity-80 transition-opacity'
          >
            <div className='relative h-16 w-16'>
              <img src={BJP_LOGO} alt='Logo' className='object-contain' />
            </div>
            <span className='text-lg font-bold'>Biswajit Phukan</span>
          </Link>

          <Button
            onClick={() => (window.location.href = "/")}
            variant='ghost'
            className='flex items-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6'>
        <motion.div
          className='w-full max-w-md'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className='shadow-2xl border-0 bg-white/80 backdrop-blur-sm'>
            <CardHeader className='text-center pb-8'>
              <motion.div
                className='mx-auto mb-6 p-4 bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10 rounded-full'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Shield className='w-12 h-12 text-[#FF9933] mx-auto' />
              </motion.div>

              <CardTitle className='text-2xl font-bold text-slate-800 mb-2'>
                Admin Login
              </CardTitle>
              <p className='text-slate-600 text-sm'>
                Access the administrative dashboard
              </p>
            </CardHeader>

            <CardContent className='space-y-6'>
              <form onSubmit={handleSubmit} className='space-y-5'>
                {/* Email Field */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='email'
                    className='text-sm font-medium text-slate-700'
                  >
                    Email Address
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 ' />
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className='w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm'
                      placeholder='Enter your email'
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='password'
                    className='text-sm font-medium text-slate-700'
                  >
                    Password
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5' />
                    <Input
                      id='password'
                      name='password'
                      type={showPassword ? "text" : "password"}
                      placeholder='••••••••'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className='w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm'
                    />
                    <button
                      type='button'
                      onClick={toggleShowPassword}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
                    >
                      {showPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='p-3 bg-red-50 border border-red-200 rounded-lg'
                  >
                    <p className='text-sm text-red-600'>{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className='w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#FF9933]/90 hover:from-[#FF9933]/90 hover:to-[#FF9933]/80 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                >
                  {isLoading ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              {(errorMessage || error) && (
                <div className='p-3 rounded-md bg-red-50 border border-red-200 text-red-600 flex items-center gap-2'>
                  <AlertCircle className='h-5 w-5' />
                  <span>{errorMessage || error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <motion.div
            className='mt-6 text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className='text-xs text-slate-500'>
              This is a secure administrative area. All access is logged and
              monitored.
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className='border-t bg-slate-50'>
        <div className='container py-6 px-4 sm:px-6'>
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
                href='/#contact'
                className='text-sm text-muted-foreground hover:text-[#FF9933] transition-colors'
              >
                Support
              </a>
              <a
                href='/about'
                className='text-sm text-muted-foreground hover:text-[#138808] transition-colors'
              >
                About
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginUser;
