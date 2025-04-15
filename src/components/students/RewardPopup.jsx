// RewardPopup.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const RewardPopup = ({ reward, onClose, points }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    if (reward) {
      // If reward is an array, use it directly
      if (Array.isArray(reward)) {
        setRewards(reward);
      } else {
        // If single reward, wrap in array
        setRewards([reward]);
      }
      setCurrentIndex(0);
    }
  }, [reward]);

  const handleNext = () => {
    if (currentIndex < rewards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!reward || rewards.length === 0) return null;

  const currentReward = rewards[currentIndex];

  return (
    <Transition appear show={true} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900"
                  >
                    Congratulations!
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-lg text-gray-600">
                      You've earned a reward!
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <img
                      src={currentReward.imageUrl}
                      alt={currentReward.name}
                      className="h-32 w-32 object-contain"
                    />
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {currentReward.name}
                    </h4>
                    <p className="mt-2 text-gray-600">
                      {currentReward.description}
                    </p>
                    {points > 0 && (
                      <p className="mt-2 text-lg font-medium text-primary-600">
                        +{points} points
                      </p>
                    )}
                  </div>

                  {rewards.length > 1 && (
                    <div className="mt-6 flex justify-between items-center">
                      <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`p-2 rounded-full ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <ArrowLeftIcon className="h-5 w-5" />
                      </button>
                      <span className="text-sm text-gray-500">
                        {currentIndex + 1} of {rewards.length}
                      </span>
                      <button
                        onClick={handleNext}
                        className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
                      >
                        {currentIndex === rewards.length - 1 ? (
                          'Close'
                        ) : (
                          <ArrowRightIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  )}

                  {rewards.length === 1 && (
                    <div className="mt-6">
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={onClose}
                      >
                        Continue Learning
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RewardPopup;