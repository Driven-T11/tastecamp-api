import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import Joi from "joi"
import bcrypt from "bcrypt"

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

const db = mongoClient.db()

// Funções (endpoints)
app.get("/receitas", async (req, res) => {
	try {
		const receitas = await db.collection("receitas").find().toArray()
		res.send(receitas)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.get("/receitas/:id", async (req, res) => {
	const { id } = req.params

	try {
		const receita = await db.collection("receitas").findOne({ _id: new ObjectId(id) })
		res.send(receita)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.post("/receitas", async (req, res) => {
	const { titulo, ingredientes, preparo } = req.body

	const schemaReceita = Joi.object({
		titulo: Joi.string().required(),
		ingredientes: Joi.string().required(),
		preparo: Joi.string().required().min(5).max(200)
	})

	const validation = schemaReceita.validate(req.body, { abortEarly: false })

	if (validation.error) {
		const errors = validation.error.details.map(detail => detail.message)
		return res.status(422).send(errors)
	}

	try {
		const receita = await db.collection("receitas").findOne({ titulo: titulo })
		if (receita) return res.status(409).send("Essa receita já existe!")

		await db.collection("receitas").insertOne(req.body)
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.delete("/receitas/:id", async (req, res) => {
	const { id } = req.params

	try {
		const result = await db.collection("receitas").deleteOne({ _id: new ObjectId(id) })
		if (result.deletedCount === 0) return res.status(404).send("Essa receita não existe!")

		res.status(204).send("Receita deletada com sucesso!")
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.delete("/receitas/muitas/:filtroIngredientes", async (req, res) => {
	const { filtroIngredientes } = req.params

	try {
		await db.collection("receitas").deleteMany({ ingredientes: filtroIngredientes })
		res.sendStatus(204)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.put("/receitas/:id", async (req, res) => {
	const { id } = req.params
	const { titulo, preparo, ingredientes } = req.body

	try {
		// result tem:  matchedCount  (quantidade de itens que encotrou com esse id)
		// 				modifiedCount (quantidade de itens que de fato mudaram com a edição)
		const result = await db.collection('receitas').updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { titulo, preparo, ingredientes } }
		)
		if (result.matchedCount === 0) return res.status(404).send("esse item não existe!")
		res.send("Receita atualizada!")
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.put("/receitas/muitas/:filtroIngredientes", async (req, res) => {
	const { filtroIngredientes } = req.params
	const { titulo, ingredientes, preparo } = req.body

	try {
		await db.collection('receitas').updateMany(
			{ ingredientes: { $regex: filtroIngredientes, $options: 'i' } },
			{ $set: { titulo } }
		)
		res.sendStatus(200)
	} catch (err) {
		return res.status(500).send(err.message)
	}
})

app.post("/sign-up", async (req, res) => {
	const { nome, email, senha } = req.body

	const hash = bcrypt.hashSync(senha, 10)

	try {
		await db.collection("usuarios").insertOne({ nome, email, senha: hash })
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}

})

app.post("/sign-in", async (req, res) => {
	const { email, senha } = req.body

	try {
		const usuario = await db.collection("usuarios").findOne({ email })
		if (!usuario) return res.status(404).send("Usuário não cadastrado")

		const senhaEstaCorreta = bcrypt.compareSync(senha, usuario.senha)
		if (!senhaEstaCorreta) return res.status(401).send("Senha incorreta")

		res.sendStatus(200)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

// Ligar a aplicação do servidor para ouvir requisições
const PORT = 4000
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`))