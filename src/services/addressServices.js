const { user_addresses } = require('../models/index');

const getAdresses = async (user_id) => {
    try {
        let addresses = await user_addresses.findAll({
            where: {
                user_id: user_id
            },
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'mobile'] },
        });
        if (!(addresses.length)) {
            return { success: false, status: 400, message: 'No addresses found', data: {} };
        }
        return { success: true, status: 200, message: 'Addresses fetched', data: { "addresses": addresses } };

    }
    catch (err) {
        return { "error": err };
    }
}

const createAddress = async (data, user_id) => {
    try {
        const { first_name, last_name, address_line1, address_line2, city, pincode, country } = data;
        await user_addresses.create({
            user_id: user_id,
            first_name: first_name,
            last_name: last_name,
            address_line1: address_line1,
            address_line2: address_line2,
            city: city,
            pincode: pincode,
            country: country,
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