const mysql = require('mysql')
const dbconfig = require('../dbconfig')
const CustomAPIError = require('../errors/custom-api')

// xuất ra hàm trả về con
// module.exports = async (params) =>
//   new Promise((resolve, reject) => {
//     const connection = mysql.createConnection(params)
//     connection.connect(err => {
//       if(err) {
//         reject(err) // lỗi trả về err
//         return
//       }
//     })
//     resolve(connection) // không có lỗi thì trả về con thong qua await với hàm promise
//   })

const conn = mysql.createConnection(dbconfig)

conn.connect((err) => {
  if (err) throw CustomAPI('Can not connect to database!')
  console.log('Connected')
})

module.exports = conn
