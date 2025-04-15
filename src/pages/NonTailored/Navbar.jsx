import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  AcademicCapIcon,
  ArrowLeftEndOnRectangleIcon,
  BookOpenIcon,
  HomeIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = path => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className='bg-white shadow-md border-b border-indigo-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          {/* Logo and desktop navigation */}
          <div className='flex items-center'>
            <Link
              to='/'
              className='flex items-center text-xl font-bold text-indigo-600'
            >
              <AcademicCapIcon className='h-7 w-7 mr-2' />
              <span className='hidden sm:inline'>Gamify LMS</span>
            </Link>

            {user && user.role === 'student' && (
              <nav className='hidden md:ml-10 md:flex md:items-center md:space-x-8'>
                {user && (
                  <>
                    <Link
                      to='/dashboard'
                      className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActive('/dashboard')
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <BookOpenIcon className='h-4 w-4 mr-2' />
                      <span>My Courses</span>
                    </Link>

                    <Link
                      to='/courses'
                      className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActive('/courses')
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <AcademicCapIcon className='h-4 w-4 mr-2' />
                      <span>Courses</span>
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='flex items-center md:hidden'>
            <button
              onClick={toggleMobileMenu}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none'
            >
              {mobileMenuOpen ? (
                <XMarkIcon className='h-6 w-6' />
              ) : (
                <Bars3Icon className='h-6 w-6' />
              )}
            </button>
          </div>

          {/* Desktop auth buttons */}
          <div className='hidden md:flex md:items-center'>
            {user ? (
              <div className='flex items-center space-x-4'>
                {user.role == 'student' && (
                  <Link
                    to='/profile'
                    className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive('/profile')
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <UserIcon className='h-4 w-4 mr-2' />
                    <span>Profile</span>
                  </Link>
                )}
                <button
                onClick={() => {
                  logout()
                  navigate('/login')
                  setMobileMenuOpen(false)
                }}
                  className='px-4 py-2 rounded-full border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors'
                >
                  <span className='flex items-center'>
                    <ArrowLeftEndOnRectangleIcon className='h-4 w-4 mr-2' />
                    Sign Out
                  </span>
                </button>
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link
                  to='/login'
                  className='px-4 py-2 rounded-full border border-indigo-200 bg-white text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors'
                >
                  Sign In
                </Link>
                <Link
                  to='/register'
                  className='px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-blue-700 transition-colors shadow-md'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
          {user && (
            <>
              {user.role == 'student' && (
                <>
                  <Link
                    to='/dashboard'
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium w-full ${
                      isActive('/dashboard')
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <BookOpenIcon className='h-5 w-5 mr-3' />
                    <span>My Courses</span>
                  </Link>

                  <Link
                    to='/courses'
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium w-full ${
                      isActive('/courses')
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <AcademicCapIcon className='h-5 w-5 mr-3' />
                    <span>Courses</span>
                  </Link>

                  <Link
                    to='/profile'
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium w-full ${
                      isActive('/profile')
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <UserIcon className='h-5 w-5 mr-3' />
                    <span>Profile</span>
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                  setMobileMenuOpen(false)
                }}
                className='flex items-center px-3 py-2 rounded-md text-base font-medium w-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
              >
                <ArrowLeftEndOnRectangleIcon className='h-5 w-5 mr-3' />
                <span>Sign Out</span>
              </button>
            </>
          )}

          {!user && (
            <>
              <Link
                to='/login'
                onClick={() => setMobileMenuOpen(false)}
                className='flex items-center justify-center px-3 py-2 rounded-md border border-indigo-200 bg-white text-indigo-600 text-base font-medium hover:bg-indigo-50 w-full'
              >
                Sign In
              </Link>
              <Link
                to='/register'
                onClick={() => setMobileMenuOpen(false)}
                className='flex items-center justify-center px-3 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-base font-medium hover:from-indigo-700 hover:to-blue-700 w-full shadow-md'
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
