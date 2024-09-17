import React from 'react';

interface Session {
  _id: string;
  calculation: string;
  notes: string;
  createdAt: number;
}

interface NavbarProps {
  sessions: Session[]; 
  onSelectSession: (session: Session) => void; 
}

const truncateText = (text: string, length: number) => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

const Navbar: React.FC<NavbarProps> = ({ sessions = [], onSelectSession }) => {
  console.log(sessions);
  return (
    <div className="navbar w-1/4 p-4 border-r border-gray-300">

        
      <h2 className="text-xl font-bold mb-4">Session History</h2>
      <div className="saved-sessions">
        {sessions.length === 0 ? (
          <p>No sessions found.</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session._id}
              className="session-item cursor-pointer p-2 border-b hover:bg-gray-100"
              onClick={() => onSelectSession(session)}
            >
              <p><strong>Calculation:</strong> {session.calculation}</p>
              <p><strong>Notes:</strong> {truncateText(session.notes, 20)}</p>
              <p><strong>Created At:</strong> {new Date(session.createdAt * 1000).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Navbar;
