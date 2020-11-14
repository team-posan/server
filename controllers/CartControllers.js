const {Cart} = require('../models')

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
      Cart.findAll({
         where: {
            UserId: req.userData.id
         },
         // // include: ['Products']
      }).then(data => {
         console.log(data)
         res.status(200).json({
            carts: data
         })
      }).catch(err => {
         res.status(500).json(err)
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
         Cart.bulkCreate(finalCartsData)
         .then((data) => {
            res.status(201).json(finalCartsData)
         }).catch(err => {
            res.status(401).json(err)
         })
      } catch (error) {
         console.log('masuk sini erorr')
         res.status(500).json(error)
      }
   }

   static editCart (req, res, next) {
      Cart.update({
         ProductId: req.body.ProductId,
         quantity: req.body.quantity
      }, {
         where: {id: req.params.id}
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
      }).catch(err => {
         res.status(500).json(err)
      })
   }

   static setPayment (req, res, next) {
      Cart.update({
         payment_status: req.body.payment_status
      }, {
         where: {id: req.body.id}
      }).then((result) => {
         // console.log(result)
         res.status(200).json(result)
      }).catch((err) => {
         res.status(500).json(err)
      });
   }

   static deleteCart (req, res, next) {
      const { id } = req.params
      Cart.destroy({
         where: {
            id: id
         }
      }).then((result) => {
         res.status(200).json({
            message: ''
         })
      }).catch((err) => {
         res.status(500).json(err)
      });
   }

   static async bulkdeleteCart (req, res, next) {
      const { idToDelete } = req.body
      const respondData = idToDelete.map( async id => {
         const response = await Cart.destroy({where: {id: id}})
         return response
      })
      // testing dulu
      res.status(200).json({
         message: 'success delete',
         data: respondData
      })
   }
}


module.exports = {
   CartController
}