import React, { useState } from 'react';
import { 
  PlusIcon, 
  XMarkIcon, 
  DocumentIcon, 
  VideoCameraIcon, 
  LinkIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import uploadToCloudinary from '../../utils/cloudinaryUpload';
import { toast } from 'react-toastify';

const ResourceForm = ({ resources = [], onChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [resourceType, setResourceType] = useState('link');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceContent, setResourceContent] = useState('');
  const [resourceFile, setResourceFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleAddResource = async () => {
    try {
      if (!resourceTitle.trim()) {
        toast.error('Resource title is required');
        return;
      }

      let url = resourceUrl;
      let fileType = resourceType;

      // If file upload is needed
      if (resourceFile && (resourceType === 'pdf' || resourceType === 'video')) {
        setUploading(true);
        const folder = `resources/${resourceType}s`;
        const uploadResult = await uploadToCloudinary(resourceFile, folder);
        
        if (!uploadResult.success) {
          toast.error(`Failed to upload resource: ${uploadResult.error}`);
          setUploading(false);
          return;
        }
        
        url = uploadResult.url;
        fileType = uploadResult.fileType || resourceType;
        setUploading(false);
      }

      // Create new resource object
      const newResource = {
        type: fileType,
        title: resourceTitle,
        url: url || undefined,
        content: resourceContent || undefined,
        id: Date.now().toString() // Temporary ID
      };

      // Add to resources array
      const updatedResources = [...resources, newResource];
      onChange(updatedResources);

      // Reset form
      setResourceType('link');
      setResourceUrl('');
      setResourceTitle('');
      setResourceContent('');
      setResourceFile(null);
      setShowForm(false);
      
      toast.success('Resource added successfully');
    } catch (error) {
      console.error('Error adding resource:', error);
      toast.error('Failed to add resource. Please try again.');
      setUploading(false);
    }
  };

  const handleRemoveResource = (index) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    onChange(updatedResources);
    toast.success('Resource removed');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (resourceType === 'pdf' && file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (resourceType === 'video' && !file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
      setResourceFile(file);
    }
  };

  return (
    <div className="mt-6 border border-blue-100 rounded-lg p-4 bg-blue-50">
      <h3 className="text-lg font-medium text-blue-900 mb-4">Lesson Resources</h3>
      
      {resources.length > 0 ? (
        <div className="mb-4 space-y-2">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md border border-blue-200">
              <div className="flex items-center">
                {resource.type === 'pdf' && <DocumentIcon className="h-5 w-5 text-red-500 mr-2" />}
                {resource.type === 'video' && <VideoCameraIcon className="h-5 w-5 text-purple-500 mr-2" />}
                {resource.type === 'link' && <LinkIcon className="h-5 w-5 text-blue-500 mr-2" />}
                <div>
                  <p className="font-medium text-gray-800">{resource.title}</p>
                  {resource.url && (
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      {resource.url.length > 40 ? `${resource.url.substring(0, 40)}...` : resource.url}
                    </a>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleRemoveResource(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-full"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mb-4">No resources added yet</p>
      )}

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Resource
        </button>
      ) : (
        <div className="bg-white p-4 rounded-md border border-blue-200">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type
              </label>
              <div className="flex space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => setResourceType('link')}
                  className={`px-3 py-2 rounded-md flex items-center ${
                    resourceType === 'link' 
                      ? 'bg-blue-100 text-blue-700 border-blue-300 border' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Link
                </button>
                <button
                  type="button"
                  onClick={() => setResourceType('pdf')}
                  className={`px-3 py-2 rounded-md flex items-center ${
                    resourceType === 'pdf' 
                      ? 'bg-red-100 text-red-700 border-red-300 border' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <DocumentIcon className="h-4 w-4 mr-1" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => setResourceType('video')}
                  className={`px-3 py-2 rounded-md flex items-center ${
                    resourceType === 'video' 
                      ? 'bg-purple-100 text-purple-700 border-purple-300 border' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <VideoCameraIcon className="h-4 w-4 mr-1" />
                  Video
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Title *
              </label>
              <input
                type="text"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter resource title"
                required
              />
            </div>

            {(resourceType === 'pdf' || resourceType === 'video') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resource-file"
                      accept={resourceType === 'pdf' ? 'application/pdf' : 'video/*'}
                    />
                    <label 
                      htmlFor="resource-file"
                      className="cursor-pointer flex items-center justify-center flex-col"
                    >
                      <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        {resourceFile ? 
                          resourceFile.name : 
                          `Click to upload a ${resourceType === 'pdf' ? 'PDF' : 'video'} file`
                        }
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or Enter URL (optional)
                  </label>
                  <input
                    type="url"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${resourceType} URL`}
                  />
                </div>
              </>
            )}

            {resourceType === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter URL"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={resourceContent}
                onChange={(e) => setResourceContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description"
                rows="2"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddResource}
                disabled={uploading || !resourceTitle || (resourceType === 'link' && !resourceUrl)}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md flex items-center ${
                  uploading || !resourceTitle || (resourceType === 'link' && !resourceUrl)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add Resource
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceForm;