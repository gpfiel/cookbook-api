'use strict'

const Ingredient = use('App/Models/Ingredient')
const { validateAll } = use('Validator')

// const Database = use('Database')

class IngredientController {
  /**
   * Display a single ingredient.
   * GET ingredients/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      const ingredient = await Ingredient.query().where('id', params.id).first()
      if (!ingredient)
        return response.status(404).send({ error: `Not Found` })
      
      return { ingredient:  ingredient }
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  /**
   * Show a list of all ingredients.
   * GET ingredients
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const data = request.get()
      const ingredients = Ingredient.query()

      data.name && ingredients.where('name', 'LIKE', '%'+data.name+'%')

      return { ingredients: await ingredients.fetch() }
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

      const data = request.only(['name', 'description'])
      const ingredient = await Ingredient.create({ ...data })
      return { ingredient:  ingredient }
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  /**
   * Update ingredient details.
   * PUT or PATCH ingredients/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const ingredient = await Ingredient.query().where('id', params.id).first()
      
      if (!ingredient)
        return response.status(404).send({ error: `Not Found` })

      const validation = await validateAll(request.all(), {
        name: 'required'
      })

      if (validation.fails())
        return response.status(401).send({ message: validation.messages() })

      const { name, description } = request.only(['name', 'description'])
      ingredient.name = name
      ingredient.description = description

      await ingredient.save()

      return { ingredient: ingredient }
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  /**
   * Delete a ingredient with id.
   * DELETE ingredients/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const ingredient = await Ingredient.query().where('id', params.id).first()

      if (!ingredient)
        return response.status(404).send({ error: `Not Found` })
      
      await ingredient.delete()
      return response.status(200).send({})
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }
}

module.exports = IngredientController
