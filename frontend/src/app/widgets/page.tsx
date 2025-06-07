'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiMessageSquare } from 'react-icons/fi';
import DashboardLayout from '@/layouts/DashboardLayout';
import WidgetModal, { WidgetFormData } from '@/components/modal/WidgetModal';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import { widgetsApi, Widget } from '@/api/widgets';

interface LayoutProps {
  children: ReactNode;
}

const Widgets: React.FC = () => {
  const [widgets, setWidgets] = useState<{ [key: string]: Widget }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState<string | null>(null);

  const fetchWidgets = async () => {
    try {
      setIsLoading(true);
      const data = await widgetsApi.getAll(currentPage, itemsPerPage);
      const widgetsList = widgets
        
      data.items.forEach(item => {
        widgetsList[item.id] = item;
      })

      setWidgets(widgetsList);
      setTotalItems(data.total);
    } catch (error) {
      console.error('Error fetching widgets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWidgets();
  }, [currentPage, itemsPerPage]);

  const handleAddChatbot = () => {
    setEditingWidget(null);
    setIsModalOpen(true);
  };

  const handleEditChatbot = (id: string) => {
    const widget = widgets[id];
    if (widget) {
      setEditingWidget(widget);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setWidgetToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (widgetToDelete) {
      try {
        await widgetsApi.delete(widgetToDelete);
        setIsDeleteModalOpen(false);
        setWidgetToDelete(null);
        fetchWidgets(); 
      } catch (error) {
        console.error('Error deleting widget:', error);
      }
    }
  };

  const handleChatClick = (id: string) => {
    window.location.href = `/chat/${id}`;
  };

  const handleModalSubmit = async (data: WidgetFormData) => {
    try {
      const fileIds = data.fileIds.map((id: string) => parseInt(id));
      const widgetData = {
        name: data.name,
        description: data.description || '',
        type: data.type,
        file_ids: fileIds,
        prompt: data.prompt || ''
      };

      if (editingWidget) {
        await widgetsApi.update(editingWidget.id, widgetData);
      } else {
        await widgetsApi.register(widgetData);
      }
      fetchWidgets();
      setIsModalOpen(false);

    } catch (error) {
      console.error('Error registering widget:', error);
    }
  };

  const content = (
    <div className="widgets">
      <div className="widgets__header">
        <h1 className="widgets__header-title">Chatbots</h1>
        <div className="widgets__header-actions">
          <button className="button button--primary" onClick={handleAddChatbot}>
            <FiPlus className="button__icon" /> Create New Chatbot
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="widgets__loading">Loading...</div>
      ) : (
        <div className="widgets__grid">
          {Object.values(widgets)?.map((widget: Widget) => (
            <div key={widget.id} className="chatbot">
              <div className="chatbot__header">
                <img src="/static/images/logo.svg" alt={widget.name} className="chatbot__avatar" />
                <div className="chatbot__info">
                  <h3 className="chatbot__name">{widget.name}</h3>
                  <p className="chatbot__description">{widget.description}</p>
                </div>
                <div className="chatbot__actions">
                  <button
                    className="chatbot__action-btn"
                    onClick={() => handleChatClick(widget.id)}
                  >
                    <FiMessageSquare />
                  </button>
                  <button
                    className="chatbot__action-btn"
                    onClick={() => handleEditChatbot(widget.id)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="chatbot__action-btn"
                    onClick={() => handleDeleteClick(widget.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="chatbot__footer">
                <div className="chatbot__stats">
                  <div className="chatbot__stat">
                    <span>{widget.type}</span>
                  </div>
                  <div className="chatbot__stat">
                    <FiMessageSquare />
                    <span>{widget.conversations_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {
        isModalOpen && (
          <WidgetModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            initialData={editingWidget ? {
              name: editingWidget.name,
              type: editingWidget.type,
              fileIds: editingWidget.files.map((file: File) => file.id),
              prompt: editingWidget.prompt,
              description: editingWidget.description
            } : undefined}
          />
        )
      }

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setWidgetToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Chatbot"
        message="Are you sure you want to delete this chatbot? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
};

export default Widgets; 