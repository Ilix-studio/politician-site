import { Card, CardContent } from "@/components/ui/card";
import {
  IconHealthRecognition,
  IconMatrix,
  IconSchool,
} from "@tabler/icons-react";
import Chakra from "./../assets/AshokaChakra.png";
import { motion } from "framer-motion";

const achievements = [
  {
    title: "Infrastructure Development",
    description:
      "Secured funding for 200+ km of new roads, 50 bridges, and modernization of public transport.",
    Icon: IconMatrix,
    iconWrapClass: "bg-[#FF9933]/10",
  },
  {
    title: "Education Reform",
    description:
      "Established 25 new schools and implemented digital learning programs reaching 100,000+ students.",
    Icon: IconSchool,
    iconWrapClass: "bg-white border border-[#000080]",
  },
  {
    title: "Healthcare Access",
    description:
      "Launched mobile health clinics serving rural areas and improved hospital infrastructure.",
    Icon: IconHealthRecognition,
    iconWrapClass: "bg-[#138808]/10",
  },
] as const;

const Achievement = () => {
  return (
    <section
      id='achievements'
      className='py-12 sm:py-16 md:py-24 bg-slate-50 relative overflow-hidden'
    >
      <div className='container px-4 sm:px-6 relative'>
        <div className='text-center max-w-3xl mx-auto mb-8 sm:mb-12'>
          <div className='inline-block px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-xs sm:text-sm mb-4'>
            Achievements
          </div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight'>
            Making a Difference
          </h2>
          <p className='text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4'>
            A track record of successful initiatives and impactful policies that
            have transformed communities.
          </p>
        </div>

        <div className='grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 relative'>
          {/* Chakra Decoration - Behind First Card */}
          <motion.div
            className='absolute -left-10 -top-10 lg:-left-13 lg:-top-13 z-0 hidden md:block pointer-events-none'
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            aria-hidden='true'
          >
            <img
              src={Chakra}
              alt=''
              className='w-24 h-24 lg:w-32 lg:h-32 opacity-90'
            />
          </motion.div>

          {achievements.map(({ title, description, Icon, iconWrapClass }) => (
            <Card key={title} className='relative z-10'>
              <CardContent className='p-5 sm:p-6 space-y-3 sm:space-y-4'>
                <div
                  className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center ${iconWrapClass}`}
                >
                  <Icon stroke={2} />
                </div>
                <h3 className='text-lg sm:text-xl font-bold'>{title}</h3>
                <p className='text-sm sm:text-base text-muted-foreground'>
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievement;
