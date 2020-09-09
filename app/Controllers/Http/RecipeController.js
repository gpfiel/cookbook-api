'use strict'

const Recipe = use('App/Models/Recipe')
const Step = use('App/Models/Step')
const { validateAll } = use('Validator')

// const Database = use('Database')

class RecipeController {
  /**
   * Display a single recipe.
   * GET recipes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      const recipe = await Recipe.query().with('steps').where('id', params.id).first()
      if (!recipe)
        return response.status(404).send({ error: `Not Found` })
      
      return { recipe:  recipe }
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  /**
   * Show a list of all recipes.
   * GET recipes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const data = request.get()
      const recipes = Recipe.query()
      
      recipes.with('steps')
      data.name && recipes.where('name', 'LIKE', '%'+data.name+'%')
      recipes.withCount('steps as total_steps')

      return { recipes: await recipes.fetch() }
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  async store ({ request, response }) {
    try {
      const validation = await validateAll(request.all(), {
        name: 'required'
      })

      if (validation.fails())
        return response.status(401).send({ message: validation.messages() })

      const data = request.only(['name', 'description', 'number_servings', 'cooking_time', 'steps'])
      const steps = data.steps
      delete data.steps
      const recipe = await Recipe.create({ ...data })
      steps && steps.length && steps.forEach(async step => {
        await Step.create({ ...step, recipe: recipe.id})
      });
      return await Recipe.query().with('steps').where('id', recipe.id).first()
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  /**
   * Update recipe details.
   * PUT or PATCH recipes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const recipe = await Recipe.query().where('id', params.id).first()
      
      if (!recipe)
        return response.status(404).send({ error: `Not Found` })

      const validation = await validateAll(request.all(), {
        name: 'required'
      })

      if (validation.fails())
        return response.status(401).send({ message: validation.messages() })

      const { name, description, number_servings, cooking_time } = request.only(['name', 'description', 'number_servings', 'cooking_time'])
      recipe.name = name
      recipe.description = description
      recipe.number_servings = number_servings
      recipe.cooking_time = cooking_time

      await recipe.save()

      return { recipe: recipe }
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  /**
   * Delete a recipe with id.
   * DELETE recipes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const recipe = await Recipe.query().where('id', params.id).first()

      if (!recipe)
        return response.status(404).send({ error: `Not Found` })
      
      await recipe.delete()
      return response.status(200).send({})
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }
}

module.exports = RecipeController
