module.exports = async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method && req.method !== 'GET') {
        res.status(405).json({ error: 'method_not_allowed' });
        return;
    }

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) {
        res.status(500).json({
            error: 'missing_instagram_access_token',
            message: 'Defina INSTAGRAM_ACCESS_TOKEN no ambiente do servidor.'
        });
        return;
    }

    const requestedLimit = Number.parseInt((req.query && req.query.limit) || '6', 10);
    const limit = Number.isNaN(requestedLimit) ? 6 : Math.max(1, Math.min(requestedLimit, 12));

    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = 'https://graph.instagram.com/me/media?fields='
        + encodeURIComponent(fields)
        + '&limit=' + limit
        + '&access_token=' + encodeURIComponent(accessToken);

    try {
        const response = await fetch(url);
        const payload = await response.json();

        if (!response.ok) {
            res.status(response.status).json({
                error: 'instagram_request_failed',
                details: payload
            });
            return;
        }

        const data = Array.isArray(payload.data) ? payload.data : [];
        const posts = data.map(function(item) {
            return {
                id: item.id,
                caption: item.caption || '',
                media_type: item.media_type || 'IMAGE',
                media_url: item.media_url || item.thumbnail_url || '',
                thumbnail_url: item.thumbnail_url || '',
                permalink: item.permalink || '',
                timestamp: item.timestamp || ''
            };
        }).filter(function(item) {
            return item.media_url && item.permalink;
        });

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
        res.status(200).json({ posts: posts });
    } catch (error) {
        res.status(500).json({
            error: 'instagram_fetch_unavailable',
            message: 'Não foi possível carregar publicações do Instagram agora.'
        });
    }
};

