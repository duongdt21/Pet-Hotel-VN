const express = require('express');
const joi = require('@hapi/joi');
const UsersModel = require('../users/model');
const hashMd5 = require('md5');
const sendMail = require('..//processing/sendMail');
const token = require('..//processing/createToken');
const TokenModel = require('..//token/model');
const base64 = require('base-64');

// router
const authRouter = express.Router();
// login
authRouter.post('/login', async (req,res) => {
    try {
        // check exist email
    const existedEmail = await UsersModel.findOne({email: req.body.email});
    if (!existedEmail) {
        res.status(400).json({
            success: false,
            message: 'Email not have',
        });
    } else {
        if (existedEmail.password!==hashMd5(req.body.password)) {
            res.status(400).json({
                success: false,
                message: 'Wrong password',
              });
        } else {
            if (existedEmail.active) {
                req.session.currentUser = {
                    _id: existedEmail._id,
                    email: existedEmail.email,
                  };
            
                  res.status(200).json({
                    //role, name
                    role: existedEmail.role,
                    name: existedEmail.name,  
                    success: true,
                    
                  });
                
            } else {
                res.status(200).json({
                    success: false,
                    message: 'This account not have yet verify. Please check your mail to verify!',
                })
            }
              
              
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          });
          
    }
        });

//register
authRouter.post('/register',async (req,res)=> {
    //validate
    try {
        const bodyValidation = joi.object({
            email: joi.string()
            .required()
            .pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
            .error(() => {
                return new Error('Invalid email address');
            }),
            password: joi.string()
            .required()
            .pattern(/^[a-zA-Z0-9]{6,30}$/)
            .error(() => {
                return new Error('Passsword only allow alphanumeric, at least 6 characters');
            }),
            confirmPass: joi.string()
            .required()
            .pattern(/^[a-zA-Z0-9]{6,30}$/)
            .error(() => {
                return new Error('Passsword only allow alphanumeric, at least 6 characters');
            }),
            name: {
                firstName: joi.string()
                .required()
                .min(2)
                .max(100)
                .error(() => {
                  return new Error('First name at least 2 characters');
                }),
                lastName: joi.string()
                .required()
                .min(2)
                .max(100)
                .error(() => {
                  return new Error('Last name at least 2 characters');
                }),
            },
            phoneNumber: joi.string().
            pattern(/^0\d{9}$/)
            .error(()=>{
                return new Error('Phone Number only allow number and must be VN phone number');
            })
        });
        // check validate from request
        const validateResult = bodyValidation.validate(req.body);
        if (validateResult.error) {
            res.status(400).json({
                success: false,
                message: validateResult.error.message,
            });
        } else {
            // check existed Email
        const existedEmail = await UsersModel.findOne({email: req.body.email});
        if (existedEmail) {
            res.status(400).json({
                success: false,
                message: 'Email has beed used',
            });
        } else {
        if (req.body.password!=req.body.confirmPass) {
            res.status(400).json({
                success: false,
                message: 'Confirm password must be the same pass',
            });
        } else {
            const newUser = {
                name: {
                    firstName: req.body.name.firstName,
                    lastName: req.body.name.lastName,
                },
                email: req.body.email,
                password: hashMd5(req.body.password),
                phoneNumber: req.body.phoneNumber,
                role: 0,
                active: false,
            };
    
            await UsersModel.create(newUser);
            
            // send Mail to verify email. Send to client email with a random token 
    
            const newToken = await {
                token: token(),
                email: newUser.email,
                tokenType: 1,
            }
    
            const verifyLink = await `http://localhost:3000/api/auth/verify?token=${base64.encode(newToken.email)+'-'+base64.encode(newToken.token)}`;   
            await TokenModel.create(newToken);
            sendMail(newUser.email,
                `Welcome to you use our system. Please click to this link to verify your email and join with Pets Hotel 
                ${verifyLink}`
                ,
                '[Pets Hotel Admin] Confirm take part in by this email address');
    
                res.status(201).json({
                    success: true,
                  });
        
        }
        //save to Database

        
        }


        
        
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          });
          
    }
});

