
const midtransClient = require('midtrans-client');

let core = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : 'SB-Mid-server-4B4yXVIv1C80XmqtjbePLmAM',
    clientKey : 'SB-Mid-client-M7Bg5PAYXNuWbEUh'
});

class Midtrans {
    static getToken(req,res,next){
        let parameter = {
            "payment_type": "gopay",
            "transaction_details": {
                "gross_amount": 12145,
                "order_id": "test-transaction-39",
            },
            "gopay": {
                "enable_callback": true,                // optional
                "callback_url": "exp://192.168.1.10:19000"   // optional
            }
        };

    core.charge(parameter)
    .then((chargeResponse)=>{
        // console.log('chargeResponse:');
        // window.location=chargeResponse.actions[1].url
        res.send(chargeResponse.actions[1].url)
        // console.log(chargeResponse);
    }).catch(err=>{
        console.log(err)
    })
    }
}   

module.exports = Midtrans