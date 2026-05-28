import axios from 'axios'
import { login, registerAPI } from '../api/auth.api'

vi.mock('axios')

describe('Auth API [auth.api.test.js]', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

        it('should call login api and return data', async () => {
            axios.post.mockResolvedValue({ data: { token: '123' } })
            const res = await login('a@a.com', '123456')
            expect(res.token).toBe('123')
        })


        it('should throw error if login fails', async () => {
            axios.post.mockRejectedValue(new Error('Invalid credentials'))
            await expect(login('wrong@email.com', 'wrongpass')).rejects.toThrow('Invalid credentials')
        })



        it('should call register api and return data', async () => {
            axios.post.mockResolvedValue({ data: { token: '123' } })
            const res = await registerAPI('ahmed', 'a@a.com', '123456')
            expect(res.token).toBe('123')
        })


        it('should throw error if register fails', async () => {
            axios.post.mockRejectedValue(new Error('User already exists'))
            await expect(registerAPI('ahmed', 'a@a.com', '123456')).rejects.toThrow('User already exists')
        })

    

})