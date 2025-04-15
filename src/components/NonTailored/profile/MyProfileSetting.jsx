import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';

const MyProfileSettings = ({ onCancel, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: '',
    age: '',
    grade: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar: user.avatar || '',
        age: user.age || '',
        grade: user.grade || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password fields
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    
    // Prepare data for submission
    const updatedData = {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
      age: formData.age ? Number(formData.age) : undefined,
      grade: formData.grade || undefined,
    };
    
    // Add password update if provided
    if (formData.currentPassword && formData.newPassword) {
      updatedData.currentPassword = formData.currentPassword;
      updatedData.newPassword = formData.newPassword;
    }
    
    try {
      setLoading(true);
    //   const result = await updateProfile(updatedData);
      
    //   if (result?.success) {
    //     toast.success('Profile updated successfully');
    //     if (onSave) onSave();
    //   }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Profile</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age (Optional)
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Grade (Optional)
              </label>
              <input
                id="grade"
                name="grade"
                type="text"
                value={formData.grade}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          {/* Avatar URL */}
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture URL (Optional)
            </label>
            <input
              id="avatar"
              name="avatar"
              type="text"
              value={formData.avatar}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none"
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a URL to an image for your profile picture.
            </p>
          </div>
          
          {/* Password Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Change Password (Optional)</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfileSettings;