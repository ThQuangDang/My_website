const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const User = new Schema({
    name:{type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type:String},
    phone: {type: String},
    isAdmin: {type: Boolean}
},
{
    timestamps: true,
  },
)

const UserModel = mongoose.model('User', User)

module.exports = {
    UserModel
}