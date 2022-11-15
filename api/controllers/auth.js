import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
/* ---------------------------------- error --------------------------------- */
import { createError } from "../utils/error.js";



export const register = async(req, res, next) => {
    try {
        
        const username = await User.findOne({username: req.body.username})
        const email = await User.findOne({email: req.body.email})
        
        if(username || email) {
            return next(createError(404, "Este usuario ya existe pruebe con otro email o nombre de usuario"))
        }
        if(req.body.password.length < 6) {
            return next(createError(404, "La contraseña es muy corta"))
        }
        
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const newUser = User({
            ...req.body,
            password: hash
        })
        const user = await newUser.save()
        const {password, ...otherDetails } = user._doc
        res.status(200).json(...otherDetails)
    } catch (error) {
        next(error)
    }
}

export const login = async(req, res, next) => {

    try {
        const user = await User.findOne({username: req.body.username})
        if(!user) return next(createError(404, 'Ese usuario no fue encontrado'))
        
        const isPasswordCorrect = await bcrypt.compareSync(req.body.password, user.password);

        if(!isPasswordCorrect) return next(createError(404, "Nombre de usuario o contraseña incorrectos"))

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT)

        const {password, ...otherDetails } = user._doc
        
        res.cookie('access_token', token, {
            httpOnly: true
        })

        res.status(200).json(otherDetails)

        
    } catch (error) {
        next(error)
    }
}
