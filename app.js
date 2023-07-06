/* Importing Different Modules */

const {globalVariables} = require('./config/configuration');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const {mongoDbUrl, PORT} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
//const express = require('express')
const multer  = require('multer')
const app = express()
const upload = multer({ dest: './public/upload/' })


app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
});

const cpUpload = upload.fields([{ name: 'uplodedFile', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
    // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
    //
});



// Configure Mongoose to Connect to MongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});



/* Configure express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


/*  Flash and Session*/
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());


/* Use Global Variables */
app.use(globalVariables);


/* File Upload Middleware*/
app.use(fileUpload(undefined));

/* Setup View Engine To Use Handlebars */
app.engine('handlebars', hbs({defaultLayout: 'default', helpers: {select: selectOption}}));
app.set('view engine' , 'handlebars');


/* Method Override Middleware*/
app.use(methodOverride('newMethod'));


/* Routes */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


/* Start The Server */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
