import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

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

// localhost:4000/receitas
// axios.get("localhost:4000/receitas?ingredientes=Ovo&limit")
app.get("/receitas", (req, res) => {
	// const { ingredientes } = req.query
	const ingredientes = req.query.ingredientes

	if (ingredientes) {
		const receitasFiltradas = receitas.filter(
			receita => receita.ingredientes.includes(ingredientes)
		)
		res.send(receitasFiltradas)
		return
	}

	res.send(receitas)
})

app.get("/receitas/:id", (req, res) => {
	const { id } = req.params
	// const id = req.params.id
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

	const novaReceita = { id: receitas.length + 1, titulo, ingredientes, preparo }
	receitas.push(novaReceita)
	res.sendStatus(201)
})


const PORT = 4000
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`))