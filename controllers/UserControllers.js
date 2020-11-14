const { User } = require('../models')
const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')

class UserController {
    static adminLoginHandler(req,res,next){
        const { username, password } = req.body
        if(!username || !password){
            res.status(404).json({name:'LoginFail', message:'Username/Password Cannot be empty'})
        }else{

            User.findOne({where:{username}})
            .then(result=>{
                if(!result){
                    res.status(404).json({name:'LoginFail', message:'Username Not Found'})
                }
                else if(!comparePassword(password,result.password)){
                    res.status(404).json({name:'LoginFail', message:'Password Wrong'})
                }else{
                    const access_token = signToken({id:result.id,username:result.username,role:result.role,StoreId:result.StoreId})
                    res.status(201).json({access_token})
                }
            })
            .catch(error=>{
                res.status(500).json({error})
            })
        }
    }

    static async customerLoginHandler(req,res,next){
        const { phone_number } = req.body
        try {
            const checkCustomer = await User.findOne({where:{phone_number}})
            if(!checkCustomer){
                let createCustomer = await  User.create({phone_number,role:'customer'})
                const access = signToken({role:'customer',id:+createCustomer.id})
                 return res.status(201).json({access})
            }else {
                const access = signToken({role:'customer',id:+checkCustomer.id})
                return res.status(201).json({access})
            }
        } catch (error) {
            console.log(error)
            return  res.status(500).json({error})
        }
    }


    static async addKasirHandler(req,res,next){
        const { username, password,StoreId } = req.body
        const roleReqData = req.userData
        const newKasir = {
            username,
            password,
            role:'kasir',
            StoreId
        }

        try {
            if(roleReqData.role === 'admin'){
                const createKasir = await User.create(newKasir)
                return res.status(201).json(createKasir)
            }else{
                return res.status(401).json({message:'not authorized to add kasir'})

            }
        } catch (error) {
            return res.status(500).json({error:error.response})
        }
    }

    static async editKasirHandler(req,res,next){
        const { username, password,StoreId } = req.body
        const id = +req.params.id
        const roleReqData = req.userData
        const editedKasir = {
            username,
            password,
            StoreId
        }

        try {
            if(roleReqData.role === 'admin'){
                const updateKasir = await User.update(editedKasir, {where:{id}})
                return res.status(201).json({updateKasir,message:'success edit'})
            }else{
                return res.status(401).json({message:'not authorized to edit kasir'})
            }
        } catch (error) {
            return res.status(500).json({error:error})
        }
    }

    static async deleteKasirHandler(req,res,next){
        const id = +req.params.id
        const { role } = req.userData
        try {
            if(role ==='admin'){
                const deletedKasir = await User.destroy({where:{id}})
                return res.status(201).json({message:'delete kasir success', deletedKasir})
            }else{
                return res.status(401).json({message:'not authorized to delete kasir'})
            }
        } catch (error) {
            return res.status(500).json({error})
        }
    }
       
}


module.exports = {
    UserController
}