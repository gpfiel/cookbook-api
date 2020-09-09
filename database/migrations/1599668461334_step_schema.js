'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StepSchema extends Schema {
  up () {
    this.create('steps', (table) => {
      table.increments()
      table.integer('position').notNullable()
      table.string('instructions').defaultTo(null)
      table.string('amount_required').defaultTo(null)
      table.integer('recipe').unsigned().references('id').inTable('recipes').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('steps')
  }
}

module.exports = StepSchema
