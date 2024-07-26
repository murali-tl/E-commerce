const { Response } = require('./constants');
require('dotenv').config({ path: '../.env' });
const jwt = require("jsonwebtoken");
const { getRole } = require('./validations')

function authenticate(authHeader) {
    try {
        console.log('Authentication function called');
        const token = authHeader?.split(' ')?.[1];
        let response = {};
        if (!token) {
            response = { status: 400, success: false, message: 'Token not found' };
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    response = { status: 401, success: false, message: 'Access token is expired' };
                } else {
                    response = { status: 401, success: false, message: 'Access token is invalid' };
                }
            }
            response = { "status": 200, "success": true, "message": 'Token valid', "data": user };
        })

        return response;
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(new Response(false, 'Internal Server Error', {}));
    }
}


const adminAuth = async (req, res, next) => {
    try {
        console.info('Admin auth called.');
        const authHeader = req?.headers['authorization'];
        const resp = authenticate(authHeader);
        if (!resp.success) {
            res.status(resp?.status).send(new Response(resp?.success, resp?.message, {}))
        }
        req.user = resp?.data;
        const roleName = await getRole(resp?.data?.user_id);
        if (!roleName || roleName !== 'admin') {
            return res.status(403).send(new Response(false, 'Access denied.', {}));
        }
        next();
    } catch (error) {
        console.error('Error checking Admin role:', error);
        return res.status(500).send(new Response(false, 'Error while verifying admin', {}));
    }
}

const userAuth = async (req, res, next) => {
    try {
        console.info('User auth called.');
        const authHeader = req?.headers['authorization'];
        const resp = authenticate(authHeader);
        if (!resp.success) {
            res.status(resp?.status).send(new Response(resp?.success, resp?.message, {}))
        }
        req.user = resp?.data;
        next();

    } catch (error) {
        console.error('Error checking user role:', error);
        return res.status(500).send(new Response(false, 'Error while verifying user', {}));
    }
}

module.exports = {
    adminAuth,
    userAuth,
}