const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')

const md5 = require('md5')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
})

//Hashing

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await md5(this.password)
      this.cpassword = await md5(this.cpassword)
    } catch (err) {
      console.error(err)
    }
  }
})

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({ token: token })
    await this.save()
    return token
  } catch (err) {
    console.error(err)
  }
}

const User = mongoose.model('USER', userSchema)

module.exports = User
