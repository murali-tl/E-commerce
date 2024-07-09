const crypto = require('crypto');
const { Response } = require('./constants');
require('dotenv').config({ path: '../.env' });
const jwt = require("jsonwebtoken");

const { user } = require('../models/index');
const { otp_notification } = require('../models/index');
const { where } = require('sequelize');
const { emit } = require('process');
const e = require('express');

function generateAccessToken(user_details) {
    return jwt.sign(user_details, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
}

const getUser = async (req) => {
    console.info('/login called');
    const { email, password } = req?.body;
    let passwordHash = crypto.createHash('md5').update(password).digest('hex');
    let response = await user.findAll({
        where: {
            email: email,
            password: passwordHash,
        }
    })
    //console.log(response);
    return response;
    //return res.status(200).send(response);
}

const verifyOTP = async (req) => {
    try {
        let { email, otp, new_password } = req?.body;
        let lastRow = await otp_notification.findOne({
            where: {
                email: email,
                otp_hash: crypto.createHash('md5').update(otp).digest('hex')
            },
            order: [['created_at', 'DESC']]
        });
        let userDetails = await user.findOne({
            where:{
                email: req?.body?.email
            }
        });
        //return lastRow;
        if(lastRow && userDetails){
            await user.update({
                password: new_password
            },
            {
                where: {
                    email: email
                }
            }
        );
        return res.status(200).send(new Response(true, 'Passsword updated', {}));
        }
        else{
            return res.status(400).send(new Response(false, 'User not found', {}));
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(new Response(false, 'Error while resetting password', { ERROR: err }));
    }
}

module.exports = {
    getUser,
    generateAccessToken,
    verifyOTP
};