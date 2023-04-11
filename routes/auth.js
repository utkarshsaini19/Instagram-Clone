const express = require('express')
require('dotenv').config()
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const nodemailer = require('nodemailer')
const AuthEMAIL = process.env.AUTHEMAIL
const PASSWORD = process.env.PASSWORD
const crypto = require('crypto');
const frontendurl = process.env.FRONTENDURL




router.post('/signup', async (req, res) => {
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    let user = await User.findOne({ email: email })
    if (user) {
        return res.status(422).json({ error: "User already exists with that email" })
    }
    const hash = await bcrypt.hash(password, 12)
    user = await User.create({
        name: name, email: email, password: hash, pic
    })

    // let config = {
    //     service : 'gmail',
    //     auth : {
    //         user: AuthEMAIL,
    //         pass: PASSWORD
    //     }
    // }

    // let transporter = nodemailer.createTransport(config);

    // let MailGenerator = new Mailgen({
    //     theme: "default",
    //     product : {
    //         name: "Mailgen",
    //         link : 'https://mailgen.js/'
    //     }
    // })

    // let response = {
    //     body: {
    //         name : "Daily Tuition",
    //         intro: "Your bill has arrived!",
    //         table : {
    //             data : [
    //                 {
    //                     item : "Nodemailer Stack Book",
    //                     description: "A Backend application",
    //                     price : "$10.99",
    //                 }
    //             ]
    //         },
    //         outro: "Looking forward to do more business"
    //     }
    // }

    // let mail = MailGenerator.generate(response)

    // let message = {
    //     from : AuthEMAIL,
    //     to : email,
    //     subject: "Place Order",
    //     html: mail
    // }

    // transporter.sendMail(message).then(() => {
    //     return res.status(201).json({
    //         msg: "you should receive an email"
    //     })
    // }).catch(error => {
    //     return res.status(500).json({ error })
    // })

    return res.status(200).json({ message: `${user.name} is successfully registered` })
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please provide email or password" })
    }

    let user = await User.findOne({ email: email })
    if (!user) {
        return res.status(422).json({ error: "Invalid Email or Password" })
    }
    const match = await bcrypt.compare(password, user.password);

    if (match) {
        const { _id, name, email, followers, following, pic } = user
        const token = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET)
        return res.status(200).json({ token, user: { _id, name, email, followers, following, pic } })

    }

    return res.status(422).json({ error: "Invalid Email or Password" })
})

router.post('/reset-password', async (req, res) => {
    const token = crypto.randomBytes(32).toString('hex')
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000
        const result = await user.save();
        if (result) {

            let config = {
                service: 'gmail',
                auth: {
                    user: AuthEMAIL,
                    pass: PASSWORD
                }
            }

            let transporter = nodemailer.createTransport(config);
            let message = {
                from: AuthEMAIL,
                to: user.email,
                subject: "password reset",
                html: `
                <p>You requested for password reset</p>
                <h5>click in this <a href="${frontendurl}/reset/${token}">link</a> to reset password</h5>
                `
            }

            const mail = await transporter.sendMail(message);
            if (mail) {
                return res.status(201).json({
                    msg: "Kindly check your mail!"
                })
            }
            else {
                return res.status(500).json({ error: "Not able to send reset Password Link" })
            }

        }
    }
    else {
        return res.status(422).json({ error: "User dont exists with that email" });
    }


})

router.post('/new-password', async (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    let user = await User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    if (!user) {
        return res.status(422).json({ error: "Try again session expired" })
    }
    else {
        const hashedpassword = await bcrypt.hash(newPassword, 12)
        user.password = hashedpassword
        user.resetToken = undefined
        user.expireToken = undefined
        const saveuser = await user.save()
        return res.json({ message: "password updated success" });
    }
})

module.exports = router