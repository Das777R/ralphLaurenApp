import mongoose, { Schema } from 'mongoose'


const bag = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName:String,
    lookImage: String,
    colorName: String,
    colorImage: String,
    product: String,
    image: String,
    qty:Number,
    brand: String,
    size: String,
    price: Number,
});

const UserAccount = new Schema({
  name: {
    type: String,
    required: false,
    trim: true
  },
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
},
password: {
  type: String,
  required: true
},
  bag: [bag],
 role:{
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
},{timestamps: true})

export default mongoose.model("UserAccount", UserAccount);