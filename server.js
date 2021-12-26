require('dotenv').config()
const express=require("express");
const app= express();
const ejs=require("ejs");
const Path=require("path");
const expressLayout =require("express-ejs-layouts");
const Port=process.env.Port || 5000;
const mongoose=require('mongoose')
const session =require('express-session')
const flash=require('express-flash')
const MongoDbStore=require('connect-mongo')

// //database connection
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/pizza';
mongoose.connect(dbUrl, {
    useNewUrlParser:true,
    /*useCreateIndex:true,*/
    useUnifiedTopology:true
});

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=> {
    console.log("Database connected");
});

// session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        // mongoUrl:'mongodb://localhost:27017/pizza'
        client:db.getClient()
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
    
}))

app.use(flash())
// Assets
app.use(express.static('public'))
app.use(express.json())

//Global middleware
app.use((req,res,next) =>{
    res.locals.session=req.session
    next()
})

//set the template engine
app.use(expressLayout)
app.set('views',Path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

app.listen(Port, () =>{
    console.log(`listinning to port ${Port}`)
})
require('./routes/web')(app)


