import { Request, Response } from 'express';
import axios from 'axios';
import generateHex from '../utils/generateHex';
import dateReturn from '../utils/dateReturn';
import connection from '../database/connection';
import calculateComplexyAndMethods, { calculateComplexyAndMethodsWithinToken, linterVerify } from '../utils/calculateComplexyAndMethods';
import writeFile from '../utils/writeLog';
import mime from 'mime-types';
class GitsControlles {
    async git(req: Request, res: Response) {
        const GITHUB_AUTH_TOKEN_URL = 'https://github.com/login/oauth/access_token';
        const GITHUB_USER_URL = 'https://api.github.com/user';
        const END_URL = process.env.REACT_APP_URL_FRONT;
        var client_id = process.env.REACT_APP_GH_BASIC_CLIENT_ID;
        var secret_id = process.env.REACT_APP_GH_BASIC_SECRET_ID;

        if (process.env.NODE_ENV === "development") {
            client_id = process.env.REACT_APP_GH_BASIC_CLIENT_ID_DEV;
            secret_id = process.env.REACT_APP_GH_BASIC_SECRET_ID_DEV;
        }

        const STATE_APP = req.query.state;
        const CODE = req.query.code;
        const SCOPE = "repo, user";

        var token = '';
        var user = {
            id: -1,
            repos_url: "",
            login: "",
            name: "",
            avatar_url: "",
            url: ""
        };


        //Pegar o token do Git
        await axios({
            url: GITHUB_AUTH_TOKEN_URL,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-OAuth-Scopes': SCOPE,
            },
            data: {
                client_id: client_id,
                client_secret: secret_id,
                state: STATE_APP,
                code: CODE,
            }
        }).then(function (response) {
            token = response.data.access_token;
        }).catch(function (err) {
            console.log(dateReturn() + 'Error in get code from token');
        });

        //Pedir dados do usuário para o git
        await axios({
            method: 'get',
            url: GITHUB_USER_URL,
            headers: {
                'Authorization': 'token ' + token,
                'X-OAuth-Scopes': SCOPE,
            },
        }).then(function (response) {
            user = response.data;
        }).catch(function (err) {
            console.log(dateReturn() + 'Error in send token');
        });


