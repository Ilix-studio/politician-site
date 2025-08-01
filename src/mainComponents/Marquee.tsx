import { motion } from "framer-motion";

const Marquee = () => {
  return (
    <div className='relative w-full overflow-hidden bg-background py-17'>
      <div className='absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-9' />
      <motion.div
        className='flex whitespace-nowrap'
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          duration: 20,
        }}
      >
        {[...Array(4)].map((_, index) => (
          <div key={index} className='flex items-center mx-4'>
            <span
              className='text-7xl sm:text-8xl md:text-9xl font-bold text-transparent px-4'
              style={{
                WebkitTextStroke: "2px rgb(204 85 0)", // Changed to dark orange
              }}
            >
              Bharatiya Janata Party
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
