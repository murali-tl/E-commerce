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
}

module.exports = {
    Constants,
    Response,
}