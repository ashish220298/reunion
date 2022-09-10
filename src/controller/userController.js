const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const valid = require("../validator/validation");

////////////////////API TO REGISTER USER//////////////////////////////////////

const register = async (request,response)=>{
    try {
    let body = request.body;
    let {userName, email, password} = body;
    if(Object.keys(body).length == 0){
       return response.status(400).send({status:false, message:"please provide data to register"})
    }
    let array = [userName, email, password]
    for(let i = 0; i < array.length-1; i++){
        if(!valid(array[i])) return response.status(400).send({status:false, message:"Mandatory field is missing"});
    }
    let emailExist = await userModel.findOne({email:email})
    if(emailExist){
        return response.status(409).send({status: false, message:"EmailId is already exist"})
    }
    let create = await userModel.create(body)
    let registerData = {
        userName : create.userName,
        email : create.email,
        password : create.password
    }
    return response.status(201).send({status:true, message:"user creates successfully", data:registerData})
    } catch (error) {
    return response.status(500).send({status:false,message:error.message})
    }
}
/////////////////////LOG IN API///////////////////////////////////////
const login = async (request,response)=>{
 try {
    let body = request.body;

    if (Object.keys(body).length == 0) {
        return response.status(400).send({ status: false, message: "provide login details" })
    }
    let { email, password } = body
    if(!valid(email)) {
        return response.status(400).send({status:false, message: "Email required"})
    }
    if(!valid(password)) {
        return response.status(400).send({status:false, message: "password required"})
    }
    let data = await userModel.findOne({ email: email, password: password })
    if (!data) {
        return response.status(400).send({ status: false, message: "login details invalid" })
    }
    else {
       let token = jwt.sign({ 
       userId: data._id,
       iat: Math.floor(Date.now()/1000),
       iat: Math.floor(Date.now()/1000)+60*60*60}, "secretreunionkey")
                
        return response.status(200).send({ status: true, message: "User login successfully", data: {token} })
    }
 } catch (error) {
   return response.status(500).send({status:false,msg:error.message})
 }
}
////////////////FOLLOW API/////////////////////////////////////////////
const follow = async (request,response)=>{
  try {
      let userId = request.params.Id;
      let findData = await userModel.findById(userId);
      let user = await userModel.findById(request.userId);
      if (!findData) {
         return response.status(404).send({ status: false, msg: "No user Found" });
      }  
      let follower = findData.followers.includes(request.userId)
      if(follower){
        return response.status(400).send({status:false,msg:`you already following ${findData.userName}`})
      }
      else {
        await userModel.findOneAndUpdate({_id:userId},{$push:{followers:request.userId}},{new:true})
        await userModel.findOneAndUpdate({_id:request.userId},{$push:{following:userId}},{new:true})
      }
      return response.status(200).send({status:true, msg:`Now you are following ${findData.userName}`})

  } catch (error) {
    return response.status(500).send({status:false,msg:error.message})
  }
}
//////////////////UNFOLLOW API///////////////////////////////////////
const unfollow = async(request,response) => {
    let userId = request.params.Id
    let findData = await userModel.findById(userId);
    if(!findData){
        return response.status(400).send({status:false,msg:"user not found"})
    }
    if(findData.followers.includes(request.userId)){
        await userModel.findOneAndUpdate({_id:userId},{$pull:{followers:request.userId}},{new:true})
        await userModel.findOneAndUpdate({_id:request.userId},{$pull:{following:userId}},{new:true})
    }else{
        return response.status(400).send({status:false,msg:`you are not following ${findData.userName}`})
    }
    return response.status(200).send({status:true, msg:`Now you are not following ${findData.userName}`})
}
/////////////////GET DETAILS API/////////////////////////////////////
const getUser = async function(request,response){
    try {
        let user = await userModel.findById(request.userId)
        let registerData = {
        userName : user.userName,
        No_of_followers : user.followers.length,
        No_of_following: user.following.length
    }
    return response.status(200).send({status:true,msg:"user data",data:registerData})
    } catch (error) {
        return response.status(500).send({status:false,msg:error.message})
    }
}

///////////GET API/////////////////////////
const getDetails = async (request,response)=>{
  let temp = request.body.userId;
  let temp1 = await userModel.findById(temp);
  return response.send({status:true,user:temp1})
}
/////////MAKING MODULE FROM PRIVATE TO PUBLIC/////////////////
module.exports.register=register;
module.exports.login=login;
module.exports.follow=follow;
module.exports.getDetails=getDetails;
module.exports.unfollow=unfollow;
module.exports.getUser=getUser;