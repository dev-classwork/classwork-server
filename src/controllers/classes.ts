import { Request, Response } from 'express';
import connection from '../database/connection';
import InternalSecurity from '../security/internal';
import dateReturn from '../utils/dateReturn';
import jsonParseCheck from '../utils/jsonParseCheck';
import { isNullOrUndefined } from 'util';
import path from 'path';
import fs from 'fs';

const internalSecurity = new InternalSecurity();

class ClassesControllers {
    async create(req: Request, res: Response) {
        const { name, description, teacher_id, teacher_id_auth, key, color } = req.body;
        console.log(req.body);
        var thx = await connection.transaction();
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            console.log(dateReturn() + `New class created!`);
            await thx('classes').insert({
                image: req.file.filename,
                color,
                key,
                name,
                description,
                teacher_id,
                teacher_id_auth
            });

            var user = await thx('users').where('id_auth', teacher_id_auth).first();
            if(!user){
                await thx.rollback();
                console.log(dateReturn() + `User [${teacher_id}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }

            var classes = (isNullOrUndefined(user.classes) || user.classes.length <= 0)? []:jsonParseCheck(user.classes); 
            classes.push(key);

            await thx('users').where('id_auth', teacher_id_auth).update({
                classes: JSON.stringify(classes)
            });
            user = await thx('users').where('id_auth', teacher_id_auth).first();
            await thx.commit();

            user.classes = jsonParseCheck(user.classes);
            user.urls = jsonParseCheck(user.urls);
            return res.status(201).json(user);
        }else{
            await thx.commit();
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    }
    async createWithTemplate(req: Request, res: Response) {
        const { name, description, teacher_id, teacher_id_auth, key, filename, color } = req.body;

        var thx = await connection.transaction();
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            console.log(dateReturn() + `New class created!`);
            await thx('classes').insert({
                image: filename,
                color,
                key,
                name,
                description,
                teacher_id,
                teacher_id_auth
            });

            var user = await thx('users').where('id_auth', teacher_id_auth).first();
            if(!user){
                await thx.rollback();
                console.log(dateReturn() + `User [${teacher_id}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
            var classes = (isNullOrUndefined(user.classes) || user.classes.length <= 0)? []:jsonParseCheck(user.classes);
            classes.push(key);

            await thx('users').where('id_auth', teacher_id_auth).update({
                classes: JSON.stringify(classes)
            });
            user = await thx('users').where('id_auth', teacher_id_auth).first();
            await thx.commit();

            user.classes = jsonParseCheck(user.classes);
            user.urls = jsonParseCheck(user.urls);
            return res.status(201).json(user);
        }else{
            await thx.commit();
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    }
    async list(req: Request, res: Response) {
        var queryKey = req.query.key;

        var classes = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(queryKey != null){
                classes = await connection('classes').select(['color', 'name','description', 'key', 'image', 'teacher_id']).where("key", String(queryKey)).first();

                if(classes == null){
                    console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                console.log(dateReturn() + `Class [${queryKey}] listed!`);
            }else{
                classes = await connection('classes').select(['color', 'name','description', 'key', 'image', 'teacher_id']);
            }
            console.log(dateReturn() + `Classes listed!`);
            return res.status(202).json(classes);
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    }
    async delete(req: Request, res: Response) {
        const queryKey = req.query.key;
        const queryTeacherId = req.query.teacher_id;

        console.log(queryKey, queryTeacherId);

        var thx = await connection.transaction();
        var classes = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(queryKey != null){
                classes = await thx('classes').select(['id', 'name','description', 'key', 'image']).where("key", String(queryKey)).andWhere("teacher_id", String(queryTeacherId)).first();
                if(classes == null){
                    await thx.rollback();
                    console.log(dateReturn() + `Class [${queryKey},${queryTeacherId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                const deletedTeams = await thx('teams').join('classes_teams', 'teams.id', '=', 'classes_teams.team_id')
                .whereIn('classes_teams.class_id', [String(classes.id)])
                .distinct()
                .select('teams.*');

                await thx('classes_teams').where("class_id", String(classes.id)).first().delete();

                for(let i = 0; i < deletedTeams.length; i++){
                    await thx('teams').where("id", String(deletedTeams[i].id)).first().delete();
                }

                await thx('classes').select(['name','description', 'key']).where("key", String(queryKey)).andWhere("teacher_id", String(queryTeacherId)).first().delete();
                let user = await thx('users').select('*').where("id", String(queryTeacherId)).first();
                let userClasses = jsonParseCheck(user.classes) as any[];
                userClasses.splice(userClasses.indexOf(queryKey), 1);
                
                await thx('users').select('*').where("id", String(queryTeacherId)).first().update({
                    classes: JSON.stringify(userClasses)
                });


                if(classes.image.split('\/')[0] !== "templates"){
                    const imageName = classes.image;
                    const oldDefaultName = path.resolve(__dirname, '..', '..', 'uploads', imageName);                   
                    if(fs.existsSync(oldDefaultName)){
                        fs.unlinkSync(oldDefaultName);
                    }
                }
                
                user = await thx('users').select('*').where("id", String(queryTeacherId)).first();

                await thx.commit();
                return res.status(200).json(user);
            }else{
                await thx.rollback();
                console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            await thx.rollback();
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    }
    async update(req: Request, res: Response) {
        const { name, description, color, key } = req.body;

        var classes = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(key != null){
                classes = await connection('classes').select(['name','description', 'key']).where("key", String(key)).first();
                if(classes == null){
                    console.log(dateReturn() + `Class [${key}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                if(req.file != null && req.file != undefined){
                    await connection('classes').select(['name','description', 'key']).where("key", String(key)).update({
                        image: req.file.filename,
                        name,
                        description,
                        color
                    });
                }else{
                    await connection('classes').select(['name','description', 'key']).where("key", String(key)).update({
                        name,
                        description,
                        color
                    });
                }
            
                console.log(dateReturn() + `Class [${key}] updated!`);
                return res.status(200).json(classes);
            }else{
                console.log(dateReturn() + `Class [${key}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    }
    async updateTemplate(req: Request, res: Response) {
        const { name, description, color, filename } = req.body;

        const queryKey = req.query.key;

        var classes = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(queryKey != null){
                classes = await connection('classes').select(['name','description', 'key', 'image']).where("key", String(queryKey)).first();
                if(classes == null){
                    console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                if(classes.image.split('\/')[0] !== "templates"){
                    const imageName = classes.image;
                    const oldDefaultName = path.resolve(__dirname, '..', '..', 'uploads', imageName);                   
                    if(fs.existsSync(oldDefaultName)){
                        fs.unlinkSync(oldDefaultName);
                    }
                }

                await connection('classes').select(['name','description', 'key']).where("key", String(queryKey)).update({
                    image: filename,
                    name,
                    description,
                    color
                });

                console.log(dateReturn() + `Class [${queryKey}] updated!`);
                return res.status(200).json(classes);
            }else{
                console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    }
}

export default ClassesControllers;