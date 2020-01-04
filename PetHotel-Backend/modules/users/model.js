const mongoose = require('mongoose');

// User: Name : {firstName, lastName }, phoneNumber, email , password, role , active 

const UserSchema = new mongoose.Schema({
    name: {
        firstName : {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        }
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },


    // role for acc: 1 for admin and 0 for user
    role: {
        type: Number,
        required: true,
    },

    active: {
        type: Boolean,
        required: true,
    }
  }, {
    timestamps: true,
  });
  
  const UsersModel = mongoose.model('User', UserSchema);
  
  module.exports = UsersModel;