import multer from 'multer';
import path from 'path';
import fs from 'fs';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, 'uploads'),
        filename(req, file, callback) {

            if(req.body.oldImage !== null && req.body.oldImage !== undefined &&
            req.body.oldImage.split('\/')[0] !== "templates"){

                const oldImage = req.body.oldImage;
                const oldDefaultName = path.resolve(__dirname, '..', '..', 'uploads', oldImage);                   
                if(fs.existsSync(oldDefaultName)){
                    fs.unlinkSync(oldDefaultName);
                }
            }

            console.log(req.body, 'abc')

            const filename = `${req.body.key}.${file.mimetype.split("\/")[1]}`;
            callback(null, filename);
        }
    }),
}