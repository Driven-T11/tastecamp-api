import { Router } from "express"
import { createRecipe, deleteRecipe, deleteRecipesByIngredients, editRecipe, editRecipesByIngridients, getRecipe, getRecipeById } from "../controllers/receitas.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { schemaReceita } from "../schemas/receita.schemas.js"
import { validateAuth } from "../middlewares/validateAuth.js"

const recipeRouter = Router()

recipeRouter.use(validateAuth)

recipeRouter.get("/receitas", getRecipe)
recipeRouter.get("/receitas/:id", getRecipeById)
recipeRouter.post("/receitas", validateSchema(schemaReceita), createRecipe)
recipeRouter.delete("/receitas/:id", deleteRecipe)
recipeRouter.delete("/receitas/muitas/:filtroIngredientes", deleteRecipesByIngredients)
recipeRouter.put("/receitas/:id", validateSchema(schemaReceita), editRecipe)
recipeRouter.put("/receitas/muitas/:filtroIngredientes", editRecipesByIngridients)

export default recipeRouter