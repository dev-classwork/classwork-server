import { Request, Response } from 'express';
import connection from '../database/connection';
import InternalSecurity from '../security/internal';
import dateReturn from '../utils/dateReturn';

const internalSecurity = new InternalSecurity();

class TeamsControllers {
    async createTeams(req: Request, res: Response) {
        const { key, repos, name } = req.body;

        var thx = await connection.transaction();
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            const classes = await thx('classes').where('key', key).first();
            if(!classes || classes.length < 1){
                await thx.rollback();
                console.log(dateReturn() + `Class [${classes}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }

            const id = await thx('teams').insert({
                name,
                repos
            }).returning('id');

            await thx('classes_teams').insert({
                class_id: classes.id,
                team_id: id[0]
            });

            await thx.commit();

            console.log(dateReturn() + `Team in Class [${key}] as been created!`);
            return res.status(200).json({
                name,
                repos
            });
        }else{
            await thx.rollback();
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    }
    async getTeams(req: Request, res: Response) {
        var key = req.query.key;
        var id = req.query.id;
        
        var thx = await connection.transaction();
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(key != null){
                var classes = await thx('classes').select(['id','key']).where("key", String(key)).first();
                if(classes == null){
                    await thx.rollback();
                    console.log(dateReturn() + `Class [${key}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
            }else{
                await thx.rollback();
                console.log(dateReturn() + `Class [${key}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }

            const teams = id === null || id === undefined? 
            
            await thx('teams').join('classes_teams', 'teams.id', '=', 'classes_teams.team_id')
            .whereIn('classes_teams.class_id', [String(classes.id)])
            .distinct()
            .select('teams.*'):

            await thx('teams').join('classes_teams', 'teams.id', '=', 'classes_teams.team_id')
            .whereIn('classes_teams.class_id', [String(classes.id)])
            .whereIn('teams.id', [String(id)])
            .distinct()
            .select('teams.*').first();

            await thx.commit();

            console.log(dateReturn() + `Class teams [${key}] listed!`);
            return res.status(202).json(teams);
        }else{
            await thx.rollback();
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    }
    async destroyTeams(req: Request, res: Response) {
        const queryId = req.query.id;
        const queryKey = req.query.key;

        var thx = await connection.transaction();
        var team = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(queryKey != null){
                var classes = await thx('classes').select(['id','key']).where("key", String(queryKey)).first();
                if(classes == null){
                    await thx.rollback();
                    console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                if(queryId != null){
                    try {
                        team = await thx('teams').where("id", Number(queryId));
                        if(team == null){
                            console.log(dateReturn() + `User [${queryId}] is not defined!`);
                            return res.status(404).json({
                                "message": "Operação inválida",
                                "origin": "Database",
                            });
                        }
                        const deletedTeam = await thx('teams').join('classes_teams', 'teams.id', '=', 'classes_teams.team_id')
                        .whereIn('classes_teams.class_id', [String(classes.id)])
                        .whereIn('teams.id', [String(queryId)])
                        .distinct()
                        .select('teams.*').first();

                        await thx('classes_teams').where('team_id', String(queryId)).andWhere("class_id", String(classes.id)).first().delete();
                        await thx('teams').where("id", deletedTeam.id).first().delete();

                        console.log(dateReturn() + `User [${queryId}] deleted!`);
                        
                        await thx.commit();

                        return res.status(200).json({
                            "message": "Equipe deletada"
                        });
                    } catch (error) {
                        await thx.rollback();
                        return res.status(404).json({
                            "message": "Operação inválida",
                            "origin": "Database",
                        });
                    }
                }else{
                    await thx.rollback();
                    console.log(dateReturn() + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
            }else{
                await thx.rollback();
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
    async updateTeams(req: Request, res: Response){
        const { repos, name } = req.body;
        const queryId = req.query.id;
        const queryKey = req.query.key;

        var thx = await connection.transaction();
        var team = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(String(auth))){
            if(queryKey != null){
                var classes = await thx('classes').select(['id','key']).where("key", String(queryKey)).first();
                if(classes == null){
                    await thx.rollback();
                    console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                if(queryId != null){
                    team = await thx('teams').where("id", Number(queryId));
                    if(team == null){
                        console.log(dateReturn() + `User [${queryId}] is not defined!`);
                        return res.status(404).json({
                            "message": "Operação inválida",
                            "origin": "Database",
                        });
                    }
                    const updatedTeam = await thx('teams').join('classes_teams', 'teams.id', '=', 'classes_teams.team_id')
                    .whereIn('classes_teams.class_id', [String(classes.id)])
                    .whereIn('teams.id', [String(queryId)])
                    .distinct()
                    .select('teams.*').first();

                    await thx('teams').where("id", updatedTeam.id).first().update({
                        repos,
                        name
                    });

                    await thx.commit();

                    return res.status(200).json({
                        "message": "Equipe atualizada"
                    });
                }else{
                    await thx.rollback();
                    console.log(dateReturn() + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
            }else{
                await thx.rollback();
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


export default TeamsControllers;