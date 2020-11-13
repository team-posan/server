const { User } = require('../models')
const { verifyToken } = require('../helpers/jwt')


const Authentication=(req,res,next)=>{
    let decoded
    if(req.headers.access_token){
        decoded = verifyToken(req.headers.access_token)
    }else if(req.headers.access){
        req.userData = {
            role:'customer'
        }
        return next()
    }else{
        res.status(404).json({message:'Login needed'})
    }

    User.findOne({where:{username:decoded.username}})
        .then(user=>{
            if(!user){
                res.status(404).json({message:'user not found'})
            }else{
                req.userData = decoded
                next()
            }
        })
        .catch(err=>{
            res.status(500).json({err})
        })
}


module.exports = {
    Authentication
}