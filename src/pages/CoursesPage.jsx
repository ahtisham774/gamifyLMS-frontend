// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import api from '../services/api';
// import {
//   BookOpenIcon,
//   MagnifyingGlassIcon,
//   AdjustmentsHorizontalIcon,
//   ChevronDownIcon,
//   UserGroupIcon,
//   StarIcon,
//   AcademicCapIcon,
// } from '@heroicons/react/24/outline';
// import LoadingSpinner from '../components/common/LoadingSpinner';

// const CoursesPage = () => {
//   const { user } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filtering and Sorting
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     subject: '',
//     grade: '',
//     level: '',
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortBy, setSortBy] = useState('newest');

//   // Enrolled Courses Tracking
//   const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
//   const [enrollingCourseId, setEnrollingCourseId] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Get all published courses
//         const coursesResponse = await api.getCourses({
//           ...filters,
//           search: searchTerm,
//         });

//         if (coursesResponse.data.success) {
//           // Sort courses based on selected sort method
//           let sortedCourses = [...coursesResponse.data.courses];

//           if (sortBy === 'newest') {
//             sortedCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//           } else if (sortBy === 'oldest') {
//             sortedCourses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//           } else if (sortBy === 'rating') {
//             sortedCourses.sort((a, b) => b.averageRating - a.averageRating);
//           } else if (sortBy === 'az') {
//             sortedCourses.sort((a, b) => a.title.localeCompare(b.title));
//           } else if (sortBy === 'za') {
//             sortedCourses.sort((a, b) => b.title.localeCompare(a.title));
//           }

//           setCourses(sortedCourses);
//         }

//         // If user is logged in, get their enrolled courses
//         if (user) {
//           const enrolledResponse = await api.getEnrolledCourses();

