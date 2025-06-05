'use client';

import { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiMessageSquare, FiSettings } from 'react-icons/fi';
import DashboardLayout from '@/layouts/DashboardLayout';
import styles from '@/static/styles/pages/widgets.module.css';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastActive: string;
  messageCount: number;
  avatar?: string;
}

export default function Widgets() {
  const [chatbots] = useState<Chatbot[]>([
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Handles customer inquiries and support tickets',
      status: 'active',
      createdAt: '2024-03-15',
      lastActive: '2 hours ago',
      messageCount: 1234,
      avatar: '/bot1.jpg'
    },
    {
      id: '2',
      name: 'Sales Assistant',
      description: 'Helps with product recommendations and sales',
      status: 'active',
      createdAt: '2024-03-10',
      lastActive: '5 minutes ago',
      messageCount: 856,
      avatar: '/bot2.jpg'
    }
  ]);

  const handleAddChatbot = () => {
    // Add chatbot logic
  };

  const handleEditChatbot = (id: string) => {
    // Edit chatbot logic
  };

  const handleDeleteChatbot = (id: string) => {
    // Delete chatbot logic
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chatbots</h1>
          <div className={styles.actions}>
            <button className={`${styles.footerButton} ${styles.primaryButton}`} onClick={handleAddChatbot}>
              <FiPlus /> Create New Chatbot
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {chatbots.map((chatbot) => (
            <div key={chatbot.id} className={styles.chatbot}>
              <div className={styles.chatbotHeader}>
                <div className={styles.avatar}>
                  <img src={chatbot.avatar || '/default-bot.jpg'} alt={chatbot.name} />
                  <span className={`${styles.statusIndicator} ${styles[chatbot.status]}`} />
                </div>
                <div className={styles.info}>
                  <h2 className={styles.name}>{chatbot.name}</h2>
                  <p className={styles.description}>{chatbot.description}</p>
                </div>
                <div className={styles.actions}>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleEditChatbot(chatbot.id)}
                    title="Edit Chatbot"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleDeleteChatbot(chatbot.id)}
                    title="Delete Chatbot"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <FiMessageSquare className={styles.statIcon} />
                  <span>{chatbot.messageCount.toLocaleString()} messages</span>
                </div>
                <div className={styles.stat}>
                  <span>Last active: {chatbot.lastActive}</span>
                </div>
              </div>

              <div className={styles.footer}>
                <button className={`${styles.footerButton} ${styles.primaryButton}`}>
                  <FiMessageSquare /> Open Chat
                </button>
                <button className={`${styles.footerButton} ${styles.secondaryButton}`}>
                  <FiSettings /> Settings
                </button>
              </div>
            </div>
          ))}

          <button className={styles.addChatbot} onClick={handleAddChatbot}>
            <div className={styles.addIcon}>
              <FiPlus />
            </div>
            <div className={styles.addText}>Create New Chatbot</div>
            <div className={styles.addSubtext}>
              Add a new chatbot to handle customer interactions
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 