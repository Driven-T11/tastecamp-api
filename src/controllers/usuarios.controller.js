import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { db } from "../database/database.connection.js"

export async function signup(req, res) {
    const { nome, email, senha } = req.body

    const hash = bcrypt.hashSync(senha, 10)

    try {
        await db.collection("usuarios").insertOne({ nome, email, senha: hash })
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signin(req, res) {
    const { email, senha } = req.body

    try {
        const usuario = await db.collection("usuarios").findOne({ email })
        if (!usuario) return res.status(404).send("Usuário não cadastrado")

        const senhaEstaCorreta = bcrypt.compareSync(senha, usuario.senha)
        if (!senhaEstaCorreta) return res.status(401).send("Senha incorreta")

        await db.collection("sessao").deleteMany({ idUsuario: usuario._id })
        const token = uuid()
        await db.collection("sessao").insertOne({ token, idUsuario: usuario._id })

        res.send(token)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUser(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.sendStatus(401)

    try {
        const sessao = await db.collection("sessao").findOne({ token })
        if (!sessao) return res.sendStatus(401)

        // opcional - se quiser saber os dados do usuario
        const usuario = await db.collection("usuarios").findOne({ _id: sessao.idUsuario })

        delete usuario.senha
        res.send(usuario)
    } catch (err) {
        res.status(500).send(err.message)
    }
}