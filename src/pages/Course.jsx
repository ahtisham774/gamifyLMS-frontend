import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  TrophyIcon,
  ChartBarIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RewardPopup from '../components/RewardPopup';
import { Progress } from '@/components/ui/progress';

const LearnCourse = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [earnedRewards, setEarnedRewards] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [userProgress, setUserProgress] = useState({
    points: 0,
    level: 1,
    progressPercentage: 0
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get course details
        const courseResponse = await api.get(`/courses/${id}`);
        if (courseResponse.data.success) {
          setCourse(courseResponse.data.course);
        } else {
          setError('Course not found');
        }

        // Get user progress if logged in
        if (user) {
          const enrolledResponse = await api.get('/courses/enrolled');
          if (enrolledResponse.data.success) {
            const enrollment = enrolledResponse.data.enrolledCourses.find(
              e => e.course._id === id
            );
            if (enrollment) {
              setCompletedLessons(enrollment.completedLessons || []);
              setUserProgress(prev => ({
                ...prev,
                progressPercentage: enrollment.progress || 0
              }));
            } else {
              navigate(`/courses/${id}`);
            }
          }

          // Get user points and level
          const profileResponse = await api.get('/auth/profile');
          if (profileResponse.data.success) {
            setUserProgress(prev => ({
              ...prev,
              points: profileResponse.data.user.points || 0,
              level: profileResponse.data.user.level || 1
            }));
          }
        } else {
          navigate(`/courses/${id}`);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user, navigate]);

  const markLessonComplete = async (lessonId, isComplete) => {
    try {
      const response = await api.post(`/courses/${id}/progress`, {
        lessonId,
        completed: isComplete
      });

      if (response.data.success) {
        if (isComplete) {
          setCompletedLessons(prev => [...prev, lessonId]);
          
          // Update points and level if returned
          if (response.data.progress) {
            setUserProgress(prev => ({
              ...prev,
              points: response.data.progress.points || prev.points,
              level: response.data.progress.level || prev.level,
              progressPercentage: response.data.progress.progressPercentage || prev.progressPercentage
            }));
            
            // Show toast for earned points
            if (response.data.progress.points > userProgress.points) {
              const pointsEarned = response.data.progress.points - userProgress.points;
              setEarnedPoints(pointsEarned);
              toast.success(`🎉 You earned ${pointsEarned} points!`);
              
              // Check for level up
              if (response.data.progress.level > userProgress.level) {
                toast.success(`🏆 Congratulations! You leveled up to Level ${response.data.progress.level}!`);
              }
            }
          }
        } else {
          setCompletedLessons(prev => prev.filter(id => id !== lessonId));
        }
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      toast.error('Failed to update progress. Please try again.');
    }
  };

  const startQuizAttempt = async quizId => {
    try {
      const response = await api.post('/attempts/start', { quizId });
      if (response.data.success) {
        setCurrentAttempt(response.data.attempt);
        setQuizQuestions(response.data.attempt.questions);
        setShowQuiz(true);
      }
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      toast.error('Failed to start quiz. Please try again.');
    }
  };

  const handleQuizAnswerChange = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextLesson = () => {
    if (!course?.units) return;

    const currentUnit = course.units[activeUnitIndex];
    if (activeLessonIndex < currentUnit?.lessons?.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
      setShowQuiz(false);
    } else if (activeUnitIndex < course?.units?.length - 1) {
      setActiveUnitIndex(activeUnitIndex + 1);
      setActiveLessonIndex(0);
      setShowQuiz(false);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
      setShowQuiz(false);
    } else if (activeUnitIndex > 0) {
      setActiveUnitIndex(activeUnitIndex - 1);
      const prevUnit = course.units[activeUnitIndex - 1];
      setActiveLessonIndex(prevUnit.lessons.length - 1);
      setShowQuiz(false);
    }
  };

  const handleQuizSubmit = async () => {
    try {
      if (!currentAttempt) return;

      // Format answers for submission
      const formattedAnswers = Object.entries(quizAnswers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer
        })
      );

      const response = await api.post(
        `/attempts/submit/${currentAttempt._id}`,
        {
          answers: formattedAnswers
        }
      );

      if (response.data.success) {
        // Mark lesson as completed
        const lessonId =
          course.units[activeUnitIndex].lessons[activeLessonIndex]._id;
        await markLessonComplete(lessonId, true);

        // Show results
        setQuizResults(prev => ({
          ...prev,
          [lessonId]: response.data.attempt.percentageScore
        }));

        // Update points and level
        if (response.data.attempt.pointsEarned) {
          setUserProgress(prev => ({
            ...prev,
            points: userProgress.points + response.data.attempt.pointsEarned,
            level: Math.floor((userProgress.points + response.data.attempt.pointsEarned) / 100) + 1
          }));
          setEarnedPoints(response.data.attempt.pointsEarned);
        }

        // Show earned rewards if any
        if (response.data.attempt.badgesAwarded?.length > 0) {
          setEarnedRewards(response.data.attempt.badgesAwarded);
          // Show reward popup
          setCurrentReward(response.data.attempt.badgesAwarded[0]);
          setShowRewardPopup(true);
        } else {
          toast.success(
            `Quiz completed! Score: ${Math.round(
              response.data.attempt.percentageScore
            )}%`
          );
        }

        setShowQuiz(false);
        setCurrentAttempt(null);
        setQuizAnswers({});
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
    }
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

  const currentUnit = course.units[activeUnitIndex];
  const currentLesson = currentUnit?.lessons[activeLessonIndex];
  const lessonId =
    currentLesson?._id || `${activeUnitIndex}-${activeLessonIndex}`;
  
  const isLessonCompleted = completedLessons.includes(lessonId);
  const lessonQuiz = currentLesson?.quizzes?.[0]; // Simplified for demo
  const quizScore = quizResults[lessonId];
  const hasQuizScore = typeof quizScore !== 'undefined';

  return (
    <div className='bg-neutral-50 min-h-screen'>
      {/* Progress Header */}
      <div className='bg-white shadow-sm border-b border-neutral-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-4 flex items-center justify-between'>
            <Link
              to={`/courses/${id}`}
              className='flex items-center text-primary-600 hover:text-primary-800 font-medium'
            >
              <ArrowLeftIcon className='h-5 w-5 mr-2' />
              Back to Course
            </Link>

            <div className='flex items-center space-x-4'>
              <div className='hidden md:block text-sm text-neutral-600'>
                <span className='font-medium'>{course.title}</span>
                <span className='mx-2'>•</span>
                <span>Unit {activeUnitIndex + 1}</span>
              </div>

              <div className='flex items-center'>
                <button
                  onClick={handlePrevLesson}
                  disabled={activeUnitIndex === 0 && activeLessonIndex === 0}
                  className='p-2 rounded-full hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronLeftIcon className='h-5 w-5' />
                </button>
                <button
                  onClick={handleNextLesson}
                  disabled={
                    activeUnitIndex === course.units.length - 1 &&
                    activeLessonIndex === currentUnit.lessons.length - 1
                  }
                  className='p-2 rounded-full hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronRightIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Sidebar - Course Navigation */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-sm border border-neutral-200 sticky top-8'>
              <div className='p-4 border-b border-neutral-200'>
                <h3 className='font-medium text-neutral-800'>Course Content</h3>
              </div>

              <div className='divide-y divide-neutral-200 max-h-[calc(100vh-200px)] overflow-y-auto'>
                {course.units.map((unit, uIndex) => (
                  <div key={unit._id || uIndex}>
                    <div className='p-4 bg-neutral-50'>
                      <h4 className='font-medium text-sm text-neutral-800'>
                        Unit {uIndex + 1}: {unit.title}
                      </h4>
                    </div>

                    <ul className='divide-y divide-neutral-200'>
                      {unit.lessons.map((lesson, lIndex) => {
                        const lid = lesson._id || `${uIndex}-${lIndex}`;
                        const isCompleted = completedLessons.includes(lid);
                        const isActive =
                          uIndex === activeUnitIndex &&
                          lIndex === activeLessonIndex;

                        return (
                          <li key={lid}>
                            <button
                              onClick={() => {
                                setActiveUnitIndex(uIndex);
                                setActiveLessonIndex(lIndex);
                                setShowQuiz(false);
                              }}
                              className={`w-full text-left p-3 flex items-center justify-between text-sm ${
                                isActive
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'hover:bg-neutral-50'
                              }`}
                            >
                              <div className='flex items-center'>
                                {isCompleted ? (
                                  <CheckCircleIcon className='h-4 w-4 text-green-500 mr-2' />
                                ) : (
                                  <div className='h-4 w-4 rounded-full border border-neutral-300 mr-2' />
                                )}
                                <span>{lesson.title}</span>
                              </div>
                              <span className='text-xs text-neutral-500'>
                                {lesson.duration || 15} min
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Student Progress */}
              <div className='p-4 border-t border-neutral-200'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-neutral-700'>Course Progress</span>
                  <span className='text-xs font-medium text-primary-600'>{userProgress.progressPercentage}%</span>
                </div>
                <Progress value={userProgress.progressPercentage} className="h-2" />

                <div className='mt-4 flex items-center justify-between'>
                  <div className='flex items-center text-xs text-neutral-500'>
                    <AcademicCapIcon className='h-3.5 w-3.5 mr-1' />
                    <span>Level {userProgress.level}</span>
                  </div>
                  <div className='flex items-center text-xs text-neutral-500'>
                    <TrophyIcon className='h-3.5 w-3.5 mr-1' />
                    <span>{userProgress.points} Points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            <div className='bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden'>
              <div className='p-6 border-b border-neutral-200'>
                <div className='flex justify-between items-start'>
                  <div>
                    <span className='text-sm font-medium text-primary-600'>
                      Unit {activeUnitIndex + 1}: {currentUnit?.title}
                    </span>
                    <h2 className='text-2xl font-bold text-neutral-800 mt-1'>
                      {currentLesson?.title}
                    </h2>
                    {hasQuizScore && (
                      <div className='mt-2 text-sm font-medium'>
                        <span
                          className={`${
                            quizScore >= 70 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          Quiz Score: {Math.round(quizScore)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() =>
                        markLessonComplete(lessonId, !isLessonCompleted)
                      }
                      className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                        isLessonCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {isLessonCompleted ? (
                        <>
                          <CheckCircleIcon className='h-4 w-4 mr-1' />
                          Completed
                        </>
                      ) : (
                        <>
                          <XCircleIcon className='h-4 w-4 mr-1' />
                          Mark Complete
                        </>
                      )}
                    </button>

                    {lessonQuiz && !hasQuizScore && (
                      <button
                        onClick={() => startQuizAttempt(lessonQuiz._id)}
                        className='btn-outline px-3 py-1.5 text-sm'
                      >
                        Take Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className='p-6'>
                {showQuiz && currentAttempt ? (
                  <div>
                    <h3 className='text-xl font-semibold text-neutral-800 mb-6'>
                      Quiz: {currentLesson?.title}
                    </h3>

                    {/* Simulated Quiz */}
                    <div className='space-y-6'>
                      {quizQuestions.map((question, index) => (
                        <div
                          key={question._id}
                          className='border border-neutral-200 rounded-lg p-4'
                        >
                          <h4 className='font-medium text-neutral-800 mb-3'>
                            Question {index + 1}: {question.questionText}
                          </h4>

                          {question.questionType === 'multiple-choice' && (
                            <div className='space-y-2'>
                              {question.options.map(option => (
                                <label
                                  key={option._id}
                                  className='flex items-center space-x-3'
                                >
                                  <input
                                    type='radio'
                                    name={`quiz-${question._id}`}
                                    value={option._id}
                                    checked={
                                      quizAnswers[question._id] === option._id
                                    }
                                    onChange={() =>
                                      handleQuizAnswerChange(
                                        question._id,
                                        option._id
                                      )
                                    }
                                    className='h-4 w-4 text-primary-600'
                                  />
                                  <span className='text-neutral-700'>
                                    {option.text}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}

                          {question.questionType === 'true-false' && (
                            <div className='space-y-2'>
                              {['True', 'False'].map(option => (
                                <label
                                  key={option}
                                  className='flex items-center space-x-3'
                                >
                                  <input
                                    type='radio'
                                    name={`quiz-${question._id}`}
                                    value={option}
                                    checked={
                                      quizAnswers[question._id] === option
                                    }
                                    onChange={() =>
                                      handleQuizAnswerChange(
                                        question._id,
                                        option
                                      )
                                    }
                                    className='h-4 w-4 text-primary-600'
                                  />
                                  <span className='text-neutral-700'>
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      <div className='flex justify-between'>
                        <button
                          onClick={() => {
                            setShowQuiz(false);
                            setCurrentAttempt(null);
                            setQuizAnswers({});
                          }}
                          className='btn-outline'
                        >
                          Cancel Quiz
                        </button>
                        <button
                          onClick={handleQuizSubmit}
                          className='btn-primary'
                          disabled={
                            Object.keys(quizAnswers).length <
                            quizQuestions.length
                          }
                        >
                          Submit Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='prose max-w-none'>
                    <h3 className='text-xl font-semibold text-neutral-800 mb-4'>
                      Lesson Content
                    </h3>

                    <p>
                      {currentLesson?.content ||
                        'No content provided for this lesson.'}
                    </p>

                    {currentLesson?.resources?.length > 0 && (
                      <div className='mt-8'>
                        <h4 className='text-lg font-medium text-neutral-800 mb-3'>
                          Resources
                        </h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          {currentLesson?.resources.map((resource, i) => (
                            <div
                              key={i}
                              className='border border-neutral-200 rounded-lg p-4'
                            >
                              <div className='flex items-start'>
                                <div className='bg-neutral-100 p-2 rounded-lg mr-3'>
                                  {resource.type === 'video' && (
                                    <PlayCircleIcon className='h-5 w-5 text-neutral-600' />
                                  )}
                                  {resource.type === 'pdf' && (
                                    <BookOpenIcon className='h-5 w-5 text-neutral-600' />
                                  )}
                                  {resource.type === 'image' && (
                                    <LightBulbIcon className='h-5 w-5 text-neutral-600' />
                                  )}
                                  {!['video', 'pdf', 'image'].includes(
                                    resource.type
                                  ) && (
                                    <QuestionMarkCircleIcon className='h-5 w-5 text-neutral-600' />
                                  )}
                                </div>
                                <div>
                                  <h5 className='font-medium text-neutral-800 capitalize'>
                                    {resource.type} Resource
                                  </h5>
                                  {resource.url ? (
                                    <a
                                      href={resource.url}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='text-sm text-primary-600 hover:underline mt-1 inline-block'
                                    >
                                      View Resource
                                    </a>
                                  ) : (
                                    <p className='text-sm text-neutral-600 mt-1'>
                                      {resource.content}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Lesson Footer Navigation */}
              <div className='p-4 border-t border-neutral-200 bg-neutral-50 flex justify-between'>
                <button
                  onClick={handlePrevLesson}
                  disabled={activeUnitIndex === 0 && activeLessonIndex === 0}
                  className='btn-outline flex items-center disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronLeftIcon className='h-5 w-5 mr-1' />
                  Previous
                </button>

                <div className='flex items-center text-sm text-neutral-600'>
                  Lesson {activeLessonIndex + 1} of{' '}
                  {currentUnit?.lessons?.length}
                </div>

                <button
                  onClick={handleNextLesson}
                  disabled={
                    activeUnitIndex === course.units.length - 1 &&
                    activeLessonIndex === currentUnit?.lessons?.length - 1
                  }
                  className='btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Next
                  <ChevronRightIcon className='h-5 w-5 ml-1' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Popup */}
      {showRewardPopup && currentReward && (
        <RewardPopup 
          reward={currentReward} 
          onClose={() => setShowRewardPopup(false)} 
          points={earnedPoints}
        />
      )}
    </div>
  );
};

export default LearnCourse;