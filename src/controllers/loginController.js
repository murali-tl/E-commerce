const {Response} = require('../services/constants');
const refreshTokens = require('../database/refreshToken.json');
const {getUser, verifyOTP, generateAccessToken} = require('../services/loginServices');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const { user } = require('../models/index');
const {sendOTP} = require('../services/otpServices.js');
require('dotenv').config({ path: '../.env' });
const {isAdmin} = require('../services/validations.js')

const login = async (req, res) => {
    const response = await getUser(req);
    if (response?.length) {
        const user = { user_id: response[0].user_id };
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        refreshTokens.push(refreshToken);
        let role = (await isAdmin(user?.user_id))? 'admin': 'customer'
        fs.writeFileSync(__dirname+'/../database/refreshToken.json', JSON.stringify(refreshTokens));
        return res.status(200).send(new Response(true, 'Tokens Generated', {role: role, accessToken: accessToken, refreshToken: refreshToken }));
    }
    else {
        return res.status(400).send(new Response(false, 'User not found', {}));
    }
}

const resetPassword = async (req, res) => {
    const lastRow = await verifyOTP(req);
    if (lastRow) {
        await user.update({
            password: new_password
        });
        return res.status(200).send(new Response(true, 'New password updated', {}));
    }
    else {
        return res.status(400).send(new Response(false, 'Email or OTP is incorrect', {}));
    }
}

const generateOTP = async (req, res) => {
    const isSent = await sendOTP(req);
    if(isSent.status === false){
        return res.status(400).send(new Response(true, 'Invalid email or user does not exist', {}));
    }
    if(isSent){
        return res.status(200).send(new Response(true, 'OTP sent', isSent.response));
    }
    return res.send(new Response(false, 'Error while sending', { ERROR: err }));
}

module.exports = {
    login,
    resetPassword,
    generateOTP
}