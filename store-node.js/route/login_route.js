const express = require('express');  //นำเข้า Express.js เพื่อใช้ในการสร้างและกำหนดเซิร์ฟเวอร์ Express.
const router = express.Router();     //นำเข้า Router Express ซึ่งจะใช้ในการกำหนดเส้นทางของแอปพลิเคชัน Express
const path = require('path');        //นำเข้าโมดูล path เพื่อใช้ในการจัดการเส้นทางไฟล์.
const Db = require('../controller/login')

const loginPage = path.join(__dirname,`../page/login.html`);  

router.get("/login",(req,res)=>{       
    res.status(200);
    res.status(200);
    res.type('text/html');
    res.sendFile(loginPage);
 })

 router.post("/login",(req,res)=>{    
    // console.log(req.body)
    let auth = { Username: req.body.Username, Password: req.body.Password } 
    // console.log(auth)
    Db.authen(auth).then((data) => {
        console.log()    
        if (data === true) 
        {
            res.status(200).json({ data: data, message: 'login success' });
        }
        else
        {
            res.status(400).send({ error: data, message: 'login fail' }) 
        }
        // console.log(data);      
    }).catch(err => {
        res.status(500).send({ error: err, message: 'Server Error ' }) 
        console.log(err);
    });
 })
 
//  router.use((req, res, next) => {      //กำหนด middleware สำหรับการจัดการเมื่อไม่พบเส้นทางที่ตรงกับคำขอ โดยส่งกลับคำตอบ "404 PAGE NOT FOUND".
//      // res.status(404).send('<h1>404 PAGE NOT FOUND</h1>');
//      res.redirect("/")
// });
module.exports = router;              //ส่งออกเราเตอร์ Express เพื่อให้สามารถนำไปใช้งานในแอปพลิเคชัน Express อื่น ๆ ได้.