import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import devstarterLogo from '../../assets/devstarter.svg';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const [activeLink, setActiveLink] = useState('features'); // Default active

  const navLinks = [
    { id: 'features', label: 'Features', href: '/#features' },
    { id: 'how-it-works', label: 'How It Works', href: '/#how-it-works' },
    { id: 'reviews', label: 'Reviews', href: '/#testimonials' }
  ];

  const handleLinkClick = (linkId) => {
    setActiveLink(linkId);
    setIsMenuAnimating(true);
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuAnimating(true);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
      return;
    }

    setIsMenuAnimating(true);
    setIsMenuOpen(true);
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  return (
    // Outer container for positioning (Floating effect)
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 pt-6 pb-4">

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-backdrop"
            className="fixed inset-0 md:hidden bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
      
      {/* The Pill Navbar */}
      <nav className={`
        relative z-10
        w-full max-w-5xl 
        bg-[#0B0F1A]/90 backdrop-blur-md 
        border border-white/10 shadow-2xl shadow-black/50
        transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-in-out
        ${(isMenuOpen || isMenuAnimating) ? 'rounded-3xl' : 'rounded-full'}
      `}>
        <div className="px-6 md:px-8">
          <div className="flex items-center justify-between py-3">
            
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <div className="bg-white/5 rounded-full flex items-center justify-center transform transition-transform duration-0 ease-in-out group-hover:duration-700 group-hover:rotate-[720deg]">
                  <img
                    src={devstarterLogo}
                    alt="DevStarter"
                    className="w-11 h-11 object-contain"
                    draggable="false"
                  />
                </div>
              </div>
              <span className="text-xl font-bold font-brand bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300 hidden sm:block">
                DevStarter
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => handleLinkClick(link.id)}
                  data-no-loader="true"
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group
                    ${activeLink === link.id 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  <span className="relative z-10">{link.label}</span>
                  
                  {/* Pill Background Indicator (More modern than underline for pill navs) */}
                  {activeLink === link.id && (
                    <div className="absolute inset-0 bg-white/10 rounded-full -z-0" />
                  )}
                </a>
              ))}
            </div>

            {/* CTA Button & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              {/* Desktop CTA */}
              <div className="hidden md:block">
                <button 
                  className="group relative overflow-hidden px-5 py-2 rounded-full text-sm font-semibold text-gray-200 bg-[#161B22] border border-gray-700 shadow-xl transition-all duration-300 hover:bg-[#1f2631] hover:border-blue-500/50 active:scale-95 cursor-pointer"
                  onClick={() => navigate("/generate")}
                >
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Get Started</span>
                </button>

              </div>

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                onClick={toggleMenu}
                data-no-loader="true"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence initial={false} onExitComplete={() => setIsMenuAnimating(false)}>
          {isMenuOpen && (
            <motion.div
              id="mobile-nav"
              key="mobile-nav"
              className="md:hidden overflow-hidden origin-top"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onAnimationStart={() => setIsMenuAnimating(true)}
            >
              <motion.div
                className="px-6 space-y-2 pt-2 pb-6 border-t border-white/5"
                initial={{ y: -6 }}
                animate={{ y: 0 }}
                exit={{ y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => handleLinkClick(link.id)}
                    data-no-loader="true"
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${activeLink === link.id 
                        ? 'text-blue-300 bg-white/5' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <span>{link.label}</span>
                  </a>
                ))}

                <div className="pt-4">
                  <button 
                    className="group relative w-full overflow-hidden px-4 py-3 rounded-xl text-sm font-semibold text-gray-200 bg-[#161B22] border border-gray-700 shadow-xl transition-all duration-300 hover:bg-[#1f2631] hover:border-blue-500/50 active:scale-95 cursor-pointer"
                    onClick={() => {
                      closeMenu();
                      navigate("/generate");
                    }}
                  >
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Get Started</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}