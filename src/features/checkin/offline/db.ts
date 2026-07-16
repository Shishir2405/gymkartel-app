import * as SQLite from "expo-sqlite";
import type { OutboxItem, OutboxStatus } from "./outbox";

const DB_NAME = "gymkartel.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
      await db.execAsync(
        `PRAGMA journal_mode = WAL;
         CREATE TABLE IF NOT EXISTS checkin_outbox (
           idempotencyKey TEXT PRIMARY KEY NOT NULL,
           gymCheckInCode TEXT NOT NULL,
           gymId TEXT NOT NULL,
           gymName TEXT NOT NULL,
           scannedAt TEXT NOT NULL,
           acceptedTopUp INTEGER NOT NULL DEFAULT 0,
           status TEXT NOT NULL DEFAULT 'pending',
           attempts INTEGER NOT NULL DEFAULT 0,
           createdAt TEXT NOT NULL
         );`,
      );
      return db;
    });
  }
  return dbPromise;
}

function rowToItem(row: OutboxRow): OutboxItem {
  return {
    idempotencyKey: row.idempotencyKey,
    gymCheckInCode: row.gymCheckInCode,
    gymId: row.gymId,
    gymName: row.gymName,
    scannedAt: row.scannedAt,
    acceptedTopUp: row.acceptedTopUp === 1,
    status: row.status as OutboxStatus,
    attempts: row.attempts,
    createdAt: row.createdAt,
  };
}

interface OutboxRow {
  idempotencyKey: string;
  gymCheckInCode: string;
  gymId: string;
  gymName: string;
  scannedAt: string;
  acceptedTopUp: number;
  status: string;
  attempts: number;
  createdAt: string;
}

export const outboxDb = {
  async enqueue(item: OutboxItem): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `INSERT OR IGNORE INTO checkin_outbox
        (idempotencyKey, gymCheckInCode, gymId, gymName, scannedAt, acceptedTopUp, status, attempts, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      item.idempotencyKey,
      item.gymCheckInCode,
      item.gymId,
      item.gymName,
      item.scannedAt,
      item.acceptedTopUp ? 1 : 0,
      item.status,
      item.attempts,
      item.createdAt,
    );
  },

  async all(): Promise<OutboxItem[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<OutboxRow>(
      `SELECT * FROM checkin_outbox ORDER BY createdAt ASC`,
    );
    return rows.map(rowToItem);
  },

  async setStatus(idempotencyKey: string, status: OutboxStatus, attempts?: number): Promise<void> {
    const db = await getDb();
    if (attempts != null) {
      await db.runAsync(
        `UPDATE checkin_outbox SET status = ?, attempts = ? WHERE idempotencyKey = ?`,
        status,
        attempts,
        idempotencyKey,
      );
    } else {
      await db.runAsync(
        `UPDATE checkin_outbox SET status = ? WHERE idempotencyKey = ?`,
        status,
        idempotencyKey,
      );
    }
  },

  async pruneSynced(): Promise<void> {
    const db = await getDb();
    await db.runAsync(`DELETE FROM checkin_outbox WHERE status = 'synced'`);
  },
};
