import User from "../models/user.model.js"

export const validateEmail = async(req, res, next) => {
    let {email, password} = req.body;
    console.log(email, password);
    let usuario = await User.findOne({
        where: {email:email, password:password}
    })
    if(!usuario){
        return res.status(400).json({code:400, message: 'El email ya existe'})
    }    
    console.log("correo verificado")
    next()
}