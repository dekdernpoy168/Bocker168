import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 1) Define the users table
const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

// 2) Describe your Env interface
export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB);
    const url = new URL(request.url);

    // Route to create the users table if it doesn't exist
    if (url.pathname === '/setup') {
      await db.run(sql`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        )
      `);
      return new Response('Table created or already exists!');
    }

    // Route to add a test user
    if (url.pathname === '/add') {
      const newUser = await db.insert(users)
        .values({ name: 'Test User' })
        .returning()
        .get();

      return Response.json(newUser);
    }

    // Route to get all users
    if (url.pathname === '/users') {
      const allUsers = await db.select().from(users).all();
      return Response.json(allUsers);
    }

    // Route to handle IndexNow requests
    if (url.pathname === '/IndexNow' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const { host, key, keyLocation, urlList } = body;

        if (!host || !key || !urlList) {
          return new Response('Missing required fields: host, key, or urlList', { status: 400 });
        }

        const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            host,
            key,
            keyLocation,
            urlList,
          }),
        });

        if (indexNowResponse.ok) {
          return new Response('IndexNow submission successful', { status: 200 });
        } else {
          const errorText = await indexNowResponse.text();
          return new Response(`IndexNow submission failed: ${errorText}`, { status: indexNowResponse.status });
        }
      } catch (error) {
        return new Response(`Error processing IndexNow request: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
      }
    }

    // Default route
    return new Response('D1 Connected!');
  },
};
