import { use } from 'chai'
import chaiHttp from 'chai-http'
import { expect, server } from './setup.js'
import { User } from '../src/models/user.model.js'
import { Note } from '../src/models/note.model.js'

const chai = use(chaiHttp)


let token;
let noteId;

describe("Notes  [note.test.js]", () => {

    before(async () => {
        // clean up
        // this.timeout(10000)
        await User.deleteMany({})
        await Note.deleteMany({})

        // register user
        await chai.request.execute(server)
            .post('/api/v1/users/register')
            .send({
                name: 'John Doe',
                email: 'john@gmail.com',
                password: '123456',
                isVerified: true
            })

        await User.updateOne({ email: 'john@gmail.com' }, { isVerified: true })

        // login to get token
        const res = await chai.request.execute(server)
            .post('/api/v1/users/login')
            .send({
                email: 'john@gmail.com',
                password: '123456'
            })

        console.log("Login response body:", res.body);
        token = res.body.token
        console.log("my token token", token)
    })


    describe('Notes - Create', () => {

        it('should create a note successfully', async () => {
            const res = await chai.request.execute(server)
                .post('/api/v1/notes/create')
                .set('Authorization', `${token}`)
                .send({
                    title: 'Test Note',
                    content: '<p>Test content</p>'
                })

            expect(res).to.have.status(201)
            expect(res.body.note.title).to.equal('Test Note')

            noteId = res.body.note._id
            console.log("my notes id ", noteId)
        })


        it('should fail without token', async () => {
            const res = await chai.request.execute(server)
                .post('/api/v1/notes/create')
                .send({
                    title: 'Test Note',
                    content: '<p>Test content</p>'
                })

            expect(res).to.have.status(400)
        })

        it('should fail if title is missing', async () => {
            const res = await chai.request.execute(server)
                .post('/api/v1/notes/create')
                .set('Authorization', `${token}`)
                .send({
                    content: '<p>Test content</p>'
                })

            expect(res).to.have.status(400)
            expect(res.body.message).to.equal('Title and content is required')
        })

        it('should fail if content is missing', async () => {
            const res = await chai.request.execute(server)
                .post('/api/v1/notes/create')
                .set('Authorization', `${token}`)
                .send({
                    title: 'Test Note'
                })

            expect(res).to.have.status(400)
            expect(res.body.message).to.equal('Title and content is required')
        })






    })


    describe('Notes - Get All', () => {

        it('should get all notes', async () => {
            const res = await chai.request.execute(server)
                .get('/api/v1/notes/')
                .set('Authorization', `${token}`)

            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
        })


        it('should fail without token', async () => {
            const res = await chai.request.execute(server)
                .get('/api/v1/notes/')

            expect(res).to.have.status(400)
        })

        it('should only return notes for logged in user', async () => {
            const res = await chai.request.execute(server)
                .get('/api/v1/notes/')
                .set('Authorization', `${token}`)

            expect(res.body).to.be.an('array')
            res.body.forEach((note) => {
                expect(note).to.have.property('title')
                expect(note).to.have.property('content')
            })
        })








    })




    describe('Notes - Update', () => {

        it('should update a note successfully', async () => {
            const res = await chai.request.execute(server)
                .patch(`/api/v1/notes/update/${noteId}`)
                .set('Authorization', `${token}`)
                .send({
                    title: 'Updated Title',
                    content: '<p>Updated content</p>'
                })

            expect(res).to.have.status(200)
            expect(res.body.note.title).to.equal('Updated Title')
        })


        it('should fail without token', async () => {
            const res = await chai.request.execute(server)
                .patch(`/api/v1/notes/update/${noteId}`)
                .send({
                    title: 'Updated Title',
                    content: '<p>Updated content</p>'
                })

            expect(res).to.have.status(400)
        })

    })



    describe('Notes - Trash', () => {

        it('should move note to trash', async () => {
            const res = await chai.request.execute(server)
                .delete(`/api/v1/notes/trash/${noteId}`)
                .set('Authorization', `${token}`)

            expect(res).to.have.status(200)
            expect(res.body.message).to.equal('moved to trash')
        })

        it('should get trash notes', async () => {
            const res = await chai.request.execute(server)
                .get('/api/v1/notes/trash')
                .set('Authorization', `${token}`)

            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
        })

        it('should restore note from trash', async () => {
            const res = await chai.request.execute(server)
                .put(`/api/v1/notes/restore/${noteId}`)
                .set('Authorization', `${token}`)

            expect(res).to.have.status(200)
            expect(res.body.message).to.equal('note restored successfullly')
        })

        it('should permanently delete note', async () => {
            // move to trash first
            await chai.request.execute(server)
                .delete(`/api/v1/notes/trash/${noteId}`)
                .set('Authorization', `${token}`)

            // then permanently delete
            const res = await chai.request.execute(server)
                .delete(`/api/v1/notes/permanent/${noteId}`)
                .set('Authorization', `${token}`)

            expect(res).to.have.status(200)
            expect(res.body.message).to.equal('note deleted successfullly')
        })

    })



})












