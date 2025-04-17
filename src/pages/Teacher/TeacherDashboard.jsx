import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  AcademicCapIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  BookOpenIcon,
  DocumentTextIcon,
  PuzzlePieceIcon,
  ChartBarIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';


const TeacherDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('myCourses');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalLessons: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchCourses();
  }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/courses/mycourses');
      
//       if (response.data.success) {
//         setCourses(response.data.courses || []);
        
//         // Calculate stats
//         const totalCourses = response.data.courses.length;
//         const totalStudents = response.data.courses.reduce(
//           (sum, course) => sum + (course.enrolledStudents?.length || 0), 0
//         );
//         const totalLessons = response.data.courses.reduce(
//           (sum, course) => sum + (course.units?.reduce(
//             (unitSum, unit) => unitSum + (unit.lessons?.length || 0), 0
//           ) || 0), 0
//         );
        
//         setStats({
//           totalCourses,
//           totalStudents,
//           totalLessons,
//           completionRate: totalStudents > 0 ? 
//             Math.round((response.data.completedEnrollments || 0) / totalStudents * 100) : 0
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching teacher courses:', error);
//       toast.error('Failed to load your courses');
//     } finally {
//       setLoading(false);
//     }
//   };


const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses/mycourses');
      
      if (response.data.success) {
        const coursesWithStats = await Promise.all(response.data.courses.map(async (course) => {
          // Get all enrollments for this course to check completion status
          const enrollmentsResponse = await api.get(`/courses/${course._id}/enrollments`);
          const enrollments = enrollmentsResponse.data.success ? enrollmentsResponse.data.enrollments : [];
          
          // Calculate completion stats
          const totalEnrolled = enrollments.length;
          const completedCount = enrollments.filter(e => e.isCompleted).length;
          const completionRate = totalEnrolled > 0 
            ? Math.round((completedCount / totalEnrolled) * 100)
            : 0;
          
          // Calculate average progress across all enrollments
          const avgProgress = enrollments.length > 0
            ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
            : 0;
  
          return {
            ...course,
            completionRate,
            averageProgress: avgProgress > 100 ? 100 : avgProgress, // Cap at 100%
            totalEnrolled
          };
        }));
  
        setCourses(coursesWithStats);
        
        // Calculate overall stats
        const totalCourses = coursesWithStats.length;
        const totalStudents = coursesWithStats.reduce(
          (sum, course) => sum + course.totalEnrolled, 0
        );
        const totalLessons = coursesWithStats.reduce(
          (sum, course) => sum + (course.units?.reduce(
            (unitSum, unit) => unitSum + (unit.lessons?.length || 0), 0) || 0), 0
        );
        const totalCompleted = coursesWithStats.reduce(
          (sum, course) => sum + (course.completionRate * course.totalEnrolled / 100), 0
        );
        
        setStats({
          totalCourses,
          totalStudents,
          totalLessons,
          completionRate: totalStudents > 0 
            ? Math.round((totalCompleted / totalStudents) * 100)
            : 0
        });
      }
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      setDeletingCourse(true);
      const response = await api.delete(`/courses/${courseId}`);
      
      if (response.data.success) {
        setCourses(courses.filter(course => course._id !== courseId));
        toast.success('Course deleted successfully');
        setStats(prev => ({
          ...prev,
          totalCourses: prev.totalCourses - 1
        }));
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    } finally {
      setDeletingCourse(false);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
              <p className="mt-2 text-blue-100">Manage your courses and student progress</p>
            </div>
            <Link 
              to="/courses/create" 
              className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-700 rounded-full font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Course
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Courses */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <BookOpenIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          {/* Total Lessons */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <DocumentTextIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Total Lessons</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalLessons}</p>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <ChartBarIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-1">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('myCourses')}
              className={`px-4 py-3 flex items-center rounded-lg transition-colors ${
                activeTab === 'myCourses'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              My Courses
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

        {/* My Courses Tab */}
        {activeTab === 'myCourses' && (
          <>
            {courses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <AcademicCapIcon className="h-16 w-16 mx-auto text-gray-400" />
                <h3 className="mt-4 text-xl font-medium text-gray-800">No courses yet</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  You haven't created any courses yet. Get started by creating your first course.
                </p>
                <Link
                  to="/courses/create"
                  className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Course
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div 
                    key={course._id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative">
                      <img
                        src={course.imageUrl || '/placeholder.svg'}
                        alt={course.title}
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Course Actions */}
                      <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/courses/${course._id}/edit`} 
                          className="p-2 bg-white rounded-full shadow-md hover:bg-blue-100 text-blue-600 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => setConfirmDelete(course._id)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        <button
                          
                          className="p-2 bg-white rounded-full shadow-md hover:bg-green-100 text-green-600 transition-colors"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {course.subject}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1 text-indigo-500" />
                          <span>{course.enrolledStudents?.length || 0} students</span>
                        </div>
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-1 text-indigo-500" />
                          <span>
                            {course.units?.reduce((sum, unit) => sum + (unit.lessons?.length || 0), 0) || 0} lessons
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link 
                          to={`/courses/${course._id}/manage`} 
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg text-center text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
                        >
                          Manage Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Enrolled Students</h3>
            </div>
            
            {courses.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">You haven't created any courses yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Progress
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={course.imageUrl || '/placeholder.svg'} 
                                alt={course.title} 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{course.title}</div>
                              <div className="text-sm text-gray-500">{course.subject}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.enrolledStudents?.length || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${course.averageProgress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{course.averageProgress || 0}%</span>
                          </div>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            to={`/courses/${course._id}/students`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            View Details
                          </Link>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Course Analytics</h3>
            
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No analytics data available yet. Create courses to view analytics.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Engagement Card */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-4">Student Engagement</h4>
                  <div className="space-y-4">
                    {courses.slice(0, 3).map((course) => (
                      <div key={course._id} className="flex items-center">
                        <div className="w-12 h-12 flex-shrink-0 mr-3">
                          <img 
                            src={course.imageUrl || '/placeholder.svg'} 
                            alt={course.title}
                            className="w-full h-full rounded object-cover" 
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" 
                              style={{ width: `${(course.enrolledStudents?.length || 0) / Math.max(...courses.map(c => c.enrolledStudents?.length || 0)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-900">
                          {course.enrolledStudents?.length || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Course Completion Card */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-4">Completion Rates</h4>
                  <div className="space-y-4">
                    {courses.slice(0, 3).map((course) => (
                      <div key={course._id} className="flex items-center">
                        <div className="w-12 h-12 flex-shrink-0 mr-3">
                          <img 
                            src={course.imageUrl || '/placeholder.svg'} 
                            alt={course.title}
                            className="w-full h-full rounded object-cover" 
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" 
                              style={{ width: `${course.completionRate || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-900">
                          {course.completionRate || 0}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Course</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete this course? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourse(confirmDelete)}
                disabled={deletingCourse}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-75 flex items-center"
              >
                {deletingCourse ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;