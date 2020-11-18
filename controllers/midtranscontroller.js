const midtransClient = require('midtrans-client');
const { verifyToken, signToken } = require('../helpers/jwt');
const { Cart, Product } = require('../models')
const linkServer = 'http://10.0.2.2:5000'

let core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'SB-Mid-server-4B4yXVIv1C80XmqtjbePLmAM',
    clientKey: 'SB-Mid-client-M7Bg5PAYXNuWbEUh'
});

/**
 * from client
 * @updateCartArray = 1,2,3,4
 * @order_id dibuat dengan newDate()POSAN<@updateCartArray>
 * @POSAN untuk splitter
 * 
 * GET endpoint (gak pake JWT)
 * http://localhost:5000/midtrans?amount=30000&order_id=Mon%20Nov%2016%202020%2022%3A09%3A23%20GMT%2B0700%20(Western%20Indonesia%20Time)POSAN%5B135,136,137%5D
 * 
 * use JWT
 * @tokenJWT = {amount, order_id}
 * http://localhost:5000/midtrans?pay=<tokenJWT>
 * 
 * jwt dari client = {
 *   amount,
 *  data_id
 * }
 * 
 */

class Midtrans {
    /* istanbul ignore next */
    static getToken (req, res, next) {
        const { pay } = req.query
        const decodePay = verifyToken(pay)
        const { amount, data_id } = decodePay
        
        // console.log('dari Midtrans', amount, data_id)
        // const filteredOrderId = order_id.split('POSAN')[1]
        // console.log('filteredOrderId', filteredOrderId)
        const newPayCode = signToken({data_id: data_id})

        let parameter = {
            "payment_type": "gopay",
            "transaction_details": {
                "gross_amount": amount,
                "order_id": String(data_id),
            },
            "gopay": {
                "enable_callback": true,                // optional
                // "callback_url": "exp://192.168.1.10:19000"   // optional
                // mengarah ke endpoint verifyPaymentCart
                // "callback_url": `${linkServer}/midtrans/verify?pay=${newPayCode}`   // optional
                "callback_url":"exp://192.168.1.10:19000"
            }
        };

        core.charge(parameter)
            .then((chargeResponse) => {
                // console.log('chargeResponse:');
                // window.location=chargeResponse.actions[1].url
                /* istanbul ignore next */
                res.status(200).json({
                    deeplinkUrl: chargeResponse.actions[1].url,
                    statusUrl: chargeResponse.actions[2].url
                })
                // console.log('woke', chargeResponse);
            }).catch(err => {
                /* istanbul ignore next */
                res.send(err)
                // console.log(err)
            })
    }

    static verifyPaymentCart(req, res, next) {
        // const { pay } = req.query
        // const decodePay = verifyToken(pay)
        // let { data_id } = decodePay
        // console.log('verifyPaymentCart', data_id)
        // /**
        //  * @data_id = [1, 2, 3, 4]
        //  */
        // Cart.update({
        //     payment_status: 'paid'
        // }, {
        //     where: {
        //         id: data_id
        //     },
        //     returning: true
        // }).then(async (result) => {
        //     result[1].map(async cart => {
        //         try {
        //             await Product.decrement('stock', {
        //                 by: cart.quantity,
        //                 where: {
        //                     id: cart.ProductId
        //                 }
        //             })
        //             //   console.log('berhasi')
        //         } catch (err) {
        //             console.log('dari loop decrement ke', cart.id, err)
        //         }
        //     })
        //     // redirect ke expo kalo udah dipasang di client
        //     // exp://192.168.1.10:19000
            // return res.redirect('exp://192.168.1.10:19000')
        //     // return res.status(200).json({
        //     //     message: 'sucess updated payment',
        //     //     data: result
        //     // })
        // })
    }

    static checkStatus(req,res){
        console.log(req.body,'webhook')
        const {transaction_status, order_id} = req.body
        let updateId = order_id.split(',')
        updateId = updateId.map((val=>{return parseInt(val)}))
        if(transaction_status === 'settlement'){
            Cart.update({
                        payment_status: 'paid'
                    }, {
                        where: {
                            id: updateId
                        },
                        returning: true
                    }).then(async (result) => {
                        result[1].map(async cart => {
                            try {
                                await Product.decrement('stock', {
                                    by: cart.quantity,
                                    where: {
                                        id: cart.ProductId
                                    }
                                })
                                //   console.log('berhasil')
                                res.status(201).json({message:'berhasil'})
                            } catch (err) {
                                // console.log('dari loop decrement ke', cart.id, err)
                                console.log(err,' error checkstatus')
                                res.status(500).json({err})
                            }
                        })
             }) 
        }
    }

    // static failure(req,res){
    //     return res.redirect('exp://192.168.1.10:19000/failure')
    // }
}

module.exports = Midtrans