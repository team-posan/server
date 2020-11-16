const { Store } = require('../models')

class StoreController{
    static async getStoreHandler(req,res,next){
        try {
            const allStore = await Store.findAll({
                order:[['id','asc']]
            })
            return res.status(200).json(allStore)

        } catch (error) {
            return res.status(500).json({error})
        }
    }

    static async addStoreHandler(req,res,next){
        const { role } = req.userData
        console.log(req.body)
        const { store_name, store_address } = req.body
        const newStore = {
            store_name, store_address
        }

        try {
            if(role === 'admin'){
                const createStore = await Store.create(newStore)
                return res.status(201).json(createStore)
            }else{
                return res.status(401).json({message:'not authorized to add store'})

            }
        } catch (error) {
            return res.status(500).json({error})
        }
    }

    static async editStoreHandler(req,res,next){
        const id = +req.params.id
        const { role } = req.userData
        const { store_name, store_address } = req.body
        const editedStore = {
            store_name, store_address
        }

        try {
            if(role === 'admin'){
                const updateStore = await Store.update(editedStore,{where:{id}})
                return res.status(201).json({updateStore,message:'Success Edit'})
            }else{
                return res.status(401).json({message:'not authorized to edit store'})

            }
        } catch (error) {
            return res.status(500).json({error})
        }

    }

    static async deleteStoreHandler(req,res,next){
        const id = req.params.id
        const { role } = req.userData
        try {
            if(role ==='admin'){
                const deletedStore = await Store.destroy({where:{id}})
                return res.status(201).json({message:'delete store success', deletedStore})
            }else{
                return res.status(401).json({message:'not authorized to delete store'})
            }
        } catch (error) {
            return res.status(500).json({error})
        }
    }
}


module.exports = {
    StoreController
}