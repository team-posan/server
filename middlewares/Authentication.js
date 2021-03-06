const { User } = require('../models')
const { verifyToken } = require('../helpers/jwt')
const { decode } = require('jsonwebtoken')

const Authentication=(req,res,next)=>{
    let decoded
    if(req.headers.access_token){
        // decoded = verifyToken(req.headers.access_token)
        // ! untuk mengatasi kalo akses token gak resmi
        try {
            decoded = verifyToken(req.headers.access_token)
            // console.log('headers.access_token', decoded)
        } catch (error) {
            return res.status(403).json({message: 'invalid access_token'})
        }
    }else if(req.headers.access){
        // try {
            decoded = verifyToken(req.headers.access)
            // } catch (error) {
                //     return res.status(401).json({
                    //         message: "invalid access_token"
                    //     })
                    // }
                    // ! @note untuk customer saku pindahin supayta juga nyari di table
                    // req.userData = {
                        //     role: decoded.role,
                        //     id: +decoded.id
                        // }
                        // console.log('masuk customer', decoded)
            req.userData = decoded
         return next()
    }else{
        // console.log('yoyoyo', decoded)
        res.status(403).json({message:'Login needed'})
    }
//     console.log('+++++', decoded)
    // User.findOne({where:{username:decoded.username}})
    User.findOne({where:{id: +decoded.id}})
        .then(user=>{
            // console.log('dari authentication', user)
            if(!user){
                res.status(404).json({message:'user not found'})
            }else{
                req.userData = decoded
                // console.log('masuk sini', req.userData)
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