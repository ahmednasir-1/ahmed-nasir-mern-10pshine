import mongoose from 'mongoose'
import * as chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/app.js'

chai.use(chaiHttp)

export const expect = chai.expect
export { app as server }

before(async function () {
  this.timeout(20000)
  await mongoose.connect('mongodb://localhost:27017/notesapp_test')
})

after(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()

})