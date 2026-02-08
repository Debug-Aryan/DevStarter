import { Github, Twitter, Linkedin, Heart, ExternalLink } from 'lucide-react';
import devstarterLogo from '../../assets/devstarter.svg';

export default function Footer() {
    return (
        <>
            <footer className="relative z-10 px-6 py-12 bg-grey/10 backdrop-blur border-t border-gray-800">
                <div className="max-w-7xl mx-auto">

                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">

                        {/* Left: Logo */}
                        <div className="flex items-center space-x-3 group">
                            <div className="bg-white/5 rounded-lg flex items-center justify-center transform transition-transform duration-700 ease-in-out group-hover:rotate-[720deg]">
                                <img
                                    src={devstarterLogo}
                                    alt="DevStarter"
                                    className="w-8 h-8 object-contain"
                                    draggable="false"
                                />
                            </div>
                            <span className="text-xl font-bold font-mono text-white">DevStarter</span>
                        </div>

                        {/* Center: Links */}
                        <div className="flex flex-wrap justify-center md:justify-center space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">About</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">GitHub</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Contact</a>
                        </div>

                        {/* Right: Social Icons */}
                        <div className="flex space-x-5">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-500 text-center">
                        <p className="text-m text-gray-500">
                            Empowering developers worldwide with modern tools • © {new Date().getFullYear()} DevStarter. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    )
}