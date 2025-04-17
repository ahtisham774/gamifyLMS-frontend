import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import {
  BookOpenIcon,
  UserGroupIcon,
  StarIcon,
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'

const CourseView = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [completedLessons, setCompletedLessons] = useState([])

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get course details
        const courseResponse = await api.get(`/courses/${id}`)
        if (courseResponse.data.success) {
          setCourse(courseResponse.data.course)
        } else {
          setError('Course not found')
        }

        // Check if user is enrolled
        if (user) {
          const enrolledResponse = await api.get('/courses/enrolled')
          if (enrolledResponse.data.success) {
            const enrolled = enrolledResponse.data?.enrolledCourses?.some(
              enrollment => enrollment?.course?._id === id
            )
            setIsEnrolled(enrolled)

            // Get completed lessons if enrolled
            if (enrolled) {
              const enrollment = enrolledResponse.data.enrolledCourses.find(
                e => e?.course?._id === id
              )

              setCompletedLessons(
                enrollment?.completedLessons ||
                  enrollment.course?.units?.flatMap(unit =>
                    unit.lessons
                      .filter(
                        lesson =>
                          lesson.isCompleted &&
                          lesson?.completedBy?.includes(user?._id)
                      )
                      .map(lesson => lesson._id)
                  ) ||
                  []
              )
            }
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id, user])

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }

    try {
      setEnrolling(true)
      const response = await api.post(`/courses/${id}/enroll`)

      if (response.data.success) {
        setIsEnrolled(true)
        toast.success('Successfully enrolled in the course!')
      }
    } catch (err) {
      console.error('Error enrolling:', err)
      toast.error(
        err.response?.data?.message || 'Failed to enroll. Please try again.'
      )
    } finally {
      setEnrolling(false)
    }
  }

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
  const getLevelBadge = level => {
    const badges = {
      beginner: 'bg-emerald-100 text-emerald-800',
      intermediate: 'bg-amber-100 text-amber-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return badges[level] || 'bg-neutral-100 text-neutral-800'
  }

  const calculateProgress = () => {
    if (!course?.units || !isEnrolled) return 0

    let totalLessons = 0
    let completed = 0

    course.units.forEach(unit => {
      if (unit.lessons) {
        totalLessons += unit.lessons.length
        unit.lessons.forEach(lesson => {
          if (completedLessons.includes(lesson._id)) {
            completed++
          }
        })
      }
    })

    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-xl p-8 text-center border border-indigo-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>{error}</h2>
            <Link
              to='/courses'
              className='inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            >
              <ArrowLeftIcon className='h-5 w-5 mr-2' />
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }
  if (!course) {
    return null
  }

  const progress = calculateProgress()

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Back Button */}
        <div className='mb-8'>
          <Link
            to='/courses'
            className='inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors'
          >
            <ArrowLeftIcon className='h-5 w-5 mr-2' />
            Back to Courses
          </Link>
        </div>

        {/* Course Header */}
        <div className='bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mb-10 border border-indigo-100 transform transition-all hover:shadow-2xl'>
          <div className='relative h-80'>
            <img
              src={course.imageUrl || '/default-course.png'}
              alt={course.title}
              className='w-full h-full object-cover'
              onError={e => {
                e.target.src = '/default-course.png'
              }}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/60 to-transparent'></div>
            <div className='absolute bottom-0 left-0 right-0 p-8'>
              <div className='flex flex-wrap gap-2 mb-3'>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getSubjectColor(
                    course.subject
                  )}`}
                >
                  {course.subject.charAt(0).toUpperCase() +
                    course.subject.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadge(
                    course.level
                  )}`}
                >
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
              </div>
              <h1 className='text-3xl md:text-4xl font-bold text-white'>
                {course.title}
              </h1>
              <p className='text-white/80 mt-2 text-lg max-w-3xl line-clamp-2'>
                {course.description}
              </p>
            </div>
          </div>

          <div className='p-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
              <div className='flex flex-wrap items-center gap-6'>
                <div className='flex items-center text-gray-700'>
                  <div className='p-2 bg-blue-100 rounded-full mr-3'>
                    <AcademicCapIcon className='h-5 w-5 text-blue-600' />
                  </div>
                  <span>Grade {course.grade}</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <div className='p-2 bg-indigo-100 rounded-full mr-3'>
                    <UserGroupIcon className='h-5 w-5 text-indigo-600' />
                  </div>
                  <span>{course.enrolledStudents?.length || 0} students</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <div className='p-2 bg-amber-100 rounded-full mr-3'>
                    <StarIcon className='h-5 w-5 text-amber-600' />
                  </div>
                  <span>
                    {course.averageRating?.toFixed(1) || 'N/A'} rating
                  </span>
                </div>
                {course.duration > 0 && (
                  <div className='flex items-center text-gray-700'>
                    <div className='p-2 bg-emerald-100 rounded-full mr-3'>
                      <ClockIcon className='h-5 w-5 text-emerald-600' />
                    </div>
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
                )}
              </div>

              {isEnrolled ? (
                <div className='w-full md:w-auto transform transition-transform hover:scale-105'>
                  <Link
                    to={`/courses/${course._id}/learn`}
                    className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all'
                  >
                    <PlayCircleIcon className='h-5 w-5 mr-2' />
                    Continue Learning
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className='w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none'
                >
                  {enrolling ? (
                    <LoadingSpinner size='sm' color='white' />
                  ) : (
                    <>
                      <BookOpenIcon className='h-5 w-5 mr-2' />
                      Enroll Now
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {/* Tabs */}
            <div className='bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-lg border border-indigo-100 mb-8 overflow-hidden'>
              <div className='flex overflow-x-auto scrollbar-none'>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 font-medium flex items-center transition-colors ${
                    activeTab === 'overview'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <BookOpenIcon className='h-5 w-5 mr-2' />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-6 py-4 font-medium flex items-center transition-colors ${
                    activeTab === 'curriculum'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <PuzzlePieceIcon className='h-5 w-5 mr-2' />
                  Curriculum
                </button>
                {isEnrolled && (
                  <button
                    onClick={() => setActiveTab('progress')}
                    className={`px-6 py-4 font-medium flex items-center transition-colors ${
                      activeTab === 'progress'
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <ChartBarIcon className='h-5 w-5 mr-2' />
                    My Progress
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className='p-8'>
                {activeTab === 'overview' && (
                  <div className='animate-fade-in'>
                    <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                      About This Course
                    </h3>
                    <div className='prose max-w-none text-gray-700'>
                      <p className='text-lg leading-relaxed'>
                        {course.description}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className='animate-fade-in'>
                    <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                      Course Curriculum
                    </h3>
                    {course.units?.length > 0 ? (
                      <div className='space-y-8'>
                        {course.units.map((unit, unitIndex) => (
                          <div
                            key={unit._id || unitIndex}
                            className='border border-indigo-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white'
                          >
                            <div className='bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100'>
                              <h4 className='font-semibold text-indigo-800 text-lg flex items-center'>
                                <span className='flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full mr-3 text-indigo-600 text-sm font-bold'>
                                  {unitIndex + 1}
                                </span>
                                {unit.title}
                              </h4>
                              {unit.description && (
                                <p className='text-indigo-600/80 mt-2 pl-11'>
                                  {unit.description}
                                </p>
                              )}
                            </div>
                            {unit.lessons?.length > 0 ? (
                              <ul className='divide-y divide-indigo-100'>
                                {unit.lessons.map((lesson, lessonIndex) => (
                                  <li
                                    key={lesson._id || lessonIndex}
                                    className='px-6 py-4 hover:bg-indigo-50/50 transition-colors'
                                  >
                                    <div className='flex items-start'>
                                      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-white shadow-sm border border-indigo-100 flex items-center justify-center mr-4 mt-0.5'>
                                        <span className='text-indigo-600 text-sm font-semibold'>
                                          {lessonIndex + 1}
                                        </span>
                                      </div>
                                      <div className='flex-1 min-w-0'>
                                        <h5 className='text-base font-medium text-gray-800'>
                                          {lesson.title}
                                        </h5>
                                        <div className='flex items-center mt-1 text-sm text-gray-500'>
                                          <ClockIcon className='h-4 w-4 mr-1' />
                                          <span>
                                            {course?.units
                                              ? (() => {
                                                  const totalMinutes =
                                                    course.units.reduce(
                                                      (total, unit) => {
                                                        return (
                                                          total +
                                                          unit.lessons.reduce(
                                                            (sum, lesson) =>
                                                              sum +
                                                              (lesson.duration ||
                                                                0),
                                                            0
                                                          )
                                                        )
                                                      },
                                                      0
                                                    )

                                                  const hours = Math.floor(
                                                    totalMinutes / 60
                                                  )
                                                  const minutes =
                                                    totalMinutes % 60

                                                  if (hours && minutes)
                                                    return `${hours} hr ${minutes} min`
                                                  if (hours)
                                                    return `${hours} hr`
                                                  return `${minutes} min`
                                                })()
                                              : 'N/A'}
                                          </span>

                                          {lesson.quizzes?.length > 0 && (
                                            <span className='ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                                              <PuzzlePieceIcon className='h-3 w-3 mr-1' />
                                              Quiz
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {isEnrolled && (
                                        <button
                                          onClick={() =>
                                            handleLessonComplete(
                                              lesson._id || lessonIndex
                                            )
                                          }
                                          className='ml-2 flex-shrink-0 transition-transform hover:scale-110'
                                        >
                                          {completedLessons.includes(
                                            lesson._id || lessonIndex
                                          ) ? (
                                            <CheckCircleIcon className='h-6 w-6 text-green-500' />
                                          ) : (
                                            <div className='h-6 w-6 rounded-full border-2 border-gray-300' />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className='px-6 py-8 text-center text-gray-500'>
                                <PuzzlePieceIcon className='h-12 w-12 mx-auto text-gray-300 mb-2' />
                                No lessons added yet
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-16 text-gray-500'>
                        <PuzzlePieceIcon className='h-16 w-16 mx-auto text-gray-300 mb-4' />
                        <p className='text-lg'>No curriculum added yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'progress' && isEnrolled && (
                  <div className='animate-fade-in'>
                    <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                      My Progress
                    </h3>
                    <div className='bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 mb-8 border border-indigo-100 shadow-sm'>
                      <div className='flex items-center justify-between mb-3'>
                        <span className='text-lg font-medium text-indigo-800'>
                          Course Progress
                        </span>
                        <span className='text-lg font-semibold text-indigo-600'>
                          {progress}%
                        </span>
                      </div>
                      <div className='w-full bg-white rounded-full h-3 shadow-inner overflow-hidden'>
                        <div
                          className='bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out'
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className='mt-4 flex flex-wrap items-center text-sm text-indigo-700 gap-4'>
                        <div className='flex items-center'>
                          <CheckCircleIcon className='h-5 w-5 mr-1.5 text-green-500' />
                          <span>
                            {completedLessons.length} lessons completed
                          </span>
                        </div>

                        <div className='flex items-center'>
                          <ClockIcon className='h-5 w-5 mr-1.5 text-indigo-500' />
                          <span>
                            {course.units?.reduce(
                              (acc, unit) => acc + (unit.lessons?.length || 0),
                              0
                            ) - completedLessons.length}{' '}
                            lessons remaining
                          </span>
                        </div>
                      </div>
                    </div>

                    <h4 className='text-xl font-semibold text-gray-800 mb-4'>
                      Completed Lessons
                    </h4>
                    {completedLessons.length > 0 ? (
                      <ul className='space-y-3 bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm'>
                        {course.units?.map(unit =>
                          unit.lessons?.map(
                            lesson =>
                              completedLessons.includes(
                                lesson._id || lesson.title
                              ) && (
                                <li
                                  key={lesson._id || lesson.title}
                                  className='flex items-center p-3 rounded-xl hover:bg-indigo-50 transition-colors'
                                >
                                  <div className='p-2 bg-green-100 rounded-full mr-3'>
                                    <CheckCircleIcon className='h-5 w-5 text-green-600' />
                                  </div>
                                  <div>
                                    <span className='text-gray-800 font-medium'>
                                      {lesson.title}
                                    </span>
                                    <span className='text-sm text-gray-500 ml-2'>
                                      {unit.title}
                                    </span>
                                  </div>
                                </li>
                              )
                          )
                        )}
                      </ul>
                    ) : (
                      <div className='bg-white rounded-2xl p-8 text-center border border-indigo-100 shadow-sm'>
                        <PuzzlePieceIcon className='h-12 w-12 mx-auto text-gray-300 mb-3' />
                        <p className='text-gray-500 text-lg'>
                          You haven't completed any lessons yet.
                        </p>
                        <p className='text-gray-500'>
                          Start learning to track your progress!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-8'>
            {/* Instructor Card */}
            <div className='bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow'>
              <h3 className='text-xl font-bold text-gray-800 mb-5 flex items-center'>
                <UserGroupIcon className='h-5 w-5 mr-2 text-indigo-600' />
                Instructor
              </h3>
              <div className='flex items-start'>
                <img
                  src={course.creator?.avatar || '/default-avatar.png'}
                  alt={course.creator?.name}
                  className='h-16 w-16 rounded-full object-cover mr-4 border-2 border-indigo-100 shadow-md'
                />
                <div>
                  <h4 className='text-lg font-semibold text-gray-800'>
                    {course.creator?.name || 'Course Instructor'}
                  </h4>
                  <p className='text-indigo-600 mt-1'>
                    {course.creator?.role === 'teacher'
                      ? 'Teacher'
                      : 'Course Instructor'}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    Expert in {course.subject || 'education'}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Details Card */}
            <div className='bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow'>
              <h3 className='text-xl font-bold text-gray-800 mb-5 flex items-center'>
                <BookOpenIcon className='h-5 w-5 mr-2 text-indigo-600' />
                Course Details
              </h3>
              <ul className='space-y-4'>
                <li className='flex items-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50'>
                  <div className='p-2 bg-blue-100 rounded-full mr-3 shadow-sm'>
                    <AcademicCapIcon className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <span className='block text-sm text-gray-500'>Grade</span>
                    <span className='font-medium text-gray-800'>
                      {course.grade}
                    </span>
                  </div>
                </li>

                {/* <li className="flex items-center p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50">
                  <div className="p-2 bg-purple-100 rounded-full mr-3 shadow-sm">
                    <PuzzlePieceIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Level</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {course.level}
                    </span>
                  </div>
                </li> */}

                {course.duration > 0 && (
                  <li className='flex items-center p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50'>
                    <div className='p-2 bg-emerald-100 rounded-full mr-3 shadow-sm'>
                      <ClockIcon className='h-5 w-5 text-emerald-600' />
                    </div>
                    <div>
                      <span className='block text-sm text-gray-500'>
                        Duration
                      </span>
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
                  </li>
                )}

                <li className='flex items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50'>
                  <div className='p-2 bg-indigo-100 rounded-full mr-3 shadow-sm'>
                    <UserGroupIcon className='h-5 w-5 text-indigo-600' />
                  </div>
                  <div>
                    <span className='block text-sm text-gray-500'>
                      Students
                    </span>
                    <span className='font-medium text-gray-800'>
                      {course.enrolledStudents?.length || 0} enrolled
                    </span>
                  </div>
                </li>
                {/*                 
                {course.gamification?.pointsToEarn && (
                  <li className="flex items-center p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="p-2 bg-amber-100 rounded-full mr-3 shadow-sm">
                      <TrophyIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Points to earn</span>
                      <span className="font-medium text-gray-800">
                        {course.gamification.pointsToEarn} points
                      </span>
                    </div>
                  </li>
                )} */}
              </ul>

              {!isEnrolled && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className='w-full mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:translate-y-[-2px]'
                >
                  <BookOpenIcon className='h-5 w-5 mr-2' />
                  Enroll Now
                </button>
              )}
            </div>

            {/* Gamification Card */}
            {/* {course.gamification?.hasPersonalization && (
              <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                  <PuzzlePieceIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Personalized Learning
                </h3>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-sm border border-indigo-100">
                  <div className="flex items-start">
                    <div className="p-3 bg-purple-100 rounded-full mr-4 shadow-sm">
                      <ChartBarIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-800 text-lg mb-1">
                        Adaptive Learning
                      </h4>
                      <p className="text-indigo-700">
                        This course adapts to your learning style and pace to provide a personalized experience that helps you master the content more effectively.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseView
