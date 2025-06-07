'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiMessageSquare } from 'react-icons/fi';
import DashboardLayout from '@/layouts/DashboardLayout';
import WidgetModal, { WidgetFormData } from '@/components/modal/WidgetModal';
import { widgetsApi, Widget } from '@/api/widgets';

interface LayoutProps {
  children: ReactNode;
}

const Widgets: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);

  const fetchWidgets = async () => {
    try {
      setIsLoading(true);
      const data = await widgetsApi.getAll(currentPage, itemsPerPage);
      setWidgets(data.items);
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
    const widget = widgets.find((w: Widget) => w.id === id);
    if (widget) {
      setEditingWidget(widget);
      setIsModalOpen(true);
    }
  };

  const handleDeleteChatbot = async (id: string) => {
    try {
      await widgetsApi.delete(id);
      fetchWidgets(); // Refresh the list
    } catch (error) {
      console.error('Error deleting widget:', error);
    }
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

      await widgetsApi.register(widgetData);
      setIsModalOpen(false);
      fetchWidgets();
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
          {widgets.map((widget: Widget) => (
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
                    onClick={() => handleEditChatbot(widget.id)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="chatbot__action-btn"
                    onClick={() => handleDeleteChatbot(widget.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="chatbot__footer">
                <div className="chatbot__stats">
                  <div className="chatbot__stat">
                    <span>Type: {widget.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <WidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingWidget ? {
          name: editingWidget.name,
          type: editingWidget.type,
          selectedFiles: []
        } : undefined}
      />
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
};

export default Widgets; 