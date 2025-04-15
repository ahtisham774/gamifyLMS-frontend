import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import ProgressCard from './ProgressCard';
import StudentRewards from './StudentRewards';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('progress');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Fetch enrolled courses
        const coursesResponse = await api.get('/courses/enrolled');
        if (coursesResponse.data.success) {
          setEnrolledCourses(coursesResponse.data.enrolledCourses);
        }
        
        // Fetch user rewards
        const rewardsResponse = await api.get('/courses/users/me/rewards');
        if (rewardsResponse.data.success) {
          setRewards(rewardsResponse.data.rewards);
        }
        
        // Fetch recent quiz attempts
        const attemptsResponse = await api.get('/attempts');
        if (attemptsResponse.data.success) {
          setRecentAttempts(attemptsResponse.data.attempts?.slice(0, 5) || []);
        }
        
        // Fetch leaderboard
        const leaderboardResponse = await api.get('/courses/users/leaderboard');
        if (leaderboardResponse.data.success) {
          setLeaderboard(leaderboardResponse.data.leaderboard);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to load your dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Student Dashboard</h1>
          <p className="text-neutral-600 mt-1">
            Track your progress, view rewards, and continue learning
          </p>
        </div>
        
        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start border border-neutral-200">
            <div className="bg-primary-100 rounded-full p-3 mr-4">
              <AcademicCapIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Current Level</p>
              <h3 className="text-2xl font-bold text-neutral-800">Level {user?.level || 1}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start border border-neutral-200">
            <div className="bg-amber-100 rounded-full p-3 mr-4">
              <TrophyIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Points</p>
              <h3 className="text-2xl font-bold text-neutral-800">{user?.points || 0}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start border border-neutral-200">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <BookOpenIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Enrolled Courses</p>
              <h3 className="text-2xl font-bold text-neutral-800">{enrolledCourses?.length || 0}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-start border border-neutral-200">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Rewards Earned</p>
              <h3 className="text-2xl font-bold text-neutral-800">{rewards?.length || 0}</h3>
            </div>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="mb-6">
          <div className="border-b border-neutral-200">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('progress')}
                className={`pb-3 px-1 ${
                  activeTab === 'progress'
                    ? 'border-b-2 border-primary-600 text-primary-600 font-medium'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                My Progress
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`pb-3 px-1 ${
                  activeTab === 'rewards'
                    ? 'border-b-2 border-primary-600 text-primary-600 font-medium'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Rewards & Badges
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`pb-3 px-1 ${
                  activeTab === 'leaderboard'
                    ? 'border-b-2 border-primary-600 text-primary-600 font-medium'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Leaderboard
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'progress' && (
            <div className="space-y-8">
              {/* Enrolled Courses */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-neutral-800">My Courses</h2>
                  <Link 
                    to="/courses" 
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
                  >
                    Browse Courses <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                {enrolledCourses?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((enrollment) => (
                      <ProgressCard 
                        key={enrollment._id || enrollment.course._id}
                        course={enrollment.course}
                        progress={enrollment.progress}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-neutral-200">
                    <div className="flex justify-center mb-4">
                      <BookOpenIcon className="h-12 w-12 text-neutral-300" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 mb-2">
                      No Courses Yet
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      You haven't enrolled in any courses yet. Browse our catalog to find courses you're interested in.
                    </p>
                    <Link to="/courses" className="btn-primary">
                      Browse Courses
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Recent Quiz Attempts */}
              {recentAttempts?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-neutral-800 mb-4">Recent Quiz Attempts</h2>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Quiz
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Course
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Score
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          {recentAttempts.map((attempt) => (
                            <tr key={attempt._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-neutral-800">
                                  {attempt.quiz?.title || 'Unknown Quiz'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-neutral-600">
                                  {attempt.quiz?.course?.title || 'Unknown Course'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${
                                  attempt.percentageScore >= 70 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }`}>
                                  {Math.round(attempt.percentageScore)}%
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                {new Date(attempt.submittedAt || attempt.createdAt).toLocaleDateString()}
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
          )}
          
          {activeTab === 'rewards' && (
            <StudentRewards rewards={rewards} points={user?.points} level={user?.level} />
          )}
          
          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800">Top Students</h2>
                <p className="text-neutral-600 text-sm mt-1">
                  Students with the highest points and levels
                </p>
              </div>
              
              <div className="divide-y divide-neutral-200">
                {leaderboard?.length > 0 ? (
                  leaderboard.map((student, index) => (
                    <div key={student._id} className="flex items-center p-4 hover:bg-neutral-50">
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-white ${
                          index === 0 ? 'bg-amber-500' : 
                          index === 1 ? 'bg-neutral-400' : 
                          index === 2 ? 'bg-amber-700' : 
                          'bg-neutral-300'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 mr-4">
                        <img
                          src={student.avatar || '/default-avatar.png'}
                          alt={student.name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">
                          {student.name}
                          {student._id === user?._id && (
                            <span className="ml-2 text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-4 w-4 text-neutral-500 mr-1" />
                          <span className="text-sm text-neutral-600">Level {student.level}</span>
                        </div>
                        <div className="flex items-center">
                          <TrophyIcon className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-sm font-medium text-neutral-700">{student.points} pts</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    No students on the leaderboard yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;