import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon,
  ClockIcon,
  AcademicCapIcon,
  UserGroupIcon,
  PresentationChartLineIcon,
  HeartIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  BookOpenIcon,
  PlayCircleIcon,
  DocumentIcon,
  GlobeAmericasIcon,
  QuestionMarkCircleIcon,
  TrophyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';


const CourseDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/courses/${id}`);
        if (response.data.success) {
          setCourse(response.data.course);
        } else {
          setError('Course not found');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (isAuthenticated && course) {
        try {
          const response = await api.get('/courses/enrolled');
          if (response.data.success) {
            const enrolledCourses = response.data.enrolledCourses;
            const enrolled = enrolledCourses.some(
              (enrolment) => enrolment.course._id === course._id
            );
            setIsEnrolled(enrolled);

            if (enrolled) {
              const enrolment = enrolledCourses.find(
                (enrolment) => enrolment.course._id === course._id
              );
              setProgress(enrolment.progress);
            }
          }
        } catch (error) {
          console.error('Error checking enrollment:', error);
          toast.error('Failed to check enrollment status.');
        }
      } else {
        setIsEnrolled(false);
        setProgress(0);
      }
    };

    checkEnrollment();
  }, [isAuthenticated, course]);

  const handleEnroll = async () => {
    try {
      const response = await api.post(`/courses/${id}/enroll`);
      if (response.data.success) {
        toast.success('Successfully enrolled in course!');
        setIsEnrolled(true);
        navigate(`/courses/${id}/learn`);
      } else {
        toast.error('Failed to enroll in course.');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course. Please try again.');
    }
  };

  const handleDeleteCourse = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/courses/${id}`);
      if (response.data.success) {
        toast.success('Course deleted successfully!');
        navigate('/courses');
      } else {
        toast.error('Failed to delete course.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course. Please try again.');
    } finally {
      setShowConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
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
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className='bg-neutral-50 min-h-screen'>
      {/* Course Header */}
      <div className='relative'>
        <img
          src={course.imageUrl || '/default-course.png'}
          alt={course.title}
          className='w-full h-64 object-cover'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-course.png';
          }}
        />
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold'>{course.title}</h1>
            <p className='mt-2 text-lg opacity-80'>{course.description}</p>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Course Details */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
              <div className='p-6 border-b border-neutral-200'>
                <h2 className='text-xl font-bold text-neutral-800 mb-4'>
                  Course Overview
                </h2>
                <p className='text-neutral-700'>{course.description}</p>
              </div>

              <div className='p-6'>
                <h3 className='text-lg font-bold text-neutral-800 mb-3'>
                  Course Content
                </h3>
                {course.units && course.units.length > 0 ? (
                  <ul className='space-y-4'>
                    {course.units.map((unit, index) => (
                      <li
                        key={unit._id || index}
                        className='border border-neutral-200 rounded-xl p-4'
                      >
                        <h4 className='font-medium text-neutral-800 mb-2'>
                          Unit {index + 1}: {unit.title}
                        </h4>
                        {unit.lessons && unit.lessons.length > 0 ? (
                          <ul className='space-y-2'>
                            {unit.lessons.map((lesson, lessonIndex) => (
                              <li
                                key={lesson._id || lessonIndex}
                                className='flex items-center justify-between text-neutral-700'
                              >
                                <div className='flex items-center'>
                                  <BookOpenIcon className='h-5 w-5 mr-2' />
                                  <span>{lesson.title}</span>
                                </div>
                                <span className='text-sm'>
                                  {lesson.duration || 15} min
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className='text-neutral-600'>No lessons in this unit.</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-neutral-600'>No units in this course.</p>
                )}
              </div>
            </div>
          </div>

          {/* Course Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
              <div className='p-6 border-b border-neutral-200'>
                <h3 className='text-lg font-bold text-neutral-800 mb-3'>
                  Course Details
                </h3>
                <div className='flex items-center text-neutral-600 mb-2'>
                  <ClockIcon className='h-5 w-5 mr-2' />
                  <span>{course.duration ? Math.round(course.duration / 60) : 'N/A'} hours</span>
                </div>
                <div className='flex items-center text-neutral-600 mb-2'>
                  <AcademicCapIcon className='h-5 w-5 mr-2' />
                  <span>Level: {course.level || 'Beginner'}</span>
                </div>
                <div className='flex items-center text-neutral-600 mb-2'>
                  <UserGroupIcon className='h-5 w-5 mr-2' />
                  <span>{course.enrolledStudents?.length || 0} students enrolled</span>
                </div>
                <div className='flex items-center text-neutral-600 mb-2'>
                  <PresentationChartLineIcon className='h-5 w-5 mr-2' />
                  <span>{course.subject || 'General'}</span>
                </div>
              </div>

              <div className='p-6 border-b border-neutral-200'>
                <h3 className='text-lg font-bold text-neutral-800 mb-3'>
                  Your Progress
                </h3>
                {isAuthenticated ? (
                  isEnrolled ? (
                    <>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-neutral-700'>Course Progress</span>
                        <span className='text-sm font-medium text-primary-600'>{progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <Link
                        to={`/courses/${id}/learn`}
                        className='btn-primary w-full mt-4'
                      >
                        Continue Learning
                      </Link>
                    </>
                  ) : (
                    <button onClick={handleEnroll} className='btn-primary w-full'>
                      Enroll Now
                    </button>
                  )
                ) : (
                  <p className='text-neutral-600'>
                    <Link to='/login' className='text-primary-600 hover:underline'>
                      Log in
                    </Link>{' '}
                    to enroll in this course.
                  </p>
                )}
              </div>

              {/* Gamification Elements */}
              {course.gamification && (
                <div className='p-6'>
                  <h3 className='text-lg font-bold text-neutral-800 mb-3'>
                    Gamification
                  </h3>
                  <div className='flex items-center text-neutral-600 mb-2'>
                    <TrophyIcon className='h-5 w-5 mr-2' />
                    <span>Points to Earn: {course.gamification.pointsToEarn}</span>
                  </div>
                  <div className='flex items-center text-neutral-600 mb-2'>
                    <ShieldCheckIcon className='h-5 w-5 mr-2' />
                    <span>Rewards Available: {course.gamification.rewardsAvailable?.length || 0}</span>
                  </div>
                </div>
              )}

              {/* Creator Section */}
              {course.creator && (
                <div className='p-6 border-t border-neutral-200'>
                  <h3 className='text-lg font-bold text-neutral-800 mb-3'>
                    About the Creator
                  </h3>
                  <div className='flex items-center mb-3'>
                    <img
                      src={course.creator.avatar || '/default-avatar.png'}
                      alt={course.creator.name}
                      className='w-10 h-10 rounded-full object-cover mr-3'
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div>
                      <p className='font-medium text-neutral-800'>{course.creator.name}</p>
                      <p className='text-sm text-neutral-600'>{course.creator.email}</p>
                    </div>
                  </div>
                  <Link
                    to={`mailto:${course.creator.email}`}
                    className='text-sm text-primary-600 hover:underline'
                  >
                    Contact Creator
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-xl shadow-lg p-8 max-w-md w-full'>
            <h2 className='text-xl font-bold text-neutral-800 mb-4'>
              Confirm Deletion
            </h2>
            <p className='text-neutral-700 mb-6'>
              Are you sure you want to delete this course? This action cannot be
              undone.
            </p>
            <div className='flex justify-end space-x-4'>
              <button onClick={cancelDelete} className='btn-outline'>
                Cancel
              </button>
              <button onClick={confirmDelete} className='btn-destructive'>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;