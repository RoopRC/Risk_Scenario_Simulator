import React, { useEffect } from 'react';

const NotificationCenter = ({ notifications = [] }) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-3 max-w-md">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`
            p-4 rounded-lg shadow-lg backdrop-blur-sm border animate-slide-in-right
            ${notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-900'
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : notification.type === 'warning'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
            }
          `}
        >
          <div className="flex items-start gap-3">
            {notification.type === 'success' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mt-0.5">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
              </svg>
            )}
            {notification.type === 'error' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mt-0.5">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            )}
            {notification.type === 'warning' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mt-0.5">
                <path d="M13 13h-2v-4h2v4zm0 4h-2v-2h2v2zm4.61-7.41L6.41 2h-.82L16.18 15.6zm0 0L6.41 2h-.82L16.18 15.6z" />
              </svg>
            )}
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">{notification.title}</p>
              <p className="text-xs opacity-90">{notification.message}</p>
            </div>
            {notification.action && (
              <button
                onClick={notification.action.callback}
                className="text-xs font-semibold mt-2 hover:underline"
              >
                {notification.action.label}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
