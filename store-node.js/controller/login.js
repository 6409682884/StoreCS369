const config = require('../sqlconfig');  //ดึงข้อมูล connection จาก sqlconfig.js
const sql = require('mssql');   // ใช้ module sql

async function authen(user) {
    // console.log(user.Username + " " + user.Password)
    try {// ถ้าเกิด error จะเข้า catch
        // Query
        let data = await sql.connect(config) // sql connect to database
            .then(pool => {
                return pool.request()
                    .input('username', sql.NVarChar, user.Username)
                    .output('code', sql.NVarChar, 'success')
                    .query('SELECT Username,Password FROM Users WHERE Username=@username;')
            }).then(async result => {
                if (result.recordset.length > 0) {
                    const storedPassword = result.recordset[0].Password;
                    // Perform case-sensitive comparison
                    const isAuthenticated = user.Password === storedPassword;
                    return isAuthenticated;
                } else {
                    return false;  // User not found
                }
            }).catch(err => {
                return err;
            });
        return data;  // return ค่ากลับ
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { authen: authen };