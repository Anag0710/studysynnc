import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

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