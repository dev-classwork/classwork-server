import { celebrate, Joi } from 'celebrate';

class User {
    repos = Joi.object().keys({
        id: Joi.number().required(),
        name: Joi.string().required(),
        description: [Joi.string().optional(), Joi.allow(null)],
        language: Joi.string().required(),
        private: Joi.boolean().required(),
        commits_url: Joi.string().required(),
        size: Joi.number().required(),
    });
    index(){
        return celebrate({
            body: Joi.object().keys({
                git_id: Joi.number().required(), 
                name: Joi.string().required(),
                real_name: Joi.string().required(),
                type: Joi.string().required(),
                avatar: Joi.string().required(),
                id_auth: Joi.string().required(),
                urls: Joi.array().items(Joi.string()),
                classes: [Joi.array().optional(), Joi.allow(null)],
                teams: [Joi.array().optional(), Joi.allow(null)],
            })
        },{
            abortEarly: false
        });
    }
    update(){
        return celebrate({
            body: Joi.object().keys({
                git_id: Joi.number().required(), 
                name: Joi.string().required(),
                real_name: Joi.string().required(),
                avatar: Joi.string().required(),
                urls: Joi.array().items(Joi.string()),
                classes: [Joi.array().optional(), Joi.allow(null)],
            }),

            query: Joi.object().keys({
                id: Joi.number().required(),
            })
        },{
            abortEarly: false
        });
    }
    delete(){
        return celebrate({
            query: Joi.object().keys({
                id: Joi.number().required(),
                id_auth: Joi.string().required(),
            })
        },{
            abortEarly: false
        });
    }
}

export default User;