import "server-only";

import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { initialBlogs, type BlogPost } from "@/data/blogs";
import { profileData, type ProfileData } from "@/data/profile";

type SqliteRow = { data: string };

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

type MessageRow = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: number;
};

function getLocalDatabase() {
  const globalForDatabase = globalThis as typeof globalThis & {
    portfolioDatabase?: DatabaseSync;
  };

  if (!globalForDatabase.portfolioDatabase) {
    const databasePath = process.env.LOCAL_DATABASE_PATH
      ? path.resolve(process.env.LOCAL_DATABASE_PATH)
      : path.join(process.cwd(), "data", "portfolio.db");
    const database = new DatabaseSync(databasePath);

    database.exec(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS blogs (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL,
        read INTEGER NOT NULL DEFAULT 0
      );
    `);

    database
      .prepare("INSERT OR IGNORE INTO profile (id, data, updated_at) VALUES (1, ?, ?)")
      .run(JSON.stringify(profileData), new Date().toISOString());

    const insertBlog = database.prepare(
      "INSERT OR IGNORE INTO blogs (id, data, created_at) VALUES (?, ?, ?)",
    );
    for (const blog of initialBlogs) {
      insertBlog.run(blog.id, JSON.stringify(blog), new Date().toISOString());
    }

    globalForDatabase.portfolioDatabase = database;
  }

  return globalForDatabase.portfolioDatabase;
}

export async function getProfile(): Promise<ProfileData> {
  const row = getLocalDatabase()
    .prepare("SELECT data FROM profile WHERE id = 1")
    .get() as SqliteRow | undefined;

  if (!row) throw new Error("Profile not found");
  return JSON.parse(row.data) as ProfileData;
}

export async function saveProfile(profile: ProfileData): Promise<ProfileData> {
  getLocalDatabase()
    .prepare("UPDATE profile SET data = ?, updated_at = ? WHERE id = 1")
    .run(JSON.stringify(profile), new Date().toISOString());

  return profile;
}

export async function getBlogs(): Promise<BlogPost[]> {
  const rows = getLocalDatabase()
    .prepare("SELECT data FROM blogs ORDER BY created_at DESC")
    .all() as SqliteRow[];
  return rows.map((row) => JSON.parse(row.data) as BlogPost);
}

export async function saveBlog(blog: BlogPost): Promise<BlogPost> {
  getLocalDatabase()
    .prepare(`
      INSERT INTO blogs (id, data, created_at) VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data
    `)
    .run(blog.id, JSON.stringify(blog), new Date().toISOString());

  return blog;
}

export async function deleteBlog(id: string): Promise<void> {
  getLocalDatabase().prepare("DELETE FROM blogs WHERE id = ?").run(id);
}

export async function saveMessage(message: { name: string; email: string; message: string }): Promise<void> {
  getLocalDatabase()
    .prepare("INSERT INTO messages (name, email, message, created_at, read) VALUES (?, ?, ?, ?, 0)")
    .run(message.name, message.email, message.message, new Date().toISOString());
}

export async function getMessages(): Promise<ContactMessage[]> {
  const rows = getLocalDatabase()
    .prepare("SELECT id, name, email, message, created_at, read FROM messages ORDER BY created_at DESC")
    .all() as MessageRow[];
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
    read: Boolean(row.read),
  }));
}

export async function markMessageRead(id: number): Promise<void> {
  getLocalDatabase().prepare("UPDATE messages SET read = 1 WHERE id = ?").run(id);
}

export async function deleteMessage(id: number): Promise<void> {
  getLocalDatabase().prepare("DELETE FROM messages WHERE id = ?").run(id);
}
