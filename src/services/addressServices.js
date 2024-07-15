const { user_addresses } = require('../models/index');
const { validateArgs } = require('./utils');

const getAdresses = async (user_id) => {
    try {
        let addresses = await user_addresses.findAll({
            where: {
                user_id: user_id
            }
        });
        if (addresses.length) {
            return { success: true, status: 200, message: 'Addresses fetched', data: { "addresses": addresses } };
        }
        else {
            return { success: false, status: 400, message: 'No addresses found', data: {} };
        }
    }
    catch (err) {
        return { "error": err };
    }
}

const createAddress = async (data, user_id) => {  //address validation
    try {
        const { first_name, second_name, address_line1, address_line2, city, pincode, country, mobile } = data;
        await user_addresses.create({
            user_id: user_id,
            first_name: first_name,
            second_name: second_name,
            address_line1: address_line1,
            address_line2: address_line2,
            city: city,
            pincode: pincode,
            country: country,
            mobile: mobile  //do we need to validate ??
        });
        return { success: true, status: 200, message: 'Address added', data: {} };

    }
    catch (err) {
        return { "error": err };
    }
}

module.exports = {
    getAdresses,
    createAddress
}