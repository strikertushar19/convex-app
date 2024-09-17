"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "./components/Navbar";
import CalculatorComponent from "./components/CalculatorComponent";

// Define TypeScript interface for session data
interface Session {
  _id: string;
  calculation: string;
  notes: string;
  createdAt: number;
}

export default function Home() {
  const getSessions = useQuery(api.tasks2.getSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [viewingSession, setViewingSession] = useState(false);

  // Callback function to handle session selection
  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    setViewingSession(true);
  };

  // Handle back button click
  const handleBack = () => {
    setSelectedSession(null);
    setViewingSession(false);
  };

  // Ensure sessions is defined as an empty array if it's undefined
  const sessions = getSessions || [];
  const truncateText = (text: string, length: number) => {
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  return (
    <>
    
    <div className="flex">
      
      {/* Navbar for displaying sessions */}
      <Navbar sessions={sessions} onSelectSession={handleSelectSession} />

      {/* Main content */}
      <div className="flex-1 p-4">
        {viewingSession ? (
          <div>
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Back
            </button>
            {selectedSession && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Selected Session</h2>
                <div>
                  <p><strong>Calculation:</strong> {selectedSession.calculation}</p>
                  <p><strong>Notes:</strong> {selectedSession.notes}</p>
                  <p><strong>Created At:</strong> {new Date(selectedSession.createdAt * 1000).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <CalculatorComponent />
        )}
      </div>
    </div></>
  );
}
