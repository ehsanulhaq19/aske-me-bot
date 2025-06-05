'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiEdit2 } from 'react-icons/fi';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function Profile() {
  const [user] = useState({
    name: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    location: 'San Francisco, CA',
    website: 'www.johndoe.com',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
    stats: {
      projects: 48,
      documents: 132,
      followers: 2890
    }
  });

  return (
    <DashboardLayout>
      <div className="profile">
        <div className="profile__header">
          <div className="profile__header-cover">
            <img src="/cover-image.jpg" alt="Cover" />
          </div>
          <div className="profile__header-avatar">
            <img src="/avatar.jpg" alt={user.name} />
            <div className="profile__header-avatar-edit">
              <FiEdit2 /> Change Photo
            </div>
          </div>
          <div className="profile__header-info">
            <h1 className="profile__header-info-name">{user.name}</h1>
            <div className="profile__header-info-title">{user.title}</div>
            <div className="profile__header-info-stats">
              <div className="profile__header-info-stats-item">
                <div className="profile__header-info-stats-item-value">
                  {user.stats.projects}
                </div>
                <div className="profile__header-info-stats-item-label">
                  Projects
                </div>
              </div>
              <div className="profile__header-info-stats-item">
                <div className="profile__header-info-stats-item-value">
                  {user.stats.documents}
                </div>
                <div className="profile__header-info-stats-item-label">
                  Documents
                </div>
              </div>
              <div className="profile__header-info-stats-item">
                <div className="profile__header-info-stats-item-value">
                  {user.stats.followers}
                </div>
                <div className="profile__header-info-stats-item-label">
                  Followers
                </div>
              </div>
            </div>
          </div>
          <div className="profile__header-actions">
            <button className="button-primary">Edit Profile</button>
            <button className="button-secondary">Share Profile</button>
          </div>
        </div>

        <div className="profile__content">
          <div className="profile__sidebar">
            <div className="profile__sidebar-section">
              <h2 className="profile__sidebar-section-title">Contact Information</h2>
              <div className="profile__sidebar-info">
                <div className="profile__sidebar-info-item">
                  <i><FiMail /></i>
                  <span>{user.email}</span>
                </div>
                <div className="profile__sidebar-info-item">
                  <i><FiPhone /></i>
                  <span>{user.phone}</span>
                </div>
                <div className="profile__sidebar-info-item">
                  <i><FiMapPin /></i>
                  <span>{user.location}</span>
                </div>
                <div className="profile__sidebar-info-item">
                  <i><FiGlobe /></i>
                  <span>{user.website}</span>
                </div>
              </div>
            </div>
            <div className="profile__sidebar-section">
              <h2 className="profile__sidebar-section-title">Skills</h2>
              <div className="profile__sidebar-skills">
                {user.skills.map((skill) => (
                  <div key={skill} className="profile__sidebar-skills-item">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="profile__main">
            <div className="profile__main-tabs">
              <div className="profile__main-tabs-item active">Overview</div>
              <div className="profile__main-tabs-item">Projects</div>
              <div className="profile__main-tabs-item">Documents</div>
              <div className="profile__main-tabs-item">Settings</div>
            </div>
            <div className="profile__main-content">
              <div className="profile__activity">
                {/* Example activity items */}
                <div className="profile__activity-item">
                  <div className="profile__activity-item-icon">
                    <FiEdit2 />
                  </div>
                  <div className="profile__activity-item-content">
                    <div className="profile__activity-item-content-header">
                      <div className="profile__activity-item-content-header-title">
                        Updated project documentation
                      </div>
                      <div className="profile__activity-item-content-header-time">
                        2 hours ago
                      </div>
                    </div>
                    <div className="profile__activity-item-content-description">
                      Made changes to the API documentation and updated the examples
                    </div>
                  </div>
                </div>
                {/* Add more activity items as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 