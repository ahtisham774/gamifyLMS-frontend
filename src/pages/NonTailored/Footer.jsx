import { AcademicCapIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'

const BottomFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-white border-t border-indigo-100 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <div className='flex items-center text-xl font-bold text-indigo-600 mb-4'>
              <AcademicCapIcon className='h-7 w-7 mr-2' />
              <span>Gamify LMS</span>
            </div>
            <p className='text-gray-600 text-sm leading-relaxed'>
              Quality education accessible to everyone. Learn at your own pace
              with our carefully curated courses.
            </p>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  to='/'
                  className='text-gray-600 hover:text-indigo-600 text-sm transition-colors'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/courses'
                  className='text-gray-600 hover:text-indigo-600 text-sm transition-colors'
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to='/dashboard'
                  className='text-gray-600 hover:text-indigo-600 text-sm transition-colors'
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to='/profile'
                  className='text-gray-600 hover:text-indigo-600 text-sm transition-colors'
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Contact
            </h3>
            <ul className='space-y-3'>
              <li className='flex items-center text-gray-600 text-sm'>
                <EnvelopeIcon className='h-4 w-4 mr-2 text-indigo-600' />
                <a
                  href='mailto:support@gamifyLMS.com'
                  className='hover:text-indigo-600 transition-colors'
                >
                  support@gamifyLMS.com
                </a>
              </li>
              <li className='flex items-center text-gray-600 text-sm'>
                <PhoneIcon className='h-4 w-4 mr-2 text-indigo-600' />
                <a
                  href='tel:+1234567890'
                  className='hover:text-indigo-600 transition-colors'
                >
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-indigo-100 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center'>
          <p className='text-gray-600 text-sm'>
            &copy; {currentYear} Gamify LMS. All rights reserved.
          </p>

          <div className='flex space-x-6 mt-4 sm:mt-0'>
            <a
              href='#'
              className='text-gray-600 hover:text-indigo-600 text-sm transition-colors'
            >
              Privacy Policy
            </a>
            <a
              href='#'
              className='text-gray-600 hover:text-indigo-600 text-sm transition-colors'
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default BottomFooter
