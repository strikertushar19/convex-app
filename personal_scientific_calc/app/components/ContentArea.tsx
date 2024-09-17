import React from 'react';

interface ContentAreaProps {
  selected: string;
}

const Profile: React.FC = () => (
  <div>
    <h2>Profile</h2>
    <p>This is the profile section.</p>
  </div>
);

const History: React.FC = () => (
  <div>
    <h2>History</h2>
    <p>This is the history section. Displaying old sessions here.</p>
  </div>
);

const Settings: React.FC = () => (
  <div>
    <h2>Settings</h2>
    <p>This is the settings section.</p>
  </div>
);

const ContentArea: React.FC<ContentAreaProps> = ({ selected }) => {
  switch (selected) {
    case 'profile':
      return <Profile />;
    case 'history':
      return <History />;
    case 'settings':
      return <Settings />;
    default:
      return <div>Select an option from the menu.</div>;
  }
};

export default ContentArea;
