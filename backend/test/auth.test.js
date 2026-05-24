import { use } from 'chai'
import chaiHttp from 'chai-http'
import { expect, server } from './setup.js'
import { User } from '../src/models/user.model.js'  

const chai = use(chaiHttp)



describe('Auth - Register  [auth.test.js]', function () {
  this.timeout(10000)
  beforeEach(async () => {
    await User.deleteMany({ email: 'john@gmail.com' })
  })

  it('should register a new user successfully', async () => {
    const res = await chai.request.execute(server) 
      .post('/api/v1/users/register')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456'
      })

    expect(res).to.have.status(201)
    expect(res.body).to.have.property('message')
  })

  it('should fail if name is missing', async () => {
    const res = await chai.request.execute(server)
      .post('/api/v1/users/register')
      .send({
        email: 'john@gmail.com',
        password: '123456'
      })

    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('All fields are required')
  })

  it('should fail if email is missing', async () => {
    const res = await chai.request.execute(server)
      .post('/api/v1/users/register')
      .send({
        name: 'John Doe',
        password: '123456'
      })

    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('All fields are required')
  })

  it('should fail if password is missing', async () => {
    const res = await chai.request.execute(server)
      .post('/api/v1/users/register')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com'
      })

    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('All fields are required')
  })

  it('should fail if user already exists', async () => {
    // register first time
    await chai.request.execute(server)
      .post('/api/v1/users/register')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456'
      })

    // register again with same email
    const res = await chai.request.execute(server)
      .post('/api/v1/users/register')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456'
      })

    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('User already exists')
  })

})



describe('Auth - Login', function () {

  this.timeout(10000)
  before(async () => {
    await User.deleteMany({ email: 'john@gmail.com' })

    // create user for login tests
    await chai.request.execute(server)
      .post('/api/v1/users/register')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456',
        isVerified: true
      })

    
    await User.updateOne({ email: 'john@gmail.com' }, { isVerified: true })
  })

  it('should login successfully', async () => {
    const res = await chai.request.execute(server)
      .post('/api/v1/users/login')
      .send({
        email: 'john@gmail.com',
        password: '123456'
      })

    expect(res).to.have.status(200)
    expect(res.body).to.have.property('token')
  })

  it('should fail with wrong password', async () => {
    const res = await chai.request.execute(server)
      .post('/api/v1/users/login')
      .send({
        email: 'john@gmail.com',
        password: 'wrongpassword'
      })

    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('Invalid Credentials')
  })

  it('should fail with wrong email', async () => {
    const res = await chai.request.execute(server)
      .post('/api/v1/users/login')
      .send({
        email: 'wrong@gmail.com',
        password: '123456'
      })

    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('User doesnot exist')
  })

  it('should fail if fields are empty', async () => {
    const res = await chai.request.execute(server)
      .post('/api/v1/users/login')
      .send({})

    expect(res).to.have.status(400)
    expect(res.body.message).to.equal('All fields are required')
  })

})