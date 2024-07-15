var nodemailer = require('nodemailer');
const { user } = require('../models/index');
require('dotenv').config({ path: '../.env' });
const { otp_notification } = require('../models/index');
const crypto = require('crypto');

const generateOTP = (n) => {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < n; i++) {
        OTP += digits[Math.floor(Math.random() * digits.length)]
    }
    return OTP;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER_NAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendOTP = async (email) => {
    try {
        console.info('/generate-otp called');
        if (!email || typeof (email) !== 'string') {
            return { status: false };
        }
        let generatedOTP = generateOTP(6);
        let userDetails = await user.findOne({
            where: {
                email: email
            }
        });
        //console.log(userDetails?.full_name);
        const mailOptions = {
            from: process.env.EMAIL_USER_NAME,
            to: email,
            subject: 'Reset password for Ecommerce',
            //text: `Following is your OTP to reset password : ${generatedOTP}`,
            html: `<p>Following is your OTP to reset password : ${generatedOTP}</p>
        <p><a href="http://localhost:3000/reset-password/${userDetails?.user_id}">Reset Password</a></p>`
        };
        //console.log(process.env.EMAIL_USER_NAME, process.env.EMAIL_PASSWORD);
        if (email && userDetails) {
            //console.log('hello')
            let info = await transporter.sendMail(mailOptions);
            await otp_notification.create({  //implement here
                email: email,
                otp_hash: crypto.createHash('md5').update(generatedOTP).digest('hex')
            })
            return { status: true, data: info };
        }
        else {
            return { status: false };
        }
    }
    catch (err) {
        console.log(err);
        return { status: false };
    }
}

module.exports = {
    sendOTP
}