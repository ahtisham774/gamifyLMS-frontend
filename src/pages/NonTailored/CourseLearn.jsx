import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  BookmarkIcon,
  BeakerIcon,
  DocumentTextIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'


const CourseLearn = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeUnitIndex, setActiveUnitIndex] = useState(0)
  const [activeLessonIndex, setActiveLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([])
  const [quizResults, setQuizResults] = useState({})
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [currentAttempt, setCurrentAttempt] = useState(null)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userProgress, setUserProgress] = useState({
    progressPercentage: 0
  })

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

        // Get user progress if logged in
        if (user) {
          const enrolledResponse = await api.get('/courses/enrolled')
          if (enrolledResponse.data.success) {
            const enrollment = enrolledResponse.data.enrolledCourses.find(
              e => e.course._id === id
            )
            if (enrollment) {
              setCompletedLessons(enrollment.completedLessons || [])
              setUserProgress(prev => ({
                ...prev,
                progressPercentage: enrollment.progress || 0
              }))
            } else {
              navigate(`/courses/${id}`)
            }
          }
        } else {
          navigate(`/courses/${id}`)
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id, user, navigate])

  

  const markLessonComplete = async (lessonId, isComplete) => {
    try {
      // Don't allow marking as complete if already completed
      if (isComplete && completedLessons.includes(lessonId)) {
        toast.info('This lesson is already marked as completed');
        return false;
      }
  
      const response = await api.post(`/courses/${id}/progress`, {
        lessonId,
        completed: isComplete
      });
  
      if (response.data.success) {
        // Update local state based on response
        const { progress } = response.data;
      
        setUserProgress(prev => ({
          progressPercentage: progress.progressPercentage || prev.progressPercentage
        }));
  
        // Update completed lessons list
        if (isComplete) {
          setCompletedLessons(prev => [...prev, lessonId]);
        } else {
          setCompletedLessons(prev => prev.filter(id => id !== lessonId));
        }
  
        // Also update the course's lesson completion status
        setCourse(prevCourse => {
          const updatedCourse = { ...prevCourse };
          for (const unit of updatedCourse.units) {
            for (const lesson of unit.lessons) {
              if (lesson._id === lessonId) {
                lesson.isCompleted = isComplete;
                if (isComplete) {
                  lesson.completedAt = new Date();
                  lesson.completedBy = [...(lesson.completedBy || []), user._id];
                } else {
                  lesson.completedAt = null;
                  lesson.completedBy = (lesson.completedBy || []).filter(
                    userId => userId !== user._id
                  );
                }
                break;
              }
            }
          }
          return updatedCourse;
        });
  
        toast.success(isComplete ? 'Lesson completed!' : 'Lesson marked as incomplete');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating progress:', err);
      toast.error('Failed to update progress. Please try again.');
      return false;
    }
  };

  const startQuizAttempt = async quizId => {
    try {
      const response = await api.post('/attempts/start', { quizId })
      if (response.data.success) {
        setCurrentAttempt(response.data.attempt)
        setQuizQuestions(response.data.attempt.questions)
        setShowQuiz(true)
      }
    } catch (error) {
      console.error('Error starting quiz attempt:', error)
      toast.error(error?.response?.data?.message || 'Failed to start quiz. Please try again.')
    }
  }

  const handleQuizAnswerChange = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNextLesson = () => {
    if (!course?.units) return

    const currentUnit = course.units[activeUnitIndex]
    if (activeLessonIndex < currentUnit?.lessons?.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1)
      setShowQuiz(false)
    } else if (activeUnitIndex < course?.units?.length - 1) {
      setActiveUnitIndex(activeUnitIndex + 1)
      setActiveLessonIndex(0)
      setShowQuiz(false)
    }
  }

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1)
      setShowQuiz(false)
    } else if (activeUnitIndex > 0) {
      setActiveUnitIndex(activeUnitIndex - 1)
      const prevUnit = course.units[activeUnitIndex - 1]
      setActiveLessonIndex(prevUnit.lessons.length - 1)
      setShowQuiz(false)
    }
  }

  const handleQuizSubmit = async () => {
    try {
      if (!currentAttempt) return

      // Format answers for submission
      const formattedAnswers = Object.entries(quizAnswers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer
        })
      )

      // Submit quiz answers
      const response = await api.post(
        `/attempts/submit/${currentAttempt._id}`,
        { answers: formattedAnswers }
      )

      if (response.data.success) {
        // Mark lesson as completed after successful quiz submission
        const lessonId =
          course.units[activeUnitIndex].lessons[activeLessonIndex]._id
        const markedComplete = await markLessonComplete(lessonId, true)

        if (markedComplete) {
          // Show quiz results
          setQuizResults(prev => ({
            ...prev,
            [lessonId]: response.data.attempt.percentageScore
          }))
          
          toast.success(
            `Quiz completed! Score: ${Math.round(
              response.data.attempt.percentageScore
            )}%`
          );
    
          // Reset quiz state
          setShowQuiz(false);
          setCurrentAttempt(null);
          setQuizAnswers({});
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz. Please try again.')
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12'>
        <div className='max-w-4xl mx-auto px-4'>
          <div className='bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-red-500'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>
              {error}
            </h2>
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

  const renderCompletionButton = () => {
    const lessonId = currentLesson?._id;
    const hasQuiz = currentLesson?.quizzes?.length > 0;
  
    const quizScore = quizResults[lessonId];
    const hasQuizScore = typeof quizScore !== 'undefined';

    // If lesson is already completed, show disabled completed state
    if (isCompleted) {
      return (
        <div className='flex items-center space-x-2 px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium'>
          <CheckCircleIcon className='h-5 w-5' />
          <span>Completed</span>
        </div>
      );
    }

    // If lesson has quiz and hasn't been taken yet
    if (hasQuiz && !hasQuizScore) {
      return (
        <button
          onClick={() => startQuizAttempt(currentLesson.quizzes[0]._id)}
          className='px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all'
        >
          <span className='flex items-center'>
            <BeakerIcon className='h-5 w-5 mr-2' />
            Take Quiz
          </span>
        </button>
      );
    }

    // Default mark complete button
    return (
      <button
        onClick={() => markLessonComplete(lessonId, true)}
        className='px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all'
      >
        <span className='flex items-center'>
          <BookmarkIcon className='h-5 w-5 mr-2' />
          Mark Complete
        </span>
      </button>
    );
  };

  if (!course) {
    return null
  }

  const currentUnit = course.units[activeUnitIndex]
  const currentLesson = currentUnit?.lessons[activeLessonIndex]
  const lessonId = currentLesson?._id || `${activeUnitIndex}-${activeLessonIndex}`
  const quizScore = quizResults[lessonId]
  const hasQuizScore = typeof quizScore !== 'undefined'

  const completionPercentage = userProgress?.progressPercentage || 0;
  const isCompleted =  currentLesson?.isCompleted && currentLesson?.completedBy && currentLesson?.completedBy.includes(user._id);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50'>
      {/* Header */}
      <header className='bg-white shadow-md border-b border-indigo-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-4 flex items-center justify-between'>
            <Link
              to={`/courses/${id}`}
              className='group flex items-center text-indigo-600 hover:text-indigo-800 font-medium'
            >
              <div className='p-1 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors mr-2'>
                <ArrowLeftIcon className='h-5 w-5' />
              </div>
              <span>Back to Course</span>
            </Link>
            
            <div className='hidden md:flex items-center'>
              <span className='font-medium text-gray-800 truncate max-w-xs'>{course.title}</span>
            </div>

            <div className='bg-indigo-100 rounded-full px-4 py-1.5 flex items-center space-x-2'>
              <div className='font-medium text-indigo-800 text-sm'>{completionPercentage}% Complete</div>
              <div className='w-24 bg-white rounded-full h-2'>
                <div 
                  className='bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full' 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex'>
          {/* Sidebar - Course Navigation */}
          <div className={`${sidebarOpen ? 'w-80' : 'w-0 opacity-0'} transition-all duration-300 ease-in-out overflow-hidden mr-6`}>
            <div className='bg-white rounded-2xl shadow-xl border border-indigo-100 sticky top-8 overflow-hidden'>
              <div className='p-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-600 to-blue-600'>
                <h3 className='font-semibold text-white flex items-center'>
                  <BookOpenIcon className='h-5 w-5 mr-2' />
                  <span>Course Content</span>
                </h3>
              </div>

              <div className='divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto'>
                {course.units.map((unit, uIndex) => (
                  <div key={unit._id || uIndex} className='bg-white'>
                    <div className='p-4 bg-indigo-50'>
                      <h4 className='font-medium text-indigo-800 text-sm'>
                        <span className='inline-block bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md mr-2'>
                          Unit {uIndex + 1}
                        </span>
                        {unit.title}
                      </h4>
                    </div>

                    <ul>
                      {unit.lessons.map((lesson, lIndex) => {
                        const lid = lesson._id || `${uIndex}-${lIndex}`;
                        const isActive = uIndex === activeUnitIndex && lIndex === activeLessonIndex;

                        return (
                          <li key={lid} className={isActive ? 'relative' : ''}>
                            {isActive && (
                              <div className='absolute left-0 top-0 bottom-0 w-1 bg-indigo-600'></div>
                            )}
                            <button
                              onClick={() => {
                                setActiveUnitIndex(uIndex);
                                setActiveLessonIndex(lIndex);
                                setShowQuiz(false);
                              }}
                              className={`w-full text-left p-4 flex items-center justify-between hover:bg-blue-50 ${
                                isActive ? 'bg-blue-50 text-indigo-900' : 'text-gray-700'
                              }`}
                            >
                              <div className='flex items-center'>
                                {lesson?.isCompleted && lesson?.completedBy && lesson?.completedBy.includes(user._id) ? (
                                  <div className='rounded-full bg-green-500 p-1 mr-3'>
                                    <CheckCircleIcon className='h-4 w-4 text-white' />
                                  </div>
                                ) : (
                                  <div className={`h-6 w-6 rounded-full mr-3 flex items-center justify-center border-2 
                                    ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-400'}`}>
                                    {lIndex + 1}
                                  </div>
                                )}
                                <span className={`${isCompleted ? 'text-gray-500' : ''} ${isActive ? 'font-medium' : ''}`}>
                                  {lesson.title}
                                </span>
                              </div>
                              {lesson.duration && (
                                <span className='text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600'>
                                  {lesson.duration} min
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Sidebar Button */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='fixed left-0 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-r-lg shadow-md hover:bg-indigo-700 transition-colors z-10'
          >
            {sidebarOpen ? (
              <ChevronLeftIcon className='h-5 w-5' />
            ) : (
              <ChevronRightIcon className='h-5 w-5' />
            )}
          </button>

          {/* Main Content */}
          <div className='flex-1 min-w-0'>
            <div className='bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden'>
              {/* Lesson Header */}
              <div className='p-6 border-b border-indigo-100 bg-gradient-to-r from-blue-50 to-indigo-50'>
                <div className='flex justify-between items-start'>
                  <div>
                    <span className='inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mb-2'>
                      Unit {activeUnitIndex + 1}: {currentUnit?.title}
                    </span>
                    <h2 className='text-3xl font-bold text-gray-800 mb-1'>
                      {currentLesson?.title}
                    </h2>
                    {hasQuizScore && (
                      <div className='mt-2 inline-block px-3 py-1 rounded-full bg-white shadow-sm'>
                        <span
                          className={`font-medium ${
                            quizScore >= 70 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          Quiz Result: {Math.round(quizScore)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    {renderCompletionButton()}
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className='p-8'>
                {showQuiz && currentAttempt ? (
                  <div className='max-w-3xl mx-auto'>
                    <div className='flex items-center space-x-3 mb-8'>
                      <div className='p-2 rounded-full bg-indigo-100'>
                        <BeakerIcon className='h-6 w-6 text-indigo-600' />
                      </div>
                      <h3 className='text-2xl font-bold text-gray-800'>
                        Quiz: {currentLesson?.title}
                      </h3>
                    </div>

                    {/* Quiz Questions */}
                    <div className='space-y-8'>
                      {quizQuestions.map((question, index) => (
                        <div
                          key={question._id}
                          className='bg-white border border-indigo-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow'
                        >
                          <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                            <span className='inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 mr-3'>
                              {index + 1}
                            </span>
                            {question.questionText}
                          </h4>

                          {question.questionType === 'multiple-choice' && (
                            <div className='space-y-3 mt-4'>
                              {question.options.map(option => (
                                <label
                                  key={option._id}
                                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                    quizAnswers[question._id] === option._id
                                      ? 'border-indigo-500 bg-indigo-50'
                                      : 'border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <input
                                    type='radio'
                                    name={`quiz-${question._id}`}
                                    value={option._id}
                                    checked={quizAnswers[question._id] === option._id}
                                    onChange={() => handleQuizAnswerChange(question._id, option._id)}
                                    className='h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500'
                                  />
                                  <span className='ml-3 text-gray-700'>{option.text}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {question.questionType === 'true-false' && (
                            <div className='grid grid-cols-2 gap-4 mt-4'>
                              {['True', 'False'].map(option => (
                                <label
                                  key={option}
                                  className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                    quizAnswers[question._id] === option
                                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                      : 'border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <input
                                    type='radio'
                                    name={`quiz-${question._id}`}
                                    value={option}
                                    checked={quizAnswers[question._id] === option}
                                    onChange={() => handleQuizAnswerChange(question._id, option)}
                                    className='sr-only'
                                  />
                                  <span className='font-medium'>{option}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quiz Actions */}
                    <div className='flex justify-between items-center mt-8 pt-6 border-t border-gray-200'>
                      <button
                        onClick={() => {
                          setShowQuiz(false);
                          setCurrentAttempt(null);
                          setQuizAnswers({});
                        }}
                        className='px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors'
                      >
                        Cancel Quiz
                      </button>
                      
                      <button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                        className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-md ${
                          Object.keys(quizAnswers).length < quizQuestions.length
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                        } transition-colors`}
                      >
                        Submit Answers
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='max-w-3xl mx-auto'>
                    <div className='flex items-center space-x-3 mb-8'>
                      <div className='p-2 rounded-full bg-indigo-100'>
                        <DocumentTextIcon className='h-6 w-6 text-indigo-600' />
                      </div>
                      <h3 className='text-2xl font-bold text-gray-800'>
                        Lesson Content
                      </h3>
                    </div>

                    <div className='prose prose-lg max-w-none'>
                      <p className='text-gray-700 leading-relaxed'>
                        {currentLesson?.content || 'No content provided for this lesson.'}
                      </p>
                    </div>

                    {/* Resources Section */}
                    {currentLesson?.resources?.length > 0 && (
                      <div className='mt-12'>
                        <h4 className='text-xl font-semibold text-gray-800 mb-6 flex items-center'>
                          <AcademicCapIcon className='h-6 w-6 mr-2 text-indigo-600' />
                          Additional Resources
                        </h4>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                          {currentLesson.resources.map((resource, i) => {
                            let icon = <BookOpenIcon className='h-6 w-6 text-indigo-600' />;
                            if (resource.type === 'video') {
                              icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-indigo-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                              </svg>;
                            } else if (resource.type === 'pdf') {
                              icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-indigo-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>;
                            }
                            
                            return (
                              <div key={i} className='group bg-white rounded-xl border border-indigo-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
                                <div className='bg-gradient-to-r from-indigo-50 to-blue-50 p-4 flex items-center justify-between border-b border-indigo-100'>
                                  <div className='flex items-center'>
                                    <div className='rounded-full bg-white p-2 shadow-sm mr-3'>
                                      {icon}
                                    </div>
                                    <h5 className='font-medium text-gray-800 capitalize'>
                                      {resource.type} Resource
                                    </h5>
                                  </div>
                                </div>
                                
                                <div className='p-4'>
                                  {resource.url ? (
                                    <a
                                      href={resource.url}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors'
                                    >
                                      View Resource
                                    </a>
                                  ) : (
                                    <p className='text-gray-600'>
                                      {resource.content}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className='p-6 border-t border-indigo-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center'>
                <button
                  onClick={handlePrevLesson}
                  disabled={activeUnitIndex === 0 && activeLessonIndex === 0}
                  className={`flex items-center px-6 py-2 rounded-full ${
                    activeUnitIndex === 0 && activeLessonIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-indigo-600 shadow-md hover:shadow-lg hover:text-indigo-700'
                  } transition-all`}
                >
                  <ChevronLeftIcon className='h-5 w-5 mr-1' />
                  Previous Lesson
                </button>

                <div className='px-4 py-2 bg-white rounded-full shadow-sm'>
                  <span className='text-sm font-medium text-gray-700'>
                    Lesson {activeLessonIndex + 1} of {currentUnit?.lessons?.length}
                  </span>
                </div>

                <button
                  onClick={handleNextLesson}
                  disabled={
                    activeUnitIndex === course.units.length - 1 &&
                    activeLessonIndex === currentUnit?.lessons?.length - 1
                  }
                  className={`flex items-center px-6 py-2 rounded-full ${
                    activeUnitIndex === course.units.length - 1 &&
                    activeLessonIndex === currentUnit?.lessons?.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700'
                  } transition-all`}
                >
                  Next Lesson
                  <ChevronRightIcon className='h-5 w-5 ml-1' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseLearn