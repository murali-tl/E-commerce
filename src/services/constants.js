class Response {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

class Constants {
    static USER = ['full_name', 'email', 'password'];
    static SHIPPING_DETAILS = {
        'sure_post': [5, 7],
        'ground_shipping': [3, 5]
    }
    static SHIPPING_PRICES = {
        'sure_post': 0,
        'ground_shipping': 0
    }
    static ADMIN = 'admin';
    static CUSTOMER = 'customer';
    static PAYMENT_STATUS = ['pending', 'paid'];
    static ORDER_STATUS = ['created', 'placed'];
    static PRODUCT_STATUS = ['available', 'deleted'];
    static PRODUCT_DETAILS = ['product_id', 'product_name', 'description'];
}


module.exports = {
    Constants,
    Response,
}