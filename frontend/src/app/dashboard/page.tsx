'use client';

import { useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import useStore from '@/store';

export default function Dashboard() {
  const { widgets, files, user } = useStore();

  return (
    <DashboardLayout>
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__header-title">Dashboard</h1>
          <div className="dashboard__header-actions">
            <button className="button-primary">Add Widget</button>
            <button className="button-secondary">Export Data</button>
          </div>
        </div>

        <div className="dashboard__stats">
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-card-title">Total Widgets</div>
            <div className="dashboard__stat-card-value">{widgets.length}</div>
            <div className="dashboard__stat-card-change positive">
              <i className="icon-arrow-up"></i>
              <span>12% increase</span>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-card-title">Active Widgets</div>
            <div className="dashboard__stat-card-value">
              {widgets.filter(w => w.status === 'active').length}
            </div>
            <div className="dashboard__stat-card-change positive">
              <i className="icon-arrow-up"></i>
              <span>8% increase</span>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-card-title">Total Documents</div>
            <div className="dashboard__stat-card-value">{files.length}</div>
            <div className="dashboard__stat-card-change negative">
              <i className="icon-arrow-down"></i>
              <span>3% decrease</span>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-card-title">Active Users</div>
            <div className="dashboard__stat-card-value">245</div>
            <div className="dashboard__stat-card-change positive">
              <i className="icon-arrow-up"></i>
              <span>24% increase</span>
            </div>
          </div>
        </div>

        <div className="dashboard__main">
          <div className="dashboard__chart-card">
            <div className="dashboard__chart-card-header">
              <h2 className="dashboard__chart-card-header-title">Usage Analytics</h2>
            </div>
            {/* Chart component will go here */}
          </div>

          <div className="dashboard__chart-card">
            <div className="dashboard__chart-card-header">
              <h2 className="dashboard__chart-card-header-title">Widget Performance</h2>
            </div>
            {/* Chart component will go here */}
          </div>

          <div className="dashboard__chart-card">
            <div className="dashboard__chart-card-header">
              <h2 className="dashboard__chart-card-header-title">Document Analytics</h2>
            </div>
            {/* Chart component will go here */}
          </div>

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