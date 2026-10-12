
import mongoose, {Schema} from "mongoose"
import { type } from "os";


const infoForWebPage = new Schema({
  media: {
    type: [String],
    required: true
  },
  brand: {
    type: String,
    required: false,
    trim: true
  },
  title: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  forMobile:{
    type: Boolean,
    required: false
  } 
})

const mediaForWebPage = new Schema({
  carousel:{
    type: [infoForWebPage],
    required: false
  },
  stories:{
    type: [infoForWebPage],
    required:false
    },
  category:{
     type: [infoForWebPage],
    required:false
   },
  trend:{
    type: [infoForWebPage],
    required:false
   },
   explore:{
   type:[infoForWebPage],
   required: false
   }
});




const PartForWebPage = new Schema({
  nav:{
    type: String,
    required: true,
    trim: true
    },
   part:{
    type: [mediaForWebPage],
    required: true
   }
},{timestamps: true})

export default mongoose.model('PartForWebPage', PartForWebPage)
