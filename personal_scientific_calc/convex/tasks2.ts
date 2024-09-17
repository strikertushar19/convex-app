
import { mutation, query } from "./_generated/server";

export const saveSession = mutation(async ({ db }, { notes, calculation }) => {
  return await db.insert("sessions", {
    notes,
    calculation,
    createdAt: Math.floor(Date.now() / 1000), 
  });
});

export const getSessions = query(async ({ db }) => {
  return await db.query("sessions").collect();
});
