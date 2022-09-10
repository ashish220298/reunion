const express = require('express');
const route = require('./routes/routes.js');
require("dotenv").config();
///////requiring mongoose///////////////////////
const mongoose= require('mongoose');
//////making an instance of express/////////////
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///////////making DB connection////////////////

mongoose.connect("mongodb+srv://uranium-cohort:zxN697Vko486ved2@cluster0.23vax.mongodb.net/group4-DB",
{
    useNewUrlParser: true
})

app.use('/', route);//////global middleware////////////

app.listen(process.env.PORT, ()=> {
    console.log('Express app is running on the port of ' + (process.env.PORT||3000))
});