import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useRef, useState, useLayoutEffect } from "react";

interface TimelineEventData {
  year: number;
  title: string;
  description: string;
  details: string;
}

const timelineEvents: readonly TimelineEventData[] = [
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
  {
    year: 2026,
    title: "Re-election Victory",
    description:
      "Won Assam Legislative Assembly election from Sarupathar again",
    details:
      "Secured re-election in the 2026 Assam Legislative Assembly elections, winning the Sarupathar (Golaghat) constituency once again on a BJP ticket, continuing the mandate of service to constituents.",
  },
  {
    year: 2026,
    title: "Oath of Office",
    description:
      "Took the oath as MLA to faithfully serve the people of Sarupathar",
    details:
      "Sworn in as a Member of the Legislative Assembly, taking a solemn oath to uphold the Constitution and to dedicate himself to the service and welfare of the people of Sarupathar.",
  },
];

const Timeline = () => {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  // Wrapper provides the vertical scroll distance; sticky child is pinned.
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Track holds the horizontal row; we measure its overflow to compute travel.
  const trackRef = useRef<HTMLDivElement>(null);

  // Distance (in px) the track must move left so its end aligns with viewport end.
  const [travelDistance, setTravelDistance] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      // scrollWidth = full content width; clientWidth = visible width.
      const overflow = track.scrollWidth - track.clientWidth;
      setTravelDistance(overflow > 0 ? overflow : 0);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -travelDistance]);

  return (
    // Wrapper height controls scroll length: 100vh pin + extra per horizontal travel.
    // Using vh keeps it responsive; the sticky child pins within it.
    <section id='timeline' className='bg-background'>
      <div ref={wrapperRef} className='relative h-[300vh]'>
        <div className='sticky top-0 h-screen flex flex-col justify-center overflow-hidden'>
          <motion.div
            className='text-center mb-12 px-4'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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

          {/* Hidden-scrollbar horizontal track, moved via scroll-driven x. */}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className='flex gap-36 px-[15vw] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
          >
            {/* Horizontal connector line behind the cards */}
            <div className='absolute top-1/2 left-0 h-0.5 w-full bg-[#FF9933]/20 -z-0' />

            {timelineEvents.map((event, index) => (
              <TimelineEvent
                key={`${event.year}-${index}`}
                event={event}
                index={index}
                progress={smoothProgress}
                total={timelineEvents.length}
                isExpanded={expandedEvent === index}
                onToggle={() =>
                  setExpandedEvent(expandedEvent === index ? null : index)
                }
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;

function TimelineEvent({
  event,
  index,
  progress,
  total,
  isExpanded,
  onToggle,
}: {
  event: TimelineEventData;
  index: number;
  progress: MotionValue<number>;
  total: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Reveal each card as the scroll progress reaches its slot.
  const slotStart = index / total;
  const slotEnd = (index + 1) / total;
  const opacity = useTransform(
    progress,
    [slotStart - 0.1, slotStart, slotEnd],
    [0, 1, 1],
  );
  const y = useTransform(progress, [slotStart - 0.1, slotStart], [50, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className='relative z-10 flex-shrink-0 w-96 flex flex-col items-center'
    >
      {/* Node marker on the connector line */}
      <div className='flex items-center justify-center w-8 h-8 bg-[#FF9933] rounded-full mb-6 ring-4 ring-[#FF9933]/15'>
        <div className='w-3 h-3 bg-background rounded-full' />
      </div>

      <motion.div
        className='w-96 cursor-pointer'
        whileHover={{ scale: 1.09, y: -6 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        onClick={onToggle}
      >
        {/* Card surface: gradient border + glassy fill */}
        <div className='group relative overflow-hidden rounded-2xl p-[1.5px] bg-gradient-to-br from-[#FF9933]/40 via-[#FF9933]/10 to-[#138808]/30 shadow-lg shadow-[#FF9933]/5'>
          <div className='relative overflow-hidden rounded-2xl bg-background/80 backdrop-blur-sm p-10'>
            {/* Abstract decoration: soft gradient blobs */}
            <div
              aria-hidden
              className='pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#FF9933]/15 blur-2xl'
            />
            <div
              aria-hidden
              className='pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-[#138808]/15 blur-2xl'
            />

            {/* Abstract decoration: oversized year watermark */}
            <span
              aria-hidden
              className='pointer-events-none absolute -top-3 right-3 select-none text-7xl font-black leading-none text-[#EC6530]/13'
            >
              {event.year}
            </span>

            {/* Content */}
            <div className='relative'>
              <span className='inline-block rounded-full bg-[#FF9933]/10 px-3 py-1 text-sm font-bold tracking-wide text-[#FF9933]'>
                {event.year}
              </span>
              <h3 className='mt-3 text-xl font-semibold text-foreground'>
                {event.title}
              </h3>
              <p className='mt-2 text-muted-foreground'>{event.description}</p>

              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className='overflow-hidden'
              >
                <p className='mt-3 border-t border-[#FF9933]/10 pt-3 text-sm leading-relaxed text-muted-foreground'>
                  {event.details}
                </p>
              </motion.div>

              {/* Subtle expand affordance */}
              <span className='mt-3 inline-block text-xs font-medium text-[#138808]/80'>
                {isExpanded ? "Show less" : "Read more"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
