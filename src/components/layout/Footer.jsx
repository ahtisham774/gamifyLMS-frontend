import { Link } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand/Logo Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-display font-bold text-white">Gamify LMS</span>
            </Link>
            <p className="mt-2 text-sm text-neutral-300">
              Making learning fun and engaging for primary school students through adaptive gamification.
            </p>
          </div>

          {/* Links Section 1 */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-neutral-300 hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-neutral-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-neutral-300 hover:text-white">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Section 2 */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Join Us</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/register" className="text-neutral-300 hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-neutral-300 hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Social Section */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-neutral-300">
                <a href="mailto:caritamorris7@gmail.com" className="hover:text-white">
                caritamorris7@gmail.com
                </a>
              </li>
              <li className="text-neutral-300">
                <a href="tel:+5927216054" className="hover:text-white">
                +592-721-6054
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-neutral-700">
          <p className="text-sm text-neutral-400 text-center">
            &copy; {currentYear} Carita Morris - Final Year Project CSE4200.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
