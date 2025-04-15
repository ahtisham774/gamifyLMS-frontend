
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PencilIcon,
  DocumentTextIcon,
  DocumentPlusIcon,
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LinkIcon,
  PlayIcon,
  PuzzlePieceIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const CourseForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const isEditing = !!id

  // Course Data
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    level: 'beginner',
    imageUrl: '',
    gamification: {
      hasPersonalization: false,
      pointsToEarn: 10
    },
    units: []
  })

  // Loading and Submission states
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // UI states
  const [expandedUnits, setExpandedUnits] = useState([])
  const [expandedLessons, setExpandedLessons] = useState([])
  const [currentTab, setCurrentTab] = useState('basic')
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedOverItem, setDraggedOverItem] = useState(null)

  useEffect(() => {
    if (isEditing) {
      fetchCourseData()
    }
  }, [id])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/courses/${id}`)

      if (response.data.success) {
        const course = response.data.course
        setCourseData(course)
        setImagePreview(course.imageUrl)

        // Expand all units by default when editing
        if (course.units) {
          setExpandedUnits(course.units.map((_, idx) => idx))
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
      toast.error('Failed to load course data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setCourseData({
      ...courseData,
      [name]: value
    })
  }

  const handleGamificationChange = e => {
    const { name, value, type, checked } = e.target
    setCourseData({
      ...courseData,
      gamification: {
        ...courseData.gamification,
        [name]: type === 'checkbox' ? checked : value
      }
    })
  }

  const handleImageSelect = async e => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))

      try {
        setUploadingImage(true)

        // Upload to Cloudinary
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'ml_default') // Replace with your Cloudinary upload preset

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dmkhjn2ii/image/upload',
          {
            method: 'POST',
            body: formData
          }
        )

        const data = await response.json()

        if (data.secure_url) {
          setCourseData({
            ...courseData,
            imageUrl: data.secure_url
          })
          toast.success('Image uploaded successfully')
        } else {
          toast.error('Failed to upload image')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        toast.error('Failed to upload image')
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleAddUnit = () => {
    const newUnit = {
      title: 'New Unit',
      description: '',
      lessons: []
    }

    const updatedUnits = [...courseData.units, newUnit]
    setCourseData({ ...courseData, units: updatedUnits })
    setExpandedUnits([...expandedUnits, updatedUnits.length - 1])
  }

  const handleRemoveUnit = unitIndex => {
    const updatedUnits = courseData.units.filter(
      (_, index) => index !== unitIndex
    )
    setCourseData({ ...courseData, units: updatedUnits })
    setExpandedUnits(
      expandedUnits
        .filter(idx => idx !== unitIndex)
        .map(idx => (idx > unitIndex ? idx - 1 : idx))
    )
  }

  const handleUnitChange = (unitIndex, field, value) => {
    const updatedUnits = [...courseData.units]
    updatedUnits[unitIndex] = {
      ...updatedUnits[unitIndex],
      [field]: value
    }
    setCourseData({ ...courseData, units: updatedUnits })
  }

  const handleAddLesson = unitIndex => {
    const newLesson = {
      title: 'New Lesson',
      content: '',
      duration: 30,
      resources: [],
      quizzes: []
    }

    const updatedUnits = [...courseData.units]
    if (!updatedUnits[unitIndex].lessons) {
      updatedUnits[unitIndex].lessons = []
    }

    updatedUnits[unitIndex].lessons.push(newLesson)
    setCourseData({ ...courseData, units: updatedUnits })

    // Expand this lesson
    const lessonIndex = updatedUnits[unitIndex].lessons.length - 1
    const lessonKey = `${unitIndex}-${lessonIndex}`
    setExpandedLessons([...expandedLessons, lessonKey])
  }

  const handleRemoveLesson = (unitIndex, lessonIndex) => {
    const updatedUnits = [...courseData.units]
    updatedUnits[unitIndex].lessons = updatedUnits[unitIndex].lessons.filter(
      (_, idx) => idx !== lessonIndex
    )
    setCourseData({ ...courseData, units: updatedUnits })

    // Remove from expanded lessons
    const lessonKey = `${unitIndex}-${lessonIndex}`
    setExpandedLessons(expandedLessons.filter(key => key !== lessonKey))
  }

  const handleLessonChange = (unitIndex, lessonIndex, field, value) => {
    const updatedUnits = [...courseData.units]
    updatedUnits[unitIndex].lessons[lessonIndex] = {
      ...updatedUnits[unitIndex].lessons[lessonIndex],
      [field]: value
    }
    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle adding quiz to a lesson
  const handleAddQuiz = (unitIndex, lessonIndex) => {
    const updatedUnits = [...courseData.units]
    const lesson = updatedUnits[unitIndex].lessons[lessonIndex]

    if (!lesson.quizzes) {
      lesson.quizzes = []
    }

    lesson.quizzes.push({
      title: `Quiz for ${lesson.title}`,
      questions: [
        {
          questionText: 'New Question',
          questionType: 'multiple-choice',
          options: [
            { text: 'Option 1', isCorrect: true },
            { text: 'Option 2', isCorrect: false },
            { text: 'Option 3', isCorrect: false }
          ],
          points: 5
        }
      ]
    })

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle removing quiz from a lesson
  const handleRemoveQuiz = (unitIndex, lessonIndex, quizIndex) => {
    const updatedUnits = [...courseData.units]
    const lesson = updatedUnits[unitIndex].lessons[lessonIndex]

    lesson.quizzes = lesson.quizzes.filter((_, idx) => idx !== quizIndex)

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle quiz data changes
  const handleQuizChange = (
    unitIndex,
    lessonIndex,
    quizIndex,
    field,
    value
  ) => {
    const updatedUnits = [...courseData.units]
    const quiz = updatedUnits[unitIndex].lessons[lessonIndex].quizzes[quizIndex]

    quiz[field] = value

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle adding a question to a quiz
  const handleAddQuestion = (unitIndex, lessonIndex, quizIndex) => {
    const updatedUnits = [...courseData.units]
    const quiz = updatedUnits[unitIndex].lessons[lessonIndex].quizzes[quizIndex]

    quiz.questions.push({
      questionText: 'New Question',
      questionType: 'multiple-choice',
      options: [
        { text: 'Option 1', isCorrect: true },
        { text: 'Option 2', isCorrect: false },
        { text: 'Option 3', isCorrect: false }
      ],
      points: 5
    })

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle removing a question from a quiz
  const handleRemoveQuestion = (
    unitIndex,
    lessonIndex,
    quizIndex,
    questionIndex
  ) => {
    const updatedUnits = [...courseData.units]
    const quiz = updatedUnits[unitIndex].lessons[lessonIndex].quizzes[quizIndex]

    quiz.questions = quiz.questions.filter((_, idx) => idx !== questionIndex)

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle question data changes
  const handleQuestionChange = (
    unitIndex,
    lessonIndex,
    quizIndex,
    questionIndex,
    field,
    value
  ) => {
    const updatedUnits = [...courseData.units]
    const question =
      updatedUnits[unitIndex].lessons[lessonIndex].quizzes[quizIndex].questions[
        questionIndex
      ]

    question[field] = value

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle option data changes
//   const handleOptionChange = (
//     unitIndex,
//     lessonIndex,
//     quizIndex,
//     questionIndex,
//     optionIndex,
//     field,
//     value
//   ) => {
//     const updatedUnits = [...courseData.units]
//     const option =
//       updatedUnits[unitIndex].lessons[lessonIndex].quizzes[quizIndex].questions[
//         questionIndex
//       ].options[optionIndex]

//     option[field] = value

//     setCourseData({ ...courseData, units: updatedUnits })
//   }
  const handleOptionChange = (unitIndex, lessonIndex, quizIndex, questionIndex, optionIndex, field, value) => {
    const updatedUnits = [...courseData.units]
    const question = updatedUnits[unitIndex].lessons[lessonIndex].quizzes[quizIndex].questions[questionIndex]

    // If changing the isCorrect field and setting it to true
    if (field === "isCorrect" && value === true) {
      // First set all options to false
      question.options.forEach((option, idx) => {
        option.isCorrect = false
      })
    }

    // Then set the current option's field
    const option = question.options[optionIndex]
    option[field] = value

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle adding an option to a question
  const handleAddOption = (
    unitIndex,
    lessonIndex,
    quizIndex,
    questionIndex
  ) => {
    const updatedUnits = [...courseData.units]
    const question =
      updatedUnits[unitIndex].lessons[lessonIndex].quizzes[quizIndex].questions[
        questionIndex
      ]

    question.options.push({
      text: `Option ${question.options.length + 1}`,
      isCorrect: false
    })

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle removing an option from a question
  const handleRemoveOption = (
    unitIndex,
    lessonIndex,
    quizIndex,
    questionIndex,
    optionIndex
  ) => {
    const updatedUnits = [...courseData.units]
    const question =
      updatedUnits[unitIndex].lessons[lessonIndex].quizzes[quizIndex].questions[
        questionIndex
      ]

    question.options = question.options.filter((_, idx) => idx !== optionIndex)

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle adding a resource to a lesson
  const handleAddResource = (unitIndex, lessonIndex) => {
    const updatedUnits = [...courseData.units]
    const lesson = updatedUnits[unitIndex].lessons[lessonIndex]

    if (!lesson.resources) {
      lesson.resources = []
    }

    lesson.resources.push({
      type: 'text',
      url: '',
      content: ''
    })

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle removing a resource from a lesson
  const handleRemoveResource = (unitIndex, lessonIndex, resourceIndex) => {
    const updatedUnits = [...courseData.units]
    const lesson = updatedUnits[unitIndex].lessons[lessonIndex]

    lesson.resources = lesson.resources.filter(
      (_, idx) => idx !== resourceIndex
    )

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle resource data changes
  const handleResourceChange = (
    unitIndex,
    lessonIndex,
    resourceIndex,
    field,
    value
  ) => {
    const updatedUnits = [...courseData.units]
    const resource =
      updatedUnits[unitIndex].lessons[lessonIndex].resources[resourceIndex]

    resource[field] = value

    setCourseData({ ...courseData, units: updatedUnits })
  }

  // Handle resource file upload to Cloudinary
  const handleResourceFileUpload = async (
    unitIndex,
    lessonIndex,
    resourceIndex,
    file
  ) => {
    try {
      const updatedUnits = [...courseData.units]
      const resource =
        updatedUnits[unitIndex].lessons[lessonIndex].resources[resourceIndex]

      // Set loading state
      resource.uploading = true
      setCourseData({ ...courseData, units: updatedUnits })

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'ml_default') // Replace with your Cloudinary upload preset

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dmkhjn2ii/image/upload',
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await response.json()

      if (data.secure_url) {
        // Update resource with the Cloudinary URL
        resource.url = data.secure_url
        resource.uploading = false
        setCourseData({ ...courseData, units: updatedUnits })
        toast.success('Resource uploaded successfully')
      } else {
        toast.error('Failed to upload resource')
        resource.uploading = false
        setCourseData({ ...courseData, units: updatedUnits })
      }
    } catch (error) {
      console.error('Error uploading resource:', error)
      toast.error('Failed to upload resource')

      const updatedUnits = [...courseData.units]
      const resource =
        updatedUnits[unitIndex].lessons[lessonIndex].resources[resourceIndex]
      resource.uploading = false
      setCourseData({ ...courseData, units: updatedUnits })
    }
  }

  const toggleUnitExpanded = unitIndex => {
    if (expandedUnits.includes(unitIndex)) {
      setExpandedUnits(expandedUnits.filter(idx => idx !== unitIndex))
    } else {
      setExpandedUnits([...expandedUnits, unitIndex])
    }
  }

  const toggleLessonExpanded = (unitIndex, lessonIndex) => {
    const lessonKey = `${unitIndex}-${lessonIndex}`
    if (expandedLessons.includes(lessonKey)) {
      setExpandedLessons(expandedLessons.filter(key => key !== lessonKey))
    } else {
      setExpandedLessons([...expandedLessons, lessonKey])
    }
  }

  const moveUnit = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= courseData.units.length) return

    const updatedUnits = [...courseData.units]
    const [movedUnit] = updatedUnits.splice(fromIndex, 1)
    updatedUnits.splice(toIndex, 0, movedUnit)

    setCourseData({ ...courseData, units: updatedUnits })

    // Update expanded units indexes
    const newExpandedUnits = expandedUnits.map(idx => {
      if (idx === fromIndex) return toIndex
      if (fromIndex < toIndex && idx > fromIndex && idx <= toIndex)
        return idx - 1
      if (fromIndex > toIndex && idx < fromIndex && idx >= toIndex)
        return idx + 1
      return idx
    })

    setExpandedUnits(newExpandedUnits)
  }

  const moveLesson = (unitIndex, fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= courseData.units[unitIndex].lessons.length)
      return

    const updatedUnits = [...courseData.units]
    const [movedLesson] = updatedUnits[unitIndex].lessons.splice(fromIndex, 1)
    updatedUnits[unitIndex].lessons.splice(toIndex, 0, movedLesson)

    setCourseData({ ...courseData, units: updatedUnits })

    // Update expanded lessons keys
    const updatedExpandedLessons = expandedLessons.map(key => {
      const [uIdx, lIdx] = key.split('-').map(Number)

      if (uIdx !== unitIndex) return key

      if (Number(lIdx) === fromIndex) return `${unitIndex}-${toIndex}`
      if (
        fromIndex < toIndex &&
        Number(lIdx) > fromIndex &&
        Number(lIdx) <= toIndex
      ) {
        return `${unitIndex}-${Number(lIdx) - 1}`
      }
      if (
        fromIndex > toIndex &&
        Number(lIdx) < fromIndex &&
        Number(lIdx) >= toIndex
      ) {
        return `${unitIndex}-${Number(lIdx) + 1}`
      }

      return key
    })

    setExpandedLessons(updatedExpandedLessons)
  }

  const calculateTotalDuration = () => {
    return courseData.units.reduce((total, unit) => {
      return (
        total +
        (unit.lessons?.reduce((lessonTotal, lesson) => {
          return lessonTotal + (lesson.duration || 0)
        }, 0) || 0)
      )
    }, 0)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Validation
    if (!courseData.title.trim()) {
      toast.error('Course title is required')
      return
    }

    if (!courseData.description.trim()) {
      toast.error('Course description is required')
      return
    }

    if (!courseData.subject) {
      toast.error('Subject is required')
      return
    }

    if (!courseData.grade) {
      toast.error('Grade is required')
      return
    }

    try {
      setSubmitting(true)

      const coursePayload = {
        ...courseData,
        duration: calculateTotalDuration()
      }

      let response
      if (isEditing) {
        response = await api.put(`/courses/${id}`, coursePayload)
      } else {
        response = await api.post('/courses', coursePayload)
      }

      if (response.data.success) {
        toast.success(
          `Course ${isEditing ? 'updated' : 'created'} successfully!`
        )
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error saving course:', error)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} course`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <button
              onClick={() => navigate(-1)}
              className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-2'
            >
              <ArrowLeftIcon className='h-5 w-5 mr-1' />
              Back
            </button>
            <h1 className='text-3xl font-bold text-gray-900'>
              {isEditing ? 'Edit Course' : 'Create New Course'}
            </h1>
          </div>
        </div>

        {/* Main Form Area */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          {/* Tabs */}
          <div className='flex border-b border-gray-200'>
            <button
              onClick={() => setCurrentTab('basic')}
              className={`px-6 py-4 text-sm font-medium ${
                currentTab === 'basic'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setCurrentTab('content')}
              className={`px-6 py-4 text-sm font-medium ${
                currentTab === 'content'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Course Content
            </button>
            <button
              onClick={() => setCurrentTab('settings')}
              className={`px-6 py-4 text-sm font-medium ${
                currentTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Course Settings
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information Tab */}
            {currentTab === 'basic' && (
              <div className='p-6'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                  {/* Left Column - Course Details */}
                  <div className='lg:col-span-2 space-y-6'>
                    {/* Course Title */}
                    <div>
                      <label
                        htmlFor='title'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        Course Title <span className='text-red-500'>*</span>
                      </label>
                      <input
                        id='title'
                        name='title'
                        type='text'
                        required
                        value={courseData.title}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                        placeholder='Enter course title'
                      />
                    </div>

                    {/* Course Description */}
                    <div>
                      <label
                        htmlFor='description'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        Description <span className='text-red-500'>*</span>
                      </label>
                      <textarea
                        id='description'
                        name='description'
                        rows='4'
                        required
                        value={courseData.description}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                        placeholder='Enter course description'
                      ></textarea>
                    </div>

                    {/* Subject and Grade */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label
                          htmlFor='subject'
                          className='block text-sm font-medium text-gray-700 mb-1'
                        >
                          Subject <span className='text-red-500'>*</span>
                        </label>
                        <select
                          id='subject'
                          name='subject'
                          required
                          value={courseData.subject}
                          onChange={handleInputChange}
                          className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                        >
                          <option value=''>Select Subject</option>
                          <option value='mathematics'>Mathematics</option>
                          <option value='english'>English</option>
                          <option value='science'>Science</option>
                          <option value='social'>Social Studies</option>
                          <option value='art'>Art</option>
                          <option value='music'>Music</option>
                          <option value='physical-education'>
                            Physical Education
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor='grade'
                          className='block text-sm font-medium text-gray-700 mb-1'
                        >
                          Grade Level <span className='text-red-500'>*</span>
                        </label>
                        <select
                          id='grade'
                          name='grade'
                          required
                          value={courseData.grade}
                          onChange={handleInputChange}
                          className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                        >
                          <option value=''>Select Grade</option>
                          <option value='1'>Grade 1</option>
                          <option value='2'>Grade 2</option>
                          <option value='3'>Grade 3</option>
                          <option value='4'>Grade 4</option>
                          <option value='5'>Grade 5</option>
                          <option value='6'>Grade 6</option>
                        </select>
                      </div>
                    </div>

                    {/* Difficulty Level */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Difficulty Level
                      </label>
                      <div className='flex flex-wrap gap-3'>
                        {['beginner', 'intermediate', 'advanced'].map(level => (
                          <label
                            key={level}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                              courseData.level === level
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type='radio'
                              name='level'
                              value={level}
                              checked={courseData.level === level}
                              onChange={handleInputChange}
                              className='sr-only'
                            />
                            <span className='capitalize'>{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Course Image */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                      Course Image
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg overflow-hidden ${
                        imagePreview
                          ? 'border-transparent'
                          : 'border-gray-300 hover:border-gray-400'
                      } transition-all`}
                    >
                      {uploadingImage && (
                        <div className='absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10'>
                          <div className='text-center'>
                            <LoadingSpinner size='md' />
                            <p className='mt-2 text-sm text-gray-600'>
                              Uploading to Cloudinary...
                            </p>
                          </div>
                        </div>
                      )}

                      {imagePreview ? (
                        <div className='relative group'>
                          <img
                            src={imagePreview || '/placeholder.svg'}
                            alt='Course preview'
                            className='w-full h-64 object-cover'
                          />
                          <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                            <button
                              type='button'
                              onClick={() => fileInputRef.current.click()}
                              className='bg-white p-2 rounded-full shadow-lg'
                              disabled={uploadingImage}
                            >
                              <PencilIcon className='h-5 w-5 text-gray-600' />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className='flex flex-col items-center justify-center p-8 h-64 cursor-pointer'
                          onClick={() => fileInputRef.current.click()}
                        >
                          <PhotoIcon className='h-12 w-12 text-gray-400' />
                          <p className='mt-2 text-sm text-gray-500'>
                            Click to upload course image
                          </p>
                          <p className='text-xs text-gray-400 mt-1'>
                            PNG, JPG or JPEG (max. 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        type='file'
                        ref={fileInputRef}
                        accept='image/*'
                        onChange={handleImageSelect}
                        className='hidden'
                        disabled={uploadingImage}
                      />
                    </div>

                    {courseData.imageUrl && (
                      <p className='mt-2 text-xs text-gray-500 truncate'>
                        Image URL: {courseData.imageUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Course Content Tab */}
            {currentTab === 'content' && (
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-semibold text-gray-800'>
                    Course Units & Lessons
                  </h2>
                  <button
                    type='button'
                    onClick={handleAddUnit}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center'
                  >
                    <PlusIcon className='h-5 w-5 mr-2' />
                    Add Unit
                  </button>
                </div>

                {courseData.units.length === 0 ? (
                  <div className='bg-gray-50 rounded-lg p-8 text-center'>
                    <DocumentTextIcon className='h-12 w-12 mx-auto text-gray-400' />
                    <h3 className='mt-2 text-lg font-medium text-gray-900'>
                      No units yet
                    </h3>
                    <p className='mt-1 text-gray-500'>
                      Start building your course by adding units and lessons
                    </p>
                    <button
                      type='button'
                      onClick={handleAddUnit}
                      className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center'
                    >
                      <PlusIcon className='h-5 w-5 mr-2' />
                      Add Your First Unit
                    </button>
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {courseData.units.map((unit, unitIndex) => (
                      <div
                        key={unitIndex}
                        className='border border-gray-200 rounded-lg overflow-hidden shadow-sm'
                      >
                        {/* Unit Header */}
                        <div
                          className={`bg-gray-50 p-4 flex items-center justify-between ${
                            expandedUnits.includes(unitIndex)
                              ? 'border-b border-gray-200'
                              : ''
                          }`}
                        >
                          <div className='flex items-center'>
                            <span className='w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm'>
                              {unitIndex + 1}
                            </span>
                            <button
                              type='button'
                              onClick={() => toggleUnitExpanded(unitIndex)}
                              className='ml-3 font-medium text-gray-800 flex items-center'
                            >
                              {unit.title}
                              <ChevronIcon
                                expanded={expandedUnits.includes(unitIndex)}
                                className='h-5 w-5 ml-2'
                              />
                            </button>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <button
                              type='button'
                              onClick={() => moveUnit(unitIndex, unitIndex - 1)}
                              disabled={unitIndex === 0}
                              className={`p-1 rounded ${
                                unitIndex === 0
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <ArrowUpIcon className='h-5 w-5' />
                            </button>
                            <button
                              type='button'
                              onClick={() => moveUnit(unitIndex, unitIndex + 1)}
                              disabled={
                                unitIndex === courseData.units.length - 1
                              }
                              className={`p-1 rounded ${
                                unitIndex === courseData.units.length - 1
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <ArrowDownIcon className='h-5 w-5' />
                            </button>
                            <button
                              type='button'
                              onClick={() => handleRemoveUnit(unitIndex)}
                              className='p-1 text-red-600 hover:bg-red-50 rounded'
                            >
                              <TrashIcon className='h-5 w-5' />
                            </button>
                          </div>
                        </div>

                        {/* Unit Content (when expanded) */}
                        {expandedUnits.includes(unitIndex) && (
                          <div className='p-4'>
                            <div className='space-y-4 mb-6'>
                              <div>
                                <label
                                  htmlFor={`unit-${unitIndex}-title`}
                                  className='block text-sm font-medium text-gray-700 mb-1'
                                >
                                  Unit Title
                                </label>
                                <input
                                  id={`unit-${unitIndex}-title`}
                                  type='text'
                                  value={unit.title}
                                  onChange={e =>
                                    handleUnitChange(
                                      unitIndex,
                                      'title',
                                      e.target.value
                                    )
                                  }
                                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor={`unit-${unitIndex}-description`}
                                  className='block text-sm font-medium text-gray-700 mb-1'
                                >
                                  Unit Description
                                </label>
                                <textarea
                                  id={`unit-${unitIndex}-description`}
                                  rows='2'
                                  value={unit.description || ''}
                                  onChange={e =>
                                    handleUnitChange(
                                      unitIndex,
                                      'description',
                                      e.target.value
                                    )
                                  }
                                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                  placeholder='Enter a brief description of this unit'
                                ></textarea>
                              </div>
                            </div>

                            {/* Lessons Section */}
                            <div>
                              <div className='flex items-center justify-between mb-3'>
                                <h4 className='font-medium text-gray-800'>
                                  Lessons
                                </h4>
                                <button
                                  type='button'
                                  onClick={() => handleAddLesson(unitIndex)}
                                  className='px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm font-medium transition-colors flex items-center'
                                >
                                  <PlusIcon className='h-4 w-4 mr-1' />
                                  Add Lesson
                                </button>
                              </div>

                              {unit.lessons && unit.lessons.length > 0 ? (
                                <div className='space-y-3'>
                                  {unit.lessons.map((lesson, lessonIndex) => {
                                    const lessonKey = `${unitIndex}-${lessonIndex}`
                                    const isLessonExpanded =
                                      expandedLessons.includes(lessonKey)

                                    return (
                                      <div
                                        key={lessonIndex}
                                        className='border border-gray-200 rounded-md overflow-hidden bg-white'
                                      >
                                        {/* Lesson Header */}
                                        <div
                                          className={`bg-gray-50 p-3 flex items-center justify-between ${
                                            isLessonExpanded
                                              ? 'border-b border-gray-200'
                                              : ''
                                          }`}
                                        >
                                          <button
                                            type='button'
                                            onClick={() =>
                                              toggleLessonExpanded(
                                                unitIndex,
                                                lessonIndex
                                              )
                                            }
                                            className='font-medium text-gray-700 flex items-center'
                                          >
                                            <DocumentTextIcon className='h-5 w-5 text-gray-500 mr-2' />
                                            <span className='mr-2'>
                                              {unitIndex + 1}.{lessonIndex + 1}{' '}
                                              {lesson.title}
                                            </span>
                                            <ChevronIcon
                                              expanded={isLessonExpanded}
                                              className='h-4 w-4'
                                            />

                                            {lesson.quizzes &&
                                              lesson.quizzes.length > 0 && (
                                                <span className='ml-2 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full'>
                                                  Quiz
                                                </span>
                                              )}
                                          </button>
                                          <div className='flex items-center text-sm'>
                                            <ClockIcon className='h-4 w-4 text-gray-500 mr-1' />
                                            <span className='text-gray-600 mr-4'>
                                              {lesson.duration || 30} min
                                            </span>

                                            <div className='flex items-center space-x-1'>
                                              <button
                                                type='button'
                                                onClick={() =>
                                                  moveLesson(
                                                    unitIndex,
                                                    lessonIndex,
                                                    lessonIndex - 1
                                                  )
                                                }
                                                disabled={lessonIndex === 0}
                                                className={`p-1 rounded ${
                                                  lessonIndex === 0
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-600 hover:bg-gray-200'
                                                }`}
                                              >
                                                <ArrowUpIcon className='h-4 w-4' />
                                              </button>
                                              <button
                                                type='button'
                                                onClick={() =>
                                                  moveLesson(
                                                    unitIndex,
                                                    lessonIndex,
                                                    lessonIndex + 1
                                                  )
                                                }
                                                disabled={
                                                  lessonIndex ===
                                                  unit.lessons.length - 1
                                                }
                                                className={`p-1 rounded ${
                                                  lessonIndex ===
                                                  unit.lessons.length - 1
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-600 hover:bg-gray-200'
                                                }`}
                                              >
                                                <ArrowDownIcon className='h-4 w-4' />
                                              </button>
                                              <button
                                                type='button'
                                                onClick={() =>
                                                  handleRemoveLesson(
                                                    unitIndex,
                                                    lessonIndex
                                                  )
                                                }
                                                className='p-1 text-red-600 hover:bg-red-50 rounded'
                                              >
                                                <TrashIcon className='h-4 w-4' />
                                              </button>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Lesson Content (when expanded) */}
                                        {isLessonExpanded && (
                                          <div className='p-3 space-y-3'>
                                            <div>
                                              <label
                                                htmlFor={`lesson-${unitIndex}-${lessonIndex}-title`}
                                                className='block text-sm font-medium text-gray-700 mb-1'
                                              >
                                                Lesson Title
                                              </label>
                                              <input
                                                id={`lesson-${unitIndex}-${lessonIndex}-title`}
                                                type='text'
                                                value={lesson.title}
                                                onChange={e =>
                                                  handleLessonChange(
                                                    unitIndex,
                                                    lessonIndex,
                                                    'title',
                                                    e.target.value
                                                  )
                                                }
                                                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                              />
                                            </div>
                                            <div>
                                              <label
                                                htmlFor={`lesson-${unitIndex}-${lessonIndex}-content`}
                                                className='block text-sm font-medium text-gray-700 mb-1'
                                              >
                                                Lesson Content
                                              </label>
                                              <textarea
                                                id={`lesson-${unitIndex}-${lessonIndex}-content`}
                                                rows='3'
                                                value={lesson.content || ''}
                                                onChange={e =>
                                                  handleLessonChange(
                                                    unitIndex,
                                                    lessonIndex,
                                                    'content',
                                                    e.target.value
                                                  )
                                                }
                                                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                placeholder='Enter the lesson content'
                                              ></textarea>
                                            </div>
                                            <div>
                                              <label
                                                htmlFor={`lesson-${unitIndex}-${lessonIndex}-duration`}
                                                className='block text-sm font-medium text-gray-700 mb-1'
                                              >
                                                Duration (minutes)
                                              </label>
                                              <input
                                                id={`lesson-${unitIndex}-${lessonIndex}-duration`}
                                                type='number'
                                                min='1'
                                                value={lesson.duration || 30}
                                                onChange={e =>
                                                  handleLessonChange(
                                                    unitIndex,
                                                    lessonIndex,
                                                    'duration',
                                                    Number(e.target.value)
                                                  )
                                                }
                                                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                              />
                                            </div>
                                            <div className='pt-4 mt-4 border-t border-gray-200'>
                                              <div className='flex items-center justify-between mb-3'>
                                                <h5 className='font-medium text-gray-800 flex items-center'>
                                                  <PuzzlePieceIcon className='h-5 w-5 text-indigo-500 mr-1' />
                                                  Quizzes
                                                </h5>
                                                {(!lesson.quizzes ||
                                                  lesson.quizzes.length ===
                                                    0) && (
                                                  <button
                                                    type='button'
                                                    onClick={() =>
                                                      handleAddQuiz(
                                                        unitIndex,
                                                        lessonIndex
                                                      )
                                                    }
                                                    className='px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 text-sm font-medium transition-colors flex items-center'
                                                  >
                                                    <PlusIcon className='h-4 w-4 mr-1' />
                                                    Add Quiz
                                                  </button>
                                                )}
                                              </div>

                                              {lesson.quizzes &&
                                              lesson.quizzes.length > 0 ? (
                                                <div className='space-y-4'>
                                                  {lesson.quizzes.map(
                                                    (quiz, quizIndex) => (
                                                      <div
                                                        key={quizIndex}
                                                        className='border border-indigo-100 rounded-md bg-indigo-50 overflow-hidden'
                                                      >
                                                        <div className='bg-indigo-100 p-3 flex items-center justify-between'>
                                                          <div className='flex items-center'>
                                                            <PuzzlePieceIcon className='h-5 w-5 text-indigo-700 mr-2' />
                                                            <input
                                                              type='text'
                                                              value={quiz.title}
                                                              onChange={e =>
                                                                handleQuizChange(
                                                                  unitIndex,
                                                                  lessonIndex,
                                                                  quizIndex,
                                                                  'title',
                                                                  e.target.value
                                                                )
                                                              }
                                                              className='font-medium bg-transparent border-none focus:ring-0 text-indigo-800 p-0'
                                                              placeholder='Quiz Title'
                                                            />
                                                          </div>
                                                          <button
                                                            type='button'
                                                            onClick={() =>
                                                              handleRemoveQuiz(
                                                                unitIndex,
                                                                lessonIndex,
                                                                quizIndex
                                                              )
                                                            }
                                                            className='p-1 text-red-600 hover:bg-red-50 rounded'
                                                          >
                                                            <TrashIcon className='h-4 w-4' />
                                                          </button>
                                                        </div>

                                                        <div className='p-3'>
                                                          <div className='space-y-3'>
                                                            {quiz.questions.map(
                                                              (
                                                                question,
                                                                questionIndex
                                                              ) => (
                                                                <div
                                                                  key={
                                                                    questionIndex
                                                                  }
                                                                  className='border border-indigo-100 rounded-md bg-white p-3'
                                                                >
                                                                  <div className='flex items-center justify-between mb-2'>
                                                                    <div className='flex items-center'>
                                                                      <QuestionMarkCircleIcon className='h-5 w-5 text-gray-500 mr-2' />
                                                                      <span className='text-sm font-medium'>
                                                                        Question{' '}
                                                                        {questionIndex +
                                                                          1}
                                                                      </span>
                                                                    </div>
                                                                    <button
                                                                      type='button'
                                                                      onClick={() =>
                                                                        handleRemoveQuestion(
                                                                          unitIndex,
                                                                          lessonIndex,
                                                                          quizIndex,
                                                                          questionIndex
                                                                        )
                                                                      }
                                                                      className='p-1 text-red-600 hover:bg-red-50 rounded'
                                                                    >
                                                                      <TrashIcon className='h-4 w-4' />
                                                                    </button>
                                                                  </div>

                                                                  <div className='grid grid-cols-1 gap-3'>
                                                                    <div>
                                                                      <label className='block text-xs font-medium text-gray-700 mb-1'>
                                                                        Question
                                                                        Text
                                                                      </label>
                                                                      <input
                                                                        type='text'
                                                                        value={
                                                                          question.questionText
                                                                        }
                                                                        onChange={e =>
                                                                          handleQuestionChange(
                                                                            unitIndex,
                                                                            lessonIndex,
                                                                            quizIndex,
                                                                            questionIndex,
                                                                            'questionText',
                                                                            e
                                                                              .target
                                                                              .value
                                                                          )
                                                                        }
                                                                        className='w-full p-2 border border-gray-300 text-sm rounded-md focus:ring-1 focus:ring-blue-500'
                                                                        placeholder='Enter question'
                                                                      />
                                                                    </div>

                                                                    <div>
                                                                      <label className='block text-xs font-medium text-gray-700 mb-1'>
                                                                        Question
                                                                        Type
                                                                      </label>
                                                                      <select
                                                                        value={
                                                                          question.questionType
                                                                        }
                                                                        onChange={e =>
                                                                          handleQuestionChange(
                                                                            unitIndex,
                                                                            lessonIndex,
                                                                            quizIndex,
                                                                            questionIndex,
                                                                            'questionType',
                                                                            e
                                                                              .target
                                                                              .value
                                                                          )
                                                                        }
                                                                        className='w-full p-2 border border-gray-300 text-sm rounded-md focus:ring-1 focus:ring-blue-500'
                                                                      >
                                                                        <option value='multiple-choice'>
                                                                          Multiple
                                                                          Choice
                                                                        </option>
                                                                        <option value='true-false'>
                                                                          True/False
                                                                        </option>
                                                                      </select>
                                                                    </div>

                                                                    <div>
                                                                      <label className='block text-xs font-medium text-gray-700 mb-1'>
                                                                        Points
                                                                      </label>
                                                                      <input
                                                                        type='number'
                                                                        min='1'
                                                                        value={
                                                                          question.points ||
                                                                          5
                                                                        }
                                                                        onChange={e =>
                                                                          handleQuestionChange(
                                                                            unitIndex,
                                                                            lessonIndex,
                                                                            quizIndex,
                                                                            questionIndex,
                                                                            'points',
                                                                            Number(
                                                                              e
                                                                                .target
                                                                                .value
                                                                            )
                                                                          )
                                                                        }
                                                                        className='w-20 p-2 border border-gray-300 text-sm rounded-md focus:ring-1 focus:ring-blue-500'
                                                                      />
                                                                    </div>

                                                                    <div>
                                                                      <div className='flex items-center justify-between mb-1'>
                                                                        <label className='block text-xs font-medium text-gray-700'>
                                                                          Options
                                                                        </label>
                                                                        <button
                                                                          type='button'
                                                                          onClick={() =>
                                                                            handleAddOption(
                                                                              unitIndex,
                                                                              lessonIndex,
                                                                              quizIndex,
                                                                              questionIndex
                                                                            )
                                                                          }
                                                                          className='text-xs text-blue-600 hover:text-blue-800'
                                                                        >
                                                                          + Add
                                                                          Option
                                                                        </button>
                                                                      </div>

                                                                      <div className='space-y-2'>
                                                                        {question.options.map(
                                                                          (
                                                                            option,
                                                                            optionIndex
                                                                          ) => (
                                                                            <div
                                                                              key={
                                                                                optionIndex
                                                                              }
                                                                              className='flex items-center'
                                                                            >
                                                                              <input
                                                                                type='radio'
                                                                                checked={
                                                                                  option.isCorrect
                                                                                }
                                                                                onChange={e =>
                                                                                  handleOptionChange(
                                                                                    unitIndex,
                                                                                    lessonIndex,
                                                                                    quizIndex,
                                                                                    questionIndex,
                                                                                    optionIndex,
                                                                                    'isCorrect',
                                                                                    e
                                                                                      .target
                                                                                      .checked
                                                                                  )
                                                                                }
                                                                                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                                                                              />
                                                                              <input
                                                                                type='text'
                                                                                value={
                                                                                  option.text
                                                                                }
                                                                                onChange={e =>
                                                                                  handleOptionChange(
                                                                                    unitIndex,
                                                                                    lessonIndex,
                                                                                    quizIndex,
                                                                                    questionIndex,
                                                                                    optionIndex,
                                                                                    'text',
                                                                                    e
                                                                                      .target
                                                                                      .value
                                                                                  )
                                                                                }
                                                                                className='ml-2 flex-1 p-1.5 border border-gray-300 text-sm rounded-md focus:ring-1 focus:ring-blue-500'
                                                                                placeholder={`Option ${
                                                                                  optionIndex +
                                                                                  1
                                                                                }`}
                                                                              />
                                                                              <button
                                                                                type='button'
                                                                                onClick={() =>
                                                                                  handleRemoveOption(
                                                                                    unitIndex,
                                                                                    lessonIndex,
                                                                                    quizIndex,
                                                                                    questionIndex,
                                                                                    optionIndex
                                                                                  )
                                                                                }
                                                                                className='ml-2 p-1 text-red-600 hover:bg-red-50 rounded'
                                                                                disabled={
                                                                                  question
                                                                                    .options
                                                                                    .length <=
                                                                                  2
                                                                                }
                                                                              >
                                                                                <TrashIcon className='h-4 w-4' />
                                                                              </button>
                                                                            </div>
                                                                          )
                                                                        )}
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              )
                                                            )}

                                                            <button
                                                              type='button'
                                                              onClick={() =>
                                                                handleAddQuestion(
                                                                  unitIndex,
                                                                  lessonIndex,
                                                                  quizIndex
                                                                )
                                                              }
                                                              className='w-full py-2 border border-dashed border-indigo-300 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors text-sm'
                                                            >
                                                              + Add New Question
                                                            </button>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              ) : (
                                                <div className='border border-gray-200 border-dashed rounded-md p-4 text-center'>
                                                  <p className='text-gray-500 text-sm'>
                                                    No quizzes added for this
                                                    lesson yet
                                                  </p>
                                                  <button
                                                    type='button'
                                                    onClick={() =>
                                                      handleAddQuiz(
                                                        unitIndex,
                                                        lessonIndex
                                                      )
                                                    }
                                                    className='mt-2 text-indigo-600 text-sm font-medium inline-flex items-center'
                                                  >
                                                    <PlusIcon className='h-4 w-4 mr-1' />
                                                    Add Quiz
                                                  </button>
                                                </div>
                                              )}
                                            </div>

                                            {/* Resources Section */}
                                            <div className='pt-4 mt-4 border-t border-gray-200'>
                                              <div className='flex items-center justify-between mb-3'>
                                                <h5 className='font-medium text-gray-800 flex items-center'>
                                                  <DocumentPlusIcon className='h-5 w-5 text-green-500 mr-1' />
                                                  Resources
                                                </h5>
                                                <button
                                                  type='button'
                                                  onClick={() =>
                                                    handleAddResource(
                                                      unitIndex,
                                                      lessonIndex
                                                    )
                                                  }
                                                  className='px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm font-medium transition-colors flex items-center'
                                                >
                                                  <PlusIcon className='h-4 w-4 mr-1' />
                                                  Add Resource
                                                </button>
                                              </div>

                                              {lesson.resources &&
                                              lesson.resources.length > 0 ? (
                                                <div className='space-y-3'>
                                                  {lesson.resources.map(
                                                    (
                                                      resource,
                                                      resourceIndex
                                                    ) => (
                                                      <div
                                                        key={resourceIndex}
                                                        className='border border-green-100 rounded-md bg-white p-3'
                                                      >
                                                        <div className='flex items-center justify-between mb-2'>
                                                          <div className='flex items-center'>
                                                            {resource.type ===
                                                              'video' && (
                                                              <PlayIcon className='h-5 w-5 text-red-500 mr-2' />
                                                            )}
                                                            {resource.type ===
                                                              'pdf' && (
                                                              <DocumentTextIcon className='h-5 w-5 text-red-500 mr-2' />
                                                            )}
                                                            {resource.type ===
                                                              'image' && (
                                                              <PhotoIcon className='h-5 w-5 text-blue-500 mr-2' />
                                                            )}
                                                            {resource.type ===
                                                              'link' && (
                                                              <LinkIcon className='h-5 w-5 text-purple-500 mr-2' />
                                                            )}
                                                            {resource.type ===
                                                              'text' && (
                                                              <DocumentTextIcon className='h-5 w-5 text-gray-500 mr-2' />
                                                            )}
                                                            <span className='text-sm font-medium'>
                                                              Resource{' '}
                                                              {resourceIndex +
                                                                1}
                                                            </span>
                                                          </div>
                                                          <button
                                                            type='button'
                                                            onClick={() =>
                                                              handleRemoveResource(
                                                                unitIndex,
                                                                lessonIndex,
                                                                resourceIndex
                                                              )
                                                            }
                                                            className='p-1 text-red-600 hover:bg-red-50 rounded'
                                                          >
                                                            <TrashIcon className='h-4 w-4' />
                                                          </button>
                                                        </div>

                                                        <div className='grid grid-cols-1 gap-3'>
                                                          <div>
                                                            <label className='block text-xs font-medium text-gray-700 mb-1'>
                                                              Resource Type
                                                            </label>
                                                            <select
                                                              value={
                                                                resource.type
                                                              }
                                                              onChange={e =>
                                                                handleResourceChange(
                                                                  unitIndex,
                                                                  lessonIndex,
                                                                  resourceIndex,
                                                                  'type',
                                                                  e.target.value
                                                                )
                                                              }
                                                              className='w-full p-2 border border-gray-300 text-sm rounded-md focus:ring-1 focus:ring-blue-500'
                                                            >
                                                              <option value='video'>
                                                                Video
                                                              </option>
                                                              <option value='pdf'>
                                                                PDF Document
                                                              </option>
                                                              <option value='image'>
                                                                Image
                                                              </option>
                                                              <option value='link'>
                                                                External Link
                                                              </option>
                                                              <option value='text'>
                                                                Text Content
                                                              </option>
                                                            </select>
                                                          </div>

                                                          {(resource.type ===
                                                            'video' ||
                                                            resource.type ===
                                                              'pdf' ||
                                                            resource.type ===
                                                              'image') && (
                                                            <div>
                                                              <label className='block text-xs font-medium text-gray-700 mb-1'>
                                                                Upload File
                                                              </label>
                                                              <div className='flex items-center'>
                                                                <input
                                                                  type='file'
                                                                  accept={
                                                                    resource.type ===
                                                                    'video'
                                                                      ? 'video/*'
                                                                      : resource.type ===
                                                                        'pdf'
                                                                      ? 'application/pdf'
                                                                      : resource.type ===
                                                                        'image'
                                                                      ? 'image/*'
                                                                      : '*/*'
                                                                  }
                                                                  onChange={e => {
                                                                    if (
                                                                      e.target
                                                                        .files &&
                                                                      e.target
                                                                        .files[0]
                                                                    ) {
                                                                      handleResourceFileUpload(
                                                                        unitIndex,
                                                                        lessonIndex,
                                                                        resourceIndex,
                                                                        e.target
                                                                          .files[0]
                                                                      )
                                                                    }
                                                                  }}
                                                                  className='text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                                                                />
                                                                {resource.uploading && (
                                                                  <div className='ml-2'>
                                                                    <svg
                                                                      className='animate-spin h-5 w-5 text-blue-600'
                                                                      xmlns='http://www.w3.org/2000/svg'
                                                                      fill='none'
                                                                      viewBox='0 0 24 24'
                                                                    >
                                                                      <circle
                                                                        className='opacity-25'
                                                                        cx='12'
                                                                        cy='12'
                                                                        r='10'
                                                                        stroke='currentColor'
                                                                        strokeWidth='4'
                                                                      ></circle>
                                                                      <path
                                                                        className='opacity-75'
                                                                        fill='currentColor'
                                                                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                                                      ></path>
                                                                    </svg>
                                                                  </div>
                                                                )}
                                                              </div>
                                                            </div>
                                                          )}

                                                          <div>
                                                            <label className='block text-xs font-medium text-gray-700 mb-1'>
                                                              {resource.type ===
                                                              'link'
                                                                ? 'URL'
                                                                : 'Resource URL'}
                                                            </label>
                                                            <input
                                                              type='text'
                                                              value={
                                                                resource.url ||
                                                                ''
                                                              }
                                                              onChange={e =>
                                                                handleResourceChange(
                                                                  unitIndex,
                                                                  lessonIndex,
                                                                  resourceIndex,
                                                                  'url',
                                                                  e.target.value
                                                                )
                                                              }
                                                              className='w-full p-2 border border-gray-300 text-sm rounded-md focus:ring-1 focus:ring-blue-500'
                                                              placeholder={
                                                                resource.type ===
                                                                'link'
                                                                  ? 'https://example.com'
                                                                  : 'Resource URL (auto-filled on upload)'
                                                              }
                                                              readOnly={
                                                                resource.type !==
                                                                  'link' &&
                                                                resource.type !==
                                                                  'text'
                                                              }
                                                            />
                                                          </div>

                                                          {resource.type ===
                                                            'text' && (
                                                            <div>
                                                              <label className='block text-xs font-medium text-gray-700 mb-1'>
                                                                Content
                                                              </label>
                                                              <textarea
                                                                rows='3'
                                                                value={
                                                                  resource.content ||
                                                                  ''
                                                                }
                                                                onChange={e =>
                                                                  handleResourceChange(
                                                                    unitIndex,
                                                                    lessonIndex,
                                                                    resourceIndex,
                                                                    'content',
                                                                    e.target
                                                                      .value
                                                                  )
                                                                }
                                                                className='w-full p-2 border border-gray-300 text-sm rounded-md focus:ring-1 focus:ring-blue-500'
                                                                placeholder='Enter text content for this resource'
                                                              ></textarea>
                                                            </div>
                                                          )}

                                                          {resource.url &&
                                                            (resource.type ===
                                                              'image' ||
                                                              resource.type ===
                                                                'pdf' ||
                                                              resource.type ===
                                                                'video') && (
                                                              <div className='mt-2'>
                                                                <label className='block text-xs font-medium text-gray-700 mb-1'>
                                                                  Preview
                                                                </label>
                                                                {resource.type ===
                                                                  'image' && (
                                                                  <img
                                                                    src={
                                                                      resource.url ||
                                                                      '/placeholder.svg'
                                                                    }
                                                                    alt='Resource preview'
                                                                    className='max-h-40 rounded-md border border-gray-200'
                                                                  />
                                                                )}
                                                                {resource.type ===
                                                                  'pdf' && (
                                                                  <div className='flex items-center text-sm text-blue-600'>
                                                                    <DocumentTextIcon className='h-5 w-5 mr-1' />
                                                                    <a
                                                                      href={
                                                                        resource.url
                                                                      }
                                                                      target='_blank'
                                                                      rel='noopener noreferrer'
                                                                    >
                                                                      View PDF
                                                                      Document
                                                                    </a>
                                                                  </div>
                                                                )}
                                                                {resource.type ===
                                                                  'video' && (
                                                                  <div className='flex items-center text-sm text-blue-600'>
                                                                    <PlayIcon className='h-5 w-5 mr-1' />
                                                                    <a
                                                                      href={
                                                                        resource.url
                                                                      }
                                                                      target='_blank'
                                                                      rel='noopener noreferrer'
                                                                    >
                                                                      View Video
                                                                    </a>
                                                                  </div>
                                                                )}
                                                              </div>
                                                            )}
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              ) : (
                                                <div className='border border-gray-200 border-dashed rounded-md p-4 text-center'>
                                                  <p className='text-gray-500 text-sm'>
                                                    No resources added for this
                                                    lesson yet
                                                  </p>
                                                  <button
                                                    type='button'
                                                    onClick={() =>
                                                      handleAddResource(
                                                        unitIndex,
                                                        lessonIndex
                                                      )
                                                    }
                                                    className='mt-2 text-green-600 text-sm font-medium inline-flex items-center'
                                                  >
                                                    <PlusIcon className='h-4 w-4 mr-1' />
                                                    Add Resource
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              ) : (
                                <div className='bg-gray-50 border border-gray-200 rounded-md p-4 text-center'>
                                  <p className='text-gray-500 text-sm'>
                                    No lessons added to this unit yet
                                  </p>
                                  <button
                                    type='button'
                                    onClick={() => handleAddLesson(unitIndex)}
                                    className='mt-2 text-blue-600 text-sm font-medium inline-flex items-center'
                                  >
                                    <PlusIcon className='h-4 w-4 mr-1' />
                                    Add Your First Lesson
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Course Settings Tab */}
            {currentTab === 'settings' && (
              <div className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  {/* Gamification Settings */}
                  <div>
                    <h3 className='text-lg font-medium text-gray-800 mb-4'>
                      Gamification Settings
                    </h3>
                    <div className='space-y-4'>
                      <div className='flex items-start'>
                        <div className='flex items-center h-5'>
                          <input
                            id='hasPersonalization'
                            name='hasPersonalization'
                            type='checkbox'
                            checked={
                              courseData.gamification?.hasPersonalization ||
                              false
                            }
                            onChange={handleGamificationChange}
                            className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                          />
                        </div>
                        <div className='ml-3'>
                          <label
                            htmlFor='hasPersonalization'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Enable Personalized Learning
                          </label>
                          <p className='text-gray-500 text-xs mt-1'>
                            Adapt content based on student's learning pace and
                            style
                          </p>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor='pointsToEarn'
                          className='block text-sm font-medium text-gray-700 mb-1'
                        >
                          Points to Earn
                        </label>
                        <input
                          id='pointsToEarn'
                          name='pointsToEarn'
                          type='number'
                          min='0'
                          value={courseData.gamification?.pointsToEarn || 0}
                          onChange={handleGamificationChange}
                          className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                        <p className='text-gray-500 text-xs mt-1'>
                          Points awarded to students upon course completion
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Course Summary */}
                  <div>
                    <h3 className='text-lg font-medium text-gray-800 mb-4'>
                      Course Summary
                    </h3>
                    <div className='bg-gray-50 rounded-lg p-4'>
                      <div className='space-y-3'>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Total Units:</span>
                          <span className='font-medium'>
                            {courseData.units.length}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Total Lessons:</span>
                          <span className='font-medium'>
                            {courseData.units.reduce(
                              (total, unit) =>
                                total + (unit.lessons?.length || 0),
                              0
                            )}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>
                            Estimated Duration:
                          </span>
                          <span className='font-medium'>
                            {Math.ceil(calculateTotalDuration() / 60)} hours
                          </span>
                        </div>
                        <div className='pt-2 mt-2 border-t border-gray-200'>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-600'>
                              Progress Tracking:
                            </span>
                            <span className='text-green-600 inline-flex items-center'>
                              <CheckCircleIcon className='h-4 w-4 mr-1' />
                              Enabled
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Controls */}
            <div className='bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between'>
              <button
                type='button'
                onClick={() => navigate('/dashboard')}
                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors'
              >
                Cancel
              </button>
              <div className='flex space-x-3'>
                {currentTab === 'content' && (
                  <button
                    type='button'
                    onClick={handleAddUnit}
                    className='px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center'
                  >
                    <PlusIcon className='h-5 w-5 mr-2' />
                    Add Unit
                  </button>
                )}
                <button
                  type='submit'
                  disabled={submitting}
                  className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-70'
                >
                  {submitting ? (
                    <>
                      <svg
                        className='animate-spin h-5 w-5 mr-2 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className='h-5 w-5 mr-2' />
                      {isEditing ? 'Update Course' : 'Create Course'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Helper component for chevron icon
const ChevronIcon = ({ expanded, className }) => {
  return expanded ? (
    <MinusIcon className={className} />
  ) : (
    <PlusIcon className={className} />
  )
}

export default CourseForm
