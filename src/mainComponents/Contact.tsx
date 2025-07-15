import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
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
            </div>
          </div>

          <Card className='shadow-md'>
            <CardContent className='p-4 md:p-6 space-y-5'>
              <h3 className='text-xl font-bold mb-2'>Send a Message</h3>
              <form className='space-y-5'>
                <div className='grid gap-5 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <label htmlFor='name' className='text-sm font-medium'>
                      Name
                    </label>
                    <input
                      id='name'
                      className='flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      placeholder='Your name'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label htmlFor='email' className='text-sm font-medium'>
                      Email
                    </label>
                    <input
                      id='email'
                      type='email'
                      className='flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      placeholder='Your email'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label htmlFor='subject' className='text-sm font-medium'>
                    Subject
                  </label>
                  <input
                    id='subject'
                    className='flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    placeholder='Message subject'
                  />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='message' className='text-sm font-medium'>
                    Message
                  </label>
                  <textarea
                    id='message'
                    className='flex min-h-[140px] w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    placeholder='Your message'
                  />
                </div>
                <Button className='w-full h-12 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white font-medium'>
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
