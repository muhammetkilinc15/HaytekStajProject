import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

// __dirname'i elde etme
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dosya yükleme işlemi için diskStorage oluşturun
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../public/images');
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, path.parse(file.originalname).name + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 100 * 1024 * 1024  // 100 MB
    }
});

export default upload;
