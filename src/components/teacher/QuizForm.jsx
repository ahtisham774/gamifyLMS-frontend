import React, { useState } from 'react';
import { 
  PlusIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const QuizForm = ({ quiz = null, onChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [quizTitle, setQuizTitle] = useState(quiz?.title || '');
  const [questions, setQuestions] = useState(quiz?.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'multiple-choice',
    options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
    correctAnswer: '',
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);

  const handleAddQuiz = () => {
    if (!quizTitle.trim()) {
      toast.error('Quiz title is required');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const newQuiz = {
      title: quizTitle,
      questions
    };

    onChange(newQuiz);
    toast.success('Quiz saved successfully');
    setShowForm(false);
  };

  const handleAddQuestion = () => {
    // Validate question
    if (!currentQuestion.questionText.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (currentQuestion.questionType === 'multiple-choice') {
      // Check if at least one option is marked correct
      const hasCorrectAnswer = currentQuestion.options.some(o => o.isCorrect);
      if (!hasCorrectAnswer) {
        toast.error('Please mark at least one option as correct');
        return;
      }

      // Check if all options have text
      const emptyOptions = currentQuestion.options.filter(o => !o.text.trim());
      if (emptyOptions.length > 0) {
        toast.error('All options must have text');
        return;
      }
    } else if (currentQuestion.questionType === 'true-false') {
      if (!currentQuestion.correctAnswer) {
        toast.error('Please select the correct answer');
        return;
      }
    }

    // Add or update question
    if (editingQuestionIndex >= 0) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = {...currentQuestion, id: updatedQuestions[editingQuestionIndex].id};
      setQuestions(updatedQuestions);
      toast.success('Question updated');
    } else {
      // Add new question
      setQuestions([...questions, {...currentQuestion, id: Date.now().toString()}]);
      toast.success('Question added');
    }

    // Reset form
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
      correctAnswer: '',
    });
    setEditingQuestionIndex(-1);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    toast.success('Question removed');
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestion({...questions[index]});
    setEditingQuestionIndex(index);
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = {...updatedOptions[index], [field]: value};
    
    // If marking as correct in single-choice mode, unmark others
    if (field === 'isCorrect' && value === true) {
      updatedOptions.forEach((option, i) => {
        if (i !== index) {
          updatedOptions[i] = {...updatedOptions[i], isCorrect: false};
        }
      });
    }
    
    setCurrentQuestion({...currentQuestion, options: updatedOptions});
  };

  const handleAddOption = () => {
    if (currentQuestion.options.length >= 5) {
      toast.error('Maximum 5 options allowed');
      return;
    }
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: '', isCorrect: false }]
    });
  };

  const handleRemoveOption = (index) => {
    if (currentQuestion.options.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    const updatedOptions = [...currentQuestion.options];
    updatedOptions.splice(index, 1);
    setCurrentQuestion({...currentQuestion, options: updatedOptions});
  };

  return (
    <div className="mt-6 border border-indigo-100 rounded-lg p-4 bg-indigo-50">
      <h3 className="text-lg font-medium text-indigo-900 mb-4">Lesson Quiz</h3>
      
      {!showForm && !quiz ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Quiz
        </button>
      ) : (
        <div className="bg-white p-4 rounded-md border border-indigo-200">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title *
              </label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter quiz title"
                required
              />
            </div>

            {/* Questions List */}
            {questions.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-gray-700">Questions:</h4>
                {questions.map((question, index) => (
                  <div key={question.id || index} className="p-3 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{question.questionText}</p>
                      <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                        {question.questionType === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => handleEditQuestion(index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Form */}
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <h4 className="font-medium text-gray-800 mb-3">
                {editingQuestionIndex >= 0 ? 'Edit Question' : 'Add New Question'}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text *
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.questionText}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter question text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Type
                  </label>
                  <div className="flex space-x-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={currentQuestion.questionType === 'multiple-choice'}
                        onChange={() => setCurrentQuestion({
                          ...currentQuestion, 
                          questionType: 'multiple-choice',
                          options: currentQuestion.options.length < 2 ? 
                            [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] : 
                            currentQuestion.options,
                          correctAnswer: ''
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Multiple Choice</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={currentQuestion.questionType === 'true-false'}
                        onChange={() => setCurrentQuestion({
                          ...currentQuestion, 
                          questionType: 'true-false',
                          options: [],
                          correctAnswer: ''
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">True/False</span>
                    </label>
                  </div>
                </div>

                {currentQuestion.questionType === 'multiple-choice' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Options
                      </label>
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-xs flex items-center text-indigo-600 hover:text-indigo-800"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Option
                      </button>
                    </div>
                    
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={`Option ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          disabled={currentQuestion.options.length <= 2}
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 mt-1">Check the box next to the correct answer(s).</p>
                  </div>
                )}

                {currentQuestion.questionType === 'true-false' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={currentQuestion.correctAnswer === 'True'}
                          onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: 'True'})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">True</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={currentQuestion.correctAnswer === 'False'}
                          onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: 'False'})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">False</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    {editingQuestionIndex >= 0 ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        Update Question
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Add Question
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  onChange(null);
                }}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddQuiz}
                disabled={!quizTitle || questions.length === 0}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center ${
                  !quizTitle || questions.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-700'
                }`}
              >
                <CheckCircleIcon className="h-5 w-5 mr-1" />
                Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizForm;