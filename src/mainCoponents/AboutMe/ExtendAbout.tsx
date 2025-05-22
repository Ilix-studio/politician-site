import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  GraduationCap,
  Heart,
  MapPin,
  Calendar,
  Users,
  Building,
  Trophy,
  BookOpen,
  Target,
  ChevronDown,
  ChevronUp,
  Quote,
  Star,
  Vote,
  Briefcase,
} from "lucide-react";
import BiswajitPhukan from "./../../assets/user.jpg";
import BJP from "./../../assets/bjp.png";
import Header from "../Header";
import Footer from "../Footer";

const ExtendAbout = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const achievements = [
    {
      icon: <Vote className='w-5 h-5' />,
      title: "Electoral Victory 2021",
      description: "Won with 1,07,090 votes from Sarupathar constituency",
      details:
        "Secured a decisive victory representing the trust of the people in our vision for development and progress.",
    },
    {
      icon: <Building className='w-5 h-5' />,
      title: "Banking Leadership",
      description: "Vice-Chairman, Assam State Cooperative Bank",
      details:
        "Led initiatives to strengthen financial inclusion and support local communities through cooperative banking.",
    },
    {
      icon: <Users className='w-5 h-5' />,
      title: "Community Service",
      description: "15+ years of dedicated public service",
      details:
        "Consistently worked for the welfare and development of communities across Assam since 2010.",
    },
  ];

  const personalValues = [
    {
      icon: <Target className='w-5 h-5' />,
      title: "Integrity",
      description: "Unwavering commitment to honest governance",
    },
    {
      icon: <Heart className='w-5 h-5' />,
      title: "Compassion",
      description: "Deep care for the welfare of all citizens",
    },
    {
      icon: <Trophy className='w-5 h-5' />,
      title: "Excellence",
      description: "Striving for the highest standards in public service",
    },
    {
      icon: <Users className='w-5 h-5' />,
      title: "Unity",
      description: "Bringing communities together for common goals",
    },
  ];

  const keyFacts = [
    {
      label: "Constituency",
      value: "Sarupathar, Assam",
      icon: <MapPin className='w-4 h-4' />,
    },
    {
      label: "Party",
      value: "Bharatiya Janata Party",
      icon: <Star className='w-4 h-4' />,
    },
    { label: "Elected", value: "2021", icon: <Calendar className='w-4 h-4' /> },
    {
      label: "Votes Received",
      value: "1,07,090",
      icon: <Vote className='w-4 h-4' />,
    },
    {
      label: "Education",
      value: "MA, Gauhati University",
      icon: <GraduationCap className='w-4 h-4' />,
    },
    {
      label: "Previous Role",
      value: "Vice-Chairman, ASCB",
      icon: <Briefcase className='w-4 h-4' />,
    },
  ];

  return (
    <>
      <Header />

      {/* Hero Section with Enhanced Design */}
      <section className='relative py-20 bg-gradient-to-br from-[#FF9933]/10 via-white to-[#138808]/10'>
        <div
          className='absolute inset-0 opacity-30'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className='container px-4 sm:px-6 relative z-10'>
          <div className='grid gap-12 lg:grid-cols-2 items-center'>
            {/* Image Section with Enhanced Design */}
            <div className='relative'>
              <div className='relative aspect-square max-w-lg mx-auto'>
                <div className='absolute inset-0 bg-gradient-to-br from-[#FF9933]/20 to-[#138808]/20 rounded-2xl transform rotate-3'></div>
                <div className='relative bg-white p-4 rounded-2xl shadow-2xl'>
                  <img
                    src={BiswajitPhukan}
                    alt='Biswajit Phukan'
                    className='object-cover rounded-xl w-full h-full'
                  />
                  <div className='absolute -bottom-2 -right-2 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full p-2 shadow-lg'>
                    <img
                      src={BJP}
                      alt='BJP Logo'
                      className='object-contain w-full h-full'
                    />
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className='absolute top-4 -left-4 bg-white rounded-lg shadow-lg p-3 hidden md:block'>
                <div className='text-2xl font-bold text-[#FF9933]'>2021</div>
                <div className='text-xs text-muted-foreground'>Elected</div>
              </div>

              <div className='absolute bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 hidden md:block'>
                <div className='text-2xl font-bold text-[#138808]'>1.07L</div>
                <div className='text-xs text-muted-foreground'>Votes</div>
              </div>
            </div>

            {/* Content Section */}
            <div className='space-y-8'>
              <div>
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9933]/10 text-[#FF9933] font-medium text-sm mb-6'>
                  <Award className='w-4 h-4' />
                  About Me
                </div>
                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6'>
                  Biswajit
                  <span className='text-[#FF9933]'> Phukan</span>
                </h1>
                <p className='text-xl text-muted-foreground mb-6'>
                  Member of Legislative Assembly | Sarupathar Constituency
                </p>
              </div>

              {/* Quick Facts Grid */}
              <div className='grid grid-cols-2 gap-4'>
                {keyFacts.slice(0, 4).map((fact, index) => (
                  <Card key={index} className='border-l-4 border-l-[#FF9933]'>
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-2 mb-1'>
                        {fact.icon}
                        <span className='text-sm font-medium text-muted-foreground'>
                          {fact.label}
                        </span>
                      </div>
                      <div className='font-semibold text-sm'>{fact.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className='flex flex-wrap gap-4'>
                <Button
                  size='lg'
                  className='bg-[#FF9933] hover:bg-[#FF9933]/90'
                >
                  <Users className='w-4 h-4 mr-2' />
                  Connect With Me
                </Button>
                <Button size='lg' variant='outline'>
                  <BookOpen className='w-4 h-4 mr-2' />
                  View Achievements
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className='py-16 bg-white'>
        <div className='container px-4 sm:px-6'>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-4 mb-8'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='journey'>Journey</TabsTrigger>
              <TabsTrigger value='values'>Values</TabsTrigger>
              <TabsTrigger value='achievements'>Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-8'>
              <div className='grid md:grid-cols-2 gap-8'>
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                      <Quote className='w-5 h-5 text-[#FF9933]' />
                      My Mission
                    </h3>
                    <p className='text-muted-foreground leading-relaxed'>
                      "As a dedicated member of the Bharatiya Janata Party from
                      Assam, I have committed my life to public service. My
                      mission is to ensure inclusive development, transparent
                      governance, and the welfare of all citizens in my
                      constituency and beyond."
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-6'>
                    <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                      <Target className='w-5 h-5 text-[#138808]' />
                      Vision
                    </h3>
                    <p className='text-muted-foreground leading-relaxed'>
                      "To build a prosperous, self-reliant Assam where every
                      citizen has access to quality education, healthcare, and
                      economic opportunities while preserving our rich cultural
                      heritage and natural resources."
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Expandable Sections */}
              <div className='space-y-4'>
                <Card>
                  <CardContent className='p-0'>
                    <button
                      onClick={() => toggleSection("background")}
                      className='w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors'
                    >
                      <h3 className='text-lg font-semibold'>
                        Background & Early Life
                      </h3>
                      {expandedSection === "background" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </button>
                    {expandedSection === "background" && (
                      <div className='px-6 pb-6 space-y-4 border-t'>
                        <p className='text-muted-foreground'>
                          Born and raised in Assam, I completed my Master of
                          Arts degree from the prestigious Gauhati University in
                          1997. This educational foundation provided me with a
                          deep understanding of social, political, and economic
                          issues that would later shape my approach to public
                          service.
                        </p>
                        <p className='text-muted-foreground'>
                          As the son of Rajen Phukan and married to Prapti
                          Thakur, I have always been grounded in strong family
                          values that emphasize service to others and commitment
                          to community welfare.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-0'>
                    <button
                      onClick={() => toggleSection("banking")}
                      className='w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors'
                    >
                      <h3 className='text-lg font-semibold'>
                        Banking & Financial Inclusion
                      </h3>
                      {expandedSection === "banking" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </button>
                    {expandedSection === "banking" && (
                      <div className='px-6 pb-6 space-y-4 border-t'>
                        <p className='text-muted-foreground'>
                          Before entering electoral politics, I served as the
                          Vice-Chairman of Assam State Cooperative Bank, where I
                          spearheaded initiatives to strengthen financial
                          inclusion across rural and urban areas of Assam.
                        </p>
                        <p className='text-muted-foreground'>
                          During my tenure, I focused on making banking services
                          more accessible to marginalized communities,
                          supporting small businesses, and promoting cooperative
                          banking as a tool for economic empowerment.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='journey' className='space-y-6'>
              <div className='space-y-8'>
                <h3 className='text-2xl font-bold text-center'>
                  Political Journey Timeline
                </h3>
                <div className='relative'>
                  <div className='absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF9933] to-[#138808]'></div>

                  {[
                    {
                      year: "2010",
                      title: "Community Service",
                      desc: "Began active involvement in grassroots development",
                    },
                    {
                      year: "2015",
                      title: "Banking Leadership",
                      desc: "Appointed Vice-Chairman of Assam State Cooperative Bank",
                    },
                    {
                      year: "2019",
                      title: "BJP Nomination",
                      desc: "Selected as BJP candidate for Sarupathar constituency",
                    },
                    {
                      year: "2021",
                      title: "Electoral Victory",
                      desc: "Won assembly election with 1,07,090 votes",
                    },
                    {
                      year: "2022",
                      title: "Legislative Work",
                      desc: "Initiated key development programs for constituents",
                    },
                  ].map((event, index) => (
                    <div
                      key={index}
                      className='relative flex items-center mb-8'
                    >
                      <div className='w-16 h-16 bg-white border-4 border-[#FF9933] rounded-full flex items-center justify-center font-bold text-sm z-10'>
                        {event.year}
                      </div>
                      <Card className='ml-8 flex-1'>
                        <CardContent className='p-4'>
                          <h4 className='font-bold text-lg'>{event.title}</h4>
                          <p className='text-muted-foreground'>{event.desc}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value='values' className='space-y-6'>
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold mb-4'>
                  Core Values & Principles
                </h3>
                <p className='text-muted-foreground max-w-2xl mx-auto'>
                  The fundamental principles that guide my approach to public
                  service and leadership
                </p>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                {personalValues.map((value, index) => (
                  <Card
                    key={index}
                    className='hover:shadow-lg transition-shadow'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 bg-[#FF9933]/10 rounded-full flex items-center justify-center text-[#FF9933]'>
                          {value.icon}
                        </div>
                        <div>
                          <h4 className='font-bold text-lg mb-2'>
                            {value.title}
                          </h4>
                          <p className='text-muted-foreground'>
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='achievements' className='space-y-6'>
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold mb-4'>Key Achievements</h3>
                <p className='text-muted-foreground max-w-2xl mx-auto'>
                  Milestones and accomplishments in public service and community
                  development
                </p>
              </div>

              <div className='space-y-6'>
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className='hover:shadow-lg transition-shadow'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 bg-[#138808]/10 rounded-full flex items-center justify-center text-[#138808]'>
                          {achievement.icon}
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-bold text-lg mb-2'>
                            {achievement.title}
                          </h4>
                          <p className='text-muted-foreground mb-3'>
                            {achievement.description}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {achievement.details}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='py-16 bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10'>
        <div className='container px-4 sm:px-6 text-center'>
          <h3 className='text-2xl font-bold mb-4'>
            Let's Build a Better Tomorrow Together
          </h3>
          <p className='text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Join me in the journey towards progress, development, and prosperity
            for our beloved Assam and our great nation.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Button size='lg' className='bg-[#FF9933] hover:bg-[#FF9933]/90'>
              <Users className='w-4 h-4 mr-2' />
              Connect With Me
            </Button>
            <Button size='lg' variant='outline'>
              <BookOpen className='w-4 h-4 mr-2' />
              View My Work
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ExtendAbout;
