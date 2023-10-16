const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb)=>{
        //il nome del file deve contenere il timestamp per evitare che venga sovrascritto
        req.body.profile_pic = Date.now() + '_' + file.originalname
        req.body.profile_pic_URL = "/uploads/" + req.body.profile_pic;
        cb(null, req.body.profile_pic);
    }
  });

const saveFile = (req, res, next) => {
    const upload = multer({ storage: storage }).single('profile_pic');
    upload(req, res, function(err) {
        if(err) {
            return res.status(500).json({errors: err});
        }
        next();
    });
}

module.exports = saveFile;