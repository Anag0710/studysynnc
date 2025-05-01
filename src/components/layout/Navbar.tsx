import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGroup } from '../../contexts/GroupContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { group, hasGroup } = useGroup();
  const router = useRouter();
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGroupDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={user ? '/dashboard' : '/'}>
                <span className="text-xl font-bold text-indigo-600">StudySync</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <>
                <Link href="/dashboard">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                  }`}>
                    Dashboard
                  </span>
                </Link>
                <Link href="/calendar">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === '/calendar' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                  }`}>
                    Calendar
                  </span>
                </Link>
                
                {/* Group dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      hasGroup ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span>Group</span>
                    {hasGroup && (
                      <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showGroupDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        {hasGroup && group ? (
                          <>
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                              <span className="font-medium">Group: </span>
                              {group.name}
                            </div>
                            <Link href="/dashboard">
                              <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Group Dashboard
                              </span>
                            </Link>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(group.inviteCode);
                                setShowGroupDropdown(false);
                                alert('Invite code copied to clipboard!');
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Copy Invite Code
                            </button>
                            <Link href="/settings">
                              <span className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                Leave Group
                              </span>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link href="/dashboard">
                              <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Create a Group
                              </span>
                            </Link>
                            <Link href="/dashboard">
                              <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
                  <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === '/settings' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                  }`}>
                    Settings
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">
                    Login
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;