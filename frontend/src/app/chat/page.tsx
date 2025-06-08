'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface UserInfo {
  name: string;
  email: string;
}

const ChatPage: React.FC = () => {
  const searchParams = useSearchParams();
  const isEmbedded = searchParams.get('embedded') === 'true';
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUserInfo({
      name: formData.get('name') as string,
      email: formData.get('email') as string
    });
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev: Message[]) => [...prev, newMessage]);
    setCurrentMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Hello ${userInfo?.name}, I received your message!`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, botMessage]);
    }, 1000);
  };

  const containerClassName = `chat-container ${isEmbedded ? 'chat-container--embedded' : ''}`;

  if (!userInfo) {
    return (
      <div className={containerClassName}>
        <div className="user-info-form">
          <h2>Welcome to Chat</h2>
          <p>Please enter your information to start</p>
          <form onSubmit={handleUserInfoSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className="submit-button">
              Start Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className="chat-header">
        <h2>Chat with Bot</h2>
        <div className="user-info">
          <span>{userInfo.name}</span>
          <span>{userInfo.email}</span>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="timestamp">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={currentMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage; 