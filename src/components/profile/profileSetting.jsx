import LoadingSpinner from '../common/LoadingSpinner'
import {
  UserIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

const ProfileSettings = ({ onCancel, onSave }) => {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    password: '',
    confirmPassword: '',
    preferences: {
      learningStyle: '',
      difficultyPreference: '',
      interestAreas: [],
      preferredRewardTypes: []
    }
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        password: '',
        confirmPassword: '',
        preferences: {
          learningStyle: user.preferences?.learningStyle || 'visual',
          difficultyPreference:
            user.preferences?.difficultyPreference || 'medium',
          interestAreas: user.preferences?.interestAreas || [],
          preferredRewardTypes: user.preferences?.preferredRewardTypes || []
        }
      })
    }
  }, [user])

  const handleChange = e => {
    const { name, value } = e.target

    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleArrayChange = (e, field) => {
    const value = e.target.value

    if (formData.preferences[field].includes(value)) {
      // Remove if already selected
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [field]: prev.preferences[field].filter(item => item !== value)
        }
      }))
    } else {
      // Add if not selected
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [field]: [...prev.preferences[field], value]
        }
      }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required')
      return
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      // Create update data (exclude confirmPassword and empty password)
      const updateData = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        preferences: formData.preferences
      }

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password
      }

    //   const result = await updateProfile(updateData)

      if (result && result.success) {
        toast.success('Profile updated successfully')
        onSave()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='bg-white rounded-lg shadow p-6 border border-gray-200'>
      <div className='border-b border-gray-200 pb-4 mb-4'>
        <h3 className='text-lg font-medium'>Edit Profile</h3>
      </div>
      <div className='py-2'>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className='space-y-6'>
              {/* Avatar Preview */}
              <div className='flex flex-col items-center'>
                <div className='h-24 w-24 mb-4 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-xl overflow-hidden'>
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.name}
                      className='h-full w-full object-cover'
                      onError={e => {
                        e.target.onError = null
                        e.target.src = ''
                      }}
                    />
                  ) : formData.name ? (
                    formData.name.charAt(0).toUpperCase()
                  ) : (
                    <UserIcon className='h-6 w-6' />
                  )}
                </div>
                <div className='w-full'>
                  <label
                    htmlFor='avatar'
                    className='block text-sm font-medium text-neutral-700 mb-1'
                  >
                    Avatar URL
                  </label>
                  <input
                    type='text'
                    id='avatar'
                    name='avatar'
                    value={formData.avatar}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                    placeholder='https://example.com/avatar.jpg'
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-neutral-700 mb-1'
                  >
                    Full Name *
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-neutral-700 mb-1'
                  >
                    Email Address *
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                </div>
              </div>

              {/* Password */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-neutral-700 mb-1'
                  >
                    New Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                    placeholder='Leave blank to keep current password'
                  />
                </div>

                <div>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-neutral-700 mb-1'
                  >
                    Confirm New Password
                  </label>
                  <input
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                    placeholder='Leave blank to keep current password'
                  />
                </div>
              </div>

              {/* Learning Preferences */}
              <div>
                <h4 className='font-medium text-neutral-800 mb-3'>
                  Learning Preferences
                </h4>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label
                      htmlFor='preferences.learningStyle'
                      className='block text-sm font-medium text-neutral-700 mb-1'
                    >
                      Learning Style
                    </label>
                    <select
                      id='preferences.learningStyle'
                      name='preferences.learningStyle'
                      value={formData.preferences.learningStyle}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                    >
                      <option value='visual'>Visual</option>
                      <option value='auditory'>Auditory</option>
                      <option value='reading'>Reading/Writing</option>
                      <option value='kinesthetic'>Hands-on</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor='preferences.difficultyPreference'
                      className='block text-sm font-medium text-neutral-700 mb-1'
                    >
                      Preferred Difficulty
                    </label>
                    <select
                      id='preferences.difficultyPreference'
                      name='preferences.difficultyPreference'
                      value={formData.preferences.difficultyPreference}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                    >
                      <option value='easy'>Easy</option>
                      <option value='medium'>Medium</option>
                      <option value='hard'>Hard</option>
                    </select>
                  </div>
                </div>

                <div className='mt-4'>
                  <label className='block text-sm font-medium text-neutral-700 mb-2'>
                    Areas of Interest
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {[
                      'math',
                      'science',
                      'language',
                      'history',
                      'arts',
                      'technology'
                    ].map(area => (
                      <button
                        key={area}
                        type='button'
                        value={area}
                        onClick={e => handleArrayChange(e, 'interestAreas')}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          formData.preferences.interestAreas.includes(area)
                            ? 'bg-primary-100 text-primary-800 border border-primary-300'
                            : 'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200'
                        }`}
                      >
                        {area.charAt(0).toUpperCase() + area.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='mt-4'>
                  <label className='block text-sm font-medium text-neutral-700 mb-2'>
                    Preferred Reward Types
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {['badge', 'points', 'certificate', 'achievement'].map(
                      type => (
                        <button
                          key={type}
                          type='button'
                          value={type}
                          onClick={e =>
                            handleArrayChange(e, 'preferredRewardTypes')
                          }
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            formData.preferences.preferredRewardTypes.includes(
                              type
                            )
                              ? 'bg-primary-100 text-primary-800 border border-primary-300'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
      <div className='flex justify-between mt-6 pt-4 border-t border-gray-200'>
        <button
          className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center'
          onClick={onCancel}
          disabled={loading}
        >
          <XCircleIcon className='h-4 w-4 mr-2' />
          Cancel
        </button>
        <button
          className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none flex items-center'
          onClick={handleSubmit}
          disabled={loading}
        >
          <CheckCircleIcon className='h-4 w-4 mr-2' />
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default ProfileSettings