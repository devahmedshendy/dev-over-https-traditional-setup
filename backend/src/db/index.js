/**
 * Module dependencies.
 */
import lowdb from "lowdb";
import Memory from 'lowdb/adapters/Memory'

/**
 * a small local JSON database powered by Lodash
 * 
 * Please refer to its repo from [here]{@link https://github.com/typicode/lowdb#guide}
 */
const db = lowdb(new Memory())

/**
 * This initialize the database with defaults values
 * for user and tasks resources
 */
db.defaults({
  tasks: []
}).write()

export default db