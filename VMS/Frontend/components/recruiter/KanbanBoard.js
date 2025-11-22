'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { initialBoardData } from '@/lib/data';
import Column from './Column';
import Card from '@/components/recruiter/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../contexts/DashboardContext';

export default function KanbanBoard({ dashboardData, userRole }) {
  const { user } = useAuth();
  const { updateApplicationStatus } = useDashboard();
  const [board, setBoard] = useState(initialBoardData);
  const [activeCard, setActiveCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const columnsToShow = 3; // Number of columns visible at once

  // Update board data when dashboard data changes
  useEffect(() => {
    if (dashboardData) {
      // Transform dashboard data to board format based on user role
      let transformedBoard = { ...initialBoardData };
      
      if (userRole === 'recruiter' && dashboardData.submittedCandidates) {
        // Transform submitted candidates to cards
        const cards = dashboardData.submittedCandidates.map(candidate => ({
          id: candidate._id,
          title: candidate.candidate?.fullName || 'Unknown Candidate',
          company: candidate.job?.title || 'Unknown Job',
          status: candidate.status,
          description: `Applied via ${candidate.appliedVia}`,
          date: new Date(candidate.createdAt).toLocaleDateString(),
          tags: candidate.candidate?.skills || []
        }));
        
        // Group cards by status
        transformedBoard.columns = transformedBoard.columns.map(column => ({
          ...column,
          cards: cards.filter(card => card.status === column.id)
        }));
      } else if (userRole === 'client' && dashboardData.applications) {
        // Transform applications to cards for client view
        const cards = dashboardData.applications.map(application => ({
          id: application._id,
          title: application.candidate?.fullName || 'Unknown Candidate',
          company: application.job?.title || 'Unknown Job',
          status: application.status,
          description: `Applied via ${application.appliedVia}`,
          date: new Date(application.createdAt).toLocaleDateString(),
          tags: application.candidate?.skills || []
        }));
        
        // Group cards by status
        transformedBoard.columns = transformedBoard.columns.map(column => ({
          ...column,
          cards: cards.filter(card => card.status === column.id)
        }));
      }
      
      setBoard(transformedBoard);
    }
  }, [dashboardData, userRole]);

  const handleDragStart = (event) => {
    const { active } = event;
    const card = findCardById(active.id);
    setActiveCard(card);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const cardId = active.id;
    const newColumnId = over.id;

    // Find the card and its current column
    const { card, sourceColumn } = findCardAndColumn(cardId);
    if (!card || !sourceColumn) return;

    // If dropped in the same column, do nothing
    if (sourceColumn.id === newColumnId) return;

    // Update the board state immediately for UI responsiveness
    setBoard(prevBoard => {
      const newBoard = { ...prevBoard };
      const newColumns = [...newBoard.columns];

      // Remove card from source column
      const sourceColumnIndex = newColumns.findIndex(col => col.id === sourceColumn.id);
      const newSourceColumn = {
        ...sourceColumn,
        cards: sourceColumn.cards.filter(c => c.id !== cardId)
      };
      newColumns[sourceColumnIndex] = newSourceColumn;

      // Add card to destination column
      const destColumnIndex = newColumns.findIndex(col => col.id === newColumnId);
      const destColumn = newColumns[destColumnIndex];
      const newDestColumn = {
        ...destColumn,
        cards: [...destColumn.cards, { ...card, status: newColumnId }]
      };
      newColumns[destColumnIndex] = newDestColumn;

      return { ...newBoard, columns: newColumns };
    });

    // Update application status on the backend
    try {
      const result = await updateApplicationStatus(cardId, { status: newColumnId });
      if (!result.success) {
        console.error('Failed to update application status:', result.error);
        // Revert the UI change if backend update failed
        // This would require more complex state management
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const findCardById = (cardId) => {
    for (const column of board.columns) {
      const card = column.cards.find(c => c.id === cardId);
      if (card) return card;
    }
    return null;
  };

  const findCardAndColumn = (cardId) => {
    for (const column of board.columns) {
      const card = column.cards.find(c => c.id === cardId);
      if (card) return { card, sourceColumn: column };
    }
    return { card: null, sourceColumn: null };
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < board.columns.length - columnsToShow) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Get visible columns based on current index
  const visibleColumns = board.columns.slice(currentIndex, currentIndex + columnsToShow);
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < board.columns.length - columnsToShow;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Talent Pipeline Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your recruitment process with our intuitive drag-and-drop Kanban board
        </p>
        <div className="flex justify-center space-x-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            📊 Real-time Analytics
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            🎯 Smart Matching
          </div>
          <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
            ⚡ Fast Processing
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {board.columns.map((column) => (
          <div key={column.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{column.title}</p>
                <p className="text-3xl font-bold text-gray-900">{column.cards.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recruitment Pipeline</h2>
            <p className="text-gray-600">Drag and drop candidates between different stages</p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!canGoBack}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                canGoBack
                  ? 'border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-md cursor-pointer'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              title="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-sm text-gray-600 font-medium px-2">
              {currentIndex + 1}-{Math.min(currentIndex + columnsToShow, board.columns.length)} of {board.columns.length}
            </span>
            
            <button
              onClick={handleNext}
              disabled={!canGoForward}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                canGoForward
                  ? 'border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-md cursor-pointer'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              title="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="relative">
            {/* Columns Container with smooth transition */}
            <div className="overflow-hidden">
              <div 
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / columnsToShow)}%)`,
                }}
              >
                {board.columns.map((column) => (
                  <div 
                    key={column.id} 
                    className="flex-shrink-0"
                    style={{ width: `calc((100% - ${(columnsToShow - 1) * 1.5}rem) / ${columnsToShow})` }}
                  >
                    <Column column={column} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeCard ? <Card card={activeCard} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
