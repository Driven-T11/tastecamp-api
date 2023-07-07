import { Router } from "express"
import { createRecipe, deleteRecipe, deleteRecipesByIngredients, editRecipe, editRecipesByIngridients, getRecipe, getRecipeById } from "../controllers/receitas.controller.js"

const recipeRouter = Router()

recipeRouter.get("/receitas", getRecipe)
recipeRouter.get("/receitas/:id", getRecipeById)
recipeRouter.post("/receitas", createRecipe)
recipeRouter.delete("/receitas/:id", deleteRecipe)
recipeRouter.delete("/receitas/muitas/:filtroIngredientes", deleteRecipesByIngredients)
recipeRouter.put("/receitas/:id", editRecipe)
recipeRouter.put("/receitas/muitas/:filtroIngredientes", editRecipesByIngridients)

export default recipeRouter