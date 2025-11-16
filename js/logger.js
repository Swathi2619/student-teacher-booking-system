// logger.js
import { writeLogEntry } from './db.js';

export async function log(actorId, action, entity, details = {}) {
  const entry = {
    actorId: actorId || null,
    action,
    entity,
    details,
    timestamp: new Date().toISOString()
  };
  try {
    // small, immediate write; you can buffer later to reduce writes
    await writeLogEntry(entry);
  } catch (err) {
    // fallback to console if Firestore not available
    console.error('Log failed', err, entry);
  }
}
