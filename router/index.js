const express = require('express')

const router = express.Router()

const jwt = require('jsonwebtoken')

const md5 = require('md5')

//Required Model
const User = require('../models/userSchema')

router.get('/', (req, res) => {
  res.send('Rendering From Router')
})

//Async Await
router.post('/register', async (req, res) => {
  const { name, email, phone, profession, password, cpassword } = req.body

  if (!name || !email || !phone || !profession || !password || !cpassword) {
    return res.status(422).json({ error: 'Please Filled The Form Properly' })
  }

  try {
    const userExist = await User.findOne({ email: email })

    if (userExist) {
      return res.status(422).json({ error: 'User Already Exists' })
    }

    const user = new User({
      name,
      email,
      phone,
      profession,
      password,
      cpassword,
    })

    await user.save()
    res.status(201).json({ succes: 'User Reigsterd Successfully' })
  } catch (err) {
    console.log(err)
  }
})

//Login
router.post('/login', async (req, res) => {
  try {
    let token
    let md5Pass
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
      res.status(400).json({ error: 'Please Filled Data' })
    }
    const userLogin = await User.findOne({ email: email })

    if (userLogin) {
      md5Pass = md5(password)
      token = await userLogin.generateAuthToken()
      res.cookie('JWT', token, {
        expires: new Date(Date.now() + 2590000),
        httpOnly: true,
      })
      console.log(md5Pass)
      console.log(userLogin)
      if (md5Pass === userLogin.password) {
        res.status(201).json({ message: 'Login Successfull' })
      } else {
        res.status(400).json({ error: 'Invalid Password' })
      }
    } else {
      res.status(400).json({ error: 'Invalid Email' })
    }
  } catch (err) {
    console.error(err)
  }
})

module.exports = router
