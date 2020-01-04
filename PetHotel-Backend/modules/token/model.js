const mongoose = require('mongoose');

// email , token

const TokenSchema = new mongoose.Schema({
    token : {
        required: true,
        type: String
    },

    email: {
        required: true,
        type: String,
    },
    tokenType: {
        required: true,
        type: Number, // 1 for verify account 2 for reset password
    }
  }, {
    timestamps: true,
  });
  
  const TokenModel = mongoose.model('Token', TokenSchema);
  
  module.exports = TokenModel;