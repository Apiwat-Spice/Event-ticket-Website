const multer = require("multer")
const path = require("path")

const storage = multer.memoryStorage()

const  fileFilter = (req,file,cb)=>{
    const allowFileTypes = /jpeg|jpg|png/
    const mimetype = allowFileTypes.test(file.mimetype)//ไฟล์ที่อัพ
    const extname = allowFileTypes.test(//nomolrize
        path.extname(file.originalname).toLowerCase()
    )
    if(mimetype && extname){//อัพได้
        console.log("i do");
        
        return cb(null,true)
    }
    cb(//อัพไม่ได้
        new Error(
            "Error:file upload only supports the following file types -"+allowFileTypes
        )
    )
}
const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{ fileSize:2*1024*1024}
})

module.exports = upload