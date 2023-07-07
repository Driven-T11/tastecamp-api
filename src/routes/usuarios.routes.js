import { Router } from "express"
import { getUser, signin, signup } from "../controllers/usuarios.controller.js"

const userRouter = Router()

userRouter.post("/sign-up", signup)
userRouter.post("/sign-in", signin)
userRouter.get("/usuario-logado", getUser)

export default userRouter