import { Request, Response } from 'express';
import fs from 'fs';

class LogsControlles {
    async getLogs(req: Request, res: Response) {
        let dir = __dirname + `/../logs/global`;
        console.log(dir);
        let files = fs.readdirSync(dir);
        console.log(fs.readdirSync(dir));

        files = files.filter((item) => {
            if(item.includes('.log') && item.includes('[@]')){
                return item;
            }

            return false;
        });

        let filesInAltFormat = files.map((item) => {
            let reposItens = item.split('.log')[0].split('[@]');
            let reposName = reposItens[1].replace('-', ' ').replace('_', ' ');

            let repos = `${reposItens[0]} | ${reposName}`;

            return {
                filename: item,
                repos,
            }
        });
    
        res.json(filesInAltFormat);
    }
    async download(req: Request, res: Response){
        let { filename } = req.params as {
            filename: string
        };

        filename = filename !== null && filename !== undefined ? filename:"";
        console.log(__dirname + `/../logs/global/${filename}`);
        if(filename.includes("[@]") && fs.existsSync(__dirname + `/../logs/global/${filename}`)){
            res.header("Content-Disposition", "attachment");
            
            return res.download(__dirname + `/../logs/global/${filename}`, filename, (e) => {
            });
        }
        
        return res.status(400);
    }
    async getUploads(req: Request, res: Response) {
        let dir = __dirname + `/../../uploads`;
        let files = fs.readdirSync(dir);

        /*
        files = files.filter((item) => {
            if(item.includes('.log') && item.includes('[@]')){
                return item;
            }

            return false;
        });*/

        let filesInAltFormat = files.map((item) => {
            let repos = `${item}`;

            return {
                filename: item,
                repos,
            }
        });
    
        res.json(filesInAltFormat);
    }
};

export default LogsControlles;