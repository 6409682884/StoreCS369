const express = require('express');
const route = express.Router();
const Db = require('../controller/shippers');
const router = require('./myroute');
//เรียกใช้ package @jsreport/nodejs-client ที่ลิ้งค์กับ report server (erl, username, password)
const client = require('@jsreport/nodejs-client')("http://localhost:5488","admin","mypassword")
//middleware
router.use((req, res, next)=>{
    console.log('middleware report');
    next();
});
//http://localhost:8080/report/ship
router.get('/ship', (req, res, next) => {
    //Get data shippers ทั้งหมด
    Db.getShip().then((data)=>{
        //เปิด report
        client.render({
            template: {
                name: 'shippers-report', // ชื่อ report
                recipe: 'chrome-pdf', //เปิดเป็น chrome-pdf หรือแปลงเป็นformat html ดูก็ได้
                engine: 'handlebars'
            },
            data: {data}  //ส่ง data ที่ getShip มาได้
        }, { timeout:5000 } // set timeout 5
    ).then((response) => response.pipe(res)).catch(next)
        }).catch(err => {
            res.status(500).send({error:err, message:'Server Error'})
            console.log(error);
        });
    })
    module.exports = router