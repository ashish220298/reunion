const jwt = require('jsonwebtoken');
///////////middleware/////////////////////
   const authmiddleware = (request, response, next) =>{
    try {
      let token = request.headers["Token-key"];   

      if (!token) {                                     
        token = request.headers["Token-key"];                 
      }

      if (!token) {
        return response.status(401).send({ status: false, msg: "Token should be there" });
      }
      let decodedToken = jwt.verify(token, "secretreunionkey" )   
      if(!decodedToken){
        return res.status(400).send({status:false, msg:"enter the token which is valid"})
      }   
      else{ 
      request.userId = decodedToken.userId;
      console.log(request.userId)
      next();       
      }                                            
    }
    catch (error) {
      response.status(500).send({ status: false, msg: error.message });
    }
  }

module.exports.authmiddleware = authmiddleware