import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/LeftNavbar.css';

const icons = {
  resume: <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M19.7502 11V10C19.7502 6.22876 19.7502 4.34315 18.5786 3.17157C17.407 2 15.5214 2 11.7502 2H10.7503C6.97907 2 5.09346 2 3.92189 3.17156C2.75032 4.34312 2.7503 6.22872 2.75027 9.99993L2.75024 14C2.7502 17.7712 2.75019 19.6568 3.92172 20.8284C5.09329 21.9999 6.97897 22 10.7502 22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M7.25024 7H15.2502M7.25024 12H15.2502" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M13.2502 20.8268V22H14.4236C14.833 22 15.0377 22 15.2217 21.9238C15.4058 21.8475 15.5505 21.7028 15.84 21.4134L20.6636 16.5894C20.9366 16.3164 21.0731 16.1799 21.1461 16.0327C21.285 15.7525 21.285 15.4236 21.1461 15.1434C21.0731 14.9961 20.9366 14.8596 20.6636 14.5866C20.3905 14.3136 20.254 14.1771 20.1067 14.1041C19.8265 13.9653 19.4975 13.9653 19.2173 14.1041C19.0701 14.1771 18.9335 14.3136 18.6605 14.5866L18.6605 14.5866L13.8369 19.4106C13.5474 19.7 13.4027 19.8447 13.3265 20.0287C13.2502 20.2128 13.2502 20.4174 13.2502 20.8268Z" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"></path>
</svg></span>,
  airesume: <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M4 12C4 8.22876 4 6.34315 5.17157 5.17157C6.34315 4 8.22876 4 12 4C15.7712 4 17.6569 4 18.8284 5.17157C20 6.34315 20 8.22876 20 12C20 15.7712 20 17.6569 18.8284 18.8284C17.6569 20 15.7712 20 12 20C8.22876 20 6.34315 20 5.17157 18.8284C4 17.6569 4 15.7712 4 12Z" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M7.5 15L9.34189 9.47434C9.43631 9.19107 9.7014 9 10 9C10.2986 9 10.5637 9.19107 10.6581 9.47434L12.5 15M8.5 13H11.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M15.5 9V15" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M8 2V4M16 2V4M12 2V4M8 20V22M12 20V22M16 20V22M22 16H20M4 8H2M4 16H2M4 12H2M22 8H20M22 12H20" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg></span>,
  saved: <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M16.9017 6.12874C18 7.25748 18 9.07416 18 12.7075V14.2925C18 17.9258 18 19.7425 16.9017 20.8713C15.8033 22 14.0355 22 10.5 22C6.96447 22 5.1967 22 4.09835 20.8713C3 19.7425 3 17.9258 3 14.2925V12.7075C3 9.07416 3 7.25748 4.09835 6.12874C5.1967 5 6.96447 5 10.5 5C14.0355 5 15.8033 5 16.9017 6.12874Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M7.5 5.5V10.3693C7.5 11.3046 7.5 11.7722 7.78982 11.9396C8.35105 12.2638 9.4038 11.1823 9.90375 10.8567C10.1937 10.6678 10.3387 10.5734 10.5 10.5734C10.6613 10.5734 10.8063 10.6678 11.0962 10.8567C11.5962 11.1823 12.6489 12.2638 13.2102 11.9396C13.5 11.7722 13.5 11.3046 13.5 10.3693V5.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M9 2H11C15.714 2 18.0711 2 19.5355 3.46447C21 4.92893 21 7.28595 21 12V18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg></span>,
};

function LeftNavbar({ onSelect }) {
  const [expanded, setExpanded] = useState(window.innerWidth > 1000);

  useEffect(() => {
    const handleResize = () => setExpanded(window.innerWidth > 1000);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    { key: 'new_resume', label: 'New Resume', icon: icons.resume },
    { key: 'airesume', label: 'AiResume', icon: icons.airesume },
    { key: 'saved', label: 'Saved Resume', icon: icons.saved },
  ];

  return (
    <aside className={`left-navbar ${expanded ? 'expanded' : 'collapsed'}`}>
      {items.map(item => (
        <button
          key={item.key}
          className="nav-item"
          onClick={() => {
            console.log('Clicked:', item.key);
            onSelect(item.key);
          }}
        >
          {item.icon}
          {expanded && <span className="label">{item.label}</span>}
        </button>
      ))}
    </aside>
  );
}

LeftNavbar.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default LeftNavbar;
