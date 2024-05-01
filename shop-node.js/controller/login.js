const config = require('../sqlconfig');  //ดึงข้อมูล connection จาก sqlconfig.js
const sql = require('mssql');   // ใช้ module sql

async function authen(user) {
    console.log(user.Username + " " + user.Password)
    try {// ถ้าเกิด error จะเข้า catch
        // Query
        let data = await sql.connect(config) // sql connect to database
            .then(pool => {
                return pool.request()
                    .input('username', sql.NVarChar, user.Username)
                    .input('password', sql.NVarChar, user.Password)
                    .output('code', sql.NVarChar, 'success')
                    .query('SELECT UserID,Username FROM Users WHERE Username=@username AND Password=@password;')
            }).then(result => {// ผลลัพธ์ result
                return result.recordset[0].UserID ? true : false;  // return data result
            }).catch(err => {  // ถ้าเกิด error จะเข้า catch
                return err;  // return error
            });
        return data;  // return ค่ากลับ
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { authen: authen };