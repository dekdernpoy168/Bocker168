export async function onRequestGet(context: any) {
  const { env } = context;
  
  // Write to Analytics Engine if binding exists
  if (env.Bocker168) {
    try {
      env.Bocker168.writeDataPoint({
        blobs: ['view', 'articles'],
        doubles: [1],
        indexes: ['article_list']
      });
    } catch (e) {
      console.error('Analytics error:', e);
    }
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'D1 binding not found' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    const { results } = await env.DB.prepare('SELECT * FROM articles ORDER BY date DESC LIMIT 100').all();
    return new Response(JSON.stringify(results || []), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    if (error.message.includes('no such table')) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const article = await request.json();
  
  // Write to Analytics Engine if binding exists
  if (env.Bocker168) {
    try {
      env.Bocker168.writeDataPoint({
        blobs: ['create', article.category || 'uncategorized'],
        doubles: [1],
        indexes: [article.id || 'new_article']
      });
    } catch (e) {
      console.error('Analytics error:', e);
    }
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'D1 binding not found' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

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
    await env.DB.prepare(sql).bind(...params).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
