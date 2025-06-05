'use client';

import { useState, useRef } from 'react';
import { FiTrash2, FiUpload, FiGrid, FiList } from 'react-icons/fi';
import DashboardLayout from '@/layouts/DashboardLayout';

interface Document {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  preview?: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'training-data.pdf',
      size: '2.5 MB',
      uploadedAt: new Date().toLocaleDateString(),
      preview: '/document-preview.jpg'
    },
    // Add more mock data as needed
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    // Mock upload - in real app, you'd send to server
    const newDocuments = Array.from(files).map(file => ({
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toLocaleDateString(),
      preview: '/document-preview.jpg'
    }));

    setDocuments([...documents, ...newDocuments]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="documents">
        <div className="documents__header">
          <h1 className="documents__header-title">Documents</h1>
          <div className="documents__header-actions">
            <button className="button-secondary" onClick={() => setViewMode('grid')}>
              <FiGrid />
            </button>
            <button className="button-secondary" onClick={() => setViewMode('list')}>
              <FiList />
            </button>
            <label className="button-primary" htmlFor="file-upload">
              <FiUpload />
              Upload Documents
            </label>
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="documents__filters">
          <input
            type="text"
            className="documents__filters-search"
            placeholder="Search documents..."
          />
          <select className="documents__filters-select">
            <option value="">All Types</option>
            <option value="pdf">PDF</option>
            <option value="doc">Word</option>
            <option value="xls">Excel</option>
          </select>
        </div>

        {viewMode === 'grid' ? (
          <div className="documents__grid">
            {documents.map((doc) => (
              <div key={doc.id} className="documents__card">
                <div className="documents__card-preview">
                  <img src={doc.preview} alt={doc.name} />
                </div>
                <div className="documents__card-info">
                  <div className="documents__card-info-title">{doc.name}</div>
                  <div className="documents__card-info-meta">
                    <span>{doc.size}</span>
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>
                <div className="documents__card-actions">
                  <button className="button-secondary">View</button>
                  <button className="button-secondary" onClick={() => handleDelete(doc.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="documents__list">
            <div className="documents__list-header">
              <span>Name</span>
              <span>Size</span>
              <span>Uploaded</span>
              <span>Actions</span>
            </div>
            {documents.map((doc) => (
              <div key={doc.id} className="documents__list-item">
                <div className="documents__list-item-info">
                  <div className="documents__list-item-icon">
                    <FiUpload />
                  </div>
                  <div className="documents__list-item-details">
                    <h3>{doc.name}</h3>
                    <p>{doc.size}</p>
                  </div>
                </div>
                <div className="documents__list-item-meta">
                  <span>{doc.uploadedAt}</span>
                </div>
                <div className="documents__list-item-actions">
                  <button className="button-secondary">View</button>
                  <button className="button-secondary" onClick={() => handleDelete(doc.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {documents.length === 0 && (
          <div className="documents__empty">
            <div className="documents__empty-icon">
              <FiUpload />
            </div>
            <h2 className="documents__empty-text">No documents yet</h2>
            <p className="documents__empty-subtext">Upload your first document to get started</p>
            <label className="button-primary" htmlFor="file-upload">
              Upload Document
            </label>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 