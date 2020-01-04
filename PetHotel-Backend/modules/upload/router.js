const express = require('express');
const fs = require('fs');

const uploadsRouter = express.Router();
const multer = require('multer');

const upload = multer({
    dest: 'public/',
});

uploadsRouter.post('/',upload.array('image',5) ,async (req,res)=> {
    try {


        // validate + save 
        var data = [];
        for (let i =0;i<req.files.length;i++) {
            //validate: file type + maximum size file 
    const pathFileName = req.files[i].originalname.split('.')[req.files[i].originalname.split('.').length-1];
    const typeFile = req.files[i].mimetype.split('/')[0];
    const size = req.files[i].size;
    

    if (typeFile==='image'&&size<= 3000000) { // file type = image and size file <=3MB
        //rename file (+ file type)
        fs.renameSync(req.files[i].path,req.files[i].path+'.'+pathFileName);
        data.push('/'+req.files[i].filename+'.'+pathFileName);
        // send result for client
        
    } else if (typeFile!=='image') {
        
        fs.unlinkSync(req.files[i].path);
    } else if (size > 3000000) {
        
        // delete this file
        fs.unlinkSync(req.files[i].path);
    } else {
        fs.unlinkSync(req.files[i].path);
    }
        }

        if (data.length==req.files.length) {
            res.status(201).json({
                success: true,
                data: data,
                
            });
        } else if (data.length<req.files.length&&data.length>0) {
            res.status(201).json({
                success: true,
                data: data,
                message: 'One or more file upload failed. Please check again',
            });
        }
         else if (data.length==0) {
            res.status(400).json({
                success: false
            })
        }
    } catch (error) {   
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

uploadsRouter.post('/image',upload.single('image') ,async (req,res)=> {
    

    //validate: file type + maximum size file 
    const pathFileName = req.file.originalname.split('.')[req.file.originalname.split('.').length-1];
    const typeFile = req.file.mimetype.split('/')[0];
    const size = req.file.size;

    if (typeFile==='image'&&size<= 3000000) { // file type = image and size file <=3MB
        //rename file (+ file type)
        fs.renameSync(req.file.path,req.file.path+'.'+pathFileName);
        // send result for client
        res.status(201).json({
            success: true,
            data: {
                imageUrl: '/'+req.file.filename+'.'+pathFileName,
            }
            
        });
        
    } else if (typeFile!=='image') {
        res.status(400).json({
            success: false,
            message: 'This file is not an image',
        });
        fs.unlinkSync(req.file.path);
    } else if (size > 3000000) {
        res.status(400).json({
            success: false,
            message: 'This file is more than 3MB, please try again!',   
        });
        // delete this file
        fs.unlinkSync(req.file.path);
    } else {
        fs.unlinkSync(req.file.path);
    }
    


    
});


module.exports = uploadsRouter;