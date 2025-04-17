import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BookOpenIcon,
  ShieldCheckIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  MusicalNoteIcon,
  BeakerIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-indigo-100">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-12 md:p-16">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Online Learning Made Simple
              </h1>
              <p className="text-lg md:text-xl mb-8 text-indigo-100 max-w-3xl">
                Discover courses that match your interests and learning style.
                Start your learning journey today.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {!isAuthenticated ? (
                  <>
                    <Link 
                      to="/login"
                      className="inline-flex items-center px-6 py-3 rounded-full bg-white text-indigo-600 font-medium shadow-md hover:bg-indigo-50 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/register"
                      className="inline-flex items-center px-6 py-3 rounded-full bg-transparent text-white border-2 border-white hover:bg-white/10 font-medium transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/courses"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-white text-indigo-600 font-medium shadow-md hover:bg-indigo-50 transition-colors"
                  >
                    Browse Courses
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        {/* <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Why Learn With Us?</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Our platform offers the best learning experience with interactive courses and expert instructors.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpenIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Engaging Courses</h3>
              <p className="text-gray-600">
                Interactive lessons designed to make learning engaging and effective with multimedia content.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Expert Teachers</h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of experience in their respective fields.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ClockIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Flexible Learning</h3>
              <p className="text-gray-600">
                Study at your own pace, on any device, with lifetime access to course materials.
              </p>
            </div>
          </div>
        </div> */}
        
        {/* Popular Topics */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Popular Subjects</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our wide range of subjects to find what interests you most.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="flex items-center px-4 py-2 bg-white border border-indigo-100 rounded-full text-sm font-medium hover:bg-indigo-50 cursor-pointer transition-colors">
              <ChartBarIcon className="h-4 w-4 mr-1 text-indigo-600" />
              Mathematics
            </span>
            <span className="flex items-center px-4 py-2 bg-white border border-indigo-100 rounded-full text-sm font-medium hover:bg-indigo-50 cursor-pointer transition-colors">
              <BeakerIcon className="h-4 w-4 mr-1 text-indigo-600" />
              Science
            </span>
            <span className="flex items-center px-4 py-2 bg-white border border-indigo-100 rounded-full text-sm font-medium hover:bg-indigo-50 cursor-pointer transition-colors">
              <BookOpenIcon className="h-4 w-4 mr-1 text-indigo-600" />
              English
            </span>
            <span className="flex items-center px-4 py-2 bg-white border border-indigo-100 rounded-full text-sm font-medium hover:bg-indigo-50 cursor-pointer transition-colors">
              <GlobeAltIcon className="h-4 w-4 mr-1 text-indigo-600" />
              Social Studies
            </span>
          
          </div>
          
          <div className="text-center">
            <Link 
              to="/courses"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
            >
              Explore All Courses
            </Link>
          </div>
        </div>

        {/* Testimonials or Stats Section */}
        {/* <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Join Our Learning Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LandingPage;