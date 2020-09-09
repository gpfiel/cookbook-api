'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StepSchema extends Schema {
  up () {
    this.table('steps', (table) => {
      table.integer('ingredient').unsigned().references('id').inTable('ingredients').onUpdate('CASCADE')
    })
  }

  down () {
    this.table('steps', (table) => {
      table.dropForeign('ingredient')
    })
  }
}

module.exports = StepSchema
