import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import LeftNavbar from '../components/LeftNavbar';
import NotificationPage from './NotificationPage';
import AccountPage from './AccountPage';
import NewResumePage from './NewResumePage';
import AiResumePage from './AiResumePage';
import SavedResumePage from './SavedResumePage';
import '../styles/Dashboard.css';

function Dashboard() {
  const [topSection, setTopSection] = useState('home');
  const [sideSection, setSideSection] = useState('new_resume');

  const handleSideSelect = (key) => {
    setTopSection('home');
    setSideSection(key);
  };

  const renderMainContent = () => {
    if (topSection === 'search') return <div>Search Section</div>;
    if (topSection === 'notifications') return <NotificationPage />;
    if (topSection === 'account') return <AccountPage />;
    if (topSection === 'logout') return <div>You’ve been logged out.</div>;

    switch (sideSection) {
      case 'new_resume': return <NewResumePage />;
      case 'airesume': return <AiResumePage />;
      case 'saved': return <SavedResumePage />;
      default: return <div>Welcome to your dashboard.</div>;
    }
  };

  return (
    <div className="dashboard-layout">
      <TopNavbar onSelectSection={setTopSection} />
      <div className="dashboard-body">
        <LeftNavbar onSelect={handleSideSelect} />
        <main className="main-content">{renderMainContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
