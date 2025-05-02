import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGroup } from '../../contexts/GroupContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { group, hasGroup } = useGroup();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close dropdown when clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGroupDropdown(false);
      }
      
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Detect scroll for floating effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-opacity-95 backdrop-blur-md shadow-lg' 
        : 'bg-opacity-100'
    } bg-[var(--bg-card)] border-b border-[var(--border-color)]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={user ? '/dashboard' : '/'}>
              <div className="flex items-center group">
                <div className="relative h-8 w-8 mr-2 overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 animate-pulse-slow"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold hidden sm:inline-block transition-all duration-300">
                  <span className="text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">Study</span>
                  <span className="text-cyan-400 group-hover:text-cyan-500">Sync</span>
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                    hover:bg-[var(--hover-color)] hover:scale-105 
                    ${router.pathname === '/dashboard' 
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                      : 'text-[var(--text-secondary)]'
                    }`}>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </span>
                  </span>
                </Link>
                <Link href="/calendar">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                    hover:bg-[var(--hover-color)] hover:scale-105 
                    ${router.pathname === '/calendar' 
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                      : 'text-[var(--text-secondary)]'
                    }`}>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Calendar
                    </span>
                  </span>
                </Link>
                
                {/* Group dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200 
                      hover:bg-[var(--hover-color)] hover:scale-105 
                      ${hasGroup ? 'text-green-600 dark:text-green-500' : 'text-[var(--text-secondary)]'}`}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Group</span>
                    {hasGroup && (
                      <span className="ml-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    )}
                    <svg className={`ml-1 h-4 w-4 transition-transform duration-300 ${showGroupDropdown ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showGroupDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] rounded-lg shadow-xl z-10 border border-[var(--border-color)] transform transition-all duration-200 origin-top-right animate-growIn overflow-hidden">
                      <div className="py-1">
                        {hasGroup && group ? (
                          <>
                            <div className="px-4 py-2 text-sm text-[var(--text-secondary)] border-b border-[var(--border-color)] bg-[var(--hover-color)] bg-opacity-50">
                              <span className="font-medium">Group: </span>
                              <span className="font-semibold text-[var(--text-primary)]">{group.name}</span>
                            </div>
                            <Link href="/dashboard">
                              <span className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-color)] transition-colors duration-150 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Group Dashboard
                              </span>
                            </Link>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(group.inviteCode);
                                setShowGroupDropdown(false);
                                // Replace alert with toast notification
                                const notification = document.createElement('div');
                                notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-slideInUp';
                                notification.textContent = 'Invite code copied to clipboard!';
                                document.body.appendChild(notification);
                                setTimeout(() => {
                                  notification.classList.add('animate-fadeOut');
                                  setTimeout(() => document.body.removeChild(notification), 500);
                                }, 2000);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-color)] transition-colors duration-150 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                              Copy Invite Code
                            </button>
                            <Link href="/settings">
                              <span className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors duration-150 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Leave Group
                              </span>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link href="/dashboard">
                              <span className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-color)] transition-colors duration-150 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Create a Group
                              </span>
                            </Link>
                            <Link href="/dashboard">
                              <span className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-color)] transition-colors duration-150 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Join a Group
                              </span>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <Link href="/settings">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                    hover:bg-[var(--hover-color)] hover:scale-105 
                    ${router.pathname === '/settings' 
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                      : 'text-[var(--text-secondary)]'
                    }`}>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </span>
                  </span>
                </Link>
                
                {/* Theme toggle button */}
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--hover-color)] transition-all duration-200 hover:scale-110"
                  aria-label="Toggle theme"
                >
                  <div className="relative">
                    {theme === 'dark' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-500 rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-500 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={logout}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 hover:translate-y-[-2px] active:scale-95"
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Theme toggle button */}
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--hover-color)] transition-all duration-200 hover:scale-110"
                  aria-label="Toggle theme"
                >
                  <div className="relative">
                    {theme === 'dark' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-500 rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-500 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </div>
                </button>
                
                <Link href="/login">
                  <span className="px-4 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--hover-color)] transition-all duration-200 hover:scale-105 hover:text-[var(--text-primary)] flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 hover:translate-y-[-2px] active:scale-95 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign Up
                  </span>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--hover-color)] transition-all duration-200"
              aria-label="Toggle theme"
            >
              <div className="relative">
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-500 rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-500 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </div>
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--hover-color)] transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 relative flex justify-center items-center">
                <span className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
                <span className={`absolute h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'w-0' : 'w-5'}`}></span>
                <span className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] animate-slideInUp shadow-lg max-h-[80vh] overflow-y-auto" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link href="/dashboard">
                  <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname === '/dashboard' ? 'bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-40 text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-primary)] hover:bg-[var(--hover-color)]'
                  } flex items-center transition-all duration-200 transform hover:translate-x-2`}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </span>
                </Link>
                <Link href="/calendar">
                  <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname === '/calendar' ? 'bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-40 text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-primary)] hover:bg-[var(--hover-color)]'
                  } flex items-center transition-all duration-200 transform hover:translate-x-2`}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Calendar
                  </span>
                </Link>
                
                <div className={`block px-3 py-2 rounded-md text-base font-medium ${
                  hasGroup ? 'text-green-600 dark:text-green-500' : 'text-[var(--text-primary)]'
                } border-t border-[var(--border-color)] pt-4 mt-4`}>
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Group
                    {hasGroup && (
                      <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    )}
                  </span>
                  
                  {hasGroup && group ? (
                    <div className="pl-8 mt-2 space-y-3">
                      <p className="text-sm text-[var(--text-secondary)]">
                        <span className="font-medium">Current:</span> 
                        <span className="font-semibold text-[var(--text-primary)] ml-1">{group.name}</span>
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(group.inviteCode);
                          // Replace alert with toast notification
                          const notification = document.createElement('div');
                          notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-slideInUp';
                          notification.textContent = 'Invite code copied to clipboard!';
                          document.body.appendChild(notification);
                          setTimeout(() => {
                            notification.classList.add('animate-fadeOut');
                            setTimeout(() => document.body.removeChild(notification), 500);
                          }, 2000);
                        }}
                        className="block w-full text-left text-sm text-[var(--text-primary)] py-1 flex items-center transform transition-transform hover:translate-x-1"
                      >
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Invite Code
                      </button>
                      <Link href="/settings">
                        <span className="block text-sm text-red-600 dark:text-red-400 py-1 flex items-center transform transition-transform hover:translate-x-1">
                          <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Leave Group
                        </span>
                      </Link>
                    </div>
                  ) : (
                    <div className="pl-8 mt-2 space-y-3">
                      <Link href="/dashboard">
                        <span className="block text-sm text-[var(--text-primary)] py-1 flex items-center transform transition-transform hover:translate-x-1">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Create a Group
                        </span>
                      </Link>
                      <Link href="/dashboard">
                        <span className="block text-sm text-[var(--text-primary)] py-1 flex items-center transform transition-transform hover:translate-x-1">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          Join a Group
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
                
                <Link href="/settings">
                  <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname === '/settings' ? 'bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-40 text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-primary)] hover:bg-[var(--hover-color)]'
                  } flex items-center transition-all duration-200 transform hover:translate-x-2`}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </span>
                </Link>
                
                <button
                  onClick={logout}
                  className="w-full text-left block px-3 py-2 mt-4 rounded-md text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 shadow-md transition-all duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="block px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--hover-color)] flex items-center transition-all duration-200 transform hover:translate-x-2">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="block px-3 py-2 mt-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 shadow-md flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign Up
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add padding div that pushes content down the height of the navbar */}
      <div className="h-16"></div>
    </nav>
  );
};

export default Navbar;