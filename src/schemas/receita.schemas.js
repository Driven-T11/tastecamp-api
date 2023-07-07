import Joi from "joi"

export const schemaReceita = Joi.object({
	titulo: Joi.string().required(),
	ingredientes: Joi.string().required(),
	preparo: Joi.string().required().min(5).max(200)
})