//           if (enrolledResponse.data.success) {
//             const enrolledIds = enrolledResponse.data.enrolledCourses.map(
//               enrollment => enrollment.course._id
//             );
//             setEnrolledCourseIds(enrolledIds);
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching courses:', err);
//         setError('Failed to load courses. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     // In this demo, we'll use simulated data
//     const simulateData = () => {
//       // Simulated courses
//       const dummyCourses = [
//         {
//           _id: '1',
//           title: 'Fun with Numbers',
//           description: 'Learn basic math concepts through games and activities',
//           subject: 'mathematics',
//           grade: 2,
//           imageUrl: 'https://img.freepik.com/free-vector/math-background-with-numbers_23-2148150517.jpg?w=740&t=st=1712668780~exp=1712669380~hmac=a0fd623ea71a98213bb64e9a0c2f52be7af67ab7ab195a471770536a0b5ff4d9',
//           level: 'beginner',
//           creator: { name: 'Ms. Johnson', _id: 'teacher1' },
//           gamification: { hasPersonalization: true },
//           enrolledStudents: new Array(12),
//           createdAt: '2023-10-15',
//           averageRating: 4.7,
//         },
//         {
//           _id: '2',
//           title: 'Reading Adventures',
//           description: 'Explore the wonderful world of reading with fun stories',
//           subject: 'english',
//           grade: 2,
//           imageUrl: 'https://img.freepik.com/free-vector/hand-drawn-world-book-day-illustration_23-2149291252.jpg?w=740&t=st=1712668781~exp=1712669381~hmac=4485099e1f3fe7df5a8b6abf9a38bcadc4bd46815e9eaa9e4ce88a9f97e8a2a4',
//           level: 'beginner',
//           creator: { name: 'Mr. Roberts', _id: 'teacher2' },
//           gamification: { hasPersonalization: false },
//           enrolledStudents: new Array(15),
//           createdAt: '2023-11-05',
//           averageRating: 4.5,
//         },
//         {
//           _id: '3',
//           title: 'Science Exploration',
//           description: 'Discover the wonders of science through interactive experiments',
//           subject: 'science',
//           grade: 1,
//           imageUrl: 'https://img.freepik.com/free-vector/scientist-kids-cartoon-characters-science-education-isolated_1308-45128.jpg?w=900&t=st=1712668784~exp=1712669384~hmac=5a59d9cfe62abbaae9887ac67caaadf2de9c43cbc72c03a0e9dbe36cdca24b3f',
//           level: 'beginner',
//           creator: { name: 'Dr. Martinez', _id: 'teacher3' },
//           gamification: { hasPersonalization: true },
//           enrolledStudents: new Array(10),
//           createdAt: '2023-09-20',
//           averageRating: 4.8,
//         },
//         {
//           _id: '4',
//           title: 'Art & Creativity',
//           description: 'Express yourself through various art forms and techniques',
//           subject: 'art',
//           grade: 3,
//           imageUrl: 'https://img.freepik.com/free-vector/hand-drawn-back-school-background_23-2149464866.jpg?w=900&t=st=1712671088~exp=1712671688~hmac=d6e5eb0bbfa52bc3e5d8bd0d935c058e2a3d1a28ac7e0df37cb45f820c72ea23',
//           level: 'intermediate',
//           creator: { name: 'Ms. Lopez', _id: 'teacher4' },
//           gamification: { hasPersonalization: false },
//           enrolledStudents: new Array(8),
//           createdAt: '2023-08-10',
//           averageRating: 4.6,
//         },
//         {
//           _id: '5',
//           title: 'Music & Rhythm',
//           description: 'Learn about music, instruments, and how to create simple melodies',
//           subject: 'music',
//           grade: 1,
//           imageUrl: 'https://img.freepik.com/free-vector/hand-drawn-music-background_52683-11662.jpg?w=900&t=st=1712671091~exp=1712671691~hmac=71ae06dfcd864e2fe3aca4b3cc9773ab5bdfbe56ac6d1be26f2ea97e8df59a79',
//           level: 'beginner',
//           creator: { name: 'Mr. Chen', _id: 'teacher5' },
//           gamification: { hasPersonalization: true },
//           enrolledStudents: new Array(11),
//           createdAt: '2023-12-05',
//           averageRating: 4.4,
//         },
//         {
//           _id: '6',
//           title: 'Physical Fun',
//           description: 'Stay active with engaging physical activities and games',
//           subject: 'physical-education',
//           grade: 3,
//           imageUrl: 'https://img.freepik.com/free-vector/flat-design-pe-class-illustration_23-2149434253.jpg?w=900&t=st=1712671093~exp=1712671693~hmac=95a050dfb93dcd7e02c3f6ac3ecf42b40c1fe6d31dabe5d31c4c32e3d5d6b5fd',
//           level: 'intermediate',
//           creator: { name: 'Coach Wilson', _id: 'teacher6' },
//           gamification: { hasPersonalization: true },
//           enrolledStudents: new Array(14),
//           createdAt: '2024-01-10',
//           averageRating: 4.9,
//         },
//       ];

//       let filteredCourses = [...dummyCourses];

//       // Apply filters
//       if (filters.subject) {
//         filteredCourses = filteredCourses.filter(course => course.subject === filters.subject);
//       }

//       if (filters.grade) {
//         filteredCourses = filteredCourses.filter(course => course.grade === parseInt(filters.grade));
//       }

//       if (filters.level) {
//         filteredCourses = filteredCourses.filter(course => course.level === filters.level);
//       }

//       // Apply search
//       if (searchTerm) {
//         const searchLower = searchTerm.toLowerCase();
//         filteredCourses = filteredCourses.filter(course =>
//           course.title.toLowerCase().includes(searchLower) ||
//           course.description.toLowerCase().includes(searchLower)
//         );
//       }

//       // Apply sorting
//       if (sortBy === 'newest') {
//         filteredCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       } else if (sortBy === 'oldest') {
//         filteredCourses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//       } else if (sortBy === 'rating') {
//         filteredCourses.sort((a, b) => b.averageRating - a.averageRating);
//       } else if (sortBy === 'az') {
//         filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
//       } else if (sortBy === 'za') {
//         filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
//       }

//       setCourses(filteredCourses);

//       // Simulate enrolled courses
//       if (user) {
//         setEnrolledCourseIds(['1', '2']);
//       }

//       setLoading(false);
//     };

//     // Use simulated data for now
//     simulateData();

//     // For actual implementation, uncomment below
//     // fetchData();
//   }, [filters, searchTerm, sortBy, user]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       subject: '',
//       grade: '',
//       level: '',
//     });
//     setSearchTerm('');
//   };

//   const handleEnrollCourse = async (courseId) => {
//     if (!user) {
//       // Redirect to login if not authenticated
//       return;
//     }

