const express = require('express')    //ใช้ module express
const router = express.Router();  //ใช้ function router ของ express
const Db = require('../controller/shippers') //import shipper ในตัวแปร Db

// middleware
router.use((req, res,next)=>{
    console.log('middleware');
    next();
});
//http://localhost:8080/api/ship
router.route('/ship').get((req, res)=>{
Db.getShip().then((data)=>{    // เรียกใช้ function getShip() และ return data กลับมา 
    // console.log(data);      
    res.status(200).json({data:data, message: 'get data success'});  // ส่ง http code 200 และแสดง data
                         // message ในรูปแบบ json
}).catch(err=>{
    res.status(500).send({error: err, message:'Server Error '}) // ถ้า error จะส่ง http code 500
                        // และแสดง err, message ในรูปแบบ json
    console.log(err);
});
})
//http://localhost:8080/api/ship/1
router.route('/ship/:id').get((req, res)=>{    // ส่ง parameter id
    Db.getShipByID(req.params.id).then((data)=>{  // เรียกใช้ function getShipByID(id) / req.params.id ดึงค่า parameter id
        res.status(200).json({data:data, message: 'get id data success'});  // ส่ง http code 200 และแสดง data
                             // message ในรูปแบบ json
    }).catch(err=>{
        res.status(500).send({error: err, message:'Server Error '}) // ถ้า error จะส่ง http code 500
                            // และแสดง err, message ในรูปแบบ json
        console.log(err);
    });
    })
    //http://localhost:8080/api/ship
    router.route('/ship').post((req, res)=>{
        let ship = { ...req.body } //ส่ง req.body เป็นข้อมูล json เข้าไปยังตัวแปร ship
        Db.postShip(ship).then((data)=>{    // เรียกใช้ function postShip() สง ship และ return data กลับมา 
            if(data.code == 'success') //return data.codde กลับมาเป็น success
            {
              res.status(200).json({ data: data, message: 'new data success' });
            } 
            else //return data เป็น error
            {
              res.status(400).send({ error: data, message:'Bad Request' }) //จะส่ง http code 400 และแสดง error, message ในรูปแบบ json
            }
            // console.log(data);      
        }).catch(err=>{
            res.status(500).send({error: err, message:'Server Error '}) // ถ้า error จะส่ง http code 500
                                // และแสดง err, message ในรูปแบบ json
            console.log(err);
        });
        })

//http://localhost:8080/api/ship
router.route('/ship/:id').put((req, res)=>{
    let ship = { ...req.body } //ส่ง req.body เป็นข้อมูล json เข้าไปยังตัวแปร ship
    Db.putShip(ship, req.params.id).then((data)=>{    // เรียกใช้ function putShip() สง ship และ return data กลับมา 
        if(data.code == 'success') //return data.codde กลับมาเป็น success
        {
          res.status(200).json({ data: data, message: 'update data success' });
        } 
        else //return data เป็น error
        {
          res.status(400).send({ error: data, message:'Bad Request' }) //จะส่ง http code 400 และแสดง error, message ในรูปแบบ json
        }
        // console.log(data);      
    }).catch(err=>{
        res.status(500).send({error: err, message:'Server Error '}) // ถ้า error จะส่ง http code 500
                            // และแสดง err, message ในรูปแบบ json
        console.log(err);
    });
    })

//http://localhost:8080/api/ship
router.route('/ship/:id').delete((req, res)=>{
    Db.deleteShip(req.params.id).then((data)=>{    // เรียกใช้ function putShip() สง ship และ return data กลับมา 
        if(data.code == 'success') //return data.codde กลับมาเป็น success
        {
          res.status(200).json({ data: data, message: 'delete data success' });
        } 
        else //return data เป็น error
        {
          res.status(400).send({ error: data, message:'Bad Request' }) //จะส่ง http code 400 และแสดง error, message ในรูปแบบ json
        }
        // console.log(data);      
    }).catch(err=>{
        res.status(500).send({error: err, message:'Server Error '}) // ถ้า error จะส่ง http code 500
                            // และแสดง err, message ในรูปแบบ json
        console.log(err);
    });
    })

    module.exports = router;   

    
    