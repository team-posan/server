const jwt = require('jsonwebtoken')


const signToken=(payload)=>{
    const token = jwt.sign(payload, 'POSAN')
    return token
}

const verifyToken=(token)=>{
    const verify = jwt.verify(token, 'POSAN')
    return verify
}


module.exports = {
    signToken,
    verifyToken
}