import { celebrate, Joi } from 'celebrate';

class Class {
    index(){
        return celebrate({
            body: Joi.object().keys({
                key: Joi.string().required().min(8),
                name: Joi.string().required().min(3).max(28), 
                repos: Joi.string().required().min("https://github.com/".length)
            })
        },{
            abortEarly: false
        });
    }
    delete(){
        return celebrate({
            query: Joi.object().keys({
                key: Joi.string().required(),
                id: Joi.number().required()
            })
        },{
            abortEarly: false
        });
    }
    update(){
        return celebrate({
            body: Joi.object().keys({
                name: Joi.string().required().min(3).max(28), 
                repos: Joi.string().required().min("https://github.com/".length)
            }),
            query: Joi.object().keys({
                key: Joi.string().required(),
                id: Joi.number().required()
            })
        }, {
            abortEarly: false
        });
    }
}

export default Class;