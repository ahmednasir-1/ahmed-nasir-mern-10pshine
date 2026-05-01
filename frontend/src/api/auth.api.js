import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/users'

export const registerAPI = async (name, email, password) =>{
    const res = await axios.post(`${BASE_URL}/register`, {
        name, email, password
    })
    return res.data
}

export const login = async (email, password) =>{
    const res = await axios.post(`${BASE_URL}/login`, {
        email, password
    })

    return res.data
}