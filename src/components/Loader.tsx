import { useEffect, useState } from "react";

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 w-full max-w-4xl px-4">
        {/* Logo Container - Larger and responsive */}
        <div className="relative w-50 h-50 md:w-64 md:h-64 lg:w-80 lg:h-80 mb-6 md:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-lg animate-pulse"></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center p-10 animate-float">
            <img 
              src="/LoaderEvtLoop.png"
              alt="Event Loop Logo"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Company Name - Responsive text sizing */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 text-center">
          Event Loop<span className="text-purple-600">.</span>Pvt<span className="text-blue-600">.</span>Ltd
        </h1>

        {/* Tagline - Larger on big screens */}
        <p className="text-md md:text-xl text-gray-600 italic text-center">
          Book your memories, effortlessly
        </p>

        {/* Progress Bar - Wider on larger screens */}
        <div className="w-64 md:w-84 bg-gray-200 rounded-full h-3 mt-8">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Animated Dots - Slightly larger */}
        <div className="flex space-x-3 mt-6">
          <div className="w-4 h-4 bg-blue-600 rounded-full" style={{ animation: `bounce 1.5s infinite 0s` }}></div>
          <div className="w-4 h-4 bg-purple-500 rounded-full" style={{ animation: `bounce 1.5s infinite 0.2s` }}></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full" style={{ animation: `bounce 1.5s infinite 0.4s` }}></div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;