const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const HUB_URL = process.env.HUB_URL; // e.g., https://your-hub.onrender.com

app.get('/', (req, res) => {
    const host = req.headers.host;
    const currentId = req.cookies.GLOBAL_ID;

    res.send(`
        <body style="font-family:sans-serif; padding:50px; background:#f4f4f9;">
            <h1>Hub Background Sync (Case 2)</h1>
            <h2>Domain: ${host}</h2>
            <p>Local Cookie: <b id="local-id">${currentId || 'None'}</b></p>

            <button onclick="sync()">Fetch ID from Hub</button>
            <div id="status" style="margin-top:20px; padding:15px; border:1px solid #ccc;">Ready...</div>

            <script>
                async function sync() {
                    const status = document.getElementById('status');
                    status.innerText = "Contacting Hub...";
                    try {
                        // Request the ID from the Hub's /pure_sync endpoint
                        const r = await fetch('${HUB_URL}/pure_sync', { credentials: 'include' });
                        const data = await r.json();

                        if (data.id && data.id !== "COOKIE_UNKNOWN") {
                            // Save the Hub's ID into this local domain's jar
                            document.cookie = "GLOBAL_ID=" + data.id + "; path=/; max-age=3600; SameSite=None; Secure";
                            
                            status.innerHTML = "✅ Identity Synced: " + data.id;
                            document.getElementById('local-id').innerText = data.id;
                        } else {
                            status.innerHTML = "❌ Blocked: Browser refused Hub cookie access.";
                        }
                    } catch(e) {
                        status.innerText = "Error: Hub unreachable or CORS blocked.";
                    }
                }
            </script>
        </body>
    `);
});

app.listen(process.env.PORT || 3000);