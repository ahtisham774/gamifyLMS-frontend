import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { toast } from 'react-toastify'
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
import LoadingSpinner from '../components/common/LoadingSpinner'

const CourseDetailPage = () => {
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
            const enrolled = enrolledResponse.data.enrolledCourses.some(
              enrollment => enrollment.course._id === id
            )
            setIsEnrolled(enrolled)

            // Get completed lessons if enrolled
            if (enrolled) {
              const enrollment = enrolledResponse.data.enrolledCourses.find(
                e => e.course._id === id
              )
              console.log('enrollment:', enrollment)
              console.log("completed lessons:", enrollment?.course?.units?.flatMap(unit => unit?.lessons?.filter(lesson => lesson.isCompleted && lesson?.completedBy && lesson?.completedBy.includes(user._id))))
              setCompletedLessons(
                enrollment?.course?.units?.flatMap(unit => unit?.lessons?.filter(lesson => lesson.isCompleted && lesson?.completedBy && lesson?.completedBy.includes(user._id))).map(lesson => lesson._id)|| []
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

  const handleLessonComplete = lessonId => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(id => id !== lessonId))
    } else {
      setCompletedLessons([...completedLessons, lessonId])
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (error) {
    return (
      <div className='bg-neutral-50 min-h-screen py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white rounded-xl shadow-sm p-8 text-center'>
            <h2 className='text-2xl font-bold text-neutral-800 mb-4'>
              {error}
            </h2>
            <Link
              to='/courses'
              className='btn-primary inline-flex items-center'
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
    <div className='bg-neutral-50 min-h-screen py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Back Button */}
        <div className='mb-6'>
          <Link
            to='/courses'
            className='inline-flex items-center text-primary-600 hover:text-primary-800 font-medium'
          >
            <ArrowLeftIcon className='h-5 w-5 mr-2' />
            Back to Courses
          </Link>
        </div>

        {/* Course Header */}
        <div className='bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-8'>
          <div className='relative h-64'>
            <img
              src={course.imageUrl || '/default-course.png'}
              alt={course.title}
              className='w-full h-full object-cover'
              onError={e => {
                e.target.src = '/default-course.png'
              }}
            />
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6'>
              <div className='flex flex-wrap gap-2 mb-2'>
                <span className={`badge ${getSubjectColor(course.subject)}`}>
                  {course.subject.charAt(0).toUpperCase() +
                    course.subject.slice(1)}
                </span>
                <span className={`badge ${getLevelBadge(course.level)}`}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
                {course.gamification?.hasPersonalization && (
                  <span className='badge badge-primary'>
                    Personalized Learning
                  </span>
                )}
              </div>
              <h1 className='text-3xl font-bold text-white'>{course.title}</h1>
              <p className='text-white/90 mt-1'>{course.description}</p>
            </div>
          </div>

          <div className='p-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center text-sm text-neutral-600'>
                  <AcademicCapIcon className='h-5 w-5 mr-1.5' />
                  <span>Grade {course.grade}</span>
                </div>
                <div className='flex items-center text-sm text-neutral-600'>
                  <UserGroupIcon className='h-5 w-5 mr-1.5' />
                  <span>{course.enrolledStudents?.length || 0} students</span>
                </div>
                <div className='flex items-center text-sm text-neutral-600'>
                  <StarIcon className='h-5 w-5 mr-1.5' />
                  <span>
                    {course.averageRating?.toFixed(1) || 'N/A'} rating
                  </span>
                </div>
                {course.duration > 0 && (
                  <div className='flex items-center text-sm text-neutral-600'>
                    <ClockIcon className='h-5 w-5 mr-1.5' />
                    <span>{Math.round(course.duration / 60)} hours</span>
                  </div>
                )}
              </div>

              {isEnrolled ? (
                <div className='w-full md:w-auto'>
                  <Link
                    to={`/courses/${course._id}/learn`}
                    className='btn-primary w-full flex items-center justify-center'
                  >
                    <PlayCircleIcon className='h-5 w-5 mr-2' />
                    Continue Learning
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className='btn-primary w-full md:w-auto flex items-center justify-center'
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
            <div className='bg-white rounded-xl shadow-sm border border-neutral-200 mb-6'>
              <div className='flex border-b border-neutral-200'>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 font-medium text-sm flex items-center ${
                    activeTab === 'overview'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  <BookOpenIcon className='h-5 w-5 mr-2' />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-6 py-3 font-medium text-sm flex items-center ${
                    activeTab === 'curriculum'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  <PuzzlePieceIcon className='h-5 w-5 mr-2' />
                  Curriculum
                </button>
                {isEnrolled && (
                  <button
                    onClick={() => setActiveTab('progress')}
                    className={`px-6 py-3 font-medium text-sm flex items-center ${
                      activeTab === 'progress'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <ChartBarIcon className='h-5 w-5 mr-2' />
                    My Progress
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className='p-6'>
                {activeTab === 'overview' && (
                  <div>
                    <h3 className='text-xl font-semibold text-neutral-800 mb-4'>
                      About This Course
                    </h3>
                    <div className='prose max-w-none text-neutral-700'>
                      <p>{course.description}</p>

                      {course.gamification?.pointsToEarn && (
                        <div className='mt-6 p-4 bg-primary-50 rounded-lg flex items-start'>
                          <TrophyIcon className='h-6 w-6 text-primary-600 mr-3 mt-1 flex-shrink-0' />
                          <div>
                            <h4 className='font-medium text-primary-800'>
                              Earn Rewards
                            </h4>
                            <p className='text-sm text-primary-700 mt-1'>
                              Complete this course to earn{' '}
                              {course.gamification.pointsToEarn} points!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div>
                    <h3 className='text-xl font-semibold text-neutral-800 mb-4'>
                      Course Curriculum
                    </h3>
                    {course.units?.length > 0 ? (
                      <div className='space-y-6'>
                        {course.units.map((unit, unitIndex) => (
                          <div
                            key={unit._id || unitIndex}
                            className='border border-neutral-200 rounded-lg overflow-hidden'
                          >
                            <div className='bg-neutral-50 px-4 py-3 border-b border-neutral-200'>
                              <h4 className='font-medium text-neutral-800'>
                                Unit {unitIndex + 1}: {unit.title}
                              </h4>
                              {unit.description && (
                                <p className='text-sm text-neutral-600 mt-1'>
                                  {unit.description}
                                </p>
                              )}
                            </div>
                            {unit.lessons?.length > 0 ? (
                              <ul className='divide-y divide-neutral-200'>
                                {unit.lessons.map((lesson, lessonIndex) => (
                                  <li
                                    key={lesson._id || lessonIndex}
                                    className='px-4 py-3 hover:bg-neutral-50'
                                  >
                                    <div className='flex items-start'>
                                      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center mr-3 mt-0.5'>
                                        <span className='text-neutral-600 text-sm font-medium'>
                                          {lessonIndex + 1}
                                        </span>
                                      </div>
                                      <div className='flex-1 min-w-0'>
                                        <h5 className='text-sm font-medium text-neutral-800'>
                                          {lesson.title}
                                        </h5>
                                        <div className='flex items-center mt-1 text-xs text-neutral-500'>
                                          <ClockIcon className='h-3.5 w-3.5 mr-1' />
                                          <span>
                                            {lesson.duration || 15} min
                                          </span>
                                        </div>
                                      </div>
                                      {isEnrolled && (
                                        <button
                                          onClick={() =>
                                            handleLessonComplete(
                                              lesson._id || lessonIndex
                                            )
                                          }
                                          className='ml-2 flex-shrink-0'
                                        >
                                          {completedLessons.includes(
                                            lesson._id || lessonIndex
                                          ) ? (
                                            <CheckCircleIcon className='h-5 w-5 text-green-500' />
                                          ) : (
                                            <div className='h-5 w-5 rounded-full border-2 border-neutral-300' />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className='px-4 py-6 text-center text-sm text-neutral-500'>
                                No lessons added yet
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-8 text-neutral-500'>
                        No curriculum added yet
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'progress' && isEnrolled && (
                  <div>
                    <h3 className='text-xl font-semibold text-neutral-800 mb-4'>
                      My Progress
                    </h3>
                    <div className='bg-neutral-50 rounded-lg p-6 mb-6'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-neutral-700'>
                          Course Progress
                        </span>
                        <span className='text-sm font-medium text-primary-600'>
                          {progress}%
                        </span>
                      </div>
                      <div className='w-full bg-neutral-200 rounded-full h-2.5'>
                        <div
                          className='bg-primary-600 h-2.5 rounded-full'
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <h4 className='font-medium text-neutral-800 mb-3'>
                      Completed Lessons
                    </h4>
                    {completedLessons.length > 0 ? (
                      <ul className='space-y-2'>
                        {course.units?.map(unit =>
                          unit.lessons?.map(
                            lesson =>
                              completedLessons.includes(
                                lesson._id || lesson.title
                              ) && (
                                <li
                                  key={lesson._id || lesson.title}
                                  className='flex items-center'
                                >
                                  <CheckCircleIcon className='h-5 w-5 text-green-500 mr-2' />
                                  <span className='text-sm text-neutral-700'>
                                    {unit.title}: {lesson.title}
                                  </span>
                                </li>
                              )
                          )
                        )}
                      </ul>
                    ) : (
                      <p className='text-neutral-500'>
                        You haven't completed any lessons yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Instructor Card */}
            <div className='bg-white rounded-xl shadow-sm border border-neutral-200 p-6'>
              <h3 className='text-lg font-semibold text-neutral-800 mb-4'>
                Instructor
              </h3>
              <div className='flex items-start'>
                <img
                  src={course.creator?.avatar || '/default-avatar.png'}
                  alt={course.creator?.name}
                  className='h-12 w-12 rounded-full object-cover mr-4'
                />
                <div>
                  <h4 className='font-medium text-neutral-800'>
                    {course.creator?.name}
                  </h4>
                  <p className='text-sm text-neutral-600 mt-1'>
                    {course.creator?.role === 'teacher'
                      ? 'Teacher'
                      : 'Course Instructor'}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Details Card */}
            <div className='bg-white rounded-xl shadow-sm border border-neutral-200 p-6'>
              <h3 className='text-lg font-semibold text-neutral-800 mb-4'>
                Course Details
              </h3>
              <ul className='space-y-3'>
                <li className='flex items-center'>
                  <AcademicCapIcon className='h-5 w-5 text-neutral-500 mr-3' />
                  <span className='text-sm text-neutral-700'>
                    Grade: {course.grade}
                  </span>
                </li>
                <li className='flex items-center'>
                  <PuzzlePieceIcon className='h-5 w-5 text-neutral-500 mr-3' />
                  <span className='text-sm text-neutral-700'>
                    Level: {course.level}
                  </span>
                </li>
                {course.duration > 0 && (
                  <li className='flex items-center'>
                    <ClockIcon className='h-5 w-5 text-neutral-500 mr-3' />
                    <span className='text-sm text-neutral-700'>
                      Duration: {Math.round(course.duration / 60)} hours
                    </span>
                  </li>
                )}
                <li className='flex items-center'>
                  <UserGroupIcon className='h-5 w-5 text-neutral-500 mr-3' />
                  <span className='text-sm text-neutral-700'>
                    Students: {course.enrolledStudents?.length || 0}
                  </span>
                </li>
                {course.gamification?.pointsToEarn && (
                  <li className='flex items-center'>
                    <TrophyIcon className='h-5 w-5 text-neutral-500 mr-3' />
                    <span className='text-sm text-neutral-700'>
                      Points to earn: {course.gamification.pointsToEarn}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Gamification Card */}
            {course.gamification?.hasPersonalization && (
              <div className='bg-white rounded-xl shadow-sm border border-neutral-200 p-6'>
                <h3 className='text-lg font-semibold text-neutral-800 mb-4'>
                  Personalized Learning
                </h3>
                <div className='flex items-start'>
                  <div className='bg-primary-100 rounded-full p-2 mr-3'>
                    <PuzzlePieceIcon className='h-5 w-5 text-primary-600' />
                  </div>
                  <p className='text-sm text-neutral-700'>
                    This course adapts to your learning style and pace for a
                    better experience.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
