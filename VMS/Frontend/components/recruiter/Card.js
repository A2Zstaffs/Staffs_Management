'use client';

import { useDraggable } from '@dnd-kit/core';

export default function Card({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: card.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`kanban-card ${isDragging ? 'dragging' : ''} bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:border-gray-300`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
          {card.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityClass(card.priority)} flex-shrink-0`}>
          {card.priority}
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-sm font-medium text-gray-700">{card.company}</p>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-xs text-gray-500">{card.location}</p>
        </div>
      </div>

      {card.salary && (
        <div className="mb-3 p-2 bg-green-50 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-green-700">{card.salary}</p>
            <p className="text-xs text-green-600">{card.experience}</p>
          </div>
        </div>
      )}

      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {card.skills.slice(0, 2).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
          {card.skills.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{card.skills.length - 2}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span>Applied: {new Date(card.appliedDate).toLocaleDateString()}</span>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
          <span>Active</span>
        </div>
      </div>
    </div>
  );
}
