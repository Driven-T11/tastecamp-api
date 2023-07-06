import { schemaReceita } from "../app.js"
import { db } from "../app.js"
import { ObjectId } from "mongodb"

export async function createRecipe(req, res) {
    const { titulo, ingredientes, preparo } = req.body

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

}

export async function getRecipe(req, res) {
    try {
        const receitas = await db.collection("receitas").find().toArray()
        res.send(receitas)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getRecipeById(req, res) {
    const { id } = req.params

    try {
        const receita = await db.collection("receitas").findOne({ _id: new ObjectId(id) })
        res.send(receita)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRecipe(req, res) {
    const { id } = req.params

    try {
        const result = await db.collection("receitas").deleteOne({ _id: new ObjectId(id) })
        if (result.deletedCount === 0) return res.status(404).send("Essa receita não existe!")

        res.status(204).send("Receita deletada com sucesso!")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRecipesByIngredients(req, res) {
    const { filtroIngredientes } = req.params

    try {
        await db.collection("receitas").deleteMany({ ingredientes: filtroIngredientes })
        res.sendStatus(204)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function editRecipe(req, res) {
    const { id } = req.params
    const { titulo, preparo, ingredientes } = req.body

    try {
        const result = await db.collection('receitas').updateOne(
            { _id: new ObjectId(id) },
            { $set: { titulo, preparo, ingredientes } }
        )
        if (result.matchedCount === 0) return res.status(404).send("esse item não existe!")
        res.send("Receita atualizada!")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function editRecipesByIngridients(req, res) {
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
}