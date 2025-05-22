import { motion } from "framer-motion";
import {
  Award,
  Users,
  Calendar,
  MapPin,
  GraduationCap,
  Heart,
} from "lucide-react";
import BiswajitPhukan from "./../../assets/user.jpg";
import BJP from "./../../assets/bjp.png";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const infoCards = [
    {
      icon: <GraduationCap className='w-5 h-5 text-blue-600' />,
      title: "Education",
      value: "MA from Gauhati University (1997)",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      icon: <Heart className='w-5 h-5 text-pink-600' />,
      title: "Family",
      value: "Son of Rajen Phukan, married to Prapti Thakur",
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-100",
    },
    {
      icon: <Users className='w-5 h-5 text-orange-600' />,
      title: "Party",
      value: "Bharatiya Janata Party (BJP)",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
    },
    {
      icon: <MapPin className='w-5 h-5 text-green-600' />,
      title: "Constituency",
      value: "Sarupathar, Assam",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
  ];

  const stats = [
    {
      number: "1,07,090",
      label: "Votes Received",
      icon: <Award className='w-6 h-6' />,
    },
    {
      number: "2021",
      label: "Year Elected",
      icon: <Calendar className='w-6 h-6' />,
    },
    {
      number: "3+",
      label: "Years of Service",
      icon: <Users className='w-6 h-6' />,
    },
  ];

  return (
    <section
      id='about'
      className='py-12 md:py-16 lg:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden'
    >
      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse'></div>
      </div>

      <div className='container px-4 sm:px-6 relative z-10'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          className='grid gap-8 md:gap-12 lg:gap-16 md:grid-cols-2 items-center'
        >
          {/* Image Section */}
          <motion.div
            variants={imageVariants}
            className='relative aspect-square max-w-md mx-auto mb-6 md:mb-0'
          >
            <div className='relative'>
              <motion.img
                src={BiswajitPhukan}
                alt='Biswajit Phukan'
                className='object-cover rounded-2xl shadow-2xl w-full h-full'
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />

              {/* Gradient overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl'></div>

              {/* BJP Logo with enhanced styling */}
              <motion.div
                className='absolute -bottom-6 -right-6 w-28 h-28 md:w-36 md:h-36 bg-white rounded-full p-2 shadow-xl'
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={BJP}
                  alt='BJP Logo'
                  className='object-contain w-full h-full rounded-full'
                />
              </motion.div>

              {/* Decorative ring */}
              <div className='absolute -inset-4 bg-gradient-to-r from-orange-200 via-white to-green-200 rounded-2xl opacity-20 -z-10'></div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div variants={itemVariants} className='space-y-8 px-2'>
            {/* Badge */}
            <motion.div
              className='inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200'
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className='text-orange-600 font-semibold text-sm'>
                About Me
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              variants={itemVariants}
              className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight'
            >
              Committed to Service & National Development
            </motion.h2>

            {/* Description */}
            <motion.div variants={itemVariants} className='space-y-4'>
              <p className='text-slate-600 leading-relaxed text-lg'>
                As a dedicated member of the Bharatiya Janata Party from Assam,
                I have committed my life to public service. I was elected to the
                Assam Legislative Assembly in 2021 from the Sarupathar
                constituency, winning with{" "}
                <span className='font-semibold text-orange-600'>
                  1,07,090 votes
                </span>
                .
              </p>
              <p className='text-slate-600 leading-relaxed text-lg'>
                Before my current role, I served as the vice-chairman of Assam
                State Cooperative Bank, where I worked to strengthen financial
                inclusion and support for local communities. I continue to
                uphold the values of{" "}
                <span className='font-semibold text-green-600'>
                  integrity, transparency, and inclusive development
                </span>
                .
              </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={itemVariants}
              className='grid grid-cols-3 gap-4 py-6 px-4 bg-white rounded-xl shadow-lg border border-slate-100'
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className='text-center'
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='flex justify-center mb-2 text-slate-600'>
                    {stat.icon}
                  </div>
                  <div className='font-bold text-xl text-slate-800'>
                    {stat.number}
                  </div>
                  <div className='text-sm text-slate-500'>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Info Cards */}
            <motion.div
              variants={itemVariants}
              className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4'
            >
              {infoCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover='hover'
                  className={`${card.bgColor} p-4 rounded-xl shadow-sm border border-white/50 backdrop-blur-sm`}
                >
                  <div className='flex items-start space-x-3'>
                    <div className={`${card.iconBg} p-2 rounded-lg`}>
                      {card.icon}
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-slate-800 mb-1'>
                        {card.title}
                      </h3>
                      <p className='text-sm text-slate-600 leading-relaxed'>
                        {card.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
