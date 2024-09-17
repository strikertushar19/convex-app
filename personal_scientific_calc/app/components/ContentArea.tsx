import React from 'react';

// Define the props for the ContentArea component
interface ContentAreaProps {
  selected: string;
}

// Define your components for different sections
const Profile: React.FC = () => (
  <div>
    <h2>Profile</h2>
    <p>This is the profile section.</p>
  </div>
);

const History: React.FC = () => (
  <div>
    <h2>History</h2>
    {/* You can render a list of sessions here */}
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