//     try {
//       setEnrollingCourseId(courseId);

//       // Call API to enroll in course
//       const response = await api.enrollCourse(courseId);

//       if (response.data.success) {
//         // Update enrolled courses list
//         setEnrolledCourseIds(prev => [...prev, courseId]);

//         // Show success message
//         toast.success('Successfully enrolled in the course!');
//       }
//     } catch (err) {
//       console.error('Error enrolling in course:', err);
//       toast.error('Failed to enroll in course. Please try again.');
//     } finally {
//       setEnrollingCourseId(null);
//     }
//   };

//   const getSubjectColor = (subject) => {
//     const colors = {
//       mathematics: 'bg-blue-100 text-blue-800',
//       english: 'bg-green-100 text-green-800',
//       science: 'bg-purple-100 text-purple-800',
//       social: 'bg-yellow-100 text-yellow-800',
//       art: 'bg-pink-100 text-pink-800',
//       music: 'bg-indigo-100 text-indigo-800',
//       'physical-education': 'bg-orange-100 text-orange-800',
//     };
//     return colors[subject] || 'bg-neutral-100 text-neutral-800';
//   };

//   const getLevelBadge = (level) => {
//     const badges = {
//       beginner: 'bg-emerald-100 text-emerald-800',
//       intermediate: 'bg-amber-100 text-amber-800',
//       advanced: 'bg-red-100 text-red-800',
//     };
//     return badges[level] || 'bg-neutral-100 text-neutral-800';
//   };

//   if (loading) {
//     return <LoadingSpinner fullScreen />;
//   }

//   return (
//     <div className="bg-neutral-50 min-h-screen py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-neutral-800">Explore Courses</h1>
//           <p className="text-neutral-600 mt-1">
//             Discover fun and engaging learning experiences
//           </p>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search Input */}
//             <div className="md:flex-1">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search courses..."
//                   className="input pl-10"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                 />
//               </div>
//             </div>

//             {/* Filter Toggle Button */}
//             <div>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="btn-outline w-full md:w-auto flex items-center justify-center gap-2"
//               >
//                 <AdjustmentsHorizontalIcon className="h-5 w-5" />
//                 <span>Filters</span>
//                 <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//               </button>
//             </div>

//             {/* Sort Dropdown */}
//             <div>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="input"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//                 <option value="rating">Highest Rated</option>
//                 <option value="az">A-Z</option>
//                 <option value="za">Z-A</option>
//               </select>
//             </div>
//           </div>

//           {/* Filter Panel (conditionally rendered) */}
//           {showFilters && (
//             <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Subject Filter */}
//               <div>
//                 <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
//                   Subject
//                 </label>
//                 <select
//                   id="subject"
//                   name="subject"
//                   value={filters.subject}
//                   onChange={handleFilterChange}
//                   className="input"
//                 >
//                   <option value="">All Subjects</option>
//                   <option value="mathematics">Mathematics</option>
//                   <option value="english">English</option>
//                   <option value="science">Science</option>
//                   <option value="social">Social Studies</option>
//                   <option value="art">Art</option>
//                   <option value="music">Music</option>
//                   <option value="physical-education">Physical Education</option>
//                 </select>
//               </div>

//               {/* Grade Filter */}
//               <div>
//                 <label htmlFor="grade" className="block text-sm font-medium text-neutral-700 mb-1">
//                   Grade
//                 </label>
//                 <select
//                   id="grade"
//                   name="grade"
//                   value={filters.grade}
//                   onChange={handleFilterChange}
//                   className="input"
//                 >
//                   <option value="">All Grades</option>
//                   <option value="1">Grade 1</option>
//                   <option value="2">Grade 2</option>
//                   <option value="3">Grade 3</option>
//                   <option value="4">Grade 4</option>
//                 </select>
//               </div>

//               {/* Level Filter */}
//               <div>
//                 <label htmlFor="level" className="block text-sm font-medium text-neutral-700 mb-1">
//                   Level
//                 </label>
//                 <select
//                   id="level"
//                   name="level"
//                   value={filters.level}
//                   onChange={handleFilterChange}
//                   className="input"
//                 >
//                   <option value="">All Levels</option>
//                   <option value="beginner">Beginner</option>
//                   <option value="intermediate">Intermediate</option>
//                   <option value="advanced">Advanced</option>
//                 </select>
//               </div>

