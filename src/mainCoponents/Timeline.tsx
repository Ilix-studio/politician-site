import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { useRef, useState } from "react";

const timelineEvents = [
  {
    year: 1997,
    title: "Educational Achievement",
    description: "Completed MA degree from Gauhati University",
    details:
      "Graduated with a Master of Arts degree from the prestigious Gauhati University, laying the foundation for a career in public service.",
  },
  {
    year: 2010,
    title: "Entry into Public Service",
    description:
      "Began active involvement in community development initiatives in Assam",
    details:
      "Started working closely with local communities in Golaghat district, focusing on grassroots development and addressing local challenges.",
  },
  {
    year: 2015,
    title: "Banking Leadership",
    description: "Appointed as Vice-Chairman of Assam State Cooperative Bank",
    details:
      "Took on the important role of Vice-Chairman at the Assam State Cooperative Bank, working to strengthen financial inclusion and economic development across the state.",
  },
  {
    year: 2019,
    title: "BJP Party Nomination",
    description: "Selected as BJP candidate for Sarupathar constituency",
    details:
      "Was chosen by the Bharatiya Janata Party leadership to represent the party in the Sarupathar constituency, recognizing years of dedicated service to the people and the party.",
  },
  {
    year: 2021,
    title: "Electoral Victory",
    description: "Won Assam Legislative Assembly election from Sarupathar",
    details:
      "Secured a decisive victory in the 2021 Assam Legislative Assembly elections, winning the Sarupathar constituency with 1,07,090 votes, marking a significant milestone in political career.",
  },
  {
    year: 2022,
    title: "Legislative Initiatives",
    description: "Launched key development programs for Sarupathar",
    details:
      "Initiated several development projects focusing on infrastructure, education, and healthcare to address the needs of constituents in Sarupathar and surrounding areas.",
  },
];

const LeafIcon = ({ progress }: { progress: number }) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='w-6 h-6'
    style={{ transform: `scale(${progress})` }}
  >
    <path
      d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'
      stroke='#FF9933'
      strokeWidth='2'
    />
    <path
      d='M12 8C12 8 14 10 14 12C14 14 12 16 12 16C12 16 10 14 10 12C10 10 12 8 12 8Z'
      stroke='#FF9933'
      strokeWidth='2'
    />
  </svg>
);

const Timeline = () => {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <section
      id='timeline'
      ref={containerRef}
      className='py-20 bg-background overflow-hidden'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className='inline-block px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
            Timeline
          </div>
          <h2 className='text-3xl font-bold text-foreground sm:text-4xl'>
            My Political Journey
          </h2>
          <p className='mt-4 text-lg text-muted-foreground'>
            The path of service and leadership in Assam
          </p>
        </motion.div>

        <div className='relative'>
          {/* Vertical line */}
          <motion.div
            className='absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#FF9933]/20'
            style={{ scaleY: scaleX }}
          />

          {/* Icon */}
          <motion.div
            className='sticky top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-[#FF9933]'
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
          >
            <LeafIcon
              progress={useTransform(scrollYProgress, [0, 1], [0.5, 1]) as any}
            />
          </motion.div>

          {timelineEvents.map((event, index) => (
            <TimelineEvent
              key={event.year}
              event={event}
              index={index}
              isExpanded={expandedEvent === index}
              onToggle={() =>
                setExpandedEvent(expandedEvent === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;

function TimelineEvent({
  event,
  index,
  isExpanded,
  onToggle,
}: {
  event: (typeof timelineEvents)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`mb-8 flex justify-between items-center w-full ${
        index % 2 === 0 ? "flex-row-reverse" : ""
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className='w-5/12' />
      <div className='z-20'>
        <div className='flex items-center justify-center w-8 h-8 bg-[#FF9933] rounded-full'>
          <div className='w-3 h-3 bg-background rounded-full' />
        </div>
      </div>
      <motion.div
        className='w-5/12 cursor-pointer'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
      >
        <div className='p-4 bg-background rounded-lg shadow-md border border-[#FF9933]/10'>
          <span className='font-bold text-[#FF9933]'>{event.year}</span>
          <h3 className='text-lg font-semibold mb-1'>{event.title}</h3>
          <p className='text-muted-foreground'>{event.description}</p>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className='overflow-hidden'
          >
            <p className='mt-2 text-sm text-muted-foreground'>
              {event.details}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
