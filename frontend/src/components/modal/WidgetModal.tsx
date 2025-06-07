import React, { useEffect, useState } from 'react';
import { Document, documentsApi } from '@/api/documents';

interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WidgetFormData) => void;
  initialData?: WidgetFormData;
}

export interface WidgetFormData {
  name: string;
  type: string;
  description?: string;
  prompt?: string;
  fileIds: string[];
}

const WIDGET_TYPES = [
  'Customer Support',
  'Sales Assistant',
  'Technical Support',
  'Healthcare Assistant',
  'Legal Assistant',
  'Educational Tutor',
  'HR Assistant',
  'Financial Advisor',
  'Travel Assistant',
  'Other'
] as const;

type WidgetType = typeof WIDGET_TYPES[number];

const WidgetModal: React.FC<WidgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<WidgetFormData>({
    name: initialData?.name || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
    prompt: initialData?.prompt || '',
    fileIds: initialData?.fileIds || []
  });

  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await documentsApi.getAll(currentPage);
      if (currentPage === 1) {
        setDocuments(response.items);
      } else {
        setDocuments((prev: Document[]) => [...prev, ...response.items]);
      }
      setHasMore(response.items.length > 0);
      setCurrentPage((prev: number) => prev + 1);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoading) {
      fetchDocuments();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileSelection = (fileId: string) => {
    setFormData((prev: WidgetFormData) => ({
      ...prev,
      fileIds: prev.fileIds.includes(fileId)
        ? prev.fileIds.filter((id: string) => id !== fileId)
        : [...prev.fileIds, fileId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="widget-modal">
        <h2 className="widget-modal__title">
          {initialData ? 'Edit Widget' : 'Create New Widget'}
        </h2>
        <form onSubmit={handleSubmit} className="widget-modal__form">
          <div className="widget-modal__field">
            <label htmlFor="name">Widget Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Enter widget name"
            />
          </div>
          <div className="widget-modal__field">
            <label htmlFor="description">Widget Description</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              placeholder="Enter widget description"
            />
          </div>

          <div className="widget-modal__field">
            <label htmlFor="type">Widget Type</label>
            <select
              id="type"
              value={formData.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFormData(prev => ({ ...prev, type: e.target.value }))}
              required
            >
              <option value="">Select a type</option>
              {WIDGET_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {formData.type === 'Other' && (
            <div className="widget-modal__field">
              <label htmlFor="otherTypeDetails">Specify Widget Type</label>
              <textarea
                id="otherTypeDetails"
                value={formData.prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                required
                placeholder="Please describe the type of chatbot widget you need"
              />
            </div>
          )}

          <div className="widget-modal__field">
            <label>Select Files</label>
            <div className="widget-modal__files" onScroll={handleScroll}>
              {documents.map((doc: Document) => (
                <div
                  key={doc.id}
                  className={`widget-modal__file ${formData.fileIds.includes(doc.id) ? 'selected' : ''}`}
                  onClick={() => handleFileSelection(doc.id)}
                >
                  <span className="widget-modal__file-name">{doc.filename}</span>
                </div>
              ))}
              {isLoading && <div className="widget-modal__loading">Loading more files...</div>}
            </div>
          </div>

          <div className="widget-modal__actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button-primary">
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WidgetModal; 