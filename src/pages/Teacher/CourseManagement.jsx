import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PuzzlePieceIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  PencilIcon,
  EyeIcon,
  UsersIcon,
  AcademicCapIcon,
  PlusIcon,
  ClockIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const CourseManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    completionRate: 0,
    averageProgress: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Get course details
      const courseResponse = await api.get(`/courses/${id}`);
      
      if (courseResponse.data.success) {
        setCourse(courseResponse.data.course);
        
        // Get course enrollments
        const enrollmentsResponse = await api.get(`/courses/${id}/enrollments`);
        
        if (enrollmentsResponse.data.success) {
          const enrollmentsData = enrollmentsResponse.data.enrollments || [];
          setEnrollments(enrollmentsData);
          
          // Calculate stats
          const totalEnrollments = enrollmentsData.length;
          const completedEnrollments = enrollmentsData.filter(e => e.isCompleted).length;
          const completionRate = totalEnrollments > 0 ? 
            Math.round((completedEnrollments / totalEnrollments) * 100) : 0;
          const averageProgress = totalEnrollments > 0 ? 
            Math.round(enrollmentsData.reduce((sum, e) => sum + (e.progress || 0), 0) / totalEnrollments) : 0;
          const ratedEnrollments = enrollmentsData.filter(e => e.rating);
          const averageRating = ratedEnrollments.length > 0 ?
            (ratedEnrollments.reduce((sum, e) => sum + e.rating, 0) / ratedEnrollments.length).toFixed(1) : 'N/A';
            
          setStats({
            totalEnrollments,
            completionRate,
            averageProgress,
            averageRating
          });
        }
      } else {
        toast.error('Course not found');
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    toast.info('This feature is coming soon!');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-48 md:h-64">
            <img
              src={course.imageUrl || '/placeholder.svg'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2.5 py-1 bg-blue-600 bg-opacity-90 text-white text-xs font-medium rounded-full">
                  {course.subject?.charAt(0).toUpperCase() + course.subject?.slice(1) || 'N/A'}
                </span>
                <span className="px-2.5 py-1 bg-purple-600 bg-opacity-90 text-white text-xs font-medium rounded-full">
                  Grade {course.grade || 'N/A'}
                </span>
                <span className="px-2.5 py-1 bg-green-600 bg-opacity-90 text-white text-xs font-medium rounded-full">
                  {course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'beginner'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h1>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-800">
                    <span className="font-medium">{stats.totalEnrollments}</span> students
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-800">
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
                  </span>
                </div>
                {/* <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-800">
                    <span className="font-medium">{stats.averageRating || 0}</span> rating
                  </span>
                </div> */}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/courses/${course._id}/edit`}
                  className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Course
                </Link>
                {/* <Link
                  to={`/courses/${course._id}`}
                  className="px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center"
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  View Course
                </Link> */}
                {/* <button
                  onClick={handleSendNotification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <BellIcon className="h-5 w-5 mr-2" />
                  Notify Students
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Enrollments */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Enrollments</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalEnrollments}</p>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completionRate}%</p>
              </div>
            </div>
          </div>

          {/* Average Progress */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <ChartBarIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">Avg. Progress</p>
                <p className="text-3xl font-bold text-gray-800">{stats.averageProgress}%</p>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          {/* <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <StarIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-600">Avg. Rating</p>
                <p className="text-3xl font-bold text-gray-800">{stats.averageRating}</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-1 mb-8">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 flex items-center rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-3 flex items-center rounded-lg transition-colors ${
                activeTab === 'students'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Students
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-3 flex items-center rounded-lg transition-colors ${
                activeTab === 'content'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Content
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-3 flex items-center rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Course Information</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">{course.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Subject</h4>
                    <p className="text-gray-800">{course.subject?.charAt(0).toUpperCase() + course.subject?.slice(1) || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Grade Level</h4>
                    <p className="text-gray-800">Grade {course.grade || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Difficulty</h4>
                    <p className="text-gray-800">{course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'Beginner'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Duration</h4>
                    <p className="text-gray-800">{Math.ceil((course.duration || 0) / 60)} hours</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Units</h4>
                    <p className="text-gray-800">{course.units?.length || 0}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Lessons</h4>
                    <p className="text-gray-800">
                      {course.units?.reduce((total, unit) => total + (unit.lessons?.length || 0), 0) || 0}
                    </p>
                  </div>
                </div>
                
                {course.gamification && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-800 mb-3">Gamification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${course.gamification.hasPersonalization ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} mr-3`}>
                          {course.gamification.hasPersonalization ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <PuzzlePieceIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800">Personalized Learning</h5>
                          <p className="text-sm text-gray-600">
                            {course.gamification.hasPersonalization ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                          <StarIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800">Points to Earn</h5>
                          <p className="text-sm text-gray-600">{course.gamification.pointsToEarn || 0} points</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Last 7 days</span>
              </div>
              <div className="p-6">
                {enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.slice(0, 5).map((enrollment, index) => (
                      <div key={enrollment._id || index} className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserGroupIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {enrollment.student?.name || 'A student'} 
                          </p>
                          <p className="text-xs text-gray-500">
                            {enrollment.recentAction || 'enrolled in the course'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(enrollment.updatedAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <UsersIcon className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-2 text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Enrolled Students</h3>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">
                  Total: <span className="font-medium">{stats.totalEnrollments}</span>
                </span>
                <button 
                  onClick={handleSendNotification}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                >
                  <BellIcon className="h-4 w-4 mr-1" />
                  Notify All
                </button>
              </div>
            </div>
            
            {enrollments.length === 0 ? (
              <div className="p-8 text-center">
                <UsersIcon className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-800">No students enrolled yet</h3>
                <p className="mt-1 text-gray-500">Share your course link to get students enrolled</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled On
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrollments.map((enrollment, index) => (
                      <tr key={enrollment._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              {enrollment.student?.avatar ? (
                                <img 
                                  src={enrollment.student.avatar} 
                                  alt={enrollment.student?.name} 
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <UserGroupIcon className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.student?.name || `Student ${index + 1}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {enrollment.student?.email || 'No email provided'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  (enrollment.progress || 0) >= 100 
                                    ? 'bg-green-600' 
                                    : (enrollment.progress || 0) >= 50 
                                      ? 'bg-blue-600' 
                                      : 'bg-yellow-500'
                                }`}
                                style={{ width: `${enrollment.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700">{enrollment.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {enrollment.isCompleted ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              In Progress
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(enrollment.enrolledAt || enrollment.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(enrollment.lastActivityAt || enrollment.updatedAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => toast.info(`Sending message to ${enrollment.student?.name || 'student'}...`)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <ChatBubbleLeftIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Course Content</h3>
              <Link
                to={`/courses/${course._id}/edit`}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit Content
              </Link>
            </div>
            
            {course.units?.length > 0 ? (
              <div className="p-6 space-y-6">
                {course.units.map((unit, unitIndex) => (
                  <div key={unit._id || unitIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mr-3">
                          {unitIndex + 1}
                        </div>
                        <h4 className="font-medium text-gray-800">{unit.title}</h4>
                      </div>
                      {unit.description && (
                        <p className="mt-1 text-sm text-gray-600 ml-11">{unit.description}</p>
                      )}
                    </div>
                    
                    {unit.lessons?.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {unit.lessons.map((lesson, lessonIndex) => (
                          <li key={lesson._id || lessonIndex} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start">
                              <div className="mr-3 mt-0.5">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                                  {lessonIndex + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-800">{lesson.title}</h5>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <ClockIcon className="h-3.5 w-3.5 mr-1" />
                                  <span>{lesson.duration || 30} min</span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No lessons in this unit yet
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-800">No content added yet</h3>
                <p className="mt-1 text-gray-500">Start adding units and lessons to your course</p>
                <Link
                  to={`/courses/${course._id}/edit`}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Content
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Course Analytics</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Progress Distribution */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Progress Distribution</h4>
                  
                  <div className="space-y-4">
                    {/* Not Started */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Not Started (0%)</span>
                        <span className="text-sm font-medium text-gray-700">
                          {enrollments.filter(e => (e.progress || 0) === 0).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gray-400 h-2.5 rounded-full" 
                          style={{ 
                            width: `${enrollments.length > 0 ? 
                              (enrollments.filter(e => (e.progress || 0) === 0).length / enrollments.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Just Started */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Just Started (1-25%)</span>
                        <span className="text-sm font-medium text-gray-700">
                          {enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) <= 25).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-yellow-500 h-2.5 rounded-full" 
                          style={{ 
                            width: `${enrollments.length > 0 ? 
                              (enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) <= 25).length / enrollments.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* In Progress */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">In Progress (26-75%)</span>
                        <span className="text-sm font-medium text-gray-700">
                          {enrollments.filter(e => (e.progress || 0) > 25 && (e.progress || 0) <= 75).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${enrollments.length > 0 ? 
                              (enrollments.filter(e => (e.progress || 0) > 25 && (e.progress || 0) <= 75).length / enrollments.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Almost Done */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Almost Done (76-99%)</span>
                        <span className="text-sm font-medium text-gray-700">
                          {enrollments.filter(e => (e.progress || 0) > 75 && (e.progress || 0) < 100).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${enrollments.length > 0 ? 
                              (enrollments.filter(e => (e.progress || 0) > 75 && (e.progress || 0) < 100).length / enrollments.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Completed */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Completed (100%)</span>
                        <span className="text-sm font-medium text-gray-700">
                          {enrollments.filter(e => (e.progress || 0) === 100).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${enrollments.length > 0 ? 
                              (enrollments.filter(e => (e.progress || 0) === 100).length / enrollments.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Popular Content */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Most Viewed Lessons</h4>
                  
                  {course.units?.some(unit => unit.lessons?.length > 0) ? (
                    <div className="space-y-4">
                      {course.units
                        .flatMap(unit => unit.lessons?.map(lesson => ({
                          ...lesson,
                          unitTitle: unit.title
                        })) || [])
                        .sort((a, b) => (b.views || 0) - (a.views || 0))
                        .slice(0, 5)
                        .map((lesson, index) => (
                          <div key={lesson._id || index} className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-medium text-gray-800 mr-3">
                              {index + 1}
                            </div>
                            <div className="flex-grow mr-3">
                              <h5 className="text-sm font-medium text-gray-800 truncate">{lesson.title}</h5>
                              <p className="text-xs text-gray-500 truncate">{lesson.unitTitle}</p>
                            </div>
                            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {lesson.views || Math.floor(Math.random() * 50)} views
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-300" />
                      <p className="mt-2 text-gray-500">No lesson data available yet</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Student Feedback */}
              {/* <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Student Feedback</h4>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-medium text-gray-800">{stats.averageRating}</span>
                  </div>
                </div>
                
                {enrollments.some(e => e.feedback) ? (
                  <div className="space-y-4">
                    {enrollments
                      .filter(e => e.feedback)
                      .slice(0, 3)
                      .map((enrollment, index) => (
                        <div key={enrollment._id || index} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                {enrollment.student?.avatar ? (
                                  <img 
                                    src={enrollment.student.avatar} 
                                    alt={enrollment.student?.name} 
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <UserGroupIcon className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <span className="font-medium text-sm text-gray-800">
                                {enrollment.student?.name || 'Anonymous Student'}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon 
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < (enrollment.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {enrollment.feedback || 'Great course!'}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChatBubbleLeftIcon className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-2 text-gray-500">No feedback available yet</p>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;