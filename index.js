const express = require('express')
const multer = require('multer')
const fs = require('fs');

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, './image/')
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
            cb(null, true)
        } else {
            cb(null, false)
            console.log("Error file type not supported")
        }
    },
 }).single('image')

const app = express()

app.get('/', function(req, res){
   (async() =>  {
        try{
            await fs.readdir('./image/',(err, files) => {
                if (err){
                    res.status(400).json({
                        Message : "Error getting images"
                    })
                }
                res.send(files)
            })
        } catch(err){
            console.log(err)
        }
    })()
})
app.get('/api/uploader/:img_name', function(req, res){
    const img = req.params.img_name
    const img_path = "/image/" + img
    res.sendFile(__dirname + img_path)
})

app.delete('/api/uploader/:img_name', function(req, res){
    const img = req.params.img_name
    const img_path = "/image/" + img
    
    
    fs.unlink((__dirname + img_path), (err) => {
        if (err){
            res.json({ Message: "Error deleting image"})
        }
        res.json({ Message: "Image deleted successfully"})
    })
})

app.post('/api/uploader', function(req, res){
    upload(req, res, function(err){
        if (err){
            res.json({ Progress: "File uploaded failed"})
        }
        res.json({ Progress: "File uploaded successfully"})
    })
})

app.listen(process.env.PORT || 3000, function(req, res){
    console.log("Connected to server")
})