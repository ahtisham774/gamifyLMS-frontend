import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { toast } from 'react-toastify'
import {
  UserIcon,
  AcademicCapIcon,
  TrophyIcon,
  BookOpenIcon,
  PencilIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BellIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ProfileSettings from '../components/profile/profileSetting'

const Profile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState(null)
  const [activityLog, setActivityLog] = useState([])
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // Fetch user profile data
        const profileResponse = await api.get('/auth/profile')
        if (profileResponse.data.success) {
          setUserStats({
            enrolledCourses:
              profileResponse.data.user.enrolledCourses?.length || 0,
            completedCourses:
              profileResponse.data.user.enrolledCourses?.filter(
                c => c.isCompleted
              ).length || 0,
            rewards: profileResponse.data.user.rewards?.length || 0,
            points: profileResponse.data.user.points || 0,
            level: profileResponse.data.user.level || 1
          })

          setActivityLog(profileResponse.data.user.activityLog || [])
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
        toast.error('Failed to load profile data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  const getUserInitials = name => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className='bg-neutral-50 min-h-screen py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Profile Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-neutral-800'>My Profile</h1>
          <p className='text-neutral-600 mt-1'>
            Manage your account and view your learning progress
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Card */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg overflow-hidden shadow border border-gray-200'>
              <div className='bg-gradient-to-r from-primary-600 to-primary-400 h-32'></div>
              <div className='px-6 pb-6 flex flex-col items-center'>
                <div className='-mt-12 mb-4'>
                  <div className='h-24 w-24 rounded-full ring-4 ring-white bg-primary-100 flex items-center justify-center text-primary-800 text-xl overflow-hidden'>
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='h-full w-full object-cover'
                        onError={e => {
                          e.target.onError = null
                          e.target.src = ''
                        }}
                      />
                    ) : (
                      getUserInitials(user?.name)
                    )}
                  </div>
                </div>
                <h2 className='text-xl font-bold text-neutral-800 text-center'>
                  {user?.name}
                </h2>
                <p className='text-neutral-500 mb-4'>{user?.email}</p>

                <div className='flex items-center justify-center space-x-2 mb-6'>
                  <div className='bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center'>
                    <AcademicCapIcon className='h-3 w-3 mr-1' />
                    Level {userStats?.level || 1}
                  </div>
                  <div className='bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center'>
                    <TrophyIcon className='h-3 w-3 mr-1' />
                    {userStats?.points || 0} pts
                  </div>
                </div>

                <button
                  onClick={() => setShowSettings(true)}
                  className='w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none'
                >
                  <PencilIcon className='h-4 w-4 mr-2' />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className='mt-6 bg-white rounded-lg shadow p-6 border border-gray-200'>
              <h3 className='text-lg font-medium mb-4'>Learning Stats</h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div className='bg-blue-100 p-2 rounded-full mr-3'>
                      <BookOpenIcon className='h-5 w-5 text-blue-600' />
                    </div>
                    <span className='text-neutral-700'>Enrolled Courses</span>
                  </div>
                  <span className='font-medium'>
                    {userStats?.enrolledCourses || 0}
                  </span>
                </div>

                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div className='bg-green-100 p-2 rounded-full mr-3'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-5 w-5 text-green-600'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                    <span className='text-neutral-700'>Completed Courses</span>
                  </div>
                  <span className='font-medium'>
                    {userStats?.completedCourses || 0}
                  </span>
                </div>

                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div className='bg-purple-100 p-2 rounded-full mr-3'>
                      <TrophyIcon className='h-5 w-5 text-purple-600' />
                    </div>
                    <span className='text-neutral-700'>Rewards Earned</span>
                  </div>
                  <span className='font-medium'>{userStats?.rewards || 0}</span>
                </div>

                <div className='pt-4'>
                  <Link
                    to='/dashboard'
                    className='text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center'
                  >
                    Go to Dashboard
                    <ArrowRightIcon className='h-4 w-4 ml-1' />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-2'>
            {showSettings ? (
              <ProfileSettings
                onCancel={() => setShowSettings(false)}
                onSave={() => {
                  setShowSettings(false)
                  // Refresh user data
                  window.location.reload()
                }}
              />
            ) : (
              <>
                {/* Account Info */}
                <div className='bg-white rounded-lg shadow p-6 border border-gray-200'>
                  <h3 className='text-lg font-medium mb-4'>
                    Account Information
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <p className='text-sm text-neutral-500 mb-1'>Full Name</p>
                      <p className='font-medium text-neutral-800'>
                        {user?.name}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm text-neutral-500 mb-1'>Email</p>
                      <p className='font-medium text-neutral-800'>
                        {user?.email}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm text-neutral-500 mb-1'>Role</p>
                      <p className='font-medium text-neutral-800 capitalize'>
                        {user?.role || 'Student'}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm text-neutral-500 mb-1'>
                        Member Since
                      </p>
                      <p className='font-medium text-neutral-800'>
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>

                    {user?.grade && (
                      <div>
                        <p className='text-sm text-neutral-500 mb-1'>Grade</p>
                        <p className='font-medium text-neutral-800'>
                          {user.grade}
                        </p>
                      </div>
                    )}

                    {user?.age && (
                      <div>
                        <p className='text-sm text-neutral-500 mb-1'>Age</p>
                        <p className='font-medium text-neutral-800'>
                          {user.age}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Log */}
                <div className='mt-6 bg-white rounded-lg shadow p-6 border border-gray-200'>
                  <h3 className='text-lg font-medium mb-4'>Recent Activity</h3>
                  {activityLog && activityLog.length > 0 ? (
                    <div className='space-y-4'>
                      {activityLog.slice(0, 6).map((activity, index) => (
                        <div key={index} className='flex items-start'>
                          <div className='bg-neutral-100 p-2 rounded-full mr-3'>
                            <ClockIcon className='h-5 w-5 text-neutral-600' />
                          </div>
                          <div>
                            <p className='text-neutral-800'>
                              {activity.activity}
                            </p>
                            <p className='text-xs text-neutral-500 mt-1'>
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-8 text-neutral-500'>
                      No recent activity to display
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
