const { Response, Constants } = require('../services/constants');
const { getUser, verifyOTP, generateAccessToken } = require('../services/loginServices');
const jwt = require("jsonwebtoken");
const { sendOTP } = require('../services/otpServices.js');
require('dotenv').config({ path: '../.env' });
const { isAdmin } = require('../services/validations.js')

const login = async (req, res) => {
    try {
        console.info('/login called');
        const { email, password } = req?.body;
        const response = await getUser({ email: email, password: password });
        if (response?.length) {
            const user = { user_id: response[0].user_id };
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
            let role = (await isAdmin(user?.user_id)) ? Constants?.ADMIN : Constants?.CUSTOMER;
            return res.status(200).send(new Response(true, 'Tokens Generated', { role: role,email: response[0]?.email, full_name: response[0]?.full_name, accessToken: accessToken, refreshToken: refreshToken }));
        }
        else {
            return res.status(400).send(new Response(false, 'Invalid email or password', {}));
        }
    }
    catch (e) {
        console.error('Login Controller: Error occurred during login', e);
        return res.status(500).send(new Response(false, 'Internal server Error',{}));
    }
}

const resetPassword = async (req, res) => {
    try {
        console.info('/resetPassword called');
        let { user_id, otp, new_password } = req?.body;
        if (!user_id || !otp || !new_password) {
            return res.status(400).send(new Response(false, 'Invalid details', {}));
        }
        const lastRow = await verifyOTP({ user_id, otp, new_password });
        if (lastRow) {
            return res.status(200).send(new Response(true, 'New password updated', {}));
        }
        else {
            return res.status(400).send(new Response(false, 'User details or OTP is incorrect', {}));
        }
    }
    catch (e) {
        console.error('Login Controller: Error occurred during reset password:', e);
        return res.status(500).send(new Response(false, 'Internal server Error', {}));
    }
}

const generateOTP = async (req, res) => {
    try {
        console.info('/generate-otp called');
        let { email } = req?.body;
        if (!email || typeof (email) !== 'string') {
            return res.status(400).send(new Response(false, 'Email not provided', {}));
        }
        const isSent = await sendOTP(email);
        if (!isSent.status) {
            return res.status(400).send(new Response(true, 'Invalid email or user does not exist', {}));
        }
        return res.status(200).send(new Response(true, 'OTP sent', isSent.data));
    }
    catch (e) {
        console.error('Login Controller: Error occurred while sending OTP', e);
        return res.status(500).send(new Response(false, 'Internal server Error', {}));
    }
}

module.exports = {
    login,
    resetPassword,
    generateOTP
}