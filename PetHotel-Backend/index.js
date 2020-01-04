const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const authRouter = require('./modules/auth/routes');
const adminRouter = require('./modules/admin/routes');
const cityRouter = require('./modules/city/router');
const locationRouter = require('./modules/location/router');
const uploadImageRouter = require('./modules/upload/router');
const blogRouter = require('./modules/blog/routes');

mongoose.connect('your server in localhost', (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Connect to mongodb success ...');
    const server = express();

    //for react to ignore CSRF
	server.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://pethotel-vn.herokuapp.com"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    // middlewares
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({
      extended: false,
    }));

    server.get('/test',(req,res)=> {
      res.json({
        success: true,
      });
    })

    server.use(expressSession({
      secret: 'chi-anh-hieu-em',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
	
    // router
    server.use(express.static('public'));
    server.use('/api/auth', authRouter);
    server.use('/api/admin',adminRouter);
    server.use('/api/city',cityRouter);
    server.use('/api/location',locationRouter);
    server.use('/api/uploadImages',uploadImageRouter);
    server.use('/api/blog',blogRouter);

    //server listen
    server.listen(process.env.PORT || 3001, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Server listen on port ${process.env.PORT || 3001} ...`);
        }
      });
  }
  
});  
