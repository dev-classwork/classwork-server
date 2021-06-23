import { celebrate, Joi } from 'celebrate';

class Class {
    index(){
        return celebrate({
            body: Joi.object().keys({
                key: Joi.string().required().min(8),
                name: Joi.string().required().min(3).max(28), 
                description: [Joi.string().optional(), Joi.allow(null)],
                teacher_id: Joi.number().required(),
                teacher_id_auth: Joi.string().required(),
                haveImage: Joi.required(),
                color: Joi.string().required(),
            })
        },{
            abortEarly: false
        });
    }
    template(){
        return celebrate({
            body: Joi.object().keys({
                key: Joi.string().required().min(8),
                name: Joi.string().required().min(3).max(28), 
                description: [Joi.string().optional(), Joi.allow(null)],
                teacher_id: Joi.number().required(),
                teacher_id_auth: Joi.string().required(),
                color: Joi.string().required(),
                filename: Joi.string().required()
            })
        },{
            abortEarly: false
        });
    }
    update(){
        return celebrate({
            body: Joi.object().keys({
                key: Joi.string().required().min(8),
                name: Joi.string().required().min(3).max(28), 
                description: [Joi.string().optional(), Joi.allow(null)],
                color: Joi.string().required()
            })
        },{
            abortEarly: false
        });
    }
    updateAll(){
        return celebrate({
            body: Joi.object().keys({
                key: Joi.string().required().min(8),
                name: Joi.string().required().min(3).max(28), 
                description: [Joi.string().optional(), Joi.allow(null)],
                haveImage: Joi.required(),
                oldImage: Joi.required(), 
                color: Joi.string().required()
            })
        },{
            abortEarly: false
        });
    }
    updateTemplate(){
        return celebrate({
            body: Joi.object().keys({
                name: Joi.string().required().min(3).max(28), 
                description: [Joi.string().optional(), Joi.allow(null)],
                filename: Joi.string().required(),
                color: Joi.string().required()
            }),
            query: Joi.object().keys({
                key: Joi.string().required()
            })
        },{
            abortEarly: false
        });
    }
    delete(){
        return celebrate({
            query: Joi.object().keys({
                key: Joi.string().required(),
                teacher_id: Joi.number().required()
            })
        },{
            abortEarly: false
        });
    }
}

export default Class;