'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { widgetsApi, Widget } from '@/api/widgets';
import { authApi, UserCreateGuest, UserOut } from '@/api/auth';
import { Conversation, conversationsApi, CreateConversationData } from '@/api/conversations';
import { messagesApi, CreateMessageData } from '@/api/messages';
import { toast } from 'react-toastify';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const BOT_WELCOME_MESSAGE = "Hello {name}. How can I help you today?";

const ChatPage: React.FC = () => {
  const searchParams = useSearchParams();
  const botId = searchParams.get("botId");
  const isEmbedded = searchParams.get('embedded') === 'true';
  const [bot, setBot] = useState<Widget | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserOut | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showChatLoading, setShowChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchBotData = async () => {
      if (botId) {
        try {
          const botData = await widgetsApi.getBotById(botId);
          setBot(botData);
          setToken(botData.token);
        } catch (error) {
          console.error('Error fetching bot data:', error);
        }
      }
    };

    fetchBotData();
  }, [botId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const user: UserCreateGuest = {
      email: formData.get('email') as string,
      name: formData.get('name') as string
    };

    try {
      const userInfo = await authApi.createGuestUser(user, token);
      setUserInfo(userInfo);

      const conversationPayload: CreateConversationData = {
        name: userInfo.name,
        type: 'bot'
      };
      const conversationData = await conversationsApi.create(conversationPayload, token);
      setConversation(conversationData);

      const botMessage = BOT_WELCOME_MESSAGE.replace("{name}", userInfo.name);
      setMessages([{
        id: Date.now().toString(),
        text: botMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);

      sendMessage(botMessage, bot?.user_id, conversationData.id);
    } catch (error) {
      toast.error('Failed to create guest user');
    }
  };

  async function sendMessage(message: string, sender_id: number, conversation_id: number|null = null) {
    const messagePayload: CreateMessageData = {
      content: message,
      conversation_id: conversation_id || conversation?.id,
      sender_id: sender_id
    };

    try {
      const messageData = await messagesApi.create(messagePayload, token);
    } catch (error) {
      toast.error('Failed to send message');
    }
  }

  async function queryBot(message: string) {
    try {
      const messageData = await widgetsApi.queryBot(message, token);
      return messageData;
    } catch (error) {
      toast.error('Failed to query bot');
    }
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (showChatLoading) return;

    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev: Message[]) => [...prev, newMessage]);
    setCurrentMessage('');

    setShowChatLoading(true);
    await sendMessage(currentMessage, userInfo?.id);

    const response = await queryBot(currentMessage);
    setShowChatLoading(false);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.content,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages((prev: Message[]) => [...prev, botMessage]);
    await sendMessage(response.content, bot?.user_id);
  };

  const containerClassName = `chat-container ${isEmbedded ? 'chat-container--embedded' : ''}`;

  if (!userInfo) {
    return (
      <div className={containerClassName}>
        <div className="user-info-form">
          <h2>{bot?.name || "Welcome"}</h2>
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

      {showChatLoading && <div className="chat-loading">Loading...</div>}

      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={currentMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button" disabled={showChatLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage; 