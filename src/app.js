import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"

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

	if (!titulo || !ingredientes || !preparo) return res.status(422).send("Preencha todos os campos!")

	try {
		const receita = await db.collection("receitas").findOne({ titulo: titulo })
		if (receita) return res.status(409).send("Essa receita já existe!")

		await db.collection("receitas").insertOne({ titulo, ingredientes, preparo })
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}
})


// Ligar a aplicação do servidor para ouvir requisições
const PORT = 4000
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`))