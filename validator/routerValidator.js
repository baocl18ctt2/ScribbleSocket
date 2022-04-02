const Joi = require('@hapi/joi')
const schema = {
    IdSchema: Joi.object().keys({
        UserId: Joi.string().regex(/^[0-9a-zA-Z]{24}$/).required()
    }),
    UserBodySchema: Joi.object().keys({
        avatar: Joi.string(),
        displayName: Joi.string().min(3).required(),
    })
}
const validateParams = (condition, name) => {
    return (req, res, next) => {
        // Lấy ra UserId: req.params[name]
        try {
            const validator = condition.validate({ UserId: req.params[name] })
            if (validator.error) {
                throw new Error(validator.error)
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

const validateBody = (condition) => {
    return (req, res, next) => {
        try {
            // validate dữ liệu
            const validator = condition.validate(req.body)
            if (validator.error) {
                req.flash('error', `${validator.error}`)
                res.redirect('/files/upload')
                return false;
            }
            next()

        } catch (error) {
            next(error)
        }
    }

}

module.exports = { validateParams, validateBody, schema }