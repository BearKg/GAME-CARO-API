
// conn: đối tượng conn để thực hiện truy vấn
// q: câu lệnh truy vấn
// params: giá trị của field
module.exports = async (conn, q, params) => new Promise((resolve, reject) => {
    const handler = (err, result) => {
        if(err) {
            reject(err)
            return
        }
        resolve(result) //trả về kết quả truy vấn khi không có lỗi
    }
    conn.query(q, params, handler)
})