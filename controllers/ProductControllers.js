const { Product } = require('../models')

class ProductController {

    static getProductHandler(req,res,next){
        const { role } = req.userData
        if(role === 'admin'){
            Product.findAll({
                order:[['id','asc'],['StoreId','asc']]
            })
                .then(result=>{
                    return res.status(200).json(result)
                })
                .catch(err=>{
                    /* istanbul ignore next */
                    return res.status(500).json({err})
                })
        }else if(role === 'kasir'){
            Product.findAll({
                where:{StoreId:req.userData.StoreId},
                order:[['id','asc'],['StoreId','asc']]
            })
                .then(result=>{
                    return res.status(200).json(result)
                })
                .catch(err=>{
                    /* istanbul ignore next */
                    return res.status(500).json({err})
                })
        }else{
            Product.findAll({
                where:{StoreId:req.query.store},
                order:[['id','asc'],['StoreId','asc']]
            })
                .then(result=>{
                    return res.status(200).json(result)
                })
                .catch(err=>{
                    /* istanbul ignore next */
                    return res.status(500).json({err})
                })
        }
    }


    static addProductHandler(req,res,next){
        const {product_name, price, image_url, stock, StoreId } = req.body
        const { role } = req.userData
        const id = +req.params.id
        const newProduct = {
            product_name,
            price:+price,
            image_url,
            stock:+stock,
            StoreId:+StoreId
        }

        if(role === 'admin'){
            Product.create(newProduct)
                .then(result=>{
                    res.status(201).json(result)
                })
                .catch(err=>{
                    /* istanbul ignore next */
                    res.status(500).json({err})
                })
        }else{
            res.status(401).json({message:'Unauthorized to add product only admin authorized to add product'})
        } 
    }

    static async editProductHandler(req,res,next){
        const {product_name, price, image_url, stock } = req.body
        const id = req.params.id
        const { role } = req.userData

        const editedProduct = {
            product_name,
            price:+price,
            image_url,
            stock:+stock,
        }

        const dataEdit = await Product.findOne({where:{id}})

        if(!dataEdit) return res.status(404).json({message:'data not found'})

        if(price < 0 || stock < 0){
            return res.status(400).json({message:'stock or price cannont below 0'})
        }

        if(role === 'admin'){
            Product.update(editedProduct, {where:{id}})
                .then(result=>{
                    res.status(201).json({result,message:`success edit product with id ${id}`})
                })
                .catch(err=>{
                    /* istanbul ignore next */
                    res.status(500).json({err})
                })
                
        }else{
            res.status(401).json({message:'Unauthorized to edit product only admin authorized to add product'})
        } 
    }

    static async deleteProductHandler(req,res,next){
        const id = req.params.id
        const { role } = req.userData
        try {
            if(role ==='admin'){
                const deletedProduct = await Product.destroy({where:{id}})
                return res.status(201).json({message:'delete product success', deletedProduct})
            }else{
                res.status(401).json({message:'Unauthorized to delete product only admin authorized to add product'})
            }
        } catch (error) {
            /* istanbul ignore next */
            res.status(500).json({error})
        }
      
    }
}


module.exports = {
    ProductController
}