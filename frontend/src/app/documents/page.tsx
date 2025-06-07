'use client';

import { useState, useRef, useEffect } from 'react';
import { FiTrash2, FiUpload, FiGrid, FiList } from 'react-icons/fi';
import DashboardLayout from '@/layouts/DashboardLayout';
import { documentsApi } from '@/api/documents';
import useStore from '@/store';
import ConfirmationModal from '@/components/modal/ConfirmationModal';

interface Document {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  status: 'pending' | 'completed' | 'error';
  preview?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['.txt', '.pdf', '.xlsx', '.docx'];
const FILE_PREVIEW_URL = '/static/images/document.svg';

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFiles } = useStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [currentPage]);

  const fetchDocuments = async () => {
    try {
      const response = await documentsApi.getAll(currentPage, itemsPerPage);
      setDocuments(response.items);
      setTotalItems(response.total);
      setFiles(response.items);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const validateFile = (file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      alert(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 5MB limit');
      return false;
    }
    return true;
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length === 0) return;

    const newDocuments = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toLocaleDateString(),
      status: 'pending' as const,
      preview: FILE_PREVIEW_URL
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    try {
      const response = await documentsApi.upload(validFiles);
      setDocuments(prev => 
        prev.map(doc => 
          newDocuments.find(newDoc => newDoc.name === doc.name)
            ? { ...doc, status: 'completed' }
            : doc
        )
      );

      fetchDocuments();
    } catch (error) {
      console.error('Error uploading files:', error);
      setDocuments(prev => 
        prev.map(doc => 
          newDocuments.find(newDoc => newDoc.name === doc.name)
            ? { ...doc, status: 'error' }
            : doc
        )
      );
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await documentsApi.delete(id);
      setDocuments(documents.filter(doc => doc.id !== id));
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const openDeleteModal = (id: string) => {
    setDocumentToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDocumentToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      await handleDelete(documentToDelete);
      closeDeleteModal();
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="documents">
        <div className="documents__header">
          <h1 className="documents__header-title">Documents</h1>
          <div className="documents__header-actions">
            <label className="button-primary upload-button" htmlFor="file-upload">
              <FiUpload className="upload-icon" />
              <span>Upload Documents</span>
            </label>
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept={ALLOWED_FILE_TYPES.join(',')}
            />
          </div>
        </div>

        <div className="documents__grid">
            {documents?.map((doc) => (
              <div key={doc.id} className="documents__card">
                <div className="documents__card-preview">
                  <img src={FILE_PREVIEW_URL} alt={doc.name} />
                  <div className={`documents__card-status ${doc.status}`}>
                    {doc.status}
                  </div>
                </div>
                <div className="documents__card-info">
                  <div className="documents__card-info-title">{doc.filename}</div>
                  <div className="documents__card-info-meta">
                    <span>{doc.size}</span>
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>
                <div className="documents__card-actions">
                  <button className="button-secondary"></button>
                  <button className="button-secondary" onClick={() => openDeleteModal(doc.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {!documents?.length && (
          <div className="documents__empty">
            <div className="documents__empty-icon">
              <FiUpload />
            </div>
            <h2 className="documents__empty-text">No documents yet</h2>
            <p className="documents__empty-subtext">Upload your first document to get started</p>
            <label className="button-primary upload-button" htmlFor="file-upload">
              <FiUpload className="upload-icon" />
              <span>Upload Document</span>
            </label>
          </div>
        )}

        {totalPages > 1 && (
          <div className="documents__pagination">
            <button
              className="button-secondary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="documents__pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="button-secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
      />
    </DashboardLayout>
  );
} 