//verify email address
authRouter.get('/verify', async (req,res)=> {
    
    try {
        const bodyRequest = req.query.token;
        
        const email = base64.decode(bodyRequest.split('-')[0]);
        const token = base64.decode(bodyRequest.split('-')[1]);

        
        // check existed Token and mail
        const existedEmail = await TokenModel.findOne({token: token});
    
        if (existedEmail) {
            
            if (existedEmail.email == email && existedEmail.tokenType==1 ){
                await UsersModel.updateOne({'email' : email}, {'active' : true});
                await TokenModel.deleteOne({token: token});
                
                res.redirect('http://localhost:3000/login');
            } else {
                res.status(400).json({
                    success: false,
                    message: "bad request",
                });
            }
         } else {
                res.status(400).json({
                    success: false,
                    message: "bad request",
                });
            }
        
    } catch (error) {
        
        res.status(500).json({
            success: false, 
            message: error.message,
          });
    }

});

//send email with link reset password for client. 

authRouter.get('/forgotPassword', async (req,res)=> {
    try  {
        const emailAddress = req.query.email;

        //check mail exist

        const existedEmail = await UsersModel.findOne({email: emailAddress});

        if (existedEmail) {
            const newToken = await {
                token: token(),
                email: emailAddress,
                tokenType: 2, // 2 for token to reset password
            };
            // send mail with Link to reset.!!!     REMEMBER TO SWITCH TO FRONTEND LINK WEB
            const verifyLink = await `http://pethotel-vn.herokuapp.com/reset?token=${base64.encode(newToken.email)+'-'+base64.encode(newToken.token)}`;   
            await TokenModel.create(newToken);
            await sendMail(emailAddress,
                `Welcome back. Please click to this link to reset your password in Pets Hotel.  
                ${verifyLink}
                `,
                '[Pets Hotel Admin] Reset Password for your account');
            await res.status(201).json({
                success: true,
                message: 'Please check your email',
            });    
    
        } else {
            
            res.status(400).json({
                success: false,
                message: 'Email address not existed',
              });
        }

        
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false, 
            message: error.message,
          });
    }
});

// get information 
authRouter.get('/check', async (req,res)=> {
    try {
        if (req.session.currentUser) {
            const existedEmail = await UsersModel.findOne({email: req.session.currentUser.email});
            if (existedEmail) {
                res.status(200).json({
                    success: true,
                    data: {
                        role :existedEmail.role,
                        name: existedEmail.name,
                        phoneNumber: existedEmail.phoneNumber,
                    }
                })
            } else {
                res.status(400).json({
                    success: false,
                })
            }
            
        } else {
            res.status(200).json({
                success: false,
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false, 
            message: error.message,
          });
    }
})

// reset pass when client forgot it
authRouter.post('/resetPassword', async(req,res)=> {
    try {

    const tokenEmail = req.body.token;
    
    const email = base64.decode(tokenEmail.split('-')[0]);
    const token = base64.decode(tokenEmail.split('-')[1]);

    const existedEmail = await TokenModel.findOne({token: token,email:email,tokenType: 2});

    

    // validate 
    const bodyValidation = joi.object({
        password: joi.string()
            .required()
            .pattern(/^[a-zA-Z0-9]{6,30}$/)
            .error(() => {
                return new Error('Passsword only allow alphanumeric, at least 6 characters');
            }),
        confirmPass: joi.string()
            .required()
            .pattern(/^[a-zA-Z0-9]{6,30}$/)
            .error(() => {
                return new Error('Passsword only allow alphanumeric, at least 6 characters');
            }),    
        token: joi.string().required(),    
    });
    if (existedEmail)  {
        const totalMinutes  = await Math.round((new Date().getTime() - existedEmail.createdAt)/ 1000 / 60);
        if(totalMinutes<=15) {
            const password = req.body.password;
            const confirmPass = req.body.confirmPass;

            const validateResult = bodyValidation.validate(req.body);

            if (validateResult.error) {
                res.status(400).json({
                    success: false,
                    message: validateResult.error.message,
                });
            } else {
                if (password===confirmPass) { 
                    await UsersModel.updateOne({'email' : email}, {'password' : hashMd5(password)});
                    await TokenModel.deleteOne({token: token});
                    res.status(201).json({
                        success: true,
                    });
                } else {
                    res.status(201).json({
                        success: false,
                        message: 'Password and Confirm Password must be the same',
                    });
                }
            }

        } else {
            await TokenModel.deleteOne({token: token});
            res.status(201).json({
                success: false,
                message: 'This link has expired',
            });

        }
    } else {
        res.status(400).json({
            success: false,
            message: "Wrong Token",
        });
    }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false, 
            message: error.message,
          });
    }
});

