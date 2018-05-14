const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    image: String,
    gender: String,
    _authentication: Object,
    bigcommerce_id: String,
    company: String,
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    date_created: Date,
    date_modified: Date,
    store_credit: String,
    registration_ip_address: String,
    customer_group_id: String,
    notes: String,
    tax_exempt_category: String,
    accepts_marketing: Boolean,
    addresses: Array,
    form_fields: Object,
    thumbnail: String
});

const user = mongoose.model('user', userSchema)

module.exports = user;
