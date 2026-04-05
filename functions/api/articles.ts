export async function onRequestGet(context: any) {
  const { env } = context;
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    return new Response(JSON.stringify([]), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: 'SELECT * FROM articles ORDER BY date DESC',
        params: [],
      }),
    });

    const data = await response.json();
    if (!data.success) {
      const errorMsg = data.errors?.[0]?.message || JSON.stringify(data.errors);
      if (errorMsg.includes('no such table: articles')) {
        // Return empty array if table doesn't exist yet
        return new Response(JSON.stringify([]), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: data.errors }), { status: 500 });
    }
    return new Response(JSON.stringify(data.result[0].results || []), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const article = await request.json();
  
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    return new Response(JSON.stringify({ error: 'D1 not configured' }), { status: 400 });
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  
  const sql = `
    INSERT INTO articles (id, title, slug, content, excerpt, category, image, status, author, date, metaTitle, metaDescription, metaKeywords)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      slug = excluded.slug,
      content = excluded.content,
      excerpt = excluded.excerpt,
      category = excluded.category,
      image = excluded.image,
      status = excluded.status,
      author = excluded.author,
      date = excluded.date,
      metaTitle = excluded.metaTitle,
      metaDescription = excluded.metaDescription,
      metaKeywords = excluded.metaKeywords
  `;
  const params = [
    article.id, article.title, article.slug, article.content, article.excerpt,
    article.category, article.image, article.status, article.author, article.date,
    article.metaTitle, article.metaDescription, article.metaKeywords
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
