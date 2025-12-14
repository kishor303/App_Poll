import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate('/student');
  };

  const handleTeacherLogin = () => {
    navigate('/teacher');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Gaming Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-background"></div>
        </div>
        
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}

        {/* Animated Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Scan Lines Effect */}
        <div className="absolute inset-0 scanlines opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="text-7xl md:text-9xl mb-4 animate-bounce">📊</div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Live Polling
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 font-medium">Modern Classroom</p>
          </div>

          {/* Circular Selection Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {/* Student Button */}
            <button
              onClick={handleStudentLogin}
              className="group relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-2xl hover:shadow-blue-500/50 border-4 border-blue-300 hover:border-blue-200"
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-6xl md:text-8xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  🎓
                </div>
                <span className="text-2xl md:text-3xl font-bold mb-2">Student</span>
                <span className="text-sm md:text-base opacity-90">Join & Answer</span>
              </div>

              {/* Animated Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping opacity-0 group-hover:opacity-100"></div>
            </button>

            {/* VS Divider */}
            <div className="text-white text-3xl md:text-5xl font-bold animate-pulse">VS</div>

            {/* Teacher Button */}
            <button
              onClick={handleTeacherLogin}
              className="group relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-110 hover:-rotate-3 shadow-2xl hover:shadow-amber-500/50 border-4 border-amber-300 hover:border-amber-200"
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-6xl md:text-8xl mb-4 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
                  👨‍🏫
                </div>
                <span className="text-2xl md:text-3xl font-bold mb-2">Teacher</span>
                <span className="text-sm md:text-base opacity-90">Create & Analyze</span>
              </div>

              {/* Animated Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping opacity-0 group-hover:opacity-100"></div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 animate-fade-in">
            <p className="text-blue-200 text-sm md:text-base">
              Real-time polling system for interactive classrooms
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        .particle {
          animation: float linear infinite;
        }

        .grid-background {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
