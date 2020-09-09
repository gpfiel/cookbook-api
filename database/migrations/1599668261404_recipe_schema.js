'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RecipeSchema extends Schema {
  up () {
    this.create('recipes', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('description').defaultTo(null)
      table.integer('number_servings').defaultTo(null)
      table.string('cooking_time').defaultTo(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('recipes')
  }
}

module.exports = RecipeSchema
