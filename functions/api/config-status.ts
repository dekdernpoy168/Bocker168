export async function onRequestGet(context: any) {
  const { env } = context;
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  const isD1Configured = !!(accountId && accountId !== 'YOUR_ACCOUNT_ID' && 
                            databaseId && databaseId !== 'YOUR_DATABASE_ID' && 
                            apiToken && apiToken !== 'YOUR_API_TOKEN');

  return new Response(JSON.stringify({
    d1Configured: isD1Configured,
    fallbackMode: !isD1Configured
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
