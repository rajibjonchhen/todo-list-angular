
import mongoose from "mongoose";



const {Schema, model } = mongoose;

const BookSchema = new Schema({
    title: { type: String, required: true},
    description: {type:String, required:true},
    publishedAt: { type: String, required: true },
    publisher: { type: String, required: true },
    category : [{type : String, required: true}],
    authors :[{ name: {type : String}, img:{type: String, default:'https://previews.123rf.com/images/koblizeek/koblizeek2001/koblizeek200100050/138262629-man-icon-profile-member-user-perconal-symbol-vector-on-white-isolated-background-.jpg'}}],
    covers:[{type: String}],
    isbn: {type: String},
    userId: {type: Schema.Types.ObjectId , ref:"Users"}
},{
    timestamps:true
})

export default model("Books", BookSchema)
