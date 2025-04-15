import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Import icons from Heroicons as needed
import {
  Bars3Icon,
  XMarkIcon,
  AcademicCapIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  ChartBarIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // Navigation links based on authentication state
  const navigationLinks = [
    // Public links
    { name: 'Home', href: '/', public: true },

    // Protected links (only shown when authenticated)
    { name: 'Dashboard', href: '/dashboard', public: false },
    { name: 'Courses', href: '/courses', public: false },
    { name: 'My Profile', href: '/profile', public: false },
  ];

  // Filter links based on authentication state
  const filteredLinks = navigationLinks.filter(
    link => link.public || isAuthenticated
  );

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <AcademicCapIcon className="h-10 w-10 text-primary-500" />
              <span className="text-2xl font-display font-bold text-primary-600">Gamify LMS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-primary-50 hover:text-primary-600"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary-50 hover:text-primary-600"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-primary-50 hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-base font-medium rounded-md hover:bg-primary-50 hover:text-primary-600"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* User info bar - only shown when authenticated */}
      {isAuthenticated && user && (
        <div className="bg-primary-50 py-2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4 text-primary-600" />
                  <span className="font-medium">{user.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <BookOpenIcon className="w-4 h-4 text-primary-600" />
                  <span>{user.role === 'student' ? `Grade ${user.grade}` : user.role}</span>
                </div>
              </div>

              {/* <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <FireIcon className="w-4 h-4 text-warning-500" />
                  <span className="font-medium">Level {user.level}</span>
                </div>

                <div className="flex items-center gap-1">
                  <ChartBarIcon className="w-4 h-4 text-accent-500" />
                  <span className="font-medium">{user.points} Points</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
