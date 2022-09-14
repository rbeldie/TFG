import {Router} from "express";

import userRouter from "./user.router.js";

const router = Router();


router.use('/', userRouter)

// router.get('*', (req,res,next) =>{
//     res.redirect('/')
// })


export default router;