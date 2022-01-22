require('dotenv').config()
const express=require("express");
const app= express();
const ejs=require("ejs");
const Path=require("path");
const expressLayout =require("express-ejs-layouts");
const Port=process.env.PORT || 5000;
const mongoose=require('mongoose')
const flash=require('express-flash')
const MongoDbStore=require('connect-mongo')
const session =require('express-session')
const passport =require('passport')
const Emitter=require('events')

// //database connection
const dbUrl = process.env.MONGO_CONNECTION_URL;
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
const eventEmitter =new Emitter()
app.set('eventEmitter',eventEmitter)
//event emitter


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


//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Assets
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Global middleware
app.use((req,res,next) =>{
    res.locals.session=req.session
    res.locals.user = req.user
    next()
})

//set the template engine
app.use(expressLayout)
app.set('views',Path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

const server=app.listen(Port, () =>{
    console.log(`listinning to port ${Port}`)
})
require('./routes/web')(app)
app.use((req,res) =>{
    res.status(404).render('errors/404')

})

// Socket
const io= require('socket.io')(server)
io.on('connection',(socket) =>{
    //join

 socket.on('join',(orderId) =>{
     socket.join(orderId)
 })
})
eventEmitter.on('orderUpdated', (data)=>{
io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})


