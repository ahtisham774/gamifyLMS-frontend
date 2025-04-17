import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'

const Courses = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filtering and Sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    subject: '',
    grade: '',
    level: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Enrolled Courses Tracking
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([])
  const [enrollingCourseId, setEnrollingCourseId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get all published courses with filters
        const coursesResponse = await api.get('/courses', {
          params: {
            ...filters,
            search: searchTerm,
            grade: filters.grade || undefined // Only send if not empty
          }
        })

        if (coursesResponse.data.success) {
          // Sort courses based on selected sort method
          let sortedCourses = [...coursesResponse.data.courses]

          if (sortBy === 'newest') {
            sortedCourses.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          } else if (sortBy === 'oldest') {
            sortedCourses.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            )
          } else if (sortBy === 'rating') {
            sortedCourses.sort(
              (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
            )
          } else if (sortBy === 'az') {
            sortedCourses.sort((a, b) => a.title.localeCompare(b.title))
          } else if (sortBy === 'za') {
            sortedCourses.sort((a, b) => b.title.localeCompare(a.title))
          }

          setCourses(sortedCourses)
        }

        // If user is logged in, get their enrolled courses
        if (user) {
          const enrolledResponse = await api.get('/courses/enrolled')

          if (enrolledResponse.data.success) {
            const enrolledIds = enrolledResponse.data.enrolledCourses.map(
              enrollment => enrollment?.course?._id
            )
            setEnrolledCourseIds(enrolledIds)
          }
        }
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError('Failed to load courses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters, searchTerm, sortBy, user])

  const handleSearchChange = e => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = e => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      subject: '',
      grade: '',
      level: ''
    })
    setSearchTerm('')
  }

  const handleEnrollCourse = async courseId => {
    if (!user) {
      navigate('/login', { state: { from: '/courses' } })
      return
    }

    try {
      setEnrollingCourseId(courseId)

      // Call API to enroll in course
      const response = await api.post(`/courses/${courseId}/enroll`)

      if (response.data.success) {
        // Update enrolled courses list
        setEnrolledCourseIds(prev => [...prev, courseId])

        // Show success message
        toast.success('Successfully enrolled in the course!')
      }
    } catch (err) {
      console.error('Error enrolling in course:', err)

      if (
        err.response?.data?.message === 'User already enrolled in this course'
      ) {
        setEnrolledCourseIds(prev => [...prev, courseId])
        toast.info('You are already enrolled in this course')
      } else {
        toast.error(
          err.response?.data?.message ||
            'Failed to enroll in course. Please try again.'
        )
      }
    } finally {
      setEnrollingCourseId(null)
    }
  }

  const getSubjectColor = subject => {
    const colors = {
      mathematics: 'bg-blue-100 text-blue-800 border-blue-200',
      english: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      science: 'bg-purple-100 text-purple-800 border-purple-200',
      social: 'bg-amber-100 text-amber-800 border-amber-200',
      art: 'bg-pink-100 text-pink-800 border-pink-200',
      music: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'physical-education': 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getLevelBadge = level => {
    const badges = {
      beginner: 'bg-green-100 text-green-800 border-green-200',
      intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      advanced: 'bg-red-100 text-red-800 border-red-200'
    }
    return badges[level] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const filteredCourses = courses?.filter(course => {
    const matchesSearch =
      !searchTerm ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject =
      !filters.subject || course.subject === filters.subject
    const matchesGrade =
      !filters.grade || course.grade === Number(filters.grade)
    const matchesLevel = !filters.level || course.level === filters.level

    return matchesSearch && matchesSubject && matchesGrade && matchesLevel
  })

  let sortedCourses = [...filteredCourses]
  if (sortBy === 'newest') {
    sortedCourses.sort(
      (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
    )
  } else if (sortBy === 'oldest') {
    sortedCourses.sort(
      (a, b) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
    )
  } else if (sortBy === 'rating') {
    sortedCourses.sort((a, b) => b.averageRating - a.averageRating)
  } else if (sortBy === 'az') {
    sortedCourses.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy === 'za') {
    sortedCourses.sort((a, b) => b.title.localeCompare(a.title))
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12'>
        <div className='max-w-4xl mx-auto px-4'>
          <div className='bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-red-500'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>{error}</h2>
            <Link
              to='/courses'
              className='inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition-colors'
            >
              <ArrowLeftIcon className='h-5 w-5 mr-2' />
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-indigo-900 mb-3'>
            Discover Your Next Learning Adventure
          </h1>
          <p className='text-lg text-indigo-700 max-w-2xl mx-auto'>
            Explore our interactive courses designed to make learning engaging
            and fun
          </p>
        </div>

        <div className='bg-white rounded-xl shadow-md border border-indigo-100 mb-10 p-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-1'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                <MagnifyingGlassIcon className='w-5 h-5' />
              </div>
              <input
                placeholder='Search for courses...'
                className='w-full pl-10 pr-4 py-2 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className='border border-indigo-200 text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 rounded-md px-4 py-2 flex items-center'
            >
              <AdjustmentsHorizontalIcon className='w-5 h-5 mr-2' />
              Filters
              <ChevronDownIcon
                className={`ml-2 w-4 h-4 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='border border-indigo-200 rounded-md px-4 py-2'
            >
              <option value='newest'>Newest First</option>
              <option value='oldest'>Oldest First</option>
              <option value='rating'>Highest Rated</option>
              <option value='az'>A-Z</option>
              <option value='za'>Z-A</option>
            </select>
          </div>

          {showFilters && (
            <div className='mt-6 pt-6 border-t border-indigo-100 grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subject
                </label>
                <select
                  value={filters.subject}
                  onChange={e => handleFilterChange('subject', e.target.value)}
                  className='w-full border border-indigo-200 rounded-md px-3 py-2'
                >
                  <option value=''>All Subjects</option>
                  <option value='mathematics'>Mathematics</option>
                  <option value='english'>English</option>
                  <option value='science'>Science</option>
                  <option value='social'>Social Studies</option>
                  <option value='art'>Art</option>
                  <option value='music'>Music</option>
                  <option value='physical-education'>Physical Education</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Grade
                </label>
                <select
                  value={filters.grade}
                  onChange={e => handleFilterChange('grade', e.target.value)}
                  className='w-full border border-indigo-200 rounded-md px-3 py-2'
                >
                  <option value=''>All Grades</option>
                  <option value='1'>Grade 1</option>
                  <option value='2'>Grade 2</option>
                  <option value='3'>Grade 3</option>
                  <option value='4'>Grade 4</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Level
                </label>
                <select
                  value={filters.level}
                  onChange={e => handleFilterChange('level', e.target.value)}
                  className='w-full border border-indigo-200 rounded-md px-3 py-2'
                >
                  <option value=''>All Levels</option>
                  <option value='beginner'>Beginner</option>
                  <option value='intermediate'>Intermediate</option>
                  <option value='advanced'>Advanced</option>
                </select>
              </div>

              <div className='md:col-span-3 flex justify-end'>
                <button
                  onClick={resetFilters}
                  className='text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-4 py-2 rounded-md'
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {sortedCourses.length === 0 ? (
          <div className='text-center py-16 bg-white rounded-xl shadow border border-indigo-100'>
            <AcademicCapIcon className='h-16 w-16 mx-auto text-indigo-300' />
            <h3 className='mt-4 text-xl font-medium text-indigo-900'>
              No courses found
            </h3>
            <p className='mt-2 text-indigo-600'>
              Try adjusting your filters or search terms
            </p>
            <button
              className='mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full'
              onClick={resetFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {sortedCourses.map(course => (
              <div
                key={course._id}
                className='bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group'
              >
                <div className='relative h-48 overflow-hidden'>
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute top-0 inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70'></div>
                  <div className='absolute top-3 right-3 flex gap-2'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getSubjectColor(
                        course.subject
                      )}`}
                    >
                      {course.subject.charAt(0).toUpperCase() +
                        course.subject.slice(1)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelBadge(
                        course.level
                      )}`}
                    >
                      {course.level.charAt(0).toUpperCase() +
                        course.level.slice(1)}
                    </span>
                  </div>
                  {/* {course.gamification?.hasPersonalization && (
                    <div className='absolute bottom-3 left-3'>
                      <span className='px-2 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white'>
                        Personalized Learning
                      </span>
                    </div>
                  )} */}
                </div>

                <div className='p-6'>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1'>
                      {course.title}
                    </h3>
                    <div className='flex items-center bg-amber-50 px-2 py-1 rounded-full'>
                      <StarIcon className='h-4 w-4 text-amber-500 mr-1 fill-amber-500' />
                      <span className='text-sm font-medium text-amber-700'>
                        {course.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className='text-gray-600 text-sm mb-4 line-clamp-2 h-10'>
                    {course.description}
                  </p>

                  <div className='flex items-center justify-between mb-5'>
                    <div className='flex items-center text-xs text-gray-500'>
                      <AcademicCapIcon className='h-4 w-4 mr-1' />
                      <span>Grade {course.grade}</span>
                    </div>
                    <div className='flex items-center text-xs text-gray-500'>
                      <UserGroupIcon className='h-4 w-4 mr-1' />
                      <span>{course.enrolledStudents.length} students</span>
                    </div>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-3'>
                    {enrolledCourseIds.includes(course._id) ? (
                      <Link
                        to={`/courses/${course._id}`}
                        className='w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-6 py-2.5 rounded-lg text-white font-medium shadow-md flex items-center justify-center'
                      >
                        Go to Course
                      </Link>
                    ) : (
                      <>
                        <Link
                          to={`/courses/${course._id}`}
                          className='sm:flex-1 text-center border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-md'
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleEnrollCourse(course._id)}
                          className='sm:flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-6 py-2.5 rounded-lg text-white font-medium shadow-md flex items-center justify-center'
                          disabled={enrollingCourseId === course._id}
                        >
                          {enrollingCourseId === course._id ? (
                            <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                          ) : (
                            <>
                              <BookOpenIcon className='h-4 w-4 mr-2' />
                              <span>Enroll</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
