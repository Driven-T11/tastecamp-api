import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import Joi from "joi"
import { getUser, signin, signup } from "./controllers/usuarios.controller.js"
import { createRecipe, deleteRecipe, deleteRecipesByIngredients, editRecipe, editRecipesByIngridients, getRecipe, getRecipeById } from "./controllers/receitas.controller.js"

// Criação do app
const app = express()

// Configurações
app.use(cors())
app.use(express.json())
dotenv.config()

// Conexão com o Banco
const mongoClient = new MongoClient(process.env.DATABASE_URL)

try {
	await mongoClient.connect() // top level await
	console.log("MongoDB conectado!")
} catch (err) {
	(err) => console.log(err.message)
}

export const db = mongoClient.db()

export const schemaReceita = Joi.object({
	titulo: Joi.string().required(),
	ingredientes: Joi.string().required(),
	preparo: Joi.string().required().min(5).max(200)
})

// Funções (endpoints)
app.get("/receitas", getRecipe)

app.get("/receitas/:id", getRecipeById)

app.post("/receitas", createRecipe)

app.delete("/receitas/:id", deleteRecipe)

app.delete("/receitas/muitas/:filtroIngredientes", deleteRecipesByIngredients)

app.put("/receitas/:id", editRecipe)

app.put("/receitas/muitas/:filtroIngredientes", editRecipesByIngridients)

app.post("/sign-up", signup)

app.post("/sign-in", signin)

app.get("/usuario-logado", getUser)

// Ligar a aplicação do servidor para ouvir requisições
const PORT = 4000
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`))