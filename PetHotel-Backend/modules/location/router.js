const express = require('express');
const LocationModel = require('../location/model');
const joi = require('@hapi/joi');
const locationRouter = express.Router();
const CityModel = require('../city/model');
const UsersModel = require('../users/model');
const sendMail = require('..//processing/sendMail');

function checkDistrict(nameDistrict,arrayDistrict) {
    var result = false;
    for (let i = 0; i < arrayDistrict.length; i++) {
        if(nameDistrict==arrayDistrict[i]) {
            result = true;
            break;
        }
    };
    return result;
}

// create new Location (for User)
locationRouter.post('/createNewLocation', async (req,res)=> {
    try {
        //check session
        if(req.session.currentUser) {
            //validate 
            const bodyValidation = joi.object({
                nameLocation: joi.string().required(),
                address: {
                    city: joi.string().required(),
                    district: joi.string().required(),
                    detailAddress: joi.string().required(),
                },
                locationMap: joi.options({
                    stripUnknown: true 
                }),
                service: joi.options({
                    stripUnknown: true 
                }),
                petType: joi.options({
                    stripUnknown: true 
                }),

                productivity: joi.number().required(),
                openTime: joi.number().required(),
                closeTime: joi.number().required(),
                highestPrice: joi.string(),
                lowestPrice: joi.string(),
                imageUrl: joi.array().items(joi.string()),
            });

            //check validate
            const validateResult = bodyValidation.validate(req.body);
        if (validateResult.error) {
            res.status(400).json({
                success: false,
                message: validateResult.error.message,
            });
        } else {
            //check city 
            const existedCity = await CityModel.findOne({name: req.body.address.city});
            if (existedCity) {
                // check district 
                if (checkDistrict(req.body.address.district,existedCity.district)) {
                    // check service
                    if (!req.body.service.hairTrimming&&!req.body.service.spaBath&&!req.body.service.takeCare) {
                        res.status(400).json({
                            success: false,
                            message: 'Your location not support any service!!',
                        });
                    } else {
                        // check type
                        if (!req.body.petType.dog&&!req.body.petType.cat) {
                            res.status(400).json({
                                success: false,
                                message: 'Your location not having service for any pet!!',
                            });
                        } else {
                            // save to Database
                            const newLocation = await {
                                nameLocation: req.body.nameLocation,
                                address: {
                                    city: req.body.address.city,
                                    district: req.body.address.district,
                                    detailAddress: req.body.address.detailAddress
                                },
                                locationMap: {
                                    lat: req.body.locationMap.lat,
                                    lng: req.body.locationMap.lng
                                },
                                service: {
                                    hairTrimming: req.body.service.hairTrimming ,
                                    spaBath: req.body.service.spaBath,
                                    takeCare: req.body.service.takeCare
                                },
                                petType: {
                                    dog: req.body.petType.dog,
                                    cat: req.body.petType.cat,
                                },
                                productivity: req.body.productivity,
                                openTime: req.body.openTime, 
                                closeTime: req.body.closeTime,
                                highestPrice: req.body.highestPrice,
                                lowestPrice: req.body.lowestPrice,
                                imageUrl: req.body.imageUrl,
                                userManager: req.session.currentUser._id,
                            };
                            await LocationModel.create(newLocation);
                            res.status(201).json({
                                success: true,
                            })
                        }
                    }
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Our system havent support this district in city',
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Our system havent support this city',
                });
            }
        }
                
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to do this work',
            })
        }
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// see location (for user)
locationRouter.get('/watch/:id', async (req,res)=> {
    try {
        const idLocation = req.params.id;
        // for Location have been actived
        const  location = await LocationModel.findOne({_id:idLocation, systemActive: true},{systemActive: 0})
        .populate('userManager', 'name email phoneNumber').lean();
        
        if (location) {
            res.status(200).json({
                success: true,
                data: location
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Don t having any result'
            })
        }
        
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

// For admin to wath request have yet 
locationRouter.get('/request-on-stack', async (req,res)=> {
    try {
        //check session
        if(req.session.currentUser) {
            const user = await UsersModel.findOne({email: req.session.currentUser.email});
            if(user.role==1) {
                // only admin to do this work
                const  locationOnStack = await LocationModel.find({ systemActive: false},{nameLocation: 1,address: 1})
                .populate('userManager', 'name email phoneNumber').lean();

                if (locationOnStack) {
                    res.status(200).json({
                        success: true,
                        data: locationOnStack,
                        user: locationOnStack.userManager,
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Can not found'
                    })
                }
            } else {
                res.status(400).json({
                    success: false,    
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to do this work',
            })
        }
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// see detal location for admin
locationRouter.get('/location-request/:id', async (req,res)=> {
    try {
        //check session
        if(req.session.currentUser) {
            const user = await UsersModel.findOne({email: req.session.currentUser.email});
            if(user.role==1) {
                // only admin to do this work
                const idLocation = req.params.id;
                // for Location have been actived
                const  location = await LocationModel.findOne({_id:idLocation}  )
                .populate('userManager', 'name email phoneNumber').lean() ;

                if (location) {
                    res.status(200).json({
                        success: true,
                        data: location,
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Can not found'
                    })
                }
            } else {
                res.status(400).json({
                    success: false,    
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to do this work',
            })
        }
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// admin reject or confirm a location
locationRouter.get('/location-confirm/:id/:status', async (req,res)=> {
    try {
        //check session
        if(req.session.currentUser) {
            const user = await UsersModel.findOne({email: req.session.currentUser.email});
            if(user.role==1) {
                // only admin to do this work
                const idLocation = req.params.id;
                const status = req.params.status;
                // for Location have been actived
                const  location = await LocationModel.findOne({_id:idLocation})
                .populate('userManager', 'name email phoneNumber').lean();

                if (location) {
                    if (status=='confirm') {
                        await LocationModel.updateOne({_id:idLocation},{systemActive: true});
                        // send Mail
                        sendMail(location.userManager.email,'Your location has been approved by Pet Hotel Administrator. Thank you for using our service.',
                        '[Pet Hotel Admin] Confirm Location Registration');
                        res.status(200).json({
                            success: true,
                            message: 'Confirm successfull'
                        })
                    } else if (status=='reject') {
                        await LocationModel.updateOne({_id:idLocation},{systemActive: false});
                        // delete from stack request
                        res.status(200).json({
                            success: true,
                            message: 'Reject successfull'
                        })
                    } else {
                        res.status(400).json({
                            success: false,
                        })
                    }
                    
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Can not found'
                    })
                }
            } else {
                res.status(400).json({
                    success: false,    
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to do this work',
            })
        }
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// send mail to reject
locationRouter.post('/send-reject/:id', async (req,res)=> {
    try {
        //check session
        if(req.session.currentUser) {
            const user = await UsersModel.findOne({email: req.session.currentUser.email});
            if(user.role==1) {
                // only admin to do this work
                const idLocation = req.params.id;
                // for Location have been actived
                const  location = await LocationModel.findOne({_id:idLocation})
                .populate('userManager', 'name email phoneNumber').lean() ;
                if (location) {
                    const content = req.body.content;
                    if (content) {
                        await sendMail(location.userManager.email,`Dear Mr.(Ms.) ${location.userManager.name.firstName},
                    After checking your location registration, We are sorry to reject your registration for the following reason: \n${content}\nPlease check the information that has been registered with us, then re-register and wait for our approval. Thank you for using our service.`,
                    '[Pet Hotel Admin] Reject Location Registration');
                    res.status(200).json({
                        success: true,
                        message: 'Reject successfull',
                    })
                    } else {
                        res.status(404).json({
                            success: false,
                            message: 'Message can not be blank',
                        })
                    }
                    
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Can not found'
                    })
                }
            } else {
                res.status(400).json({
                    success: false,    
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to do this work',
            })
        }
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// show all location in first screen 
// localhost:3001/get-all?pageNumber=1
locationRouter.get('/get-all', async (req,res)=> {
    try {
        const pageNumber = Number(req.query.pageNumber); 
        const cityLocation = req.query.city;

        if(!cityLocation) {
            res.status(404).json({
                success: false,
            })
        } else {
            const existedCity = await CityModel.findOne({name: cityLocation});
            if (existedCity) {
                const total = await LocationModel.find({systemActive: true,'address.city': cityLocation}).countDocuments();
                const data = await LocationModel.find({systemActive: true,'address.city': cityLocation})
                .select({systemActive: 0})
                .sort({createdAt: -1})
                .populate('userManager', 'name email phoneNumber')
                .skip((pageNumber-1)*12)
                .limit(12)
                .lean();

        res.status(200).json({
            success: true,
            data : data,
            total,
        })
            } else {
                res.status(404).json({
                    success: false,
                })
            }
        }

        
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

// find by filter
// localhost:3001/find?city=&district=&keyword=
locationRouter.get('/find', async (req,res)=> {
    try {
        const city = req.query.city;
        const district = req.query.district;
        const keyword = req.query.keyword;
        const pageNumber = Number(req.query.pageNumber);

        //check city and district
        const existedCity = await CityModel.findOne({name: city});
        if (existedCity) {
            // check district 
            if (checkDistrict(district,existedCity.district)) {
                const total = await LocationModel.find({nameLocation: {$regex: keyword, $options: 'i'},systemActive: true,
                'address.city': city, 'address.district': district}).countDocuments();
                
                const data = await LocationModel.find({nameLocation: {$regex: keyword, $options: 'i'},systemActive: true,
                'address.city': city, 'address.district': district})
                .select({systemActive: 0})
                .populate('userManage', 'name, email, phoneNumber')
                .skip((pageNumber-1)*12)
                .limit(12)
                .lean();

                // retrun data result 
                res.status(200).json({
                    success: true,
                    data: data,
                    total: total
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Distric not have'
                })
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'City not have',
            })
        }

    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})




module.exports = locationRouter;