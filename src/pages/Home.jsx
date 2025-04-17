import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

import StdDashboard from './StDashboard'

const Index = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getSubjectColor = subject => {
    const colors = {
      mathematics: 'bg-blue-100 text-blue-800',
      english: 'bg-green-100 text-green-800',
      science: 'bg-purple-100 text-purple-800',
      social: 'bg-yellow-100 text-yellow-800',
      art: 'bg-pink-100 text-pink-800',
      music: 'bg-indigo-100 text-indigo-800',
      'physical-education': 'bg-orange-100 text-orange-800'
    }
    return colors[subject] || 'bg-neutral-100 text-neutral-800'
  }

  const subjects = [
    {
      name: 'Mathematics',
      case: 'mathematics',
    },
    {
      name: 'English',
      case: 'english',
    },
    {
      name: 'Science',
      case: 'science',
    },
    {
      name: 'Social Studies',
      case: 'social',
    },
  
  ]



  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-neutral-50'>
        <div className='w-60 space-y-4'>
          <h2 className='text-center text-xl font-semibold'>
            Loading your learning space...
          </h2>
          <div className='w-full bg-neutral-200 rounded-full h-2.5'>
            <div
              className='bg-primary-600 h-2.5 rounded-full'
              style={{ width: `${60}%` }}
            ></div>
          </div>
        </div>
      </div>
    )
  }



  // Otherwise show the welcome page
  return (
    <div className='min-h-screen bg-neutral-50'>
      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
          <div className='bg-gradient-to-r from-primary-500 to-primary-700 text-white p-12 md:p-16'>
            <h1 className='text-3xl md:text-4xl font-bold mb-4'>
              Welcome to Gamify LMS
            </h1>
            <p className='text-lg md:text-xl mb-8 max-w-3xl opacity-90'>
              The gamified learning platform that makes education fun and
              engaging. Earn rewards, level up, and track your progress as you
              learn.
            </p>

            <div className='flex flex-wrap gap-4'>
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className='bg-white text-primary-600 hover:bg-primary-50 border border-primary-200 rounded-md px-4 py-2 font-semibold shadow-sm transition duration-200'
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className=' text-white border-2 border-white rounded-md px-4 py-2 font-semibold shadow-sm transition duration-200'
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/courses')}
                  className='btn-white'
                >
                  Browse Courses
                </button>
              )}
            </div>
          </div>

          <div className='p-8'>
            {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='flex flex-col items-center text-center p-6 rounded-lg bg-neutral-50'>
                <div className='bg-primary-100 p-4 rounded-full mb-4'>
                  <svg
                    className='h-8 w-8 text-primary-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>
                  Gamified Learning
                </h3>
                <p className='text-neutral-600'>
                  Learn through interactive experiences, quizzes, and challenges
                  that make education fun.
                </p>
              </div>

              <div className='flex flex-col items-center text-center p-6 rounded-lg bg-neutral-50'>
                <div className='bg-primary-100 p-4 rounded-full mb-4'>
                  <svg
                    className='h-8 w-8 text-primary-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>
                  Earn Points & Rewards
                </h3>
                <p className='text-neutral-600'>
                  Collect points, badges, and rewards as you complete courses
                  and tests.
                </p>
              </div>

              <div className='flex flex-col items-center text-center p-6 rounded-lg bg-neutral-50'>
                <div className='bg-primary-100 p-4 rounded-full mb-4'>
                  <svg
                    className='h-8 w-8 text-primary-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>
                  Track Your Progress
                </h3>
                <p className='text-neutral-600'>
                  Monitor your learning journey with detailed progress tracking
                  and statistics.
                </p>
              </div>
            </div> */}

            <div className='mt-12 border-t border-neutral-200 pt-8'>
              <h2 className='text-2xl font-bold mb-6 text-center'>
                Join thousands of students learning with Edu-Gamify
              </h2>

              <div className='flex flex-wrap justify-center gap-3 mb-8'>
                {
                  subjects.map(subject => (
                    <span
                      key={subject.case}
                      className={`badge ${getSubjectColor(subject.case)}`}
                    >
                      {subject.name}
                    </span>
                  ))
                }
               
                {/* <Badge variant='outline' className='px-3 py-1'>
                  Mathematics
                </Badge>
                <Badge variant='outline' className='px-3 py-1'>
                  Science
                </Badge>
                <Badge variant='outline' className='px-3 py-1'>
                  English
                </Badge>
                <Badge variant='outline' className='px-3 py-1'>
                  Social Studies
                </Badge>
                <Badge variant='outline' className='px-3 py-1'>
                  Programming
                </Badge>
                <Badge variant='outline' className='px-3 py-1'>
                  Art
                </Badge>
                <Badge variant='outline' className='px-3 py-1'>
                  Music
                </Badge> */}
              </div>

              <div className='text-center'>
                <button
                  onClick={() => navigate('/courses')}
                  className='btn-primary'
                >
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
