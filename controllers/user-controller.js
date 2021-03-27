import mongoose from 'mongoose'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from '../models/User.js'

export const signin = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({email})
        if(!existingUser) return res.status(404).json({messege: "User doesn't exists"})
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(400).json({messege: "Password is incorrect"})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" })

        res.status(200).json({ result: existingUser, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({messege: "Something went wrong"})
    }
} 

export const signup = async (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body

    try {
        const existingUser = await User.findOne({email})

        if(existingUser) return res.status(400).json({messege: "User already exists"})
        if(password !== confirmPassword) return res.status(400).json({messege: "Passwords don't match"})

        const newUser = User.create({
            name: `${firstName} ${lastName}`,
            password: await bcrypt.hash(password, 10),
            email
        })

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, 'test', { expiresIn: "1h" })

        res.status(200).json({ result: newUser, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({messege: "Something went wrong"})
    }
} 