// update information: name: {firstName, lastName}, phoneNumber
// localhost:3001/api/auth/updateInfo?firstName=aaaa&lastName=bbbb&phoneNumber=00968568754567
authRouter.post('/updateInfo', async (req,res)=>{
    try {
        const phoneNumber = req.body.phoneNumber;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        const dataUpdate = {
            phoneNumber: phoneNumber,
            firstName: firstName,
            lastName: lastName,
        };
        // validate
        const bodyValidation = joi.object({
            firstName: joi.string()
                .required()
                .min(2)
                .max(100)
                .error(() => {
                  return new Error('First name at least 2 characters');
                }),
            lastName: joi.string()
                .required()
                .min(2)
                .max(100)
                .error(() => {
                  return new Error('Last name at least 2 characters');
                }),
            phoneNumber: joi.string().
                pattern(/^0\d{9}$/)
                .error(()=>{
                    return new Error('Phone Number only allow number');
                })
        });

        if (req.session.currentUser) {
            const validateResult = bodyValidation.validate(dataUpdate);
            if (validateResult.error) {
                res.status(400).json({
                    success: false,
                    message: validateResult.error.message,
                });
            } else {
                //update to database
                await UsersModel.updateOne({'email' : req.session.currentUser.email}, {'phoneNumber' : phoneNumber,name:{'firstName':firstName,'lastName':lastName}});
                res.status(201).json({
                    success: true,
                });
            }
            
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to use this function',
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false, 
            message: error.message,
          });
    }
});

//change password
authRouter.post('/changePassword',async (req,res)=>{
    try {
        const oldPass = req.body.oldPass;
        const newPass = req.body.newPass;
        const confirmPass = req.body.confirmPass;
        // validate 
        const newPassword = {
            newPass: newPass,
            confirmPass: confirmPass,
        };
        const bodyValidation = joi.object({
        newPass: joi.string()
            .required()
            .pattern(/^[a-zA-Z0-9]{6,30}$/)
            .error(() => {
                return new Error('Passsword only allow alphanumeric, at least 6 characters');
            }),
        confirmPass: joi.string()
            .required()
            .pattern(/^[a-zA-Z0-9]{6,30}$/)
            .error(() => {
                return new Error('Passsword only allow alphanumeric, at least 6 characters');
            }),    
       
    });
        if (req.session.currentUser) {
            const existedEmail = await UsersModel.findOne({email: req.session.currentUser.email});
            if (hashMd5(oldPass)!=existedEmail.password) {
                res.status(400).json({
                    success: false,
                    message: 'Wrong password',
                })
            } else {
                //check Validate new pass
                const validateResult = bodyValidation.validate(newPassword);
                if (validateResult.error) {
                    res.status(400).json({
                        success: false,
                        message: validateResult.error.message,
                    });
                } else {
                    if (newPass!=confirmPass) {
                        res.status(400).json({
                            success: false,
                            message: 'New password and confirm password must be the same'
                        })
                    } else {
                        await UsersModel.updateOne({'email' : req.session.currentUser.email}, {'password': hashMd5(newPass)});
                        res.status(201).json({
                            success: true,
                        });
                    }
                }
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to use this function'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false, 
            message: error.message,
          });
    }
});
// log out
authRouter.get('/logout', (req,res)=> {
    req.session.destroy((err)=>{
        if (err) {
          res.status(500).json({
            success: false,
            message: err.message,        
          })
        } else {
          res.status(200).json({
            success: true,
          })
        }
      })
});

module.exports = authRouter;