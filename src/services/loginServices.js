const crypto = require('crypto');
const { Response } = require('./constants');
require('dotenv').config({ path: '../.env' });
const jwt = require("jsonwebtoken");

const { user } = require('../models/index');
const { otp_notification } = require('../models/index');


function generateAccessToken(user_details) {
    return jwt.sign(user_details, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
}

const getUser = async (data) => {
    const { email, password } = data;
    let passwordHash = crypto.createHash('md5').update(password).digest('hex');
    let response = await user.findAll({
        where: {
            email: email,
            password: passwordHash,
            user_status: 'active'
        }
    })
    return response;
}


const verifyOTP = async (data) => {
    try {
        let { user_id, otp, new_password } = data;
        let userDetails = await user.findOne({
            where:{
                user_id: user_id
            }
        });
        let lastRow = await otp_notification.findOne({
            where: {
                email: userDetails?.email,
                otp_hash: crypto.createHash('md5').update(otp).digest('hex')
            },
            order: [['created_at', 'DESC']]
        });
        if(lastRow && userDetails){
            await user.update({
                password: crypto.createHash('md5').update(new_password).digest('hex') // hash it  ---
            },
            {
                where: {
                    user_id: user_id
                }
            }
        );
        }
    return lastRow;
    }
    catch (err) {
        console.log(err);
        return  false;
    }
}

module.exports = {
    getUser,
    generateAccessToken,
    verifyOTP
};