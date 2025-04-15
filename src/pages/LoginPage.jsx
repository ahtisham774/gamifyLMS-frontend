import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  UserIcon,
  KeyIcon,
  ExclamationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/common/LoadingSpinner'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const errors = {}

    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (validateForm()) {
      const success = await login(email, password)
      if (success) {
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className='py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 min-h-screen'>
      <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='md:flex'>
          {/* Left side - Form */}
          <div className='flex-1 flex items-center justify-center p-6'>
            <div className='w-full max-w-md'>
              <div className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-primary-600'>
                  Welcome Back!
                </h1>
                <p className='text-neutral-600 mt-2'>
                  Login to continue your learning journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Email field */}
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-neutral-700 mb-1'
                  >
                    Email Address
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <UserIcon className='h-5 w-5 text-neutral-400' />
                    </div>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`input pl-10 ${
                        formErrors.email
                          ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                          : ''
                      }`}
                      placeholder='you@example.com'
                    />
                    {formErrors.email && (
                      <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                        <ExclamationCircleIcon className='h-5 w-5 text-error-500' />
                      </div>
                    )}
                  </div>
                  {formErrors.email && (
                    <p className='mt-1 text-sm text-error-500'>
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-neutral-700 mb-1'
                  >
                    Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <KeyIcon className='h-5 w-5 text-neutral-400' />
                    </div>
                    <input
                      id='password'
                      name='password'
                      type='password'
                      autoComplete='current-password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={`input pl-10 ${
                        formErrors.password
                          ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                          : ''
                      }`}
                      placeholder='••••••'
                    />
                    {formErrors.password && (
                      <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                        <ExclamationCircleIcon className='h-5 w-5 text-error-500' />
                      </div>
                    )}
                  </div>
                  {formErrors.password && (
                    <p className='mt-1 text-sm text-error-500'>
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <input
                      id='remember-me'
                      name='remember-me'
                      type='checkbox'
                      className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded'
                    />
                    <label
                      htmlFor='remember-me'
                      className='ml-2 block text-sm text-neutral-700'
                    >
                      Remember me
                    </label>
                  </div>

                  <div className='text-sm'>
                    <a
                      href='#'
                      className='font-medium text-primary-600 hover:text-primary-500'
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className='bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded'>
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type='submit'
                    className='btn-primary w-full bg-gradient-to-r from-indigo-600 to-primary-600 flex justify-center items-center gap-2'
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner size='sm' color='white' />
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ArrowRightIcon className='h-4 w-4' />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className='mt-6 text-center'>
                <p className='text-sm text-neutral-600'>
                  Don't have an account?{' '}
                  <Link
                    to='/register'
                    className='font-medium text-primary-600 hover:text-primary-500'
                  >
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Image/Banner */}
          <div className='hidden lg:block lg:flex-1 bg-gradient-to-r from-indigo-600 to-primary-600 relative overflow-hidden'>
            <div className='absolute inset-0 bg-pattern opacity-10'></div>
            <div className='relative h-full flex flex-col justify-start items-center p-12 text-white'>
              {/* <img
                src='https://img.freepik.com/free-vector/children-working-homework-together_52683-37658.jpg?w=900&t=st=1712668780~exp=1712669380~hmac=86dddc9baf60e9124e1388fd4afd1d40fd4f28d0ae44773ef6d9d95a14eec761'
                alt='Happy students learning'
                className='w-full max-w-md rounded-2xl mb-8 shadow-lg'
              /> */}
              <h2 className='text-3xl font-bold mb-6'>
                Interactive Learning Experience
              </h2>
              <div className='text-start space-y-4 max-w-md'>
                <p className='text-lg'>
                  Dive into a world where learning is fun, personalized, and
                  rewarding!
                </p>
                <p>
                  Our gamified platform adapts to each child's unique needs,
                  making educational content engaging and effective.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
