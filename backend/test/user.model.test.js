import { expect } from './setup.js'
import { User } from '../src/models/user.model.js'  

describe('User Model  [user.model.test.js]', () => {

  // clean up before each test
  beforeEach(async () => {
    await User.deleteMany({})
  })



  it('should create user with valid fields', async () => {
    const user = await User.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456'
    })

    expect(user.name).to.equal('John')
    expect(user.email).to.equal('john@gmail.com')
    expect(user._id).to.exist
  })

  it('should set isVerified to false by default', async () => {
    const user = await User.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456'
    })

    expect(user.isVerified).to.equal(false)
  })

 

  it('should add timestamps automatically', async () => {
    const user = await User.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456'
    })

    expect(user.createdAt).to.exist
    expect(user.updatedAt).to.exist
  })



  it('should fail if name is missing', async () => {
    try {
      await User.create({
        email: 'john@gmail.com',
        password: '123456'
      })
      throw new Error('Should have failed')
    } catch (error) {
      expect(error.errors.name).to.exist
    }
  })

  it('should fail if email is missing', async () => {
    try {
      await User.create({
        name: 'John',
        password: '123456'
      })
      throw new Error('Should have failed')
    } catch (error) {
      expect(error.errors.email).to.exist
    }
  })

  it('should fail if password is missing', async () => {
    try {
      await User.create({
        name: 'John',
        email: 'john@gmail.com'
      })
      throw new Error('Should have failed')
    } catch (error) {
      expect(error.errors.password).to.exist
    }
  })

  it('should fail if email is duplicate', async () => {
    await User.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456'
    })

    try {
      await User.create({
        name: 'Jane',
        email: 'john@gmail.com', 
        password: '123456'
      })
      throw new Error('Should have failed')
    } catch (error) {
      expect(error.code).to.equal(11000)  // MongoDB duplicate key error
    }
  })

  it('should store email in lowercase', async () => {
    const user = await User.create({
      name: 'John',
      email: 'JOHN@GMAIL.COM',  
      password: '123456'
    })

    expect(user.email).to.equal('john@gmail.com')  
  })



  it('should hash password before saving', async () => {
    const user = await User.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456'
    })

    expect(user.password).to.not.equal('123456')  
    expect(user.password).to.have.lengthOf.above(20)  // hash is long
  })

  it('should not rehash password if not modified', async () => {
    const user = await User.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456'
    })

    const originalHash = user.password

    // update name only
    user.name = 'Jane'
    await user.save()

    expect(user.password).to.equal(originalHash) 
  })

  

  it('should return true for correct password', async () => {
    const user = await User.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456'
    })

    const isMatch = await user.comparePassword('123456')
    expect(isMatch).to.equal(true)
  })

  it('should return false for wrong password', async () => {
    const user = await User.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456'
    })

    const isMatch = await user.comparePassword('wrongpassword')
    expect(isMatch).to.equal(false)
  })

  it('should return false for empty password', async () => {
    const user = await User.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456'
    })

    const isMatch = await user.comparePassword('')
    expect(isMatch).to.equal(false)
  })

})