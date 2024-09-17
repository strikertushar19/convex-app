// convex/tasks2.ts

import { mutation, query } from "./_generated/server";

// Function to insert a new session
export const saveSession = mutation(async ({ db }, { notes, calculation }) => {
  return await db.insert("sessions", {
    notes,
    calculation,
    createdAt: Math.floor(Date.now() / 1000), // Store as Unix timestamp
  });
});

// Function to query all sessions
export const getSessions = query(async ({ db }) => {
  return await db.query("sessions").collect();
});
