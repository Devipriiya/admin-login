import express from "express";
import bcrypt from 'bcrypt';
import Userlogin from "./authmodel.js";
import connectDB from "./authdb.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
connectDB();
const app = express();
app.use(express.json());
app.get("/api/mail/signup",(req,res) => {
    try {
        res.status(200).send(mail);
      }
       catch (error) 
      {
        res.json({ message:"unable to created"});
      }
}); 
app.post('/api/signup', async (req, res) => {
	const { mailid, password: plainTextpassword } = req.body
    
    if (!mailid || typeof mailid !== 'string') {
		return res.json({ status: 'error', error: 'Invalid mailid' })
	}

	if (!plainTextpassword || typeof plainTextpassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}
	if (plainTextpassword.length<6) {
        return res.json({
            status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}
    if (plainTextpassword.length!=6) {
        
        return res.json({ msg:'password is too long' })
    }
    const password = await bcrypt.hash(plainTextpassword, 10)
    try {
        const signup = await Userlogin.create({
            mailid,
            password
        })
        console.log('User created successfully:', signup)
        if (plainTextpassword.length==6) {
            return res.json({
                    status: 'correct',
                    message: 'valid password'
                })
    }

    }
    catch (error) {
            res.json({status:"ok"})
    }
            
    })
   
        
    //         res.status(404);
    //     }
    // })
//login
// app.post('/api/login',(req,res,next)=>{
//     Userlogin.find({mailid:req.body.mailid})
//     .exec()
//     .then(user=>{
//         if(user.length<1){
//             return res.status(401).json({
//                 msg:'user not exist'
//             })
//         }
//         bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
//             if(!result)
//             {
//                 return res.status(401).json({
//                     msg:'password matching fail'
//                 })
//             }
//             if(result){
//                 const token=jwt.sign({
//                     username:user[0].username,
//                     password:user[0].password
//                 })
//             }
//         })
//     })
//     .catch(err=>{
//         res.status(500).json({
//             err:err
//         })
//     })
//  })
app.post("/login",async(req,res)=>{
	try{
		const {
			mailid,
			password
		} = req.body;
		if(!(mailid && password)) { 
			res.status(400).send("all input is required");

		}
		const user=await Userlogin.findOne({mailid});
		if(user && (await bcrypt.compare(password,user.password))){
            
			const token =jwt.sign(
                {user_id:user.user_id,mailid},
                process.env.TOKEN_KEY,
                {
                    expiresIn:"2h",
                }
            );

            user.token=token;
            res.status(200).json(user);
		}else{
		res.status(400).send("invaild credentials")
        }
	}catch(err){
		console.log(err);
	}

});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});