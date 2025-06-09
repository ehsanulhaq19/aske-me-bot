'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import useStore from '@/store';
import { analyticsApi, SystemAnalytics } from '@/api/analytics';

export default function Dashboard() {
  const { user } = useStore();
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

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

    fetchAnalytics();
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
              <h2 className="dashboard__activity-header-title">Recent Activity</h2>
            </div>
            <div className="dashboard__activity-list">
              {/* Example activity items */}
              <div className="dashboard__activity-item">
                <div className="dashboard__activity-item-info">
                  <img src="/avatar1.jpg" alt="User" className="dashboard__activity-item-avatar" />
                  <div className="dashboard__activity-item-content">
                    John Doe created a new widget
                  </div>
                </div>
                <div className="dashboard__activity-item-time">2 hours ago</div>
              </div>
              <div className="dashboard__activity-item">
                <div className="dashboard__activity-item-info">
                  <img src="/avatar2.jpg" alt="User" className="dashboard__activity-item-avatar" />
                  <div className="dashboard__activity-item-content">
                    Jane Smith uploaded a document
                  </div>
                </div>
                <div className="dashboard__activity-item-time">4 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 