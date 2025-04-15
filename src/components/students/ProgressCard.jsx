import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ClockIcon,
  ChevronRightIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const ProgressCard = ({ course, progress }) => {
  if (!course) return null;

  console.log('Course:', course);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="relative h-32">
        <img 
          src={course.imageUrl || '/default-course.png'} 
          alt={course.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-course.png';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-medium truncate">{course.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">Progress</span>
          <span className="text-sm font-medium text-primary-600">{progress || 0}%</span>
        </div>
        
        <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-3">
          <div 
            className="bg-primary-600 h-2.5 rounded-full" 
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-neutral-500 mb-4">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {/* <span>{course.duration ? Math.round(course.duration / 60) : 'N/A'} hrs</span> */}
          {/* calculate total duration that is in lessons and lessons are in units and units are in course */}
          <span>
  {course?.units
    ? (() => {
        const totalMinutes = course.units.reduce((total, unit) => {
          return total + unit.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
        }, 0);

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours && minutes) return `${hours} hr ${minutes} min`;
        if (hours) return `${hours} hr`;
        return `${minutes} min`;
      })()
    : 'N/A'}
</span>



          </div>
          
          <div className="flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            <span>
              {progress >= 100 ? (
                'Completed'
              ) : (
                `${Math.round(progress || 0)}% Done`
              )}
            </span>
          </div>
        </div>
        
        <Link 
          to={`/courses/${course._id}/learn`}
          className="btn-primary w-full flex items-center justify-center"
        >
          <BookOpenIcon className="h-5 w-5 mr-2" />
          {progress === 100 ?
            "View Course" :
         progress > 0 ? 'Continue Learning' : 'Start Learning'}
          <ChevronRightIcon className="h-5 w-5 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ProgressCard;