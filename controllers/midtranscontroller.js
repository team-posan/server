const midtransClient = require('midtrans-client');
const { verifyToken, signToken } = require('../helpers/jwt');
const { Cart, Product } = require('../models')
const linkServer = process.env.SERVERURL || 'http://localhost:5000'

let core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'SB-Mid-server-gfcyFpC0-y7PzOahToSkk4yL',
    clientKey: 'SB-Mid-client-PpcZqss1S3SMV-UI'
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
    static getToken(req, res, next) {
        const { pay } = req.query
        const decodePay = verifyToken(pay)
        const { amount, data_id } = decodePay
        
        console.log('dari Midtrans', amount, data_id)
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
                "callback_url": `${linkServer}/midtrans/verify?pay=${newPayCode}`   // optional
            }
        };

        core.charge(parameter)
            .then((chargeResponse) => {
                // console.log('chargeResponse:');
                // window.location=chargeResponse.actions[1].url
                res.status(200).json(chargeResponse.actions[1].url)
                // console.log(chargeResponse);
            }).catch(err => {
                console.log(err)
            })
    }

    static verifyPaymentCart(req, res, next) {
        const { pay } = req.query
        const decodePay = verifyToken(pay)
        let { data_id } = decodePay
        console.log('verifyPaymentCart', data_id)
        /**
         * @data_id = [1, 2, 3, 4]
         */
        Cart.update({
            payment_status: 'paid'
        }, {
            where: {
                id: data_id
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
                    //   console.log('berhasi')
                } catch (err) {
                    console.log('dari loop decrement ke', cart.id, err)
                }
            })
            // redirect ke expo kalo udah dipasang di client
            // exp://192.168.1.10:19000
            return res.redirect('https://www.google.com/')
            // return res.status(200).json({
            //     message: 'sucess updated payment',
            //     data: result
            // })
        })

    }
}

module.exports = Midtrans