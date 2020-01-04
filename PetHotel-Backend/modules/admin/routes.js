const express = require('express');
const joi = require('@hapi/joi');
const UsersModel = require('../users/model');
const hashMd5 = require('md5');

//router 
const adminRouter = express.Router();

// create another admin 
adminRouter.post('/createNewAdmin', async (req,res)=>{
    try {
        // check session 
        if (req.session.currentUser) {
            // check admin
        
        const user = await UsersModel.findOne({email: req.session.currentUser.email});
        if(user.role==1) {
            //validate. account(email), name: {lastName, firstName}, phoneNumber, password default = "pet123"
            const bodyValidation = joi.object({
                email: joi.string()
                .required()
                .error(() => {
                    return new Error('Account can not be blank');
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
                    return new Error('Phone Number only allow number');
                })
            });

            const validateResult = bodyValidation.validate(req.body);
            if (validateResult.error) {
                res.status(400).json({
                    success: false,
                    message: validateResult.error.message,
                });
            } else {
                // check this account existed
                const existedEmail = await UsersModel.findOne({email: req.body.email});
                if (existedEmail) {
                    res.status(400).json({
                        success: false,
                        message: 'Email has beed used',
                    });
                } else {
                    // save to database
                    const newAdmin = await {
                        name: {
                            firstName: req.body.name.firstName,
                            lastName: req.body.name.lastName,
                        },
                        email: req.body.email,
                        password: hashMd5('pet123'),
                        phoneNumber: req.body.phoneNumber,
                        role: 1,
                        active: true,
                    };

                    await UsersModel.create(newAdmin);
                    res.status(200).json({
                        success: true,
                    })
                }    
                
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'you are not admin to do this work'
            })
        }
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to do this work',
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

//delete another admin 

adminRouter.get('/deleteAdmin', async (req,res)=> {
    try {
        // check session
        if (req.session.currentUser) {
            // check admin
            const thisUser = await UsersModel.findOne({email: req.session.currentUser.email});
            if (thisUser.role ==1) {
                const accountWannaDelete = req.query.email;
                // can not delete admin with account admin1 
                if (accountWannaDelete=='admin1') {
                    res.status(200).json({
                        success: false,
                        message: 'you can not delete root admin',
                    });
                } else {
                    const adminWannaDelete = await UsersModel.findOne({email: accountWannaDelete});
                    if (adminWannaDelete) {
                        await UsersModel.deleteOne({email: accountWannaDelete});
                        res.status(200).json({
                            success: true,
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: 'Dont having this account'
                        })
                    }
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: 'you are not admin to do this work'
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to do this work'
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

//show list admin 
adminRouter.get('/allAdmin', async (req,res)=> {
    try {
        // check session
        if (req.session.currentUser) {
            // check admin
            const thisUser = await UsersModel.findOne({email: req.session.currentUser.email});
            if (thisUser.role ==1) {
                const data = await UsersModel.find({role: 1},{name: 1 , phoneNumber: 1, email:1})
                .lean();
                res.status(200).json({
                    success: true,
                    data: data,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'you are not admin to do this work'
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to do this work'
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false, 
            message: error.message,
          });
    }
})


module.exports = adminRouter;