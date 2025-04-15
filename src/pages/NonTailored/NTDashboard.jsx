import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const NTDashboard = () => {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [recentAttempts, setRecentAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true)

        // Fetch enrolled courses
        const coursesResponse = await api.get('/courses/enrolled')
        if (coursesResponse.data.success) {
          setEnrolledCourses(coursesResponse.data.enrolledCourses)
        }

        // Fetch recent quiz attempts
        const attemptsResponse = await api.get('/attempts')
        if (attemptsResponse.data.success) {
          setRecentAttempts(attemptsResponse.data.attempts?.slice(0, 5) || [])
        }
      } catch (error) {
        console.error('Error fetching student data:', error)
        toast.error('Failed to load your dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStudentData()
    }
  }, [user])

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Dashboard Header */}
        <div className='bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Student Dashboard
          </h1>
          <p className='text-gray-600 mt-1'>
            Track your progress and continue learning
          </p>
          <div className='bg-white mt-5 w-fit rounded-xl shadow-sm p-6 flex items-start border border-neutral-200'>
            <div className='bg-green-100 rounded-full p-3 mr-4'>
              <BookOpenIcon className='h-6 w-6 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-neutral-500'>Enrolled Courses</p>
              <h3 className='text-2xl font-bold text-neutral-800'>
                {enrolledCourses?.length || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
              <BookOpenIcon className='h-6 w-6 mr-2 text-indigo-600' />
              My Courses
            </h2>
            <Link
              to='/courses'
              className='group flex items-center text-indigo-600 hover:text-indigo-800 font-medium'
            >
              Browse Courses
              <ArrowRightIcon className='h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>

          {enrolledCourses?.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {enrolledCourses.map(enrollment => {
                const course = enrollment.course
                const progress = enrollment.progress || 0
                return (
                  <div
                    key={enrollment._id || course._id}
                    className='bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden hover:shadow-xl transition-shadow duration-300'
                  >
                    <div className='relative h-40 overflow-hidden bg-gradient-to-r from-indigo-500 to-blue-600'>
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className='w-full h-full object-cover opacity-75'
                        />
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <BookOpenIcon className='h-16 w-16 text-white/50' />
                        </div>
                      )}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                      <div className='absolute bottom-0 left-0 p-4 w-full'>
                        <h3 className='text-white font-bold text-lg line-clamp-1'>
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    <div className='p-4'>
                      {/* Progress bar */}
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-gray-600'>
                          Progress
                        </span>
                        <span className='text-sm font-bold text-indigo-600'>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2 mb-4'>
                        <div
                          className='bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full'
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      {/* Course details */}
                      <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center text-gray-500 text-sm'>
                          <ClockIcon className='h-4 w-4 mr-1' />
                          <span>
                            {course?.units
                              ? (() => {
                                  const totalMinutes = course.units.reduce(
                                    (total, unit) => {
                                      return (
                                        total +
                                        unit.lessons.reduce(
                                          (sum, lesson) =>
                                            sum + (lesson.duration || 0),
                                          0
                                        )
                                      )
                                    },
                                    0
                                  )

                                  const hours = Math.floor(totalMinutes / 60)
                                  const minutes = totalMinutes % 60

                                  if (hours && minutes)
                                    return `${hours} hr ${minutes} min`
                                  if (hours) return `${hours} hr`
                                  return `${minutes} min`
                                })()
                              : 'N/A'}
                          </span>
                        </div>

                        <div className='flex items-center text-gray-500 text-sm'>
                          <AcademicCapIcon className='h-4 w-4 mr-1' />
                          <span>{course.level || 'All levels'}</span>
                        </div>
                      </div>

                      {/* Action button */}
                      <Link
                        to={`/courses/${course._id}/learn`}
                        className='w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:from-indigo-700 hover:to-blue-700 transition-colors'
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='bg-white rounded-xl shadow-lg p-8 text-center border border-indigo-100'>
              <div className='flex justify-center mb-4'>
                <div className='p-4 bg-indigo-50 rounded-full'>
                  <BookOpenIcon className='h-12 w-12 text-indigo-600' />
                </div>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-2'>
                No Courses Yet
              </h3>
              <p className='text-gray-600 mb-6'>
                You haven't enrolled in any courses yet. Browse our catalog to
                find courses you're interested in.
              </p>
              <Link
                to='/courses'
                className='inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:from-indigo-700 hover:to-blue-700 transition-colors'
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        {/* Recent Quiz Attempts */}
        {recentAttempts?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center'>
              <CheckCircleIcon className='h-6 w-6 mr-2 text-indigo-600' />
              Recent Quiz Attempts
            </h2>
            <div className='bg-white rounded-xl shadow-xl overflow-hidden border border-indigo-100'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-indigo-100'>
                  <thead className='bg-gradient-to-r from-indigo-50 to-blue-50'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-4 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider'
                      >
                        Quiz
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-4 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider'
                      >
                        Course
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-4 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider'
                      >
                        Score
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-4 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider'
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-indigo-100'>
                    {recentAttempts.map(attempt => (
                      <tr
                        key={attempt._id}
                        className='hover:bg-indigo-50 transition-colors'
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-800'>
                            {attempt.quiz?.title || 'Unknown Quiz'}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-600'>
                            {attempt?.course?.title || 'Unknown Course'}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              attempt.percentageScore >= 70
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {Math.round(attempt.percentageScore)}%
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(
                            attempt.submittedAt || attempt.createdAt
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NTDashboard
