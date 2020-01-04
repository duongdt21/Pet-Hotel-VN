const alpha = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
const length = alpha.length;
const TokenModel = require('..//token/model');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


function createToken() {
    

    var token = '';
    for (let i = 0 ; i<=20; i++) {
        token =  token + alpha[getRandomInt(length)];
    }

    // make sure that don't having 2 token the same each other
    
    // const existedToken = await TokenModel.findOne({'token': token});
    
    // if(!existedToken) {
    //     console.log("A");
    // } else {
    //     return createToken();   
    // }    
    return token;
};

module.exports = createToken;
