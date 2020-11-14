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
         Cart.bulkCreate(finalCartsData,{
            returning: true
         })
         .then((data) => {
            console.log(data)
            res.status(201).json(data)
         })
         // .catch(err => {
         //    console.log('dari cath err try add', err)
         //    res.status(401).json(err)
         // })
      } 
      catch (error) {
         console.log('masuk sini erorr')
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

   static setPayment (req, res, next) {
      console.log('id yang mau dirubah', req.body.dataId)
      Cart.update({
         payment_status: req.body.payment_status
      }, {
         // sendnya dataId = [id1, id2, id3]
         where: {
            id: req.body.dataId
         },
         returning: true
      }).then((result) => {
         console.log('update payment', result)
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