        //Checar se existe algum usuário no banco de dados com o msm git_id
        await axios({
            method: 'get',
            url: process.env.REACT_APP_URL_BACK + '/users?git_id=' + user.id,
            headers: {
                'auth': process.env.REACT_APP_DB_IDENTITY,
            },
        }).then(async function (response) {
            user = response.data;
        }).catch(async function () {
            console.log(dateReturn() + 'Checking user');

            //Criar se não existir
            if (user.id != null) {
                var git_id = user.id;
                var name = user.login;
                var real_name = String(user.name);
                var type = "User";
                var avatar = user.avatar_url;
                var id_auth = generateHex();
                var urls = [
                    user.url,
                    user.repos_url
                ];
                var classes = [] as string[];

                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_URL_BACK + '/user/create',
                    data: {
                        id_auth,
                        git_id,
                        name,
                        real_name,
                        type,
                        avatar,
                        urls,
                        classes
                    },
                    headers: {
                        'auth': process.env.REACT_APP_DB_IDENTITY,
                    },
                }).then(function (response) {
                    user = response.data;
                }).catch(function (err) {
                    console.log(dateReturn() + 'Error in create user');
                });
            }
        });

        return res.status(200).redirect(END_URL + `/git/repos?token=${token}&user=${JSON.stringify(user)}`);
    }
    async gitToMobileAuth(req: Request, res: Response) {
        const GITHUB_AUTH_TOKEN_URL = 'https://github.com/login/oauth/access_token';
        const GITHUB_USER_URL = 'https://api.github.com/user';
        var client_id = process.env.REACT_APP_GH_BASIC_CLIENT_ID_MOBILE;
        var secret_id = process.env.REACT_APP_GH_BASIC_SECRET_ID_MOBILE;

        const STATE_APP = req.query.state;
        const CODE = req.query.code;
        const SCOPE = "repo, user";

        var token = '';
        var user = {
            id: -1,
            repos_url: "",
            login: "",
            name: "",
            avatar_url: "",
            url: ""
        };


        //Pegar o token do Git
        await axios({
            url: GITHUB_AUTH_TOKEN_URL,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-OAuth-Scopes': SCOPE,
            },
            data: {
                client_id: client_id,
                client_secret: secret_id,
                state: STATE_APP,
                code: CODE,
            }
        }).then(function (response) {
            token = response.data.access_token;
        }).catch(function (err) {
            console.log(dateReturn() + 'Error in get code from token');
        });

        //Pedir dados do usuário para o git
        await axios({
            method: 'get',
            url: GITHUB_USER_URL,
            headers: {
                'Authorization': 'token ' + token,
                'X-OAuth-Scopes': SCOPE,
            },
        }).then(function (response) {
            user = response.data;
        }).catch(function (err) {
            console.log(dateReturn() + 'Error in send token');
        });


        //Checar se existe algum usuário no banco de dados com o msm git_id
        await axios({
            method: 'get',
            url: process.env.REACT_APP_URL_BACK + '/users?git_id=' + user.id,
            headers: {
                'auth': process.env.REACT_APP_DB_IDENTITY,
            },
        }).then(async function (response) {
            user = response.data;
        }).catch(async function () {
            console.log(dateReturn() + 'Checking user');

            //Criar se não existir
            if (user.id != null) {
                var git_id = user.id;
                var name = user.login;
                var real_name = String(user.name);
                var type = "User";
                var avatar = user.avatar_url;
                var id_auth = generateHex();
                var urls = [
                    user.url,
                    user.repos_url
                ];
                var classes = [] as string[];

                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_URL_BACK + '/user/create',
                    data: {
                        id_auth,
                        git_id,
                        name,
                        real_name,
                        type,
                        avatar,
                        urls,
                        classes
                    },
                    headers: {
                        'auth': process.env.REACT_APP_DB_IDENTITY,
                    },
                }).then(function (response) {
                    user = response.data;
                }).catch(function (err) {
                    console.log(dateReturn() + 'Error in create user');
                });
            }
        });

        return res.status(200).json({
            token,
            user
        });
    }
    async getGitRepos(req: Request, res: Response) {
        var { token, page } = req.query;
        var user = null as any;
        await axios({
            method: 'get',
            url: 'https://api.github.com/user',
            headers: {
                'Authorization': 'token ' + token,
            },
        }).then(function (response) {
            user = response.data;
        }).catch(function (err) {
            console.log(dateReturn() + 'Error in get repos');
            res.status(400);
        });
        var repos = [] as any[];
        await axios(
            {
                method: 'get',
                url: `https://api.github.com/users/${user.login}/repos?per_page=33&page=${page}`,
                headers: {
                    'Authorization': 'token ' + token
                },
                data: {
                    type: 'all',
                },
            }
        ).then(function (response) {
            for (var i in response.data) {
                repos.push({
                    id: response.data[i].id,
                    name: response.data[i].name,
                    description: response.data[i].description,
                    language: response.data[i].language,
                    private: response.data[i].private,
                    commits_url: response.data[i].commits_url,
                    size: response.data[i].size
                });
            }
        }).catch(function (err) {
            console.log(dateReturn() + 'Error in get repos');
            res.status(400);
        });
        res.status(200).json(repos);
    }
    async raw(req: Request, res: Response) {
        const raw_url = String(req.query.raw_url);
        const TOKEN = String(req.query.token);
        if (raw_url != null) {
            var raw;
            await axios.get(raw_url, {
                headers: {
                    'Authorization': 'token ' + TOKEN
                },
            }).then(function (response) {
                raw = response.data;
            }).catch(function () { });

            return res.status(200).json(raw);
        } else {
            console.log(dateReturn() + `Raw url is not defined!`);
            return res.status(404).json({
                "message": "Operação inválida",
                "origin": "Database",
            });
        }
    }
    async loadDirectory(req: Request, res: Response) {
        var rank_void = true;
        var rank_index = 0;

        let { data, actions, url, token } = req.body;

        writeFile(url, dateReturn() + `Coletando dados do repositório salvo no github: ${url}`);

        for (var z in data) {
            actions.shas[Number(z)] = data[z].sha;

            await axios.get(url + '/' + actions.shas[Number(z)], {
                headers: {
                    'Authorization': 'token ' + token
                }
            }).then((r) => {
                let com = r.data;

                if (data === 0) {
                    console.log(Object.values(com));
                }
                var files: any[] = com.files;

                for (var x in files) {
                    files[x] = {
                        filename: files[x].filename,
                        status: files[x].status,
                        additions: files[x].additions,
                        deletions: files[x].deletions,
                        raw_url: files[x].raw_url,
                        changes: files[x].changes,
                        previous_filename: files[x].previous_filename ? files[x].previous_filename : ""
                    }
                }

                let _userData: any = Object.values(com)[6];
                let _authorData: any = Object.values(com)[2];
                let _changeData: any = Object.values(com)[9];

                if (_userData === undefined || _userData === null) {
                    console.log(url + '/' + actions.shas[Number(z)], {
                        headers: {
                            'Authorization': 'token ' + token
                        }
                    }, _userData, z);
                }

                let authorName: string = _userData && _userData.login ? _userData.login : _authorData.author.name + " [unsafe]";

                let authorAvatar: string = _userData && _userData.avatar_url ? _userData.avatar_url : "";
                actions.commits[Number(z)] = {
                    author: authorName,
                    author_avatar: authorAvatar,
                    date: _authorData.author.date,
                    status: _changeData,
                    message: _authorData.message,
                    tree: _authorData.tree.url,
                    files: files,
                }

                if (!rank_void) {
                    var _authors = [] as any[];
                    for (var n in actions.rank) {
                        _authors[Number(n)] = actions.rank[n].name;
                    }

                    if (_authors.includes(authorName)) {
                        let a = _authors.indexOf(authorName);
                        actions.rank[a].total += _changeData.total;
                        actions.rank[a].additions += _changeData.additions;
                        actions.rank[a].deletions += _changeData.deletions;
                    } else if (!authorName.includes('[bot]')) {
                        actions.rank[rank_index] = {
                            name: authorName,
                            avatar: authorAvatar,
                            total: _changeData.total,
                            additions: _changeData.additions,
                            deletions: _changeData.deletions,
                        };
                        rank_index++;
                    }
                } else if (!authorName.includes('[bot]')) {
                    rank_void = false;
                    actions.rank[rank_index] = {
                        name: authorName,
                        avatar: authorAvatar,
                        total: _changeData.total,
                        additions: _changeData.additions,
                        deletions: _changeData.deletions,
                    };

                    rank_index++;
                }
            }).catch((err) => {
                console.log("erro", err);
                res.status(400);
            });
        }

        writeFile(url, dateReturn() + `Dados coletados!\n`);
        return res.status(200).json(actions);
    }
    async insertDirectoryComplexy(req: Request, res: Response) {
        let { commit, url, commit_number } = req.body;
        let { token } = req.query;

        writeFile(url, dateReturn() + "Iniciando commit: " + commit_number);

        let commit_thx = await connection.transaction();
        try {
            const have_commit = await commit_thx('commit').select("qtd").where("repos_url", url);
            console.log(commit_number, have_commit);

            if (have_commit.length === 0) {
                await commit_thx('commit').insert({
                    qtd: commit_number,
                    repos_url: url
                }).catch((e) => {
                    console.log(e);
                });;
            } else if (have_commit[0].qtd < commit_number) {
                await commit_thx('commit').where("repos_url", url).first().update({
                    qtd: commit_number
                }).catch((e) => {
                    console.log(e);
                });;
            } else {
                const _savedCommit = await commit_thx('commit_historic').select("*")
                    .where("repos_url", url)
                    .andWhere("commit_number", commit_number).first().catch((e) => {
                        console.log(e);
                    });;

                const _savedCommitFiles = await commit_thx('files_historic')
                    .select("filename", "previous_filename", "status", "raw_url", "filename", "additions", "changes", "deletions", "lines", "complexity_cyclomatic", "methods")
                    .where("repos_url", url)
                    .andWhere("commit_number", commit_number).catch((e) => {
                        console.log(e);
                    });;

                if (_savedCommit !== undefined && _savedCommitFiles !== undefined) {
                    let loadedCommit = {
                        commit_number,
                        author: _savedCommit.author,
                        author_avatar: _savedCommit.author_avatar,
                        date: _savedCommit.date,
                        files: _savedCommitFiles,
                        message: _savedCommit.message,
                        status: {
                            additions: _savedCommit.additions,
                            deletions: _savedCommit.deletions,
                            total: _savedCommit.total
                        },
                        tree: _savedCommit.tree,
                        lines: _savedCommit.lines,
                        complexity_cyclomatic: _savedCommit.complexity_cyclomatic,
                        methods: _savedCommit.methods
                    }

                    await commit_thx.commit();

                    writeFile(url, dateReturn() + `Commit carregado do banco de dados: ${commit_number}\n`);

                    return res.status(200).json({ ...req.body, commit: loadedCommit, n: commit_number });
                }
            }

            writeFile(url, dateReturn() + `Iniciando processo de contagem da complexidade ciclomatica e quantidade de metódos do commit: ${commit_number}`);
            await commit_thx.commit();
        } catch (e) {
            console.log(e, commit_number);
            await commit_thx.rollback();
            return res.status(400).json({ commit, ...req.body, n: commit_number - 1 });
        }

        let author_thx = await connection.transaction();
        var author_rank = {
            repos_url: url,
            name: commit.author,
            avatar: commit.author_avatar,
            additions: 0,
            deletions: 0,
            lines: 0,
            complexity_cyclomatic: 0,
            methods: 0
        };

        try {
            const have_author = await author_thx('rank')
                .select("*")
                .where("repos_url", url).andWhere("name", author_rank.name);
            if (have_author.length === 0) {
                await author_thx('rank').insert(author_rank);
            } else {
                author_rank.additions = have_author[0].additions;
                author_rank.deletions = have_author[0].deletions;
                author_rank.lines = have_author[0].lines;
                author_rank.methods = have_author[0].methods;
                author_rank.complexity_cyclomatic = have_author[0].complexity_cyclomatic;
            }

            await author_thx.commit();
        } catch (e) {
            console.log(e);
            await author_thx.rollback();
        }

        let confirm_thx = await connection.transaction();

        commit = {
            commit_number,
            lines: 0,
            complexity_cyclomatic: 0,
            methods: 0,
            ...commit
        }

        try {
            for (let x in commit.files) {
                var thx = await connection.transaction();
                try {
                    let file = commit.files[x] as {
                        additions: number;
                        changes: number;
                        deletions: number;
                        filename: string;
                        raw_url: string | null;
                        status: string,
                        previous_filename: string
                    };

                    if (
                        !mime.lookup(file.filename).toString().includes('image') &&
                        file !== null && file !== undefined &&
                        file.raw_url !== null &&
                        file.raw_url !== undefined &&
                        !file.filename.includes(".min.") &&
                        !file.filename.includes(".log") &&
                        !file.filename.includes("bootstrap") &&
                        !isNaN(Number(file.additions)) &&
                        !isNaN(Number(file.deletions)) &&
                        !isNaN(Number(file.changes))
                    ) {
                        writeFile(url, `\n` + dateReturn() + `Lendo arquivo: ${file.filename}`);
                        switch (file.status) {
                            case ("added"):
                                const values = await calculateComplexyAndMethods(file.raw_url, token as string, file.filename);
                                writeFile(url, dateReturn() + `[added] Complexidade do arquivo: ${values[0]}`);
                                await thx('files').insert({
                                    repos_url: url,
                                    filename: file.filename,
                                    lines: file.additions - file.deletions,
                                    complexity_cyclomatic: values[0],
                                    methods: values[1]
                                }).catch((e) => {
                                    writeFile(url, dateReturn() + `Erro ao salvar arquivo: ${file.filename} | ${e}`);
                                });;

                                await thx('files_historic').insert({
                                    commit_number,
                                    repos_url: url,
                                    lines: file.additions - file.deletions,
                                    complexity_cyclomatic: values[0],
                                    methods: values[1],
                                    ...file
                                }).catch((e) => {
                                    writeFile(url, dateReturn() + `Erro ao salvar arquivo no histórico: ${file.filename} | ${e}`);
                                });

                                writeFile(url, dateReturn() + `Complexidade de ${author_rank.name}: + ${values[0]}`);
                                author_rank.lines += file.additions - file.deletions;
                                author_rank.complexity_cyclomatic += Number(values[0]);
                                author_rank.methods += Number(values[1]);
                                author_rank.additions += file.additions;
                                author_rank.deletions += file.deletions;
                                writeFile(url, dateReturn() + `Complexidade de ${author_rank.name} = ${author_rank.complexity_cyclomatic}`);

                                commit.files[x].lines = file.additions - file.deletions;
                                commit.files[x].complexity_cyclomatic = Number(values[0]);
                                commit.files[x].methods = Number(values[1]);

                                commit.lines += file.additions - file.deletions;
                                commit.complexity_cyclomatic += Number(values[0]);
                                commit.methods += Number(values[1]);

                                writeFile(url, dateReturn() + `Arquivo salvo: ${file.filename}\n`);
                                break;
                            case ("removed"):
                                const deletedInfo = await thx('files').select("complexity_cyclomatic",
                                    "lines", "methods").where("filename", file.filename).andWhere("repos_url", url).first();

                                await thx('files').where("filename", file.filename)
                                    .andWhere("repos_url", url).delete().catch((e) => {
                                        writeFile(url, dateReturn() + `Erro ao remover arquivo: ${file.filename} | ${e}`);
                                    });;

                                await thx('files_historic').insert({
                                    commit_number,
                                    repos_url: url,
                                    lines: deletedInfo.lines,
                                    complexity_cyclomatic: deletedInfo.complexity_cyclomatic,
                                    methods: deletedInfo.methods,
                                    ...file
                                }).catch((e) => {
                                    writeFile(url, dateReturn() + `Erro ao remover arquivo do histórico: ${file.filename} | ${e}`);
                                });;

                                writeFile(url, dateReturn() + `[removed] Complexidade do arquivo: ${deletedInfo.complexity_cyclomatic}`);
                                writeFile(url, dateReturn() + `Complexidade de ${author_rank.name}: - ${deletedInfo.complexity_cyclomatic}`);
                                author_rank.lines -= deletedInfo.lines;
                                author_rank.complexity_cyclomatic -= deletedInfo.complexity_cyclomatic;
                                author_rank.methods -= deletedInfo.methods;
                                author_rank.deletions += deletedInfo.lines;
                                writeFile(url, dateReturn() + `Complexidade de ${author_rank.name} = ${author_rank.complexity_cyclomatic}`);

                                commit.files[x].lines = file.deletions;
                                commit.files[x].complexity_cyclomatic = deletedInfo.complexity_cyclomatic;
                                commit.files[x].methods = deletedInfo.methods;

                                commit.lines -= deletedInfo.lines;
                                commit.complexity_cyclomatic -= deletedInfo.complexity_cyclomatic;
                                commit.methods -= deletedInfo.methods;

                                writeFile(url, dateReturn() + `Arquivo removido: ${file.filename}\n`);
                                break;
                            case ("modified"):
                                const newValues = await calculateComplexyAndMethods(file.raw_url, token as string, file.filename);
                                const oldInfo = await thx('files').select("complexity_cyclomatic", "lines", "methods").where("filename", file.filename).andWhere("repos_url", url).first();

                                let newInfo = {
                                    complexity_cyclomatic: Number(newValues[0]),
                                    methods: Number(newValues[1]),
                                    lines: Number(oldInfo.lines) + file.additions - file.deletions,
                                    laststatus: "modified"
                                };

                                writeFile(url, dateReturn() + `[modified] Complexidade do arquivo: ${newInfo.complexity_cyclomatic} - ${oldInfo.complexity_cyclomatic}`);

                                await thx('files').where("filename", file.filename)
                                    .andWhere("repos_url", url).first().update({ ...newInfo });

                                await thx('files_historic').insert({
                                    commit_number,
                                    repos_url: url,
                                    lines: newInfo.lines,
                                    complexity_cyclomatic: newInfo.complexity_cyclomatic,
                                    methods: newInfo.methods,
                                    ...file
                                }).catch((e) => {
                                    writeFile(url, dateReturn() + `Erro ao salvar arquivo modificado no histórico: ${file.filename} | ${e}`);
                                });;

                                writeFile(url, dateReturn() + `Complexidade de ${author_rank.name}: + ${newInfo.complexity_cyclomatic} - ${oldInfo.complexity_cyclomatic}`);
                                author_rank.lines += file.additions - file.deletions;
                                author_rank.complexity_cyclomatic += newInfo.complexity_cyclomatic - oldInfo.complexity_cyclomatic;
                                author_rank.methods += newInfo.methods - oldInfo.methods;
                                author_rank.additions += file.additions;
                                author_rank.deletions += file.deletions;
                                writeFile(url, dateReturn() + `Complexidade de ${author_rank.name} = ${author_rank.complexity_cyclomatic}`);

                                commit.files[x].lines = file.additions - file.deletions;
                                commit.files[x].complexity_cyclomatic = newInfo.complexity_cyclomatic;
                                commit.files[x].methods = newInfo.methods;

                                commit.lines += file.additions - file.deletions;
                                commit.complexity_cyclomatic += newInfo.complexity_cyclomatic - oldInfo.complexity_cyclomatic;
                                commit.methods += newInfo.methods - oldInfo.methods;

                                writeFile(url, dateReturn() + `Arquivo modificado: ${file.filename}\n`);
                                break;
                            case ("renamed"):
                                const newValuesOfRenamedFile = await calculateComplexyAndMethods(file.raw_url, token as string, file.filename);
                                const oldInfoOfRenamedFile = await thx('files').select("complexity_cyclomatic", "lines", "methods").where("filename", file.previous_filename).andWhere("repos_url", url).first().catch((e) => {
                                    console.log(e);
                                });;

                                let newInfoOfRenamedFile = {
                                    filename: file.filename,
                                    complexity_cyclomatic: Number(newValuesOfRenamedFile[0]),
                                    methods: Number(newValuesOfRenamedFile[1]),
                                    lines: Number(oldInfoOfRenamedFile.lines) + file.additions - file.deletions,
                                    laststatus: "renamed"
                                };

                                writeFile(url, dateReturn() + `[renamed] Complexidade do arquivo: ${newInfoOfRenamedFile.complexity_cyclomatic} - ${oldInfoOfRenamedFile.complexity_cyclomatic}`);

                                await thx('files').where("filename", file.previous_filename)
                                    .andWhere("repos_url", url).first().update({ ...newInfoOfRenamedFile }).catch((e) => {
                                        writeFile(url, dateReturn() + `Erro ao encontrar arquivo renomeado: ${file.filename} | ${e}`);
                                    });;

                                await thx('files_historic').insert({
                                    commit_number,
                                    repos_url: url,
                                    lines: newInfoOfRenamedFile.lines,
                                    complexity_cyclomatic: newInfoOfRenamedFile.complexity_cyclomatic,
                                    methods: newInfoOfRenamedFile.methods,
                                    ...file,
                                }).catch((e) => {
                                    writeFile(url, dateReturn() + `Erro ao salvar arquivo renomeado: ${file.filename} | ${e}`);
                                });;

                                writeFile(url, dateReturn() + `Complexidade de ${author_rank.name}: + ${newInfoOfRenamedFile.complexity_cyclomatic} - ${oldInfoOfRenamedFile.complexity_cyclomatic}`);
                                author_rank.lines += file.additions - file.deletions;
                                author_rank.complexity_cyclomatic += newInfoOfRenamedFile.complexity_cyclomatic - oldInfoOfRenamedFile.complexity_cyclomatic;
                                author_rank.methods += newInfoOfRenamedFile.methods - oldInfoOfRenamedFile.methods;
                                author_rank.additions += file.additions;
                                author_rank.deletions += file.deletions;
                                writeFile(url, dateReturn() + `Complexidade de ${author_rank.name} = ${author_rank.complexity_cyclomatic}`);

                                commit.files[x].lines = file.additions - file.deletions;
                                commit.files[x].complexity_cyclomatic = newInfoOfRenamedFile.complexity_cyclomatic;
                                commit.files[x].methods = newInfoOfRenamedFile.methods;

                                commit.lines += file.additions - file.deletions;
                                commit.complexity_cyclomatic += newInfoOfRenamedFile.complexity_cyclomatic - oldInfoOfRenamedFile.complexity_cyclomatic;
                                commit.methods += newInfoOfRenamedFile.methods - oldInfoOfRenamedFile.methods;

                                writeFile(url, dateReturn() + `Arquivo renomeado: ${file.filename}\n`);
                                break;
                            default:
                                writeFile(url, dateReturn() + `Status não reconhecido: ${file.status}`);
                                break;
                        }
                    } else {
                        writeFile(url, dateReturn() + `Arquivo ignorado: [${commit.files[x].filename}]\n`);
                    }

                    await thx('rank').where("repos_url", url).andWhere("name", author_rank.name)
                        .first().update({ ...author_rank }).catch((e) => {
                            console.log(e);
                        });;

                    await thx.commit();

                    writeFile(url, dateReturn() + `Ranking dos usuários atualizado!`);
                } catch (e) {
                    let file = commit.files[x] as {
                        additions: number;
                        changes: number;
                        deletions: number;
                        filename: string;
                        raw_url: string | null;
                        status: string,
                        previous_filename: string
                    };

                    writeFile(url, dateReturn() + `Erro desconhecido: ${file} | ${e}`);
                    await thx.rollback();
                    break;
                }
            };

            await confirm_thx('commit_historic').insert({
                repos_url: url,
                commit_number: commit_number,
                complexity_cyclomatic: commit.complexity_cyclomatic,
                lines: commit.lines,
                methods: commit.methods,
                author: commit.author,
                author_avatar: commit.author_avatar,
                date: commit.date,
                message: commit.message,
                additions: commit.status.additions,
                deletions: commit.status.deletions,
                total: commit.status.total,
                tree: commit.tree
            })

            confirm_thx.commit();
        } catch (e) {
            writeFile(url, dateReturn() + `Erro desconhecido: ${e}`);
            confirm_thx.rollback();
        }

        writeFile(url, dateReturn() + `Todos os processos foram concluidos.\n`);

        return res.status(200).json({ ...req.body, commit, n: commit_number });
    }
    async getReposFiles(req: Request, res: Response) {
        const { repos_url } = req.query;
        const data = await connection('files').select("complexity_cyclomatic", "lines", "methods")
            .where("repos_url", repos_url as string);

        return res.status(200).json(data);
    }
    async getReposRank(req: Request, res: Response) {
        const { repos_url } = req.query;
        const data = await connection('rank').select("name", "avatar", "additions", "deletions", "complexity_cyclomatic", "lines", "methods")
            .where("repos_url", repos_url as string);

        return res.status(200).json(data);
    }
    async calculateComplexyOfFile(req: Request, res: Response) {
        let { text, type, filename } = req.body;
        const values = await calculateComplexyAndMethodsWithinToken(text, type, filename);
        res.json(values);
    }
    async verify(req: Request, res: Response) {
        var { text, filename } = req.body;
        let values = await linterVerify(text, filename);
        res.status(200).json(values);
    }
}

export default GitsControlles;