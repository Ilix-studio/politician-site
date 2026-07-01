import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Mail, Code, PhoneCall, Globe2 } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

const Footer = () => {
  const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

  return (
    <footer className='border-t bg-slate-50'>
      <div className='container py-8 md:py-12 px-4 sm:px-6'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4 px-2'>
            <div className='flex items-center gap-3'>
              <div className='relative h-10 w-10'>
                <img
                  src='https://i.postimg.cc/0Qrhpj56/BJPico.png'
                  alt='Logo'
                  className='object-contain'
                />
              </div>
              <span className='text-lg font-bold'>Biswajit Phukan</span>
            </div>
            <p className='text-sm text-muted-foreground'>
              Dedicated to the progress and prosperity of our nation. Working
              tirelessly for the welfare of all citizens.
            </p>
          </div>

          <div className='space-y-4 px-2'>
            <h3 className='text-lg font-semibold'>Quick Links</h3>
            <nav className='flex flex-col space-y-3'>
              <Link
                to='#home'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Home
              </Link>
              <Link
                to='/about'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                About
              </Link>
              <Link
                to='#achievements'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Achievements
              </Link>
              <Link
                to='#initiatives'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Initiatives
              </Link>
              <Link
                to='/editor/login'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                ..
              </Link>
            </nav>
          </div>

          <div className='space-y-4 px-2'>
            <h3 className='text-lg font-semibold'>Resources</h3>
            <nav className='flex flex-col space-y-3'>
              <Link
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Press Releases
              </Link>
              <Link
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Speeches
              </Link>
              <Link
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Policy Documents
              </Link>
              <Link
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                Constituency Map
              </Link>
              <Link
                to='/see-bill-memo'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                see bill memo
              </Link>
            </nav>
          </div>

          {/* Developer Card */}
          <div className='space-y-4 px-2'>
            <CardSpotlight
              className='relative overflow-hidden bg-white/20 backdrop-blur-sm border shadow-lg p-4 h-auto'
              radius={300}
              color='rgba(255, 153, 51, 0.3)'
            >
              {/* Background watermark */}
              <span
                aria-hidden='true'
                className=' absolute pointer-events-none select-none underline decoration-dotted decoration-[#0f0a1c]/20 lg:absolute bottom-1 right-2 z-0 text-2xl font-bold tracking-tight text-[#0f0a1c]/20'
              >
                ilix-studio
              </span>

              <div className='relative z-10'>
                <div className='flex items-center gap-3 mb-3'>
                  <Code className='h-5 w-5 text-[#FF9933]' />
                  <div>
                    <h5 className='font-semibold text-sm text-gray-800'>
                      Developer Card
                    </h5>
                  </div>
                </div>

                <p className='text-xs text-muted-foreground mb-4 leading-relaxed'>
                  Crafted with precision and passion for political excellence.
                </p>

                <div className='flex gap-2 mb-3'>
                  {/* Phone */}
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-6 w-6 p-0 hover:bg-[#FF9933]/10 hover:border-[#FF9933] transition-all duration-200'
                    asChild
                  >
                    <a href='tel:+919101035038'>
                      <PhoneCall className='h-4 w-4' />
                    </a>
                  </Button>

                  {/* Website */}
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-6 w-6 p-0 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200'
                    asChild
                  >
                    <a
                      href='https://ilix-hazarika.vercel.app/'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Globe2 className='h-4 w-4' />
                    </a>
                  </Button>

                  {/* Email */}
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-6 w-6 p-0 hover:bg-green-50 hover:border-green-400 transition-all duration-200'
                    asChild
                  >
                    <a href='mailto:ilishjyoti17@gmail.com'>
                      <Mail className='h-4 w-4' />
                    </a>
                  </Button>
                </div>
              </div>
            </CardSpotlight>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-6'>
          <div className='flex flex-col md:flex-row items-center gap-4'>
            <p className='text-sm text-muted-foreground text-center md:text-left'>
              &copy; {new Date().getFullYear()} Biswajit Phukan. All rights
              reserved.
            </p>
            <Badge
              variant='outline'
              className='bg-white text-green-600 border-green-200'
            >
              Made in India 🇮🇳
            </Badge>
          </div>

          <div className='flex flex-wrap justify-center gap-4'>
            {legalLinks.map((link) => (
              <Link
                key={link}
                to='#'
                className='text-sm text-muted-foreground hover:text-primary'
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
