const refreshTokens = require('../database/refreshToken.json');
const { Response } = require('../services/constants');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const {generateAccessToken} = require('../services/loginServices');


const refreshToken = (req, res) => {
    console.info("/refreshToken called");
    try {
        const refreshToken = req?.body?.refresh_token;
        if (refreshToken === null) { return res.status(401).send(new Response(false, 'Refresh Token not found', {})) }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).send(new Response(false, 'Invalid Refresh Token', {}));
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).send(new Response(false, 'Refresh token expired',{}));
            const accessToken = generateAccessToken({ user_id: user?.user_id });
            res.json({ accessToken: accessToken });
        })
    }
    catch (err) {
        return res.status(500).send(new Response(false, 'Internal server error', { err: err }));
    }
}



module.exports = {
    refreshToken
}