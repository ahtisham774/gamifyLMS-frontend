import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  UserIcon,
  KeyIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  IdentificationIcon,
  SparklesIcon,
  RectangleGroupIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    grade: '',
    age: '',
    learningApproach: 'tailored'
  });

  const [formErrors, setFormErrors] = useState({});
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const errors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Validate student-specific fields
    if (formData.role === 'student') {
      if (!formData.grade) {
        errors.grade = 'Grade is required';
      }

      if (!formData.age) {
        errors.age = 'Age is required';
      } else if (formData.age < 6 || formData.age > 9) {
        errors.age = 'Age must be between 6 and 9';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;

      // Prepare preferences object
      const userWithPreferences = {
        ...userData,
        preferences: {
          learningApproach: userData.learningApproach
        }
      };

      const success = await register(userWithPreferences);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Left side - Form */}
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary-600">Create Your Account</h1>
              <p className="text-neutral-600 mt-2">Join our community of learners today!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input pl-10 ${formErrors.name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <ExclamationCircleIcon className="h-5 w-5 text-error-500" />
                    </div>
                  )}
                </div>
                {formErrors.name && (
                  <p className="mt-1 text-sm text-error-500">{formErrors.name}</p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input pl-10 ${formErrors.email ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    placeholder="you@example.com"
                  />
                  {formErrors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <ExclamationCircleIcon className="h-5 w-5 text-error-500" />
                    </div>
                  )}
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-error-500">{formErrors.email}</p>
                )}
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  I am a:
                </label>
                <div className="flex space-x-4">
                  <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer ${formData.role === 'student' ? 'bg-primary-50 border-primary-500' : 'border-neutral-300 hover:bg-neutral-50'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={formData.role === 'student'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <UserIcon className={`h-5 w-5 mr-2 ${formData.role === 'student' ? 'text-primary-500' : 'text-neutral-500'}`} />
                    <span className={formData.role === 'student' ? 'text-primary-700 font-medium' : 'text-neutral-700'}>Student</span>
                  </label>

                  <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer ${formData.role === 'teacher' ? 'bg-primary-50 border-primary-500' : 'border-neutral-300 hover:bg-neutral-50'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="teacher"
                      checked={formData.role === 'teacher'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <AcademicCapIcon className={`h-5 w-5 mr-2 ${formData.role === 'teacher' ? 'text-primary-500' : 'text-neutral-500'}`} />
                    <span className={formData.role === 'teacher' ? 'text-primary-700 font-medium' : 'text-neutral-700'}>Teacher</span>
                  </label>
                </div>
              </div>

              {/* Student-specific fields (conditionally rendered) */}
              {formData.role === 'student' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="grade" className="block text-sm font-medium text-neutral-700 mb-1">
                        Grade
                      </label>
                      <select
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className={`input ${formErrors.grade ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      >
                        <option value="">Select grade</option>
                        <option value="1">Grade 1</option>
                        <option value="2">Grade 2</option>
                        <option value="3">Grade 3</option>
                        <option value="4">Grade 4</option>
                      </select>
                      {formErrors.grade && (
                        <p className="mt-1 text-sm text-error-500">{formErrors.grade}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-neutral-700 mb-1">
                        Age
                      </label>
                      <select
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className={`input ${formErrors.age ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      >
                        <option value="">Select age</option>
                        <option value="6">6 years</option>
                        <option value="7">7 years</option>
                        <option value="8">8 years</option>
                        <option value="9">9 years</option>
                      </select>
                      {formErrors.age && (
                        <p className="mt-1 text-sm text-error-500">{formErrors.age}</p>
                      )}
                    </div>
                  </div>

                  {/* Learning Approach Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Learning Experience
                    </label>
                    <div className="flex space-x-4">
                      <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer ${formData.learningApproach === 'tailored' ? 'bg-primary-50 border-primary-500' : 'border-neutral-300 hover:bg-neutral-50'}`}>
                        <input
                          type="radio"
                          name="learningApproach"
                          value="tailored"
                          checked={formData.learningApproach === 'tailored'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <SparklesIcon className={`h-5 w-5 mr-2 ${formData.learningApproach === 'tailored' ? 'text-primary-500' : 'text-neutral-500'}`} />
                        <span className={formData.learningApproach === 'tailored' ? 'text-primary-700 font-medium' : 'text-neutral-700'}>Tailored</span>
                      </label>

                      <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer ${formData.learningApproach === 'non-tailored' ? 'bg-primary-50 border-primary-500' : 'border-neutral-300 hover:bg-neutral-50'}`}>
                        <input
                          type="radio"
                          name="learningApproach"
                          value="non-tailored"
                          checked={formData.learningApproach === 'non-tailored'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <RectangleGroupIcon className={`h-5 w-5 mr-2 ${formData.learningApproach === 'non-tailored' ? 'text-primary-500' : 'text-neutral-500'}`} />
                        <span className={formData.learningApproach === 'non-tailored' ? 'text-primary-700 font-medium' : 'text-neutral-700'}>Standard</span>
                      </label>
                    </div>
                    <p className="mt-2 text-sm text-neutral-500">
                      {formData.learningApproach === 'tailored' 
                        ? 'Get a personalized learning path based on your needs and preferences'
                        : 'Follow a standard curriculum path for all students'}
                    </p>
                  </div>

                 
                </>
              )}

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input pl-10 ${formErrors.password ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    placeholder="••••••"
                  />
                  {formErrors.password && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <ExclamationCircleIcon className="h-5 w-5 text-error-500" />
                    </div>
                  )}
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-error-500">{formErrors.password}</p>
                )}
              </div>

              {/* Confirm Password field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input pl-10 ${formErrors.confirmPassword ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    placeholder="••••••"
                  />
                  {formErrors.confirmPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <ExclamationCircleIcon className="h-5 w-5 text-error-500" />
                    </div>
                  )}
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-500">{formErrors.confirmPassword}</p>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="btn-primary bg-gradient-to-r from-indigo-600 to-primary-600 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Creating account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Right side - Info */}
          <div className="md:w-1/2 bg-gradient-to-r from-indigo-600 to-primary-600 text-white p-8 flex flex-col justify-start">
            <h2 className="text-2xl font-bold mb-4">Join Our Learning Adventure!</h2>
            <p className="mb-6">Create an account to access:</p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-white text-primary-600 font-bold mr-3">✓</div>
                <span>Interactive learning games</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-white text-primary-600 font-bold mr-3">✓</div>
                <span>Personalized learning paths</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-white text-primary-600 font-bold mr-3">✓</div>
                <span>Fun rewards and badges</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-white text-primary-600 font-bold mr-3">✓</div>
                <span>Progress tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;