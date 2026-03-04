const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
const HUB_URL = process.env.HUB_URL;

app.get('/', (req, res) => {
    const host = req.headers.host;
    const globalId = req.cookies.GLOBAL_ID;

    if (req.query.id && !globalId) {
        res.cookie("GLOBAL_ID", req.query.id, { httpOnly: true, secure: true, sameSite: "lax" });
        return res.redirect('/'); 
    }

    if (!globalId) {
        return res.redirect(`${HUB_URL}/sync?origin=https://${host}`);
    }

    res.send(`
        <body style="font-family:sans-serif; padding:50px; background:#f0f8ff;">
            <h1>Redirect Test (Case 1)</h1>
            <h2>Domain: ${host}</h2>
            <div style="padding:20px; border:2px solid green; background:white;">
                Synced Identity: <b style="font-size:1.5em; color:green;">${globalId}</b>
            </div>
            <p>Verification: Visit other c1-x site to see if the ID matches.</p>
        </body>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Site running on ${PORT}`));