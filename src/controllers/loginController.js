const { Response } = require('../services/constants');
const refreshTokens = require('../database/refreshToken.json');
const { getUser, verifyOTP, generateAccessToken } = require('../services/loginServices');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const { user } = require('../models/index');
const { sendOTP } = require('../services/otpServices.js');
require('dotenv').config({ path: '../.env' });
const { isAdmin } = require('../services/validations.js')

const login = async (req, res) => {
    console.info('/login called');
    const { email, password } = req?.body;
    const response = await getUser({email, password});
    if (response?.length) {
        const user = { user_id: response[0].user_id };
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        refreshTokens.push(refreshToken);
        let role = (await isAdmin(user?.user_id)) ? 'admin' : 'customer'
        fs.writeFileSync(__dirname + '/../database/refreshToken.json', JSON.stringify(refreshTokens));
        return res.status(200).send(new Response(true, 'Tokens Generated', { role: role, accessToken: accessToken, refreshToken: refreshToken }));
    }
    else {
        return res.status(400).send(new Response(false, 'User not found', {}));
    }
}

const resetPassword = async (req, res) => {
    console.info('/resetPassword called');
    let { email, otp, new_password } = req?.body;
    if(!email || !otp || !new_password){
        return res.status(400).send(new Response(false, 'Invalid details', {}));
    }
    const lastRow = await verifyOTP({email, otp, new_password});
    if (lastRow) {
        return res.status(200).send(new Response(true, 'New password updated', {}));
    }
    else {
        return res.status(400).send(new Response(false, 'Email or OTP is incorrect', {}));
    }
}

const generateOTP = async (req, res) => {
    console.info('/generate-otp called');
    let { email } = req?.body;
    if(!email || typeof(email) !== 'string'){
        return res.status(400).send(new Response(false, 'Email not provided', {}));
    }
    const isSent = await sendOTP(email);
    if (!isSent.status) {
        return res.status(400).send(new Response(true, 'Invalid email or user does not exist', {}));
    }
    return res.status(200).send(new Response(true, 'OTP sent', isSent.data));
}

module.exports = {
    login,
    resetPassword,
    generateOTP
}