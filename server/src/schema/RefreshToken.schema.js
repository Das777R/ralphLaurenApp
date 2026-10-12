import mongoose from "mongoose";


const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccount',
        required: true
    },
    expirationDate: { 
        type: Date,
        required: true
    }
}, { timestamps: true }); 

refreshTokenSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model('RefreshToken', refreshTokenSchema);
    