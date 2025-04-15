import React from 'react';
import { TrophyIcon, StarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const StudentRewards = ({ rewards, points, level }) => {
  const navigate = useNavigate();
  
  // Group rewards by type
  const groupedRewards = rewards?.reduce((acc, reward) => {
    const type = reward.type || 'badge';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(reward);
    return acc;
  }, {});

  const getRewardIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'badge':
        return <ShieldCheckIcon className="h-8 w-8 text-purple-500" />;
      case 'trophy':
        return <TrophyIcon className="h-8 w-8 text-amber-500" />;
      case 'certificate':
        return <StarIcon className="h-8 w-8 text-emerald-500" />;
      default:
        return <StarIcon className="h-8 w-8 text-primary-500" />;
    }
  };

  const getRewardColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'bg-neutral-100 border-neutral-200';
      case 'uncommon':
        return 'bg-green-50 border-green-200';
      case 'rare':
        return 'bg-blue-50 border-blue-200';
      case 'epic':
        return 'bg-purple-50 border-purple-200';
      case 'legendary':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Points & Level Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-neutral-800">Your Progress</h3>
          <div className="flex items-center">
            <TrophyIcon className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-sm font-medium text-neutral-700">{points || 0} Points</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-neutral-700">Level {level || 1}</span>
            <span className="text-sm font-medium text-neutral-700">
              Level {(level || 1) + 1}
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${(points % 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {100 - (points % 100)} more points until level {(level || 1) + 1}
          </p>
        </div>
      </div>
      
      {/* Rewards Display */}
      {groupedRewards && Object.keys(groupedRewards).length > 0 ? (
        Object.entries(groupedRewards).map(([type, rewardsList]) => (
          <div key={type} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <h3 className="font-semibold text-lg text-neutral-800 mb-4 capitalize">
              {type === 'badge' ? 'Badges' : type === 'trophy' ? 'Trophies' : type + 's'}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rewardsList.map((reward) => (
                <div 
                  key={reward._id} 
                  className={`flex flex-col items-center p-4 rounded-lg border ${getRewardColor(reward.rarity)}`}
                >
                  {reward.imageUrl ? (
                    <img 
                      src={reward.imageUrl} 
                      alt={reward.name} 
                      className="h-16 w-16 object-contain mb-3 mix-blend-multiply"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-badge.png";
                      }}
                    />
                  ) : (
                    getRewardIcon(type)
                  )}
                  <h4 className="font-medium text-center text-sm mt-2">{reward.name}</h4>
                  {reward.rarity && (
                    <span className="text-xs text-neutral-500 mt-1 capitalize">{reward.rarity}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 text-center">
          <div className="flex justify-center mb-4">
            <TrophyIcon className="h-12 w-12 text-neutral-300" />
          </div>
          <h3 className="font-medium text-neutral-700 mb-2">No Rewards Yet</h3>
          <p className="text-sm text-neutral-500">
            Complete courses and quizzes to earn badges, trophies, and more!
          </p>
          <button 
            onClick={() => navigate('/courses')}
            className="btn-primary mt-4"
          >
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentRewards;