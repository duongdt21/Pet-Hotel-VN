const express = require('express');
const CityModel = require('../city/model');

const cityRouter = express.Router();

cityRouter.get('/getCity', async (req,res)=> {
    try {        
        const data = await CityModel.find({},{name: 1, _id: 0}).lean();
        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// /getDistrict?city=

cityRouter.get('/getDistrict', async (req,res)=> {
    try {

        const data = await  CityModel.findOne({name: req.query.city},{district: 1,_id: 0}).lean();
        if (data) {
            res.status(200).json({
                success: true,
                data: data,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Can not find this city'
            })
        }
        
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = cityRouter;