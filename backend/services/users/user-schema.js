
import mongoose from "mongoose";
import bcrypt from "bcrypt"


const {Schema, model } = mongoose;

const UserSchema = new Schema({
    firstName: { type: String, required: true},
    lastName: {type:String, required:true},
    email: { type: String, required: true, unique:[true, "email must be unique"] },
    password: { type: String, required: true },
    refreshToken :{ type : String},
    userVerification:{ type: String, enum:['waiting', 'verified'], default: 'waiting'},
    favouriteBooks :[{type: String}],
    previouslyLikedBooks : [{type: String}],
    tempId : {type:String}
},{
    timestamps:true
})

UserSchema.pre("save", async function(next){
    const newUser = this
    const plainPw = newUser.password
    const salt = await bcrypt.genSalt(11);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    next()
})

UserSchema.methods.toJSON = function() {
    const userDocument = this
    const userObject = userDocument.toObject()
    delete userObject.password
    return userObject
}

UserSchema.statics.checkCredentials = async function(email, plainPw){
    const user = await this.findOne({email})
    if(user){
        const isMatch = await bcrypt.compare(plainPw, user.password)
        console.log(isMatch)
        return isMatch ? user: null

    } else
        return null
}

export default model("Users", UserSchema)
