const bcrypt = require('bcryptjs')

// hash function
const hashPassword = async (password) => new Promise(async(resolve, reject) => {
  const salt = await bcrypt.genSalt(10)
  const pass = await bcrypt.hash(password, salt)
  resolve(pass)
})

// compare function 
const comparePassword = (plaintextPassword, hashPassword) => {
    return bcrypt.compareSync(plaintextPassword, hashPassword) 
}

module.exports = {
    hashPassword,
    comparePassword
}

