import multer from "multer";
// import {} from "../public/images"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("File destination:", './public/temp');
      cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
      console.log("Original filename:", file.originalname);
      cb(null, file.originalname);
    },
  });
  
export const upload = multer({ storage: storage });

