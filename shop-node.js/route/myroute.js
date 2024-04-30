const express = require('express');  //นำเข้า Express.js เพื่อใช้ในการสร้างและกำหนดเซิร์ฟเวอร์ Express.
const router = express.Router();     //นำเข้า Router Express ซึ่งจะใช้ในการกำหนดเส้นทางของแอปพลิเคชัน Express
const path = require('path');        //นำเข้าโมดูล path เพื่อใช้ในการจัดการเส้นทางไฟล์.

const indexPage = path.join(__dirname,`../page/index.html`);   //กำหนดตัวแปร indexPage ให้เก็บที่อยู่ของไฟล์ index.html ซึ่งอยู่ในโฟลเดอร์ "page" ในโฟลเดอร์ที่เรากำลังทำงานอยู่.
const empPage = path.join(__dirname,`../page/employee.html`);  //กำหนดตัวแปร empPage ให้เก็บที่อยู่ของไฟล์ employee.html ซึ่งอยู่ในโฟลเดอร์ "page" ในโฟลเดอร์ที่เรากำลังทำงานอยู่.
const orderPage = path.join(__dirname,`../page/Order.html`);   //กำหนดตัวแปร orderPage ให้เก็บที่อยู่ของไฟล์ Order.html ซึ่งอยู่ในโฟลเดอร์ "page" ในโฟลเดอร์ที่เรากำลังทำงานอยู่.
router.get("/", (req,res)=>{               //กำหนดการจัดการเมื่อมีคำขอ HTTP GET มายังเส้นทางหลัก "/" โดยส่งไฟล์ index.html กลับไปที่เบราว์เซอร์.                            
    res.type('text/html');
    res.sendFile(indexPage);
 })
router.get("/employee",(req,res)=>{        //กำหนดการจัดการเมื่อมีคำขอ HTTP GET มายังเส้นทาง "/employee" โดยส่งไฟล์ employee.html กลับไปที่เบราว์เซอร์.
    res.status(200);
    res.status(200);
    res.type('text/html');
    res.sendFile(empPage);
 })
router.get("/order",(req,res)=>{          //กำหนดการจัดการเมื่อมีคำขอ HTTP GET มายังเส้นทาง "/order" โดยส่งไฟล์ Order.html กลับไปที่เบราว์เซอร์.
    res.status(200);
    res.type('text/html');
    res.sendFile(orderPage);
 })
//  router.use((req, res, next) => {      //กำหนด middleware สำหรับการจัดการเมื่อไม่พบเส้นทางที่ตรงกับคำขอ โดยส่งกลับคำตอบ "404 PAGE NOT FOUND".
//      // res.status(404).send('<h1>404 PAGE NOT FOUND</h1>');
//      res.redirect("/")
// });
module.exports = router;              //ส่งออกเราเตอร์ Express เพื่อให้สามารถนำไปใช้งานในแอปพลิเคชัน Express อื่น ๆ ได้.