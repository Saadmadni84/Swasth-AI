'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/auth-context';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SwasthAILogo from './SwasthAILogo';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    {
      href: '/hero',
      label: 'Home',
      isActive: pathname === '/hero' || pathname === '/'
    },
    {
      href: '/health-check',
      label: 'Health Check',
      isActive: pathname === '/health-check'
    },
    {
      href: '/mental-health',
      label: 'Mental Health',
      isActive: pathname === '/mental-health'
    },
    {
      href: '/3d-lab',
      label: '3D Lab',
      isActive: pathname === '/3d-lab'
    },
    {
      href: '/find-doctor',
      label: 'Find Doctor',
      isActive: pathname === '/find-doctor'
    },
    {
      href: '/test-ai',
      label: 'AI Assistant',
      isActive: pathname === '/test-ai'
    },
    {
      href: '/simple-profile',
      label: 'My Profile',
      isActive: pathname === '/simple-profile'
    }
  ];

  const LinkComponent = ({ href, children, className, isActive }) => (
    <Link
      href={href}
      className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 transform hover:scale-105 ${
        isActive
          ? 'bg-gradient-to-r from-cyan-500/90 via-blue-500/90 to-indigo-600/90 text-white shadow-2xl shadow-blue-500/40 backdrop-blur-sm border border-white/20'
          : 'text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:border hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/20'
      } ${className}`}
    >
      {children}
      
      {/* Active indicator */}
      {isActive && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl animate-pulse opacity-30" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
        </>
      )}
      
      {/* Hover glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300" />
    </Link>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a] border-b-2 border-slate-700 shadow-2xl shadow-black/30">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -top-40 -left-32 w-80 h-80 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/hero" className="flex items-center space-x-3 group relative">
              <div className="relative">
                {/* SwasthAI Logo Component */}
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-blue-500/30 group-hover:shadow-blue-500/50 overflow-hidden">
                  <SwasthAILogo 
                    variant="heart" 
                    size="md" 
                    className="scale-75" 
                  />
                </div>
                
                {/* Glowing border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-70 blur-lg transition-all duration-500" />
                
                {/* Animated particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-2 -right-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="font-bold text-2xl bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-indigo-300 transition-all duration-500">
                  SwasthAI
                </span>
                <span className="text-xs text-blue-200/70 font-medium tracking-wider uppercase">
                  Healthcare AI
                </span>
              </div>
              
              {/* Hover effect background */}
              <div className="absolute -inset-4 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <LinkComponent
                  key={link.href}
                  href={link.href}
                  isActive={link.isActive}
                  className="flex items-center space-x-2"
                >
                  <span>{link.label}</span>
                </LinkComponent>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <LinkComponent
                    href="/dashboard"
                    isActive={pathname === '/dashboard'}
                    className="flex items-center space-x-2"
                  >
                    <span>Dashboard</span>
                  </LinkComponent>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-300">
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 hover:text-red-300 transition-colors duration-200 flex items-center space-x-2 border border-red-500/30"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <LinkComponent href="/auth/login" isActive={false} className="flex items-center space-x-2">
                    <span>Login</span>
                  </LinkComponent>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center space-x-2"
                  >
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-colors duration-200 border border-slate-700/50"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 relative">
                <div className={`absolute w-full h-0.5 bg-slate-300 transition-all duration-300 ${
                  isMenuOpen ? 'top-2 rotate-45' : 'top-1'
                }`} />
                <div className={`absolute top-2 w-full h-0.5 bg-slate-300 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`} />
                <div className={`absolute w-full h-0.5 bg-slate-300 transition-all duration-300 ${
                  isMenuOpen ? 'top-2 -rotate-45' : 'top-3'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-4 bg-[#0f172a] backdrop-blur-md border-t-2 border-slate-700 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  link.isActive
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-blue-400'
                }`}
              >
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-slate-700/50 pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">
                        {user.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-800/50 hover:text-blue-400 rounded-lg transition-colors"
                  >
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-800/50 hover:text-blue-400 rounded-lg transition-colors"
                  >
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium shadow-lg"
                  >
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;
