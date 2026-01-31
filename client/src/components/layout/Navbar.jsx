import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Code, Menu, X, Github, Home, Zap } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const navLinks = [
    {
      id: 'features',
      label: 'Features',
      href: '/#features'
    },
    {
      id: 'how-it-works',
      label: 'How It Works',
      href: '/#how-it-works'
    },
    {
      id: 'reviews',
      label: 'Reviews',
      href: '/#testimonials'
    }
  ];

  const handleLinkClick = (linkId) => {
    setActiveLink(linkId);
    setIsMenuOpen(false); // Close mobile menu when link is clicked
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-[#0B0F1A] border-b border-gray-800 shadow-sm" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex items-center justify-between py-4">
            
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105">
                  <Code className="w-6 h-6 text-white" />
                </div>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold font-mono bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                  DevStarter
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => handleLinkClick(link.id)}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 group
                    ${activeLink === link.id 
                      ? 'text-blue-300 bg-blue-500/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span>{link.label}</span>
                  
                  {/* Animated underline */}
                  <div className={`
                    absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 transform -translate-x-1/2
                    ${activeLink === link.id 
                      ? 'w-full opacity-100' 
                      : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }
                  `} />
                </a>
              ))}
            

                {/* CTA Button (Desktop) */}
                <div className="hidden md:block">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" onClick={() => navigate("/")}>
                    Get Started
                  </button>
                </div>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="bg-black/40 backdrop-blur-lg border-t border-gray-800/50">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Brand
              <div className="flex items-center space-x-3 px-4 py-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-mono text-white">DevStarter</span>
              </div> */}

              {/* Mobile Links */}
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => handleLinkClick(link.id)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                    ${activeLink === link.id 
                      ? 'text-blue-300 bg-blue-500/10 border-l-2 border-blue-500' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                    
                  <span>{link.label}</span>
                </a>
              ))}

              {/* Mobile CTA Button */}
              <div className="pt-4 px-4">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 rounded-lg text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"  onClick={() => navigate("/")}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}