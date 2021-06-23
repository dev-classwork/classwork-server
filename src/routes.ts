import express from 'express';
import multer from 'multer';
import configMulter from '../multer';

const upload = multer(configMulter);

import GitsController from './controllers/gits';
import UsersController from './controllers/users';
import ClassesController from './controllers/classes';
import TeamsController from './controllers/teams';
import LogsController from './controllers/logs';

import ExternalSecurity from './security/external';

const routes = express.Router();

const gitController = new GitsController();
const userController = new UsersController();
const classController = new ClassesController();
const teamsController = new TeamsController();
const logsController = new LogsController();

const externalSecurity = new ExternalSecurity();

//Linter
routes.post('/linter', externalSecurity.git.verify(), gitController.verify);

//User
routes.post('/user/create', externalSecurity.user.index(), userController.create);
routes.post('/user/update', externalSecurity.user.update(), userController.update);
routes.delete('/user/delete', externalSecurity.user.delete(), userController.delete);
routes.get('/users', userController.list);

//Class
routes.post('/class/create', upload.single('image'), externalSecurity.class.index(), classController.create);
routes.post('/class/create/template', externalSecurity.class.template(), classController.createWithTemplate);
routes.post('/class/update', externalSecurity.class.update(), classController.update);
routes.post('/class/updateAll', upload.single('image'), externalSecurity.class.updateAll(), classController.update);
routes.post('/class/update/template', externalSecurity.class.updateTemplate(), classController.updateTemplate);
routes.delete('/class/delete', externalSecurity.class.delete(), classController.delete);
routes.get('/classes', classController.list);

//Teams
routes.post('/teams/create', externalSecurity.team.index(), teamsController.createTeams);
routes.post('/teams/update', externalSecurity.team.update(), teamsController.updateTeams);
routes.delete('/teams/delete', externalSecurity.team.delete(), teamsController.destroyTeams);
routes.get('/teams', teamsController.getTeams);

//Git
routes.get('/git', externalSecurity.git.index(), gitController.git);
routes.get('/mobile/git', externalSecurity.git.index(), gitController.gitToMobileAuth);
routes.get('/git/user/repos', gitController.getGitRepos);
routes.get('/raw', gitController.raw);
routes.post('/directory/load', gitController.loadDirectory);
routes.post('/directory/complexy', gitController.insertDirectoryComplexy);
routes.get('/directory/files', gitController.getReposFiles);
routes.get('/directory/rank', gitController.getReposRank);

//Logs
routes.get('/logs', logsController.getLogs);
routes.get('/log/:filename', logsController.download);

routes.get('/uploads', logsController.getUploads);

export default routes;