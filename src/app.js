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
let db

mongoClient.connect()
	.then(() => db = mongoClient.db())
	.catch((err) => console.log(err.message))

// Funções (endpoints)
app.get("/receitas", (req, res) => {
	const promise = db.collection("receitas").find().toArray()

	promise.then(data => res.send(data))
	promise.catch(err => res.status(500).send(err.message))
})

app.get("/receitas/:id", (req, res) => {
	const { id } = req.params

	db.collection("receitas").findOne({ _id: new ObjectId(id) })
		.then(receita => res.send(receita))
		.catch(err => res.status(500).send(err.message))
})

app.post("/receitas", (req, res) => {
	const { titulo, ingredientes, preparo } = req.body

	if (!titulo || !ingredientes || !preparo) {
		return res.status(422).send({ message: "Todos os campos são obrigatórios!!!" })
	}

	const novaReceita = { titulo, ingredientes, preparo }

	const promise = db.collection("receitas").insertOne(novaReceita)

	promise.then(() => res.sendStatus(201))
	promise.catch(err => res.status(500).send(err.message))
})


// Ligar a aplicação do servidor para ouvir requisições
const PORT = 4000
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`))