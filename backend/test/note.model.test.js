import { expect } from './setup.js'
import { Note } from '../src/models/note.model.js'
import { User } from '../src/models/user.model.js'

describe('Note Model  [note.model.test.js]', () => {

    let userId

    before(async () => {
        await User.deleteMany({})
        const user = await User.create({
            name: 'John',
            email: 'john@gmail.com',
            password: '123456'
        })
        userId = user._id
    })

    beforeEach(async () => {
        await Note.deleteMany({})
    })

    

    it('should create note with valid fields', async () => {
        const note = await Note.create({
            title: 'Test Note',
            content: '<p>Hello</p>',
            user: userId
        })

        expect(note.title).to.equal('Test Note')
        expect(note.content).to.equal('<p>Hello</p>')
        expect(note._id).to.exist
    })

    it('should set isDeleted to false by default', async () => {
        const note = await Note.create({
            title: 'Test Note',
            content: '<p>Hello</p>',
            user: userId
        })

        expect(note.isDeleted).to.equal(false)
    })

    it('should set isPinned to false by default', async () => {
        const note = await Note.create({
            title: 'Test Note',
            content: '<p>Hello</p>',
            user: userId
        })

        expect(note.isPinned).to.equal(false)
    })

    it('should set deletedAt to null by default', async () => {
        const note = await Note.create({
            title: 'Test Note',
            content: '<p>Hello</p>',
            user: userId
        })

        expect(note.deletedAt).to.be.null
    })

    it('should add timestamps automatically', async () => {
        const note = await Note.create({
            title: 'Test Note',
            content: '<p>Hello</p>',
            user: userId
        })

        expect(note.createdAt).to.exist
        expect(note.updatedAt).to.exist
    })



    it('should fail if title is missing', async () => {
        try {
            await Note.create({
                content: '<p>Hello</p>',
                user: userId
            })
            throw new Error('Should have failed')
        } catch (error) {
            expect(error.errors.title).to.exist
        }
    })

    it('should fail if content is missing', async () => {
        try {
            await Note.create({
                title: 'Test Note',
                user: userId
            })
            throw new Error('Should have failed')
        } catch (error) {
            expect(error.errors.content).to.exist
        }
    })

    it('should fail if user is missing', async () => {
        try {
            await Note.create({
                title: 'Test Note',
                content: '<p>Hello</p>'
            })
            throw new Error('Should have failed')
        } catch (error) {
            expect(error.errors.user).to.exist
        }
    })

    

    it('should update isDeleted and deletedAt when moved to trash', async () => {
        const note = await Note.create({
            title: 'Test Note',
            content: '<p>Hello</p>',
            user: userId
        })

        note.isDeleted = true
        note.deletedAt = new Date()
        await note.save()

        expect(note.isDeleted).to.equal(true)
        expect(note.deletedAt).to.exist
    })

    it('should restore note correctly', async () => {
        const note = await Note.create({
            title: 'Test Note',
            content: '<p>Hello</p>',
            user: userId,
            isDeleted: true,
            deletedAt: new Date()
        })

        note.isDeleted = false
        note.deletedAt = null
        await note.save()

        expect(note.isDeleted).to.equal(false)
        expect(note.deletedAt).to.be.null
    })

    

    it('should pin note correctly', async () => {
        const note = await Note.create({
            title: 'Test Note',
            content: '<p>Hello</p>',
            user: userId
        })

        note.isPinned = true
        await note.save()

        expect(note.isPinned).to.equal(true)
    })

    it('should unpin note correctly', async () => {
        const note = await Note.create({
            title: 'Test Note',
            content: '<p>Hello</p>',
            user: userId,
            isPinned: true
        })

        note.isPinned = false
        await note.save()

        expect(note.isPinned).to.equal(false)
    })

})