const commentModel = require("../model/commentModel");
const postModel = require("../model/postModel");
const valid = require("../validator/validation");
const mongoose = require('mongoose');

//////////COMMENT CREATE API//////////////////////

const Createcomment = async (request,response)=>{
 try {
    let post = request.params.Id

    let find = await postModel.findOne({postId:post, isDeleted:false});
    if(!find){
      return response.status(400).send({status:false,msg:"unable to find the postId"})
    }
    let body = request.body;
    //////USE OF DESTRUCTURING////////////////
    let {comment} = body
    body.postId = post;
    body.user = request.userId;

    if(!valid(comment)){
      return response.status(400).send({status:false,msg:"comment missing"})
    }
    let create = await commentModel.create(body);

    let Objectofcomment = {
        commentId : create._id,
        comment : create.comment
    }
    return response.status(201).send({status:true,msg:"The comment has been created successfully",data:Objectofcomment})
 } 
 
 catch (error) {
    return response.status(500).send({status:false, msg:error.message})
 }}

module.exports.Createcomment = Createcomment /////exporting the module here making it public