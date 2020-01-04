const express = require('express');
const UsersModel = require('../users/model');
const sendMail = require('..//processing/sendMail');
const BlogModel = require('..//blog/model');


// router
const blogRouter = express.Router();

blogRouter.post('/post', async (req,res) => {
     try {
        if (req.session.currentUser) {
            const existedEmail = await UsersModel.findOne({email: req.session.currentUser.email});
            if (existedEmail) {
                const title = await req.body.title;
                const urlImageDescribe = await req.body.image;
                const content = await req.body.content;

                if(title&&content) {
                    const newBlog = await {
                        title : title,
                        imgDescribe: urlImageDescribe,
                        content: content,
                        userManager: req.session.currentUser._id,
                    };
                    await BlogModel.create(newBlog);
                    res.status(201).json({
                        success: true,
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Again check your content and title',
                    })
                }
                
            } else {
                res.status(400).json({
                    success: false,
                    message: 'You must login to do this work'
                })
            }
            
        } else {
            res.status(400).json({
                success: false,
                message: 'You must login to do this work'
            })
        }
     } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          });
          
    }
});

blogRouter.get('/', async (req,res)=> {
    try {
        const pageNumber = await Number(req.query.pageNumber);
        const keyWord = await req.query.keyWord;
        
        const total = await BlogModel.find({title: {$regex: keyWord, $options: 'i'}}).countDocuments();

        const data = await BlogModel.find({title: {$regex: keyWord, $options: 'i'}})
        .select({content: 0})
        .sort({createdAt: -1})
        .populate('userManager', 'name email phoneNumber')
        .skip((pageNumber-1)*12)
        .limit(12)
        .lean();

        res.status(200).json({
            success: true,
            data : data,
            total: total,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          });
          
    }
});

blogRouter.get('/watch/:id', async (req,res)=> {
    try {
        const idBlog = req.params.id;
        const data = await BlogModel.findOne({_id:idBlog}).populate('userManager', 'name email phoneNumber');
        res.status(200).json({
            success: true,
            data : data,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          });
          
    }
});

//ban a blog post (for admin)
blogRouter.post('/ban-blog/:id', async (req,res)=> {
    try {
        if (req.session.currentUser) {
            // check admin
            const thisUser = await UsersModel.findOne({email: req.session.currentUser.email});
            if (thisUser.role ==1) {
                const idBlog = req.params.id;
                const data = await BlogModel.findOne({_id:idBlog}).populate('userManager', 'name email phoneNumber');
                
                const emailContent = req.body.emailContent;
                if (emailContent) {
                    sendMail(data.userManager.email,`Dear Mr.(Ms.) ${data.userManager.name.firstName},
                After checking your blog, We are sorry to ban your blog for the following reason: \n${emailContent}\nPlease check the information that in your post, then re-post. Thank you for using our service.`,'[Pet Hotel Admin] Ban a Blog on Pet Hotel System');
                await BlogModel.deleteOne({_id: idBlog});
                res.status(200).json({
                    success: true,
                })
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Content can not be blank',
                    })
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
        return res.status(500).json({
            success: false,
            message: error.message,
          });
          
    }
});

// show list all blog of user...
blogRouter.get('/blog-list', async (req,res)=> {
    try {
        if (req.session.currentUser) {
            // check login + find user
            const thisUser = await UsersModel.findOne({email: req.session.currentUser.email});
            const pageNumber = Number(req.query.pageNumber);
        
            const total = await BlogModel.find({userManager: {_id: thisUser._id}}).countDocuments();

            const data = await BlogModel.find({userManager: {_id: thisUser._id}})
            .select({content: 0})
            .sort({createdAt: -1})
            .populate('userManager', 'name email phoneNumber')
            .skip((pageNumber-1)*12)
            .limit(12)
            .lean();

        res.status(200).json({
            success: true,
            data : data,
            total: total,
        })
        } else {
            res.status(400).json({
                success: false,
                message: 'You must log in to do this work'
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          });
          
    }
});

//user delete blog of thier own
blogRouter.get('/blog-delete/:id', async (req,res)=> {
    try {
        if (req.session.currentUser) {
            // check login + find user
            const idBlog = await req.params.id;
            const data = await BlogModel.findById(idBlog)
            .populate('userManager', 'name email').lean();

            if (data) {
                if (data.userManager._id==req.session.currentUser._id) {
                    await BlogModel.deleteOne({_id:idBlog});
                    res.status(200).json({
                        success: true,
                    })
                } else {
                    res.status(400).json({
                        success: false, 
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
                message: 'You must log in to do this work'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,

          });
          
    }
})

module.exports = blogRouter;