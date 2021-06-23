import { celebrate, Joi } from 'celebrate';

class Git {
    index(){
        return celebrate({
            query: Joi.object().keys({
                state: Joi.string().required(), 
                code: Joi.string().required(), 
            }),
            body: Joi.object().keys({
                USER: Joi.object() 
            })
        },{
            abortEarly: false
        });
    }
    verify(){
        return celebrate({
            body: Joi.object().keys({
                text: Joi.string().required(),
                filename: Joi.string().required(),
            })
        },{
            abortEarly: false
        });
    }
}

export default Git;