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

    if (!req.cookies.LOCAL_ID) {
        res.cookie("LOCAL_ID", "ID-FROM-" + host.split('.')[0].toUpperCase(), { 
            httpOnly: true, 
            secure: true, 
            sameSite: "none" 
        });
    }

    res.send(`
        <body style="font-family:sans-serif; padding:50px; background:#fff5ee;">
            <h1>Script Fetch Test (Case 2)</h1>
            <h2>Current Domain: ${host}</h2>
            <p>Target Peer: <b>${peerUrl}</b></p>
            
            <button style="padding:10px 20px; cursor:pointer;" onclick="scan()">
                Fetch Peer ID
            </button>
            
            <div id="out" style="margin-top:20px; padding:20px; border:2px dashed #d35400;">
                Click to start scan...
            </div>

            <script>
                async function scan() {
                    const out = document.getElementById('out');
                    out.innerText = "Attempting background sync...";
                    try {
                        const r = await fetch('${peerUrl}/get_id_sync', { credentials: 'include' });
                        const d = await r.json();
                        out.innerHTML = "Peer Response: <b style='color:red;'>" + d.global_id + "</b>";
                    } catch(e) {
                        out.innerText = "Network Error: Blocked by Browser Security";
                    }
                }
            </script>
        </body>
    `);
});

app.get('/get_id_sync', (req, res) => {
    const cookie = req.cookies.LOCAL_ID;
    res.json({ global_id: cookie || "BROWSER_BLOCKED_COOKIE" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Peer Site running on ${PORT}`));