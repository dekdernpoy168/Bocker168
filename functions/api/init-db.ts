export async function onRequestPost(context: any) {
  const { env } = context;
  
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    return new Response(JSON.stringify({ error: 'D1 not configured' }), { status: 400 });
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  
  const sql = `
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      category TEXT,
      image TEXT,
      status TEXT CHECK(status IN ('published', 'draft', 'scheduled')),
      author TEXT,
      date TEXT,
      metaTitle TEXT,
      metaDescription TEXT,
      metaKeywords TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params: [],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ success: true, message: 'Database initialized successfully' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
