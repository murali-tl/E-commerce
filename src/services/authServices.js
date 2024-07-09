const {Response} = require('./constants');
require('dotenv').config({ path: '../.env' });
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    try {
        const authHeader = req?.headers['authorization'];
        const token = authHeader?.split(' ')?.[1];
        if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                try {
                    if (err) {
                        return res.status(401).send(new Response(false, 'Token Expired', {}));
                    }
                    req.user = user;
                    next();
                }
                catch (TokenExpiredError) {
                    return res.status(401).send(new Response(false, 'Token Expired', {}));

                }
            })
        }
        else {
            return res.status(403).send(new Response(false, 'Token not found', {}));
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(new Response(false, 'Internal Server Error', {}));
    }
}

module.exports = {
    authenticate
}