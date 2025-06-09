'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import useStore from '@/store';
import { analyticsApi, SystemAnalytics } from '@/api/analytics';
import { messagesApi, GuestMessage } from '@/api/messages';

export default function Dashboard() {
  const { user } = useStore();
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  function formatDistanceToNow(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diff / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hours ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minutes ago`;
    } else {
      return 'just now';
    }
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsApi.getSystemAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGuestMessages = async () => {
      try {
        const data = await messagesApi.getLatestGuestMessages();
        setGuestMessages(data.items);
      } catch (error) {
        console.error('Failed to fetch guest messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchAnalytics();
    fetchGuestMessages();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__header-title">Dashboard</h1>
        </div>

        <div className="dashboard__stats">
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-card-title">Total Widgets</div>
            <div className="dashboard__stat-card-value">
              {loading ? '...' : analytics?.total_widgets || 0}
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-card-title">Total Conversations</div>
            <div className="dashboard__stat-card-value">
              {loading ? '...' : analytics?.total_conversations || 0}
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-card-title">Total Documents</div>
            <div className="dashboard__stat-card-value">
              {loading ? '...' : analytics?.total_files || 0}
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-card-title">Guest Users</div>
            <div className="dashboard__stat-card-value">
              {loading ? '...' : analytics?.total_type_4_users || 0}
            </div>
          </div>
        </div>

        <div className="dashboard__main">
          <div className="dashboard__activity">
            <div className="dashboard__activity-header">
              <h2 className="dashboard__activity-header-title">Recent Guest Messages</h2>
            </div>
            <div className="dashboard__activity-list">
              {loadingMessages ? (
                <div className="dashboard__activity-loading">Loading...</div>
              ) : guestMessages.length === 0 ? (
                <div className="dashboard__activity-empty">No recent guest messages</div>
              ) : (
                guestMessages.map((message: GuestMessage, index: number) => (
                  <div key={index} className="dashboard__activity-item">
                    <div className="dashboard__activity-item-info">
                      <div className="dashboard__activity-item-avatar">
                        {message.sender_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="dashboard__activity-item-content">
                        <div className="dashboard__activity-item-header">
                          <span className="dashboard__activity-item-name">{message.sender_name}</span>
                        </div>
                        <div className="dashboard__activity-item-message">
                          {message.message_content}
                        </div>
                      </div>
                    </div>
                    {message.widget && (
                      <div className="dashboard__activity-item-meta">
                        <div className="dashboard__activity-item-widget-name">
                          Widget: {message.widget.name}
                        </div>
                        <div className="dashboard__activity-item-time">
                          {formatDistanceToNow(new Date(message.created_at + 'Z'))}
                        </div>
                      </div>
                    )}
                    {!message.widget && (
                      <div className="dashboard__activity-item-meta">
                        <div className="dashboard__activity-item-time">
                          {formatDistanceToNow(new Date(message.created_at + 'Z'))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 