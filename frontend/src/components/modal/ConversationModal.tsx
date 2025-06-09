import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import { conversationsApi, Conversation } from '@/api/conversations';
import { Message, messagesApi, MessageUser } from '@/api/messages';
import { debounce } from '@/utils/debounce';

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgetId: string;
}

interface ConversationResponse {
  items: Conversation[];
  total: number;
  page: number;
  size: number;
}

const ConversationModal: React.FC<ConversationModalProps> = ({ isOpen, onClose, widgetId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [conversationCreator, setConversationCreator] = useState<MessageUser | null>(null);
  const conversationsContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const debouncedFetchConversations = useCallback(
    debounce(async () => {
      if (isLoading || !hasMore) return;
      
      try {
        setIsLoading(true);
        const response = await conversationsApi.getByWidgetId(widgetId, page) as ConversationResponse;
        const newConversations = response.items;
        
        setConversations((prev: Conversation[]) => [...prev, ...newConversations]);
        setHasMore(newConversations.length > 0 && response.total > conversations.length + newConversations.length);
        setPage((prev: number) => prev + 1);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [isLoading, hasMore, page, widgetId, conversations.length]
  );

  const debouncedFetchMessages = useCallback(
    debounce(async (conversationId: number, page: number) => {
      if (isLoadingMessages || !hasMoreMessages) return;

      try {
        setIsLoadingMessages(true);
        const response = await messagesApi.getConversationMessages(conversationId, page);
        const newMessages = response.items;
        
        setMessages((prev: Message[]) => [...prev, ...newMessages]);
        setHasMoreMessages(newMessages.length === 10);
        setMessagePage((prev: number) => prev + 1);

        if (newMessages.length > 0 && !conversationCreator) {
          const creator = newMessages.find((message: Message) => message.sender.type != 3)?.sender;
          if (creator) {
            setConversationCreator(creator);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    }, 300),
    [isLoadingMessages, hasMoreMessages, conversationCreator]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDateTime = (date: string) => {
    const utcDate = new Date(date + 'Z');
    const localDate = utcDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return localDate;
  };

  const handleConversationsScroll = () => {
    const container = conversationsContainerRef.current;
    if (!container || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      debouncedFetchConversations();
    }
  };

  const handleMessagesScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingMessages || !hasMoreMessages || !selectedConversation) return;

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
      debouncedFetchMessages(selectedConversation.id, messagePage);
    }
  }, [isLoadingMessages, hasMoreMessages, selectedConversation, messagePage, debouncedFetchMessages]);

  const debouncedHandleMessagesScroll = useCallback(
    debounce(handleMessagesScroll, 150),
    [handleMessagesScroll]
  );

  useEffect(() => {
    const conversationsContainer = conversationsContainerRef.current;
    if (conversationsContainer) {
      conversationsContainer.addEventListener('scroll', handleConversationsScroll);
    }

    return () => {
      if (conversationsContainer) {
        conversationsContainer.removeEventListener('scroll', handleConversationsScroll);
      }
    };
  }, [isLoading, hasMore]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', debouncedHandleMessagesScroll);
    }

    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener('scroll', debouncedHandleMessagesScroll);
      }
      debouncedHandleMessagesScroll.cancel();
    };
  }, [debouncedHandleMessagesScroll]);

  useEffect(() => {
    if (isOpen) {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      
      setConversations([]);
      setPage(1);
      setHasMore(true);
      debouncedFetchConversations();
      isLoadingRef.current = false;
    }
    
    return () => {
      debouncedFetchConversations.cancel();
    };
  }, [isOpen]);

  useEffect(() => {
    if (selectedConversation) {
      setMessages([]);
      setMessagePage(1);
      setHasMoreMessages(true);
      setConversationCreator(null);
      debouncedFetchMessages(selectedConversation.id, 1);
    }

    return () => {
      debouncedFetchMessages.cancel();
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (messages.length > 0 && messagePage === 1) {
      scrollToBottom();
    }
  }, [messages, messagePage]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content--large">
        <div className="modal-header">
          <h2 className="modal-title">Conversations</h2>
          <button onClick={onClose} className="modal-close">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {/* Conversations List */}
          <div className="conversation-list" ref={conversationsContainerRef}>
            {conversations.map((conversation: Conversation) => (
              <div
                key={`${conversation.id}-${conversation.created_at}`}
                className={`conversation-item ${
                  selectedConversation?.id === conversation.id ? 'conversation-item--selected' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="conversation-item__header">
                  <h3 className="conversation-item__title">{conversation.name}</h3>
                  <button className="conversation-item__icon">
                    <FiMessageSquare />
                  </button>
                </div>
                <p className="conversation-item__type">{conversation.type}</p>
                <p className="conversation-item__created-at">{formatDateTime(conversation.created_at)}</p>
              </div>
            ))}
            {isLoading && <div className="conversation-list__loader">Loading...</div>}
          </div>

          {/* Chat Display */}
          <div className="chat-display">
            {selectedConversation ? (
              <div className="chat-display__content">
                {conversationCreator && (
                  <div className="chat-display__creator">
                    <p className="chat-display__creator-name">{conversationCreator.name}</p>
                    <p className="chat-display__creator-email">{conversationCreator.email}</p>
                  </div>
                )}
                <div className="chat-display__messages" ref={messagesContainerRef}>
                  {isLoadingMessages && (
                    <div className="message-list__loader">
                      Loading more messages...
                    </div>
                  )}
                  {messages.map((message: Message) => (
                    <div
                      key={`${message.id}-${message.created_at}`}
                      className={`chat-message ${
                        message.sender.type === 3
                          ? 'chat-message--outgoing'
                          : 'chat-message--incoming'
                      }`}
                    >
                      <div className="chat-message__sender">{message.sender.name}</div>
                      <div className="chat-message__content">{message.content}</div>
                      <div className="chat-message__created-at">{formatDateTime(message.created_at)}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            ) : (
              <div className="chat-display__empty">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationModal; 