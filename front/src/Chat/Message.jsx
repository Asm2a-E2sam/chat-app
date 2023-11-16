import React from 'react';

const Message = ({ text, sender, timestamp, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-sm rounded-lg overflow-hidden ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${
          isCurrentUser ? 'ml-auto' : 'mr-auto'
        }`}
      >
        <div className="px-4 py-2">
          <p className="text-sm">{text}</p>
        </div>
        <div className="px-4 py-2 flex items-center justify-between bg-gray-300">
          <p className="text-xs">{sender}</p>
          <p className="text-xs">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
