import mongoose from 'mongoose';
import { Schema } from 'mongoose';



const itemForHomePage = new Schema({
   title: {
    type: String,
    required: false,
    trim: true
   },
   brand: {
    type: String,
    required: false,
    trim: true
   },
   description: {
    type: String,
    required: false,
    trim: true
   },
   media: {
    type: [String],
    required: true,
    trim: true
   },
   forMobile: {
    type: Boolean,
    required: false
   }
})

const MediaForHomePage = new Schema({
  rlc_hero:[itemForHomePage],
  rlc_block:[itemForHomePage],
  rlc_wrapper:[itemForHomePage],
  rlc_trend:[itemForHomePage],
  rlc_ads:[itemForHomePage]
})


export default mongoose.model("MediaForHomePage", MediaForHomePage)