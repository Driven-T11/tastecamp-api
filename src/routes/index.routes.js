import { Router } from "express"
import recipeRouter from "./receitas.routes.js"
import userRouter from "./usuarios.routes.js"

const router = Router()

router.use(userRouter)
router.use(recipeRouter)

export default router