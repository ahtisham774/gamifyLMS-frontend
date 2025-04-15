import { Link } from 'react-router-dom';
import { FaceFrownIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <FaceFrownIcon className="h-24 w-24 text-primary-500 animate-bounce-slow" />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-neutral-800">Page Not Found</h1>
        <p className="mt-4 text-lg text-neutral-600">
          Oops! It looks like the page you're looking for doesn't exist.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="btn-primary flex items-center gap-2"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Go to Homepage</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* <div className="mt-12">
          <img
            src="https://img.freepik.com/free-vector/curious-kids-concept-illustration_114360-11156.jpg?w=900&t=st=1712668779~exp=1712669379~hmac=2aee7fe4b5eb3fe5d1a87c3711be2a04444a71be7a0c7d01e11e3cfd3b5cfa51"
            alt="Lost kids illustration"
            className="max-w-xs mx-auto rounded-lg"
          />
        </div> */}
      </div>
    </div>
  );
};

export default NotFoundPage;
