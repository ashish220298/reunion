const postModel = require("../model/postModel");
const commentModel = require("../model/commentModel")
const {valid,validObjectId} = require("../validator/validation");
const mongoose = require('mongoose')

const posts = async (request,response)=>{
   try {

    let body = request.body;

    if(Object.keys(body).length===0){
       return response.status(400).send({status:false,msg:"please provide data to post"})
    }
    if(body.isDeleted == true){
      return response.status(400).send({status:false,msg:"Bad request"})
    }
    let {Title,Description} = body
    if(!valid(Title)){
        return response.status(400).send({status:false,msg:"Title should be present"})
    }
    if(!valid(Description)){
        return response.status(400).send({status:false,msg:"Description should be present"})
    }
    body.user = request.userId
    let create = await postModel.create(body);
    let data = {
        postId: create._id,
        Title: create.Title,
        Description: create.Description,
        Time: create.Time.toLocaleString()
    }
    return response.status(201).send({status:true, msg:"post created successfully", data:data})
   } catch (error) {
    return response.status(500).send({status:false, msg:error.message})
   }
}

const deletePost = async (request,response)=>{
  try {
  let postId = request.params.Id;
  let post = await postModel.findById(postId);
  if(!validObjectId(postId)){
    return response.status(400).send({status:false,msg:"please enter valid postId"})
  }
  if(!post){
    return response.status(400).send({status:false,msg:"postId is not found"})
  }
  if(post.user != request.userId){
    return response.status(400).send({status:false,msg:"You are not authorised to delete that post"})
  }
  if(post.isDeleted == true){
    return response.status(400).send({status:false,msg:"This post is already deleted"})
  }
  await postModel.findOneAndUpdate({_id:postId},{$set:{isDeleted:true,deletedAt:new Date()}},{new:true})
  return response.status(200).send({status:false,msg:"post deleted successfully"})
  } catch (error) {
  return response.status(500).send({status:false, msg:error.message})
  }
}

const like = async (request,response)=>{
 try {
 let post = request.params.Id
 let postfind = await postModel.findOne({_id:post, isDeleted:false});
 if(!validObjectId(post)){
    return response.status(400).send({status:false,msg:"please enter valid postId"})
  }
 if(!postfind){
    return response.status(400).send({status:false, msg:"postId is not found"})
 }
 if(postfind.like.includes(request.userId)){
    return response.status(400).send({status:false,msg:"you already liked the post"})
 }
 if(postfind.unlike.includes(request.userId)){
    await postModel.findOneAndUpdate({_id:post},{$pull:{unlike:request.userId}},{new:true});
 }
 await postModel.findOneAndUpdate({_id:post},{$push:{like:request.userId}},{new:true});
 return response.status(201).send({status:true,msg:"successfully you liked the post"})
 } catch (error) {
 return response.status(500).send({status:false, msg:error.message})
 }
}

const unlike = async (request,response)=>{
    try {
    let post = request.params.Id
    let postfind = await postModel.findOne({_id:post, isDeleted:false});
    if(!validObjectId(post)){
        return response.status(400).send({status:false,msg:"please enter valid postId"})
    }
    if(!postfind){
        return response.status(400).send({status:false, msg:"postId is not found"})
    }
    if(postfind.unlike.includes(request.userId)){
        return response.status(400).send({status:false, msg:"you already unliked the post"})
    }
    if(postfind.like.includes(request.userId)){
        await postModel.findOneAndUpdate({_id:post},{$pull:{like:request.userId}},{new:true});
    }
    await postModel.findOneAndUpdate({_id:post},{$push:{unlike:request.userId}},{new:true});
    return response.status(200).send({status:true,msg:"successfully you unliked the post"})
    } catch (error) {
    return response.status(500).send({status:false, msg:error.message})
    }
}

const getPostDetails = async (request,response)=>{
 try{
  let postId = request.params.Id
  let find = await postModel.findOne({_id:postId,isDeleted:false});
  if(!find){
    return response.status(400).send({status:false,msg:"post is not found"})
  }
  if(find.isDeleted == true){
    return response.status(400).send({status:false,msg:"This post is deleted"})
  }

  let comment = await commentModel.find({postId:postId}).select('comment');
  let Obj = {
      postId : postId,
      Title : find.Title,
      Description : find.Description,
      likes : find.like.length,
      userId : find.user,
      comments : comment
  }
  return response.status(400).send({status:true,msg:"getting all post details",data:Obj})
 } catch(error){
  return response.status(500).send({status:false, msg:error.message})
 }
}

const getAllPosts = async (request,response)=>{
 try {
  let posts = await postModel.find({user:request.userId,isDeleted:false}).sort({time:1})

  let array = [];
  for(let i = 0; i < posts.length; i++){
   let Obj = {
     postId : posts[i]._id,
     Title : posts[i].Title,
     Description : posts[i].Description,
     createdAt : posts[i].createdAt.toLocaleString(),
     comments : await commentModel.find({postId:posts[i]}).select('comment'),
     likes : posts[i].like.length,
    }
    array.push(Obj)
  }
  return response.status(200).send({status:true, data:array})
 } catch (error) {
   return response.status(500).send({status:false, msg:error.message})
 }
}

module.exports.posts =posts;
module.exports.deletePost =deletePost;
module.exports.like =like;
module.exports.unlike =unlike;
module.exports.getPostDetails =getPostDetails;
module.exports.getAllPosts =getAllPosts;