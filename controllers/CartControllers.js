const {Cart, Product} = require('../models')
const cart = require('../models/cart')


/**
 * @userData didapat dari Authentication
 */

 const cartDummy = {
   ProductId: 0,
   UserId: 0,
   quantity: 0,
   payment_status: ''
 }

class CartController {
   static getAll(req, res, next) {
      if (req.userData.role === 'admin') {
         Cart.findAll({
            include: [Product]
         }).then(data => {
            console.log('role admin', data)
            res.status(200).json({
               carts: data
            })
         })
      } else {
         Cart.findAll({
            where: {
               UserId: req.userData.id
            },
            include: [Product]
         }).then(data => {
            console.log(data)
            res.status(200).json({
               carts: data
            })
         })
      }
   }

   static getAllFromScan (req, res) {
      console.log('===>', req.body.dataId)
      Cart.findAll({
         where: {
            id: req.body.dataId
         },
         include: [Product]
      }).then(data => {
         const dataFresh = data.filter(cart => {
            return cart.payment_status !== 'done'
         })
         if (dataFresh.length === 0) {
            return res.status(404).json({
               carts: [],
               message: 'invalid barcode'
            })
         }
         return res.status(200).json({
            carts: dataFresh
         })
      })
   }
   

   static addCart (req, res, next) {
      const { carts } = req.body
      console.log('???/', carts)

      let finalCartsData = carts.map(cart => {
         cart.UserId = req.userData.id
         return cart
      })

      console.log('???/ setelah di map', finalCartsData)

      try {
         Cart.bulkCreate(finalCartsData, {
            include: [Product]
         })
         .then((data) => {
            return Cart.findAll({
               where: {
                  UserId: req.userData.id,
                  payment_status: 'unpaid'
               },
               include: [Product]
            })
         }).then ((data => {
            console.log(data)
            res.status(201).json(data)
         }))
         // .catch(err => {
         //    console.log('dari cath err try add', err)
         //    res.status(401).json(err)
         // })
      } 
      catch (error) {
         res.status(500).json(error)
      }
   }

   static editCart (req, res, next) {
      console.log('dari update', req.params.id)
      Cart.update({
         ProductId: req.body.ProductId,
         quantity: req.body.quantity
      }, {
         where: {id: req.params.id},
         returning: true
      }).then((data) => {
         console.log('dari edit data', data)
         if (data[0] === 0) {
            return res.status(404).json({
               message: 'data not found'
            })
         } else {
            return res.status(200).json({
               message: "sucess updated data",
               cart: data
            })
         }
      })
      // .catch(err => {
      //    res.status(500).json(err)
      // })
   }

   static async setPayment (req, res, next) {
      console.log('masuk setPayment', req.body.payment_status)

      Cart.update({
         payment_status: req.body.payment_status
      }, {
         // sendnya dataId = [id1, id2, id3]
         where: {
            id: req.body.dataId
         },
         returning: true
      }).then(async(result) => {
         console.log('update payment', result[1])

         if (req.body.payment_status === 'paid') {
            result[1].map( async cart => {
               try {
                    await Product.decrement('stock',{
                        by: cart.quantity,
                        where: {
                            id: cart.ProductId
                        }
                    })
                    console.log('berhasi')
                } catch (err) {
                    console.log('dari loop decrement ke', cart.id , err)
                }
            })
         }
         if (result[0] === 0 ) {
            return res.status(404).json({
               message: 'data not found'
            })
         }
         return res.status(200).json({
            message: 'sucess updated payment',
            data: result
         })
      })
      // .catch((err) => {
      //    console.log('masuk err', err)
      //    res.status(500).json(err)
      // });
   }

   static deleteCart (req, res, next) {
      console.log('masuk sini')
      const { id } = req.params
      Cart.destroy({
         where: {
            id: id
         }
      }).then((result) => {
         console.log('result delete', result)
         if (result === 0) {
            return res.status(404).json({
               message: 'data not found'
            })
         } else {
            return res.status(200).json({
               message: 'sucess deleted data'
            })
         }
      })
      // .catch((err) => {
      //    res.status(500).json(err)
      // });
   }

   static async bulkdeleteCart (req, res, next) {
      const { idToDelete } = req.body
      const respondData = idToDelete.map( async id => {
         const response = await Cart.destroy({where: {id: id}, returning: true, plain: true})
         return response
      })
      // testing dulu
      res.status(200).json({
         message: 'success bulk delete',
         data: respondData
      })
   }
}


module.exports = {
   CartController
}