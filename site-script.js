const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.get('/', (req, res) => {
    const host = req.headers.host;
    const peerUrl = process.env.PEER_URL; 
    let currentId = req.cookies.GLOBAL_ID;

    if (!currentId) {
        currentId = "ID-" + Math.floor(Math.random() * 9999);
        res.cookie("GLOBAL_ID", currentId, { 
            httpOnly: true, 
            secure: true, 
            sameSite: "none", 
            maxAge: 3600000,
            path: "/"
        });
    }

    res.send(`
        <body style="font-family:sans-serif; padding:50px; background:#fff5ee;">
            <h1>Peer-to-Peer Relay (Case 2)</h1>
            <h2>Current Domain: ${host}</h2>
            <div style="padding:15px; background:white; border:1px solid #ddd; border-radius:8px;">
                <p>Local ID Status: <b id="local-status" style="color:blue;">${currentId}</b></p>
            </div>
            
            <br>
            <button style="padding:10px 20px; cursor:pointer; font-weight:bold;" onclick="syncFromPeer()">
                Sync from Peer Domain
            </button>
            
            <div id="out" style="margin-top:20px; padding:20px; border:2px dashed #d35400; border-radius:8px; background:#fffcf9;">
                Status: Ready to test...
            </div>

            <script>
                async function syncFromPeer() {
                    const out = document.getElementById('out');
                    out.innerText = "Requesting ID from ${peerUrl}...";
                    
                    try {
                        // Attempt to fetch the cookie from the peer site
                        const r = await fetch('${peerUrl}/get_id_sync', { credentials: 'include' });
                        const d = await r.json();
                        
                        // If we successfully get a real ID (Standard Mode)
                        if (d.global_id && d.global_id !== "BROWSER_BLOCKED_COOKIE") {
                            // ADOPTION: Save the peer's ID into our own cookie jar
                            document.cookie = "GLOBAL_ID=" + d.global_id + "; path=/; max-age=3600; SameSite=None; Secure";
                            
                            out.innerHTML = "✅ <b>Success!</b> Identity adopted: <span style='color:green; font-size:1.2em;'>" + d.global_id + "</span>";
                            document.getElementById('local-status').innerText = d.global_id;
                            document.getElementById('local-status').style.color = "green";
                        } 
                        // If the browser stripped the cookie (Incognito Mode)
                        else {
                            out.innerHTML = "❌ <b>Blocked:</b> Browser refused to send Peer's cookie.<br><small>Response: " + d.global_id + "</small>";
                            out.style.borderColor = "red";
                        }
                    } catch(e) {
                        out.innerHTML = "❌ <b>Network Error:</b> Check CORS or if Peer is awake.";
                    }
                }
            </script>
        </body>
    `);
});

app.get('/get_id_sync', (req, res) => {
    const id = req.cookies.GLOBAL_ID;
    
    if (!id) {
        return res.json({ global_id: "BROWSER_BLOCKED_COOKIE" });
    }
    
    res.json({ global_id: id });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));