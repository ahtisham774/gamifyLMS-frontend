import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClockIcon,
  BookOpenIcon,
  ChevronRightIcon,
  UserGroupIcon,
  StarIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const CourseCard = ({ course, progress = 0, isTeacher = false, onDelete }) => {
  if (!course) return null;
  
  const getSubjectColor = (subject) => {
    const colors = {
      mathematics: 'bg-blue-100 text-blue-800 border-blue-200',
      english: 'bg-green-100 text-green-800 border-green-200',
      science: 'bg-purple-100 text-purple-800 border-purple-200',
      social: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      art: 'bg-pink-100 text-pink-800 border-pink-200',
      music: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'physical-education': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[subject] || 'bg-neutral-100 text-neutral-800 border-neutral-200';
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group border-blue-100 hover:border-blue-300 h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.imageUrl || '/placeholder.svg'} 
          alt={course.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {course.subject && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className={`${getSubjectColor(course.subject)}`}>
              {course.subject.charAt(0).toUpperCase() + course.subject.slice(1)}
            </Badge>
          </div>
        )}
        
        {/* Teacher actions overlay */}
        {isTeacher && (
          <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Link 
              to={`/courses/${course._id}/edit`} 
              className="p-2 bg-white rounded-full shadow-md hover:bg-blue-100 text-blue-600 transition-colors"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            {onDelete && (
              <button 
                onClick={() => onDelete(course._id)}
                className="p-2 bg-white rounded-full shadow-md hover:bg-red-100 text-red-600 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
            <Link
              to={`/courses/${course._id}`}
              className="p-2 bg-white rounded-full shadow-md hover:bg-green-100 text-green-600 transition-colors"
            >
              <EyeIcon className="h-5 w-5" />
            </Link>
          </div>
        )}
        
        {/* Progress bar for students */}
        {progress > 0 && !isTeacher && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 px-4 py-2 backdrop-blur-sm">
            <div className="flex justify-between items-center text-sm text-gray-700 mb-1">
              <span>Progress</span>
              <span className="font-medium">{progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{course.description}</p>
        
        <div className="flex justify-between text-sm text-gray-500 mb-5">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1.5 text-blue-500" />
            <span>{course.duration ? Math.ceil(course.duration / 60) : 'N/A'} hrs</span>
          </div>
          
          <div className="flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-1.5 text-blue-500" />
            <span>
              {course.enrolledStudents?.length || 0} students
            </span>
          </div>
        </div>
        
        {isTeacher ? (
          <Link 
            to={`/courses/${course._id}/manage`}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-md flex items-center justify-center transition-all duration-200 font-medium"
          >
            Manage Course
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </Link>
        ) : (
          <Link 
            to={`/courses/${course._id}/learn`}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-md flex items-center justify-center transition-all duration-200 font-medium"
          >
            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;