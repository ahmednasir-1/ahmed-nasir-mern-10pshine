import sinon from 'sinon'
import jwt from 'jsonwebtoken'
import protect from '../src/middleware/auth.middleware.js'
import { expect } from './setup.js'
import { User } from '../src/models/user.model.js'

describe('Auth Middleware  [auth.middleware.test.js]', () => {

    let req, res, next

    beforeEach(() => {
        // mock req, res, next
        req = { headers: {} }
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        }
        next = sinon.stub()
    })

    afterEach(() => {
        sinon.restore()
    })



    it('should return 400 if no token provided', async () => {
        req.headers.authorization = undefined

        await protect(req, res, next)

        expect(res.status.calledWith(400)).to.be.true
        expect(next.called).to.be.false
    })

    it('should return 400 if token is empty', async () => {
        req.headers.authorization = ''

        await protect(req, res, next)

        expect(res.status.calledWith(400)).to.be.true
        expect(next.called).to.be.false
    })

  

    it('should return 401 if token is invalid', async () => {
        req.headers.authorization = 'invalidtoken123'

        await protect(req, res, next)

        expect(res.status.calledWith(401)).to.be.true
        expect(next.called).to.be.false
    })

    it('should return 401 if token is malformed', async () => {
        req.headers.authorization = 'abc.def'

        await protect(req, res, next)

        expect(res.status.calledWith(401)).to.be.true
        expect(next.called).to.be.false
    })

   

    it('should call next if token is valid', async () => {
        // create real user
        const user = await User.create({
            name: 'John',
            email: 'john@gmail.com',
            password: '123456'
        })

        // generate valid token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'testsecret'
        )

        req.headers.authorization = `${token}`

        await protect(req, res, next)

        expect(next.called).to.be.true
        expect(req.user).to.exist
    })

    it('should set req.user from token', async () => {
        const user = await User.create({
            name: 'John',
            email: 'john2@gmail.com',
            password: '123456'
        })

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'testsecret'
        )

        req.headers.authorization = `${token}`

        await protect(req, res, next)

        expect(req.user._id.toString()).to.equal(user._id.toString())
    })

    it('should not return password in req.user', async () => {
        const user = await User.create({
            name: 'John',
            email: 'john3@gmail.com',
            password: '123456'
        })

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'testsecret'
        )

        req.headers.authorization = `${token}`

        await protect(req, res, next)

        expect(req.user.password).to.be.undefined
    })

})