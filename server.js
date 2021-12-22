const express=require("express");
const app= express();
const ejs=require("ejs");
const Path=require("path");
const expressLayout =require("express-ejs-layouts");
const res = require("express/lib/response");
const Port=process.env.Port || 5000

app.get("/",(req,res) =>{
    res.render("home")
}) 
//set the template engine
app.use(expressLayout)
app.set('views',Path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

app.listen(Port, () =>{
    console.log(`listinning to port ${Port}`)
})

