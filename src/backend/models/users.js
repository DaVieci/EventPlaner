const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/** Schema for users
 * @constructor
 */
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    }
}, { timestamps: true })

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;