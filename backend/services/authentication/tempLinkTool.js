import jwt from "jsonwebtoken"
import createHttpError from "http-errors";

export const getTempId = async(tempId) => {
    const token = await generateTempToken({tempId})
    return token
}

export const generateTempToken = (payload) => 
    new Promise (( resolve, reject) => 
    jwt.sign(payload, process.env.JWT_SECRET,{expiresIn : "1day"}, (err, token) => {
        if(err) reject(err)
            else resolve(token)
    })
)

export const verifyTempToken = (token) => 
    new Promise ((resolve, reject) => 
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(err) reject(err)
            else resolve(payload)
    } )
)

export const TempLinkVerification = async(jwtId) => {
        try {
            const payload = await verifyTempToken(jwtId)
            if(payload.tempId) {
                return payload.tempId
            } 
        } catch (error) {
           console.log(error)
        }
    
}