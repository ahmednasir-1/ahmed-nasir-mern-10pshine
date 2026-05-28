import axios from 'axios';
import { Logger } from 'react-logger-lib';

const BASE_URL = 'http://localhost:5000/api/v1/users'

export const registerAPI = async (name, email, password) =>{
    Logger.of('Auth API').info("Signup Request Started")
    const res = await axios.post(`${BASE_URL}/register`, {
        name, email, password
    })
    return res.data
}

export const login = async (email, password) =>{
    Logger.of('Auth API').info("Login Request Started")
    const res = await axios.post(`${BASE_URL}/login`, {
        email, password
    })

    return res.data
}