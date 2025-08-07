import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Initiatives = () => {
  return (
    <section id='initiatives' className='py-16 md:py-24 bg-white'>
      <div className='container'>
        <div className='text-center max-w-3xl mx-auto mb-12'>
          <div className='inline-block px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm mb-4'>
            Key Initiatives
          </div>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Building a Better Tomorrow
          </h2>
          <p className='text-muted-foreground mt-4'>
            Ongoing projects and future plans to address the most pressing
            challenges facing our constituency.
          </p>
        </div>

        <Tabs defaultValue='economic' className='max-w-4xl mx-auto'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='economic'>Economic</TabsTrigger>
            <TabsTrigger value='social'>Social</TabsTrigger>
            <TabsTrigger value='environmental'>Environmental</TabsTrigger>
            <TabsTrigger value='technology'>Technology</TabsTrigger>
          </TabsList>
          <TabsContent value='economic' className='mt-6 space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-xl font-bold'>
                    Skill Development Program
                  </h3>
                  <p className='text-muted-foreground'>
                    Training 10,000 youth in emerging technologies and
                    vocational skills to boost employment.
                  </p>
                  <Link
                    to='https://asdm.assam.gov.in/portlet-sub-innerpage/about-entrepreneurship-development-programme'
                    className='text-[#FF9933] inline-flex items-center gap-1 text-sm font-medium'
                  >
                    Learn more <ChevronRight className='h-4 w-4' />
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-xl font-bold'>Small Business Support</h3>
                  <p className='text-muted-foreground'>
                    Providing microloans and mentorship to 5,000 entrepreneurs
                    to stimulate local economy.
                  </p>
                  <Link
                    to='https://www.myscheme.gov.in/schemes/bps'
                    className='text-[#FF9933] inline-flex items-center gap-1 text-sm font-medium'
                  >
                    Learn more <ChevronRight className='h-4 w-4' />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='social' className='mt-6 space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-xl font-bold'>Women Empowerment</h3>
                  <p className='text-muted-foreground'>
                    Initiatives to promote gender equality and support women
                    entrepreneurs.
                  </p>
                  <Link
                    to='https://www.ekuhipath.com/blog/building-a-stronger-assam-through-women-empowerment-06-04-2025'
                    className='text-[#FF9933] inline-flex items-center gap-1 text-sm font-medium'
                  >
                    Learn more <ChevronRight className='h-4 w-4' />
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-xl font-bold'>Rural Development</h3>
                  <p className='text-muted-foreground'>
                    Comprehensive programs to improve infrastructure and
                    services in rural areas.
                  </p>
                  <Link
                    to='https://pnrd.assam.gov.in/schemes'
                    className='text-[#FF9933] inline-flex items-center gap-1 text-sm font-medium'
                  >
                    Learn more <ChevronRight className='h-4 w-4' />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='environmental' className='mt-6 space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-xl font-bold'>Clean Energy</h3>
                  <p className='text-muted-foreground'>
                    Promoting solar power adoption and renewable energy
                    infrastructure.
                  </p>
                  <Link
                    to='https://aeda.assam.gov.in/'
                    className='text-[#FF9933] inline-flex items-center gap-1 text-sm font-medium'
                  >
                    Learn more <ChevronRight className='h-4 w-4' />
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-xl font-bold'>Water Conservation</h3>
                  <p className='text-muted-foreground'>
                    Projects to improve water management and ensure clean
                    drinking water access.
                  </p>
                  <Link
                    to='https://slnaiwmpassam.gov.in/jalshakti.html'
                    className='text-[#FF9933] inline-flex items-center gap-1 text-sm font-medium'
                  >
                    Learn more <ChevronRight className='h-4 w-4' />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='technology' className='mt-6 space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-xl font-bold'>Digital Literacy</h3>
                  <p className='text-muted-foreground'>
                    Programs to increase digital skills among all age groups and
                    bridge the digital divide.
                  </p>
                  <Link
                    to='https://scert.assam.gov.in/'
                    className='text-[#FF9933] inline-flex items-center gap-1 text-sm font-medium'
                  >
                    Learn more <ChevronRight className='h-4 w-4' />
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-xl font-bold'>Smart City Initiatives</h3>
                  <p className='text-muted-foreground'>
                    Implementing technology solutions to improve urban
                    infrastructure and services.
                  </p>
                  <Link
                    to='https://gdd.assam.gov.in/portlets/smart-city-project'
                    className='text-[#FF9933] inline-flex items-center gap-1 text-sm font-medium'
                  >
                    Learn more <ChevronRight className='h-4 w-4' />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Initiatives;
