'use client';

import { useDroppable } from '@dnd-kit/core';
import Card from '@/components/recruiter/Card';

export default function Column({ column }) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const getColumnColor = (columnId) => {
    switch (columnId) {
      case 'applied':
        return 'border-blue-200 bg-blue-50';
      case 'screening':
        return 'border-yellow-200 bg-yellow-50';
      case 'interview':
        return 'border-purple-200 bg-purple-50';
      case 'offer':
        return 'border-green-200 bg-green-50';
      case 'hired':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'drag-over' : ''} ${getColumnColor(column.id)}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{column.title}</h2>
          <p className="text-sm text-gray-500">Stage {column.id === 'applied' ? '1' : column.id === 'screening' ? '2' : column.id === 'interview' ? '3' : column.id === 'offer' ? '4' : '5'}</p>
        </div>
        <span className="bg-white text-gray-700 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
          {column.cards.length}
        </span>
      </div>
      
      <div className="space-y-4 flex-1 min-h-[400px]">
        {column.cards.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            No candidates in this stage
          </div>
        ) : (
          column.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))
        )}
      </div>
    </div>
  );
}
