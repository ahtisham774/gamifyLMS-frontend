import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  PuzzlePieceIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats cards data (These would be calculated from API data in a real app)
  const statsCards = [
    {
      id: 1,
      title: 'Current Level',
      value: user?.level || 1,
      description: 'Keep learning to level up!',
      icon: <FireIcon className="h-8 w-8 text-primary-500" />,
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-700',
    },
    {
      id: 2,
      title: 'Total Points',
      value: user?.points || 0,
      description: 'Points earned through activities',
      icon: <ChartBarIcon className="h-8 w-8 text-secondary-500" />,
      bgColor: 'bg-secondary-50',
      textColor: 'text-secondary-700',
    },
    {
      id: 3,
      title: 'Courses Enrolled',
      value: enrolledCourses?.length || 0,
      description: 'Active learning adventures',
      icon: <BookOpenIcon className="h-8 w-8 text-accent-500" />,
      bgColor: 'bg-accent-50',
      textColor: 'text-accent-700',
    },
    {
      id: 4,
      title: 'Rewards Earned',
      value: rewards?.length || 0,
      description: 'Badges and achievements',
      icon: <TrophyIcon className="h-8 w-8 text-warning-500" />,
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-700',
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get enrolled courses
        const coursesResponse = await api.getEnrolledCourses();
        if (coursesResponse.data.success) {
          setEnrolledCourses(coursesResponse.data.enrolledCourses || []);
        }

        // Get recent quiz attempts
        const attemptsResponse = await api.getUserAttempts();
        if (attemptsResponse.data.success) {
          setRecentAttempts(attemptsResponse.data.attempts?.slice(0, 5) || []);
        }

        // Get user rewards
        const rewardsResponse = await api.getUserRewards(user._id);
        if (rewardsResponse.data.success) {
          setRewards(rewardsResponse.data.rewards || []);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // In this demo, we'll use simulated data instead of the actual API call
    // since we don't have a backend connected yet
    const simulateData = () => {
      // Simulated enrolled courses
      const dummyCourses = [
        {
          course: {
            _id: '1',
            title: 'Fun with Numbers',
            description: 'Learn basic math concepts through games and activities',
            subject: 'mathematics',
            grade: 2,
            imageUrl: 'https://img.freepik.com/free-vector/math-background-with-numbers_23-2148150517.jpg?w=740&t=st=1712668780~exp=1712669380~hmac=a0fd623ea71a98213bb64e9a0c2f52be7af67ab7ab195a471770536a0b5ff4d9',
            level: 'beginner',
          },
          progress: 65,
          isCompleted: false,
          enrolledAt: new Date('2023-12-15'),
        },
        {
          course: {
            _id: '2',
            title: 'Reading Adventures',
            description: 'Explore the wonderful world of reading with fun stories',
            subject: 'english',
            grade: 2,
            imageUrl: 'https://img.freepik.com/free-vector/hand-drawn-world-book-day-illustration_23-2149291252.jpg?w=740&t=st=1712668781~exp=1712669381~hmac=4485099e1f3fe7df5a8b6abf9a38bcadc4bd46815e9eaa9e4ce88a9f97e8a2a4',
            level: 'beginner',
          },
          progress: 30,
          isCompleted: false,
          enrolledAt: new Date('2023-12-20'),
        },
        {
          course: {
            _id: '3',
            title: 'Science Exploration',
            description: 'Discover the wonders of science through interactive experiments',
            subject: 'science',
            grade: 2,
            imageUrl: 'https://img.freepik.com/free-vector/scientist-kids-cartoon-characters-science-education-isolated_1308-45128.jpg?w=900&t=st=1712668784~exp=1712669384~hmac=5a59d9cfe62abbaae9887ac67caaadf2de9c43cbc72c03a0e9dbe36cdca24b3f',
            level: 'beginner',
          },
          progress: 15,
          isCompleted: false,
          enrolledAt: new Date('2024-01-05'),
        },
      ];

      // Simulated quiz attempts
      const dummyAttempts = [
        {
          _id: 'a1',
          quiz: { title: 'Addition & Subtraction' },
          course: { title: 'Fun with Numbers' },
          score: 8,
          totalPossibleScore: 10,
          percentageScore: 80,
          passed: true,
          createdAt: new Date('2024-01-20'),
        },
        {
          _id: 'a2',
          quiz: { title: 'Phonics Basics' },
          course: { title: 'Reading Adventures' },
          score: 7,
          totalPossibleScore: 10,
          percentageScore: 70,
          passed: true,
          createdAt: new Date('2024-01-18'),
        },
        {
          _id: 'a3',
          quiz: { title: 'Animals & Habitats' },
          course: { title: 'Science Exploration' },
          score: 6,
          totalPossibleScore: 10,
          percentageScore: 60,
          passed: true,
          createdAt: new Date('2024-01-15'),
        },
      ];

      // Simulated rewards
      const dummyRewards = [
        {
          _id: 'r1',
          name: 'Math Whiz',
          description: 'Completed 5 math quizzes with perfect scores',
          type: 'badge',
          imageUrl: 'https://img.freepik.com/free-vector/gradient-mountain-badge_23-2149161833.jpg?w=740&t=st=1712668786~exp=1712669386~hmac=aa54fc592d8a6e60be96dc1bd2aa1f76aff6c03ea6e58f8960883b86b6869d04',
          rarity: 'rare',
        },
        {
          _id: 'r2',
          name: 'Reading Star',
          description: 'Read 10 stories and completed their quizzes',
          type: 'badge',
          imageUrl: 'https://img.freepik.com/free-vector/gradient-mountain-badge_23-2149161829.jpg?w=740&t=st=1712668787~exp=1712669387~hmac=e28ec30d3f06c29c702c85a70ddb7e1e9f19e3dd2b87a569bc96f9962bb7d7d3',
          rarity: 'uncommon',
        },
      ];

      setEnrolledCourses(dummyCourses);
      setRecentAttempts(dummyAttempts);
      setRewards(dummyRewards);
      setLoading(false);
    };

    // Use simulated data for now
    simulateData();

    // Uncomment below to use actual API
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const getSubjectColor = (subject) => {
    const colors = {
      mathematics: 'bg-blue-100 text-blue-800',
      english: 'bg-green-100 text-green-800',
      science: 'bg-purple-100 text-purple-800',
      social: 'bg-yellow-100 text-yellow-800',
      art: 'bg-pink-100 text-pink-800',
      music: 'bg-indigo-100 text-indigo-800',
      'physical-education': 'bg-orange-100 text-orange-800',
    };
    return colors[subject] || 'bg-neutral-100 text-neutral-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Welcome back, {user?.name}!</h1>
          <p className="text-neutral-600 mt-1">
            Here's an overview of your learning journey
          </p>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => (
            <div
              key={stat.id}
              className={`${stat.bgColor} rounded-xl p-6 shadow-sm border border-neutral-200`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
                  <p className="text-xs text-neutral-500 mt-1">{stat.description}</p>
                </div>
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Enrolled Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 flex justify-between items-center border-b border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-800 flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-primary-500" />
                  Your Courses
                </h2>
                <Link
                  to="/courses"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Browse More Courses
                </Link>
              </div>

              <div className="p-6">
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <AcademicCapIcon className="h-12 w-12 mx-auto text-neutral-400" />
                    <p className="mt-2 text-neutral-600">You haven't enrolled in any courses yet.</p>
                    <Link
                      to="/courses"
                      className="mt-3 inline-block btn-primary"
                    >
                      Explore Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {enrolledCourses.map((enrollment) => (
                      <div
                        key={enrollment.course._id}
                        className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="sm:w-1/4">
                            <img
                              src={enrollment.course.imageUrl}
                              alt={enrollment.course.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                          <div className="sm:w-3/4">
                            <div className="flex justify-between">
                              <h3 className="font-semibold text-lg text-neutral-800">{enrollment.course.title}</h3>
                              <span className={`badge ${getSubjectColor(enrollment.course.subject)}`}>
                                {enrollment.course.subject.charAt(0).toUpperCase() + enrollment.course.subject.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600 mt-1">{enrollment.course.description}</p>
                            <div className="mt-2 flex items-center text-xs text-neutral-500">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span>Enrolled: {formatDate(enrollment.enrolledAt)}</span>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{enrollment.progress}%</span>
                              </div>
                              <div className="w-full bg-neutral-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary-500 h-2.5 rounded-full"
                                  style={{ width: `${enrollment.progress}%` }}
                                ></div>
                              </div>
                              <div className="mt-4">
                                <Link
                                  to={`/courses/${enrollment.course._id}`}
                                  className="btn-primary btn-sm"
                                >
                                  Continue Learning
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity and Rewards */}
          <div className="space-y-8">
            {/* Recent Quiz Attempts */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-800 flex items-center">
                  <PuzzlePieceIcon className="h-5 w-5 mr-2 text-primary-500" />
                  Recent Quiz Attempts
                </h2>
              </div>

              <div className="p-6">
                {recentAttempts.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-neutral-600">No quiz attempts yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAttempts.map((attempt) => (
                      <div
                        key={attempt._id}
                        className="border border-neutral-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-neutral-800">{attempt.quiz.title}</h3>
                            <p className="text-xs text-neutral-500">{attempt.course.title}</p>
                          </div>
                          <div className={`badge ${attempt.passed ? 'badge-success' : 'badge-error'}`}>
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-neutral-500" />
                            <span className="text-sm">{attempt.score}/{attempt.totalPossibleScore} ({Math.round(attempt.percentageScore)}%)</span>
                          </div>
                          <span className="text-xs text-neutral-500">{formatDate(attempt.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Rewards */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-800 flex items-center">
                  <CheckBadgeIcon className="h-5 w-5 mr-2 text-primary-500" />
                  Your Rewards
                </h2>
              </div>

              <div className="p-6">
                {rewards.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-neutral-600">Complete activities to earn rewards!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {rewards.map((reward) => (
                      <div
                        key={reward._id}
                        className="border border-neutral-200 rounded-lg p-4 text-center hover:border-warning-300 transition-colors reward-badge"
                      >
                        <img
                          src={reward.imageUrl}
                          alt={reward.name}
                          className="w-16 h-16 object-contain mx-auto mb-2 "
                        />
                        <h3 className="font-medium text-neutral-800">{reward.name}</h3>
                        <p className="text-xs text-neutral-500 mt-1">{reward.description}</p>
                        <div className={`badge badge-${reward.rarity} mt-2`}>
                          {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
