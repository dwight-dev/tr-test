const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

app.get('/sync', (req, res) => {
    let globalId = req.cookies.GLOBAL_ID || "UID-" + Math.floor(Math.random() * 9999);

    res.cookie("GLOBAL_ID", globalId, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000, 
        path: "/"
    });

    const origin = req.query.origin;
    if (!origin) return res.status(400).send("Missing origin");
    
    res.redirect(`${origin}?id=${globalId}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hub running on ${PORT}`));