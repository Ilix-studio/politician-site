import { Wrench, Hammer, HardHat } from "lucide-react";

const UnderConstruction = () => {
  return (
    <div className='min-h-[50vh] bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4'>
      <div className='max-w-2xl text-center'>
        {/* Icon Section */}
        <div className='flex justify-center items-center space-x-4 mb-8'>
          <div className='relative'>
            <HardHat className='w-16 h-16 text-orange-500 animate-bounce' />
          </div>
          <div className='relative'>
            <Hammer className='w-12 h-12 text-yellow-600 animate-pulse' />
          </div>
          <div className='relative'>
            <Wrench className='w-14 h-14 text-orange-600 animate-bounce delay-150' />
          </div>
        </div>

        {/* Main Message */}
        <h1 className='text-4xl md:text-6xl font-bold text-gray-800 mb-4'>
          Under Construction
        </h1>

        <p className='text-lg text-gray-500 mb-8'>
          Our site is currently under development.
        </p>

        {/* Progress Bar */}
        <div className='w-full max-w-md mx-auto mb-8'>
          <div className='flex justify-between text-sm text-gray-500 mb-2'>
            <span>Progress</span>
            <span>75%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-3'>
            <div
              className='bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full animate-pulse'
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
