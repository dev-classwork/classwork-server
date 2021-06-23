import { Request, Response } from 'express';
import connection from '../database/connection';
import InternalSecurity from '../security/internal';
import jsonParseCheck from '../utils/jsonParseCheck';
import dateReturn from '../utils/dateReturn';

const internalSecurity = new InternalSecurity();

class UsersControllers {
    async create(req: Request, res: Response) {
        const { git_id, name, real_name, type, avatar, id_auth } = req.body;
        var urls = JSON.stringify(req.body.urls);
        var classes = JSON.stringify(req.body.classes);

        const {auth} = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            console.log(dateReturn() + `New user created!`);
            await connection('users').insert({
                id_auth,
                git_id,
                name,
                real_name,
                type,
                avatar,
                classes,
                urls
            });

            req.body.classes = jsonParseCheck(req.body.classes);
            req.body.urls = jsonParseCheck(req.body.urls);
            return res.status(201).json(req.body);
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                "message": "Request não autorizado!",
                "origin": "Internal security",
            });
        }
    }
    async list(req: Request, res: Response) {
        var queryId = req.query.id;
        var queryGitId = req.query.git_id;

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(queryId != null){
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes', 'urls']).where("id", Number(queryId)).first();

                if(users == null){
                    console.log(dateReturn() + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                console.log(dateReturn() + `User [${queryId}] listed!`);
            }else if(queryGitId != null){
                users = await connection('users').select(['id', 'git_id','id_auth','type','real_name','name','avatar','classes', 'urls']).where("git_id", Number(queryGitId)).first();

                if(users == null){
                    console.log(dateReturn() + `User [${queryGitId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                console.log(dateReturn() + `Git user [${queryGitId}] listed!`);
                users.classes = jsonParseCheck(users.classes);
                users.urls = jsonParseCheck(users.urls);
            }else{
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes', 'urls']);
                console.log(dateReturn() + `Users listed!`);
                for(var l in users){
                    users[l].classes = jsonParseCheck(users[l].classes);
                    users[l].urls = jsonParseCheck(users[l].urls);
                }
            }
            return res.status(202).json(users);
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    }
    async delete(req: Request, res: Response) {
        const queryId = req.query.id;
        const queryAuth = req.query.id_auth;

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(queryId != null){
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes', 'urls']).where("id", Number(queryId)).andWhere("id_auth", String(queryAuth)).first();
                if(users == null){
                    console.log(dateReturn() + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes', 'urls']).where("id", Number(queryId)).first().delete();
                console.log(dateReturn() + `User [${queryId}] deleted!`);

                users.classes = jsonParseCheck(users.classes);
                users.urls = jsonParseCheck(users.urls);
                return res.status(200).json(users);
            }else{
                console.log(dateReturn() + `User [${queryId}] is not defined!`);
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
    async update(req: Request, res: Response) {
        const {git_id, name, real_name, avatar} = req.body;
        var urls = JSON.stringify(req.body.urls);
        var classes = JSON.stringify(req.body.classes);

        const queryId = req.query.id;

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(queryId != null){
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes', 'urls']).where("id", Number(queryId)).first();
                if(users == null){
                    console.log(dateReturn() + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes', 'urls']).where("id", Number(queryId)).update({
                    git_id,
                    name,
                    real_name,
                    avatar,
                    classes,
                    urls
                });

                console.log(dateReturn() + `User [${queryId}] updated!`);
                return res.status(200).redirect(process.env.REACT_APP_URL_FRONT+'/profile');
            }else{
                console.log(dateReturn() + `User [${queryId}] is not defined!`);
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
    async addClass(req: Request, res: Response) {
        const { git_id } = req.body;
        var classes = JSON.stringify(req.body.classes);
        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(git_id != null){
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes', 'urls']).where("git_id", git_id).first();
                if(users == null){
                    console.log(dateReturn() + `User [${git_id}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                
                await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','urls']).where("git_id", git_id).update({
                    classes,
                });

                console.log(dateReturn() + `User [${git_id}] updated!`);
                users.classes = jsonParseCheck(users.classes);
                users.urls = jsonParseCheck(users.urls);
                return res.status(200).json(users);
            }else{
                console.log(dateReturn() + `User [${git_id}] is not defined!`);
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

export default UsersControllers;