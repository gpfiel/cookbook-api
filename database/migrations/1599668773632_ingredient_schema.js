'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IngredientSchema extends Schema {
  up () {
    this.create('ingredients', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('description').defaultTo(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('ingredients')
  }
}

module.exports = IngredientSchema
