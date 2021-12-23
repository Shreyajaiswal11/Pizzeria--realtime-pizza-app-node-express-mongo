const express=require("express");
const app= express();
const ejs=require("ejs");
const Path=require("path");
const expressLayout =require("express-ejs-layouts");
const res = require("express/lib/response");
const Port=process.env.Port || 5000

// Assets
app.use(express.static('public'))

//set the template engine
app.use(expressLayout)
app.set('views',Path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

app.listen(Port, () =>{
    console.log(`listinning to port ${Port}`)
})
app.get("/",(req,res) =>{
    res.render("home")
}) 
app.get("/cart",(req,res) =>{
    res.render('customers/cart')
})
app.get('/login',(req,res) =>{
    res.render('auth/login')
})
app.get('/register',(req,res) =>{
    res.render('auth/register')
})

