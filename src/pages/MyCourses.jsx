import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
  BookOpenIcon,
  ChartBarIcon,
  TrophyIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyCourses = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrolled');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (user) {
          // Get enrolled courses for students
          if (user.role === 'student') {
            const enrolledResponse = await api.get('/courses/enrolled');
            if (enrolledResponse.data.success) {
              setEnrolledCourses(enrolledResponse.data.enrolledCourses);
            }
          }
          
          // Get created courses for teachers
          if (user.role === 'teacher' || user.role === 'admin') {
            const createdResponse = await api.get('/courses/mycourses');
            if (createdResponse.data.success) {
              setCreatedCourses(createdResponse.data.courses);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const calculateProgress = (enrollment) => {
    if (!enrollment.course?.units) return 0;
    
    let totalLessons = 0;
    let completed = 0;
    
    enrollment.course.units.forEach(unit => {
      if (unit.lessons) {
        totalLessons += unit.lessons.length;
        unit.lessons.forEach(lesson => {
          if (enrollment.completedLessons.includes(lesson._id)) {
            completed++;
          }
        });
      }
    });
    
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">My Courses</h1>
          <p className="text-neutral-600 mt-1">
            {user.role === 'student' ? 'Your learning journey' : 'Courses you created'}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 mb-6">
          <div className="flex border-b border-neutral-200">
            {(user.role === 'student' || user.role === 'admin') && (
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'enrolled' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-600 hover:text-neutral-800'}`}
              >
                Enrolled Courses
              </button>
            )}
            {(user.role === 'teacher' || user.role === 'admin') && (
              <button
                onClick={() => setActiveTab('created')}
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'created' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-600 hover:text-neutral-800'}`}
              >
                Created Courses
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'enrolled' && (
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-6">Your Enrolled Courses</h2>
                
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpenIcon className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                    <h3 className="text-lg font-medium text-neutral-800 mb-2">
                      No enrolled courses yet
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      Explore our courses and start learning today!
                    </p>
                    <a
                      href="/courses"
                      className="btn-primary inline-flex items-center"
                    >
                      Browse Courses
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.map((enrollment) => {
                      const progress = calculateProgress(enrollment);
                      const course = enrollment.course;
                      
                      return (
                        <div
                          key={enrollment._id}
                          className="border border-neutral-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-center">
                              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                                <img
                                  src={course.imageUrl || '/default-course.png'}
                                  alt={course.title}
                                  className="h-32 w-full md:w-48 object-cover rounded-lg"
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                                      {course.title}
                                    </h3>
                                    <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                                      {course.description}
                                    </p>
                                  </div>
                                  <span className="badge badge-primary ml-2">
                                    {progress}% Complete
                                  </span>
                                </div>
                                
                                <div className="mt-4 flex flex-wrap items-center gap-4">
                                  <div className="flex items-center text-sm text-neutral-600">
                                    <AcademicCapIcon className="h-4 w-4 mr-1.5" />
                                    <span>Grade {course.grade}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-neutral-600">
                                    <ChartBarIcon className="h-4 w-4 mr-1.5" />
                                    <span>{progress}% progress</span>
                                  </div>
                                  {course.gamification?.pointsToEarn && (
                                    <div className="flex items-center text-sm text-neutral-600">
                                      <TrophyIcon className="h-4 w-4 mr-1.5" />
                                      <span>
                                        {Math.round((progress / 100) * course.gamification.pointsToEarn)}/
                                        {course.gamification.pointsToEarn} points
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="mt-4">
                                  <div className="w-full bg-neutral-200 rounded-full h-2">
                                    <div
                                      className="bg-primary-600 h-2 rounded-full"
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <a
                                href={`/courses/${course._id}/learn`}
                                className="btn-primary"
                              >
                                {progress === 100 ? 'Review Course' : 'Continue Learning'}
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'created' && (
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-6">Courses You Created</h2>
                
                {createdCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpenIcon className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                    <h3 className="text-lg font-medium text-neutral-800 mb-2">
                      No courses created yet
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      Start creating your first course to share your knowledge!
                    </p>
                    <a
                      href="/courses/new"
                      className="btn-primary inline-flex items-center"
                    >
                      Create Course
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {createdCourses.map((course) => (
                      <div
                        key={course._id}
                        className="border border-neutral-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <div className="relative h-40">
                          <img
                            src={course.imageUrl || '/default-course.png'}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="badge badge-primary">
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                            <span className="badge">
                              {course.enrolledStudents?.length || 0} students
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <a
                              href={`/courses/${course._id}`}
                              className="btn-outline"
                            >
                              View Details
                            </a>
                            <a
                              href={`/courses/${course._id}/edit`}
                              className="btn-primary"
                            >
                              Edit Course
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;