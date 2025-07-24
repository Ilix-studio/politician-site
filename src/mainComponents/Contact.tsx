import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Twitter,
  TriangleDashed,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSendContactMessageMutation } from "@/redux-store/services/contactApi";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sendContactMessage, { isLoading, isSuccess, error }] =
    useSendContactMessageMutation();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return;
    }

    try {
      await sendContactMessage(formData).unwrap();
      // Reset form on success
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      // Error is handled by RTK Query
      console.error("Failed to send message:", err);
    }
  };

  const getErrorMessage = () => {
    if (error) {
      if ("data" in error) {
        return (error.data as any)?.message || "Failed to send message";
      }
      return "Network error. Please try again.";
    }
    return "";
  };

  const navigatetoAdminRoute = async () => {
    await navigate("https://biswajitphukan.in/admin/dashboard");
  };

  return (
    <section id='contact' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
      <div className='container px-4 sm:px-6'>
        <div className='grid gap-8 md:gap-12 md:grid-cols-2 items-start'>
          <div className='space-y-6 p-4 md:p-6'>
            <div className='inline-block px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm'>
              Get in Touch
            </div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
              Connect With Us
            </h2>
            <p className='text-muted-foreground'>
              Have questions or suggestions? Reach out to our office. We're here
              to listen and assist.
            </p>

            <div className='space-y-6 pt-4'>
              <div className='flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm'>
                <div className='h-12 w-12 rounded-full bg-[#FF9933]/10 flex items-center justify-center shrink-0'>
                  <Mail className='h-5 w-5 text-[#FF9933]' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Email</div>
                  <div className='text-sm text-muted-foreground'>
                    contact@biswajitphukan.com
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm'>
                <div className='h-12 w-12 rounded-full bg-white border border-[#000080] flex items-center justify-center shrink-0'>
                  <Phone className='h-5 w-5 text-[#000080]' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Phone</div>
                  <div className='text-sm text-muted-foreground'>
                    +91 98765 43210
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm'>
                <div className='h-12 w-12 rounded-full bg-[#138808]/10 flex items-center justify-center shrink-0'>
                  <MapPin className='h-5 w-5 text-[#138808]' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Office Address</div>
                  <div className='text-sm text-muted-foreground'>
                    Dispur, Guwahati, Assam 781005, India.
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-4 pt-6 pl-3'>
              <Link
                to='#'
                className='h-12 w-12 rounded-full bg-[#FF9933]/10 flex items-center justify-center hover:bg-[#FF9933]/20 transition-colors'
              >
                <Facebook className='h-5 w-5 text-[#FF9933]' />
              </Link>
              <Link
                to='#'
                className='h-12 w-12 rounded-full bg-white border border-[#000080] flex items-center justify-center hover:bg-slate-50 transition-colors'
              >
                <Twitter className='h-5 w-5 text-[#000080]' />
              </Link>
              <Link
                to='#'
                className='h-12 w-12 rounded-full bg-[#138808]/10 flex items-center justify-center hover:bg-[#138808]/20 transition-colors'
              >
                <Instagram className='h-5 w-5 text-[#138808]' />
              </Link>
              <Link
                to='https://biswajitphukan.in/admin/login'
                className='h-12 w-12 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center hover:bg-[#FFFFFF]/20 transition-colors'
                onClick={navigatetoAdminRoute}
              >
                <TriangleDashed className='h-5 w-5 text-[#FFFFFF]' />
              </Link>
            </div>
          </div>

          <Card className='shadow-md'>
            <CardContent className='p-4 md:p-6 space-y-5'>
              <h3 className='text-xl font-bold mb-2'>Send a Message</h3>
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid gap-5 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='name' className='text-sm font-medium'>
                      Name
                    </Label>
                    <Input
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className='flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      placeholder='Your name'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-sm font-medium'>
                      Email
                    </Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className='flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      placeholder='Your email'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='subject' className='text-sm font-medium'>
                    Subject
                  </Label>
                  <Input
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className='flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    placeholder='Message subject'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='message' className='text-sm font-medium'>
                    Message
                  </Label>
                  <Textarea
                    id='message'
                    name='message'
                    placeholder='Your message'
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    disabled={isLoading}
                    className='flex min-h-[140px] w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  />
                </div>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full h-12 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white font-medium'
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
                {/* Success Message */}
                {isSuccess && (
                  <div className='text-center py-4'>
                    <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-3' />
                    <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                      Message Sent Successfully!
                    </h4>
                    <p className='text-gray-600'>
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className='p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3'>
                    <AlertCircle className='h-5 w-5 text-red-500 mt-0.5' />
                    <div>
                      <p className='text-red-600 font-medium'>
                        Failed to send message
                      </p>
                      <p className='text-red-600/70 text-sm'>
                        {getErrorMessage()}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
