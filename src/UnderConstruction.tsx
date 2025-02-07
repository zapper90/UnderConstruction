import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

const UnderConstruction = () => {
  const [dotCount, setDotCount] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Prevent scrolling on mount
  useEffect(() => {
    // Save original styles
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Cleanup function to restore original styles
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      document.body.style.height = 'auto';
    };
  }, []);

  // Generate random particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < (window.innerWidth < 768 ? 20 : 35); i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (window.innerWidth < 768 ? 4 : 8) + (window.innerWidth < 768 ? 3 : 6),
          duration: Math.random() * 15 + 25
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Mouse parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  // Loading dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleNostrFollow = () => {
    const npub = 'npub1nawnnh69a0e7zurp822j9nmagjnr3tdp2vc6j26n29d5whhe9wqs983sxy';
    window.location.href = `https://nostter.app/${npub}`;
  };

  // Background circle parallax
  const circleX = useTransform(mouseX, [0, 1000], [-20, 20]);
  const circleY = useTransform(mouseY, [0, 1000], [-20, 20]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Custom Particles */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-yellow-500/40"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 60 - 30],
              y: [0, Math.random() * 60 - 30],
              scale: [1, Math.random() * 0.3 + 0.7],
              opacity: [0.4, 0.3]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Background Elements */}
      <motion.div 
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ x: circleX, y: circleY }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-100 rounded-full opacity-20 blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-3xl mx-auto text-center z-10 px-4 sm:px-8 py-4 sm:py-8"
      >
        {/* Logo Section */}
        <div className="mb-4 sm:mb-12">
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <div className="text-5xl sm:text-7xl filter drop-shadow-md mb-4">⚡</div>
          </motion.div>
          <motion.h1 
            className="mt-4 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent px-2 py-1 leading-[1.2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="inline-block py-2">Lightning Board</span>
          </motion.h1>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h2 className="text-xl sm:text-3xl font-medium text-gray-700 mb-2 tracking-tight">
              Under Construction
              <span className="inline-block ml-1 opacity-75 w-8 text-left">
                {'.'.repeat(dotCount)}
              </span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-6">
              We're crafting something extraordinary
            </p>
            <motion.blockquote 
              className="max-w-xl mx-auto px-4 py-3 border-l-4 border-yellow-500/30 bg-gradient-to-br from-white/40 to-white/20 rounded-r-lg backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <p className="text-gray-600 text-base sm:text-lg italic font-light leading-relaxed">
                "The secret of change is to focus all of your energy not on fighting the old, but on building the new."
              </p>
              <footer className="mt-1 text-gray-500 text-xs sm:text-sm font-medium">
                ― Socrates
              </footer>
            </motion.blockquote>
          </motion.div>

          <motion.button
            onClick={handleNostrFollow}
            initial={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 mx-auto"
          >
            <span className="text-base sm:text-lg">Follow us on Nostr ⚡</span>
            <motion.svg 
              className="w-5 h-5"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-7v4h3l-4 7z"/>
            </motion.svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default UnderConstruction; 