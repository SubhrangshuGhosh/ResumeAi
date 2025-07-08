import React from 'react';
import '../styles/NotificationPage.css';

export default function NotificationPage() {
  return (
    <div className="notif-loading-wrapper">
      <div className="spinner"></div>
      <p>No new notifications available</p>
    </div>
  );
}
