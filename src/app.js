import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"

// Criação do app
const app = express()

// Configurações
app.use(cors())
app.use(express.json())

// Conexão com o Banco
const mongoClient = new MongoClient("mongodb://localhost:27017/tastecamp")
let db

mongoClient.connect()
	.then(() => db = mongoClient.db())
	.catch((err) => console.log(err.message))

// Variáveis Globais
const receitas = [
	{
		id: 1,
		titulo: "Pão com Ovo",
		ingredientes: "Ovo e pão",
		preparo: "Frite o ovo e coloque no pão"
	},
	{
		id: 2,
		titulo: "Mingau de Whey",
		ingredientes: "Leite, Aveia e Whey",
		preparo: "Mistura tudo na panela fervendo",
	},
	{
		id: 3,
		titulo: "Omelete",
		ingredientes: "Ovo",
		preparo: "Bata os ovos e frite na frigideira"
	}
]

// Funções (endpoints)
app.get("/receitas", (req, res) => {
	const promise = db.collection("receitas").find().toArray()

	promise.then(data => res.send(data))
	promise.catch(err => res.status(500).send(err.message))
})

app.get("/receitas/:id", (req, res) => {
	const { id } = req.params
	const { auth } = req.headers

	if (!auth) {
		return res.status(401).send("Faça login!")
	}

	const receita = receitas.find((rec) => rec.id === Number(id))
	res.send(receita)
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