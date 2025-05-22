import { Card, CardContent } from "@/components/ui/card";
import {
  IconHealthRecognition,
  IconMatrix,
  IconSchool,
} from "@tabler/icons-react";
import Chakra from "./../assets/AshokaChakra.png";
import { motion } from "framer-motion";

const Achievement = () => {
  return (
    <section id='achievements' className='py-16 md:py-24 bg-slate-50 relative'>
      <div className='container relative'>
        <div className='text-center max-w-3xl mx-auto mb-12'>
          <div className='inline-block px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
            Achievements
          </div>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Making a Difference
          </h2>
          <p className='text-muted-foreground mt-4'>
            A track record of successful initiatives and impactful policies that
            have transformed communities.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-3 relative'>
          {/* Chakra Decoration - Behind First Card */}
          <motion.div
            className='absolute -left-13 -top-13 z-0 hidden md:block'
            animate={{ rotate: 360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <img
              src={Chakra}
              alt='Ashoka Chakra'
              className='w-32 h-32 opacity-90'
            />
          </motion.div>

          {/* First Card */}
          <Card className='relative z-10'>
            <CardContent className='p-6 space-y-4'>
              <div className='h-12 w-12 rounded-full bg-[#FF9933]/10 flex items-center justify-center'>
                <IconMatrix stroke={2} />
              </div>
              <h3 className='text-xl font-bold'>Infrastructure Development</h3>
              <p className='text-muted-foreground'>
                Secured funding for 200+ km of new roads, 50 bridges, and
                modernization of public transport.
              </p>
            </CardContent>
          </Card>

          {/* Second Card */}
          <Card>
            <CardContent className='p-6 space-y-4'>
              <div className='h-12 w-12 rounded-full bg-white border border-[#000080] flex items-center justify-center'>
                <IconSchool stroke={2} />
              </div>
              <h3 className='text-xl font-bold'>Education Reform</h3>
              <p className='text-muted-foreground'>
                Established 25 new schools and implemented digital learning
                programs reaching 100,000+ students.
              </p>
            </CardContent>
          </Card>

          {/* Third Card */}
          <Card>
            <CardContent className='p-6 space-y-4'>
              <div className='h-12 w-12 rounded-full bg-[#138808]/10 flex items-center justify-center'>
                <IconHealthRecognition stroke={2} />
              </div>
              <h3 className='text-xl font-bold'>Healthcare Access</h3>
              <p className='text-muted-foreground'>
                Launched mobile health clinics serving rural areas and improved
                hospital infrastructure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Achievement;