//               {/* Reset Filters Button */}
//               <div className="md:col-span-3 mt-2 flex justify-end">
//                 <button
//                   onClick={resetFilters}
//                   className="btn-ghost text-primary-600"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-8">
//             {error}
//           </div>
//         )}

//         {/* Courses Grid */}
//         {courses.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//             <AcademicCapIcon className="h-16 w-16 mx-auto text-neutral-400" />
//             <h3 className="mt-4 text-xl font-medium text-neutral-800">No courses found</h3>
//             <p className="mt-2 text-neutral-600">Try adjusting your filters or search terms</p>
//             <button
//               onClick={resetFilters}
//               className="mt-4 btn-primary"
//             >
//               Clear Filters
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {courses.map((course) => (
//               <div
//                 key={course._id}
//                 className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow group"
//               >
//                 <div className="relative">
//                   <img
//                     src={course.imageUrl}
//                     alt={course.title}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="absolute top-2 right-2 flex gap-2">
//                     <span className={`badge ${getSubjectColor(course.subject)}`}>
//                       {course.subject.charAt(0).toUpperCase() + course.subject.slice(1)}
//                     </span>
//                     <span className={`badge ${getLevelBadge(course.level)}`}>
//                       {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
//                     </span>
//                   </div>
//                   {course.gamification.hasPersonalization && (
//                     <div className="absolute bottom-2 left-2">
//                       <span className="badge badge-primary">
//                         Personalized
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <h2 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
//                       {course.title}
//                     </h2>
//                     <div className="flex items-center gap-1">
//                       <StarIcon className="h-4 w-4 text-warning-500" />
//                       <span className="text-sm font-medium">{course.averageRating.toFixed(1)}</span>
//                     </div>
//                   </div>
//                   <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
//                     {course.description}
//                   </p>
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center text-xs text-neutral-500">
//                       <AcademicCapIcon className="h-4 w-4 mr-1" />
//                       <span>Grade {course.grade}</span>
//                     </div>
//                     <div className="flex items-center text-xs text-neutral-500">
//                       <UserGroupIcon className="h-4 w-4 mr-1" />
//                       <span>{course.enrolledStudents.length} students</span>
//                     </div>
//                   </div>
//                   <div className="flex flex-col sm:flex-row gap-2">
//                     {enrolledCourseIds.includes(course._id) ? (
//                       <Link
//                         to={`/courses/${course._id}`}
//                         className="btn-primary w-full"
//                       >
//                         Go to Course
//                       </Link>
//                     ) : (
//                       <>
//                         <Link
//                           to={`/courses/${course._id}`}
//                           className="btn-outline w-full sm:w-1/2"
//                         >
//                           View Details
//                         </Link>
//                         <button
//                           onClick={() => handleEnrollCourse(course._id)}
//                           className="btn-primary w-full sm:w-1/2 flex justify-center items-center"
//                           disabled={enrollingCourseId === course._id}
//                         >
//                           {enrollingCourseId === course._id ? (
//                             <LoadingSpinner size="sm" color="white" />
//                           ) : (
//                             <>
//                               <BookOpenIcon className="h-4 w-4 mr-1" />
//                               <span>Enroll</span>
//                             </>
//                           )}
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  UserGroupIcon,
  StarIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtering and Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    grade: '',
    level: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Enrolled Courses Tracking
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all published courses with filters
        const coursesResponse = await api.get('/courses', {
          params: {
            ...filters,
            search: searchTerm,
            grade: filters.grade || undefined, // Only send if not empty
          }
        });

        if (coursesResponse.data.success) {
          // Sort courses based on selected sort method
          let sortedCourses = [...coursesResponse.data.courses];

          if (sortBy === 'newest') {
            sortedCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          } else if (sortBy === 'oldest') {
            sortedCourses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          } else if (sortBy === 'rating') {
            sortedCourses.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
          } else if (sortBy === 'az') {
            sortedCourses.sort((a, b) => a.title.localeCompare(b.title));
          } else if (sortBy === 'za') {
            sortedCourses.sort((a, b) => b.title.localeCompare(a.title));
          }

          setCourses(sortedCourses);
        }

        // If user is logged in, get their enrolled courses
        if (user) {
          const enrolledResponse = await api.get('/courses/enrolled');
          
          if (enrolledResponse.data.success) {
            const enrolledIds = enrolledResponse.data.enrolledCourses.map(
              enrollment => enrollment.course._id
            );
            setEnrolledCourseIds(enrolledIds);
          }
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, searchTerm, sortBy, user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      subject: '',
      grade: '',
      level: '',
    });
    setSearchTerm('');
  };

  const handleEnrollCourse = async (courseId) => {
    if (!user) {
      navigate('/login', { state: { from: '/courses' } });
      return;
    }

    try {
      setEnrollingCourseId(courseId);

      // Call API to enroll in course
      const response = await api.post(`/courses/${courseId}/enroll`);

      if (response.data.success) {
        // Update enrolled courses list
        setEnrolledCourseIds(prev => [...prev, courseId]);

        // Show success message
        toast.success('Successfully enrolled in the course!');
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      
      if (err.response?.data?.message === 'User already enrolled in this course') {
        setEnrolledCourseIds(prev => [...prev, courseId]);
        toast.info('You are already enrolled in this course');
      } else {
        toast.error(err.response?.data?.message || 'Failed to enroll in course. Please try again.');
      }
    } finally {
      setEnrollingCourseId(null);
    }
  };

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

  const getLevelBadge = (level) => {
    const badges = {
      beginner: 'bg-emerald-100 text-emerald-800',
      intermediate: 'bg-amber-100 text-amber-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return badges[level] || 'bg-neutral-100 text-neutral-800';
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Explore Courses</h1>
          <p className="text-neutral-600 mt-1">
            Discover fun and engaging learning experiences
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="md:flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline w-full md:w-auto flex items-center justify-center gap-2"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span>Filters</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rated</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
          </div>

          {/* Filter Panel (conditionally rendered) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Subject Filter */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={filters.subject}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">All Subjects</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="english">English</option>
                  <option value="science">Science</option>
                  <option value="social">Social Studies</option>
                  <option value="art">Art</option>
                  <option value="music">Music</option>
                  <option value="physical-education">Physical Education</option>
                </select>
              </div>

              {/* Grade Filter */}
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-neutral-700 mb-1">
                  Grade
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={filters.grade}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">All Grades</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-neutral-700 mb-1">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={filters.level}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              <div className="md:col-span-3 mt-2 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="btn-ghost text-primary-600"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <AcademicCapIcon className="h-16 w-16 mx-auto text-neutral-400" />
            <h3 className="mt-4 text-xl font-medium text-neutral-800">No courses found</h3>
            <p className="mt-2 text-neutral-600">Try adjusting your filters or search terms</p>
            <button
              onClick={resetFilters}
              className="mt-4 btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative">
                  <img
                    src={course.imageUrl || '/default-course.png'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/default-course.png';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span className={`badge ${getSubjectColor(course.subject)}`}>
                      {course.subject.charAt(0).toUpperCase() + course.subject.slice(1)}
                    </span>
                    <span className={`badge ${getLevelBadge(course.level)}`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  </div>
                  {course.gamification?.hasPersonalization && (
                    <div className="absolute bottom-2 left-2">
                      <span className="badge badge-primary">
                        Personalized
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h2>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-warning-500" />
                      <span className="text-sm font-medium">
                        {course.averageRating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-xs text-neutral-500">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      <span>Grade {course.grade}</span>
                    </div>
                    <div className="flex items-center text-xs text-neutral-500">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>{course.enrolledStudents?.length || 0} students</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {enrolledCourseIds.includes(course._id) ? (
                      <Link
                        to={`/courses/${course._id}`}
                        className="btn-primary w-full"
                      >
                        Go to Course
                      </Link>
                    ) : (
                      <>
                        <Link
                          to={`/courses/${course._id}`}
                          className="btn-outline w-full sm:w-1/2"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleEnrollCourse(course._id)}
                          className="btn-primary w-full sm:w-1/2 flex justify-center items-center"
                          disabled={enrollingCourseId === course._id}
                        >
                          {enrollingCourseId === course._id ? (
                            <LoadingSpinner size="sm" color="white" />
                          ) : (
                            <>
                              <BookOpenIcon className="h-4 w-4 mr-1" />
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
  );
};

export default CoursesPage;