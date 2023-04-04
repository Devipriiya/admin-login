import mongoose from "mongoose";
const userSchema= mongoose.Schema({
        mailid:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,

        }
}
    
)
const Userlogin = mongoose.model("Userlogin",userSchema);
export default Userlogin;