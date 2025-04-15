import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AcademicCapIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  // Features section content
  const features = [
    {
      id: 1,
      title: 'Personalized Learning',
      description: 'Content and difficulty adapt based on student performance and preferences',
      icon: <UserGroupIcon className="h-12 w-12 text-primary-500" />,
    },
    {
      id: 2,
      title: 'Interactive Quizzes',
      description: 'Fun and engaging quizzes with immediate feedback and rewards',
      icon: <PuzzlePieceIcon className="h-12 w-12 text-primary-500" />,
    },
    {
      id: 3,
      title: 'Rewards System',
      description: 'Earn points, badges, and achievements as you progress through courses',
      icon: <TrophyIcon className="h-12 w-12 text-primary-500" />,
    },
    {
      id: 4,
      title: 'Progress Tracking',
      description: 'Monitor learning progress with detailed analytics and reports',
      icon: <RocketLaunchIcon className="h-12 w-12 text-primary-500" />,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Learning Made Fun and Effective
              </h1>
              <p className="text-xl mb-8">
                An adaptive educational platform with gamification for primary school students aged 6-9
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="btn-secondary btn-lg"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-secondary btn-lg"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-lg"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary-300 rounded-3xl rotate-3 scale-105"></div>
                <img
                  src="https://img.freepik.com/free-vector/children-studying-together-illustrated_52683-45083.jpg?w=900&t=st=1712668778~exp=1712669378~hmac=3a7c53a8ee2d77e9f8d0f5b60f7da6acb5bc01fbb25d9a74c45a580f04f99292"
                  alt="Children learning together"
                  className="relative z-10 rounded-3xl shadow-xl max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Key Features</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Designed to make learning engaging, personalized, and effective for young students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-primary-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary-600 mb-2">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tailored vs. Non-Tailored Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Two Learning Environments</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our platform offers both tailored and non-tailored learning environments to maximize effectiveness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Non-Tailored Environment */}
            <div className="bg-neutral-50 p-8 rounded-xl shadow-md border-2 border-neutral-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-neutral-200 p-3 rounded-full">
                  <AcademicCapIcon className="h-8 w-8 text-neutral-700" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800">Non-Tailored Environment</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-500 mt-1">•</span>
                  <span>Consistent experience for all students</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-500 mt-1">•</span>
                  <span>Same quizzes, rewards, and difficulty levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-500 mt-1">•</span>
                  <span>Standard progression path through content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-500 mt-1">•</span>
                  <span>Fixed challenge level for all learners</span>
                </li>
              </ul>
            </div>

            {/* Tailored Environment */}
            <div className="bg-primary-50 p-8 rounded-xl shadow-md border-2 border-primary-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary-200 p-3 rounded-full">
                  <LightBulbIcon className="h-8 w-8 text-primary-700" />
                </div>
                <h3 className="text-2xl font-bold text-primary-800">Tailored Environment</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>Adaptive difficulty based on performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>Personalized rewards matching preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>Custom feedback tailored to learning style</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>Content adjusts to individual needs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-secondary-300 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Ready to Make Learning Fun?</h2>
          <p className="text-xl text-neutral-800 max-w-3xl mx-auto mb-8">
            Join our platform today and discover the perfect learning environment for primary school students
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/courses"
                className="btn-primary btn-lg"
              >
                Explore Courses
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary btn-lg"
                >
                  Register Now
                </Link>
                <Link
                  to="/login"
                  className="btn-ghost bg-white bg-opacity-80 hover:bg-opacity-100 btn-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
