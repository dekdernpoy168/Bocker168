export async function onRequestDelete(context: any) {
  const { env, params } = context;
  const id = params.id;
  
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    return new Response(JSON.stringify({ error: 'D1 not configured' }), { status: 400 });
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
        sql: 'DELETE FROM articles WHERE id = ?',
        params: [id],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
