//6409682884
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const login = require('./route/login_route')
const app = express();
const productroute = require('./route/product_route')
// const reportRouter = require('./route/report')
const path = require('path');  //นำเข้าโมดูล path เพื่อใช้ในการจัดการเส้นทางไฟล์.
const multer = require("multer")
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true })); // ใช้งาน bodyParser แบบ application/x-www-form-urlencoded  
/*ใช้ middleware ที่ชื่อว่า body-parser เพื่อทำการแปลงข้อมูลที่ส่งมากับคำขอ (request) จากรูปแบบของ URL-encoded data 
เป็นข้อมูลที่เป็นอ็อบเจกต์ (object) ในรูปแบบของ JavaScript เพื่อที่จะสามารถใช้งานข้อมูลดังกล่าวได้ง่ายขึ้นในแอปพลิเคชัน Express.js ของคุณ.
โดยทั่วไปแล้ว URL-encoded data คือข้อมูลที่ถูกส่งผ่านการส่งคำขอแบบ POST จากฟอร์ม HTML หรือผ่านการส่งคำขอแบบอื่นๆ 
ซึ่งข้อมูลจะถูกเข้ารหัสเป็น URL-encoded format ก่อนจะถูกส่งไปยังแอปพลิเคชัน Express.js ของคุณ.
การใช้ middleware body-parser ที่กำหนดค่า extended: true จะทำให้ Express.js สามารถแปลงข้อมูลในรูปแบบของ 
URL-encoded data ที่ซับซ้อน (nested object) ได้โดยอัตโนมัติ ซึ่งจะช่วยให้คุณสามารถใช้งานข้อมูลในรูปแบบที่เป็นโครงสร้างได้ง่ายขึ้น*/
app.use(bodyParser.json()); // ใช้งาน bodyParser แบบ json
app.use(cors());
app.use('/Authen',login);
app.use('/api', productroute); // ระบุ route ชื่อ api เพื่่อป้องกันความสับสน ตอนเรียกหน้า page ซึ่งได้สร้าง link shipper_route.js ไว้แล้วที่
// app.use('/report', reportRouter);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(__dirname, 'uploads');
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const sanitizedFilename = file.originalname.replace(/[^\x00-\x7F]/g, 'a');
        cb(null, Date.now() + "_" + sanitizedFilename)
    }
})

const upload = multer({ storage })

app.post('/upload', upload.single('file'), function (req, res) {
    const filename = req.file.filename;
    res.status(200).json(filename)
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.delete('/delete/:filename', function(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    
    // Delete the file from the uploads directory
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            res.status(500).send('Error deleting file');
        } else {
            console.log('File deleted successfully:', filename);
            res.status(200).send('File deleted successfully');
        }
    });
});

const localhost = "localhost"

app.listen(8080, () => {
    console.log('Server running at http://'+localhost+':8080')
})