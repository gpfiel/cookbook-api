'use strict'

const Ingredient = use('App/Models/Ingredient')
const { validateAll } = use('Validator')

// const Database = use('Database')

class IngredientController {
  /**
   * Display a single inrgedient.
   * GET inrgedients/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      const inrgedient = await Ingredient.query().where('id', params.id).first()
      if (!inrgedient)
        return response.status(404).send({ error: `Not Found` })
      
      return { inrgedient:  inrgedient }
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  /**
   * Show a list of all inrgedients.
   * GET inrgedients
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const data = request.get()
      const inrgedients = Ingredient.query()

      data.name && inrgedients.where('name', 'LIKE', '%'+data.name+'%')

      return { inrgedients: await inrgedients.fetch() }
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
      const inrgedient = await Ingredient.create({ ...data })
      return { inrgedient:  inrgedient }
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  /**
   * Update inrgedient details.
   * PUT or PATCH inrgedients/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const inrgedient = await Ingredient.query().where('id', params.id).first()
      
      if (!inrgedient)
        return response.status(404).send({ error: `Not Found` })

      const validation = await validateAll(request.all(), {
        name: 'required'
      })

      if (validation.fails())
        return response.status(401).send({ message: validation.messages() })

      const { name, description } = request.only(['name', 'description'])
      inrgedient.name = name
      inrgedient.description = description

      await inrgedient.save()

      return { inrgedient: inrgedient }
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }

  /**
   * Delete a inrgedient with id.
   * DELETE inrgedients/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const inrgedient = await Ingredient.query().where('id', params.id).first()

      if (!inrgedient)
        return response.status(404).send({ error: `Not Found` })
      
      await inrgedient.delete()
      return response.status(200).send({})
    } catch (error) {
      return response.status(500).send({ error: `${error.message}` })
    }
  }
}

module.exports = IngredientController
