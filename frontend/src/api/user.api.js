import axios from "axios";

const BASE_URL = 'http://localhost:5000/api/v1/users'


export const getProfile = async () => {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${BASE_URL}/profile`, {
        headers: {
            Authorization: `${token}`
        }
    })
    return res.data
}

export const updateProfile = async (name) => {

    const token = localStorage.getItem('token')
    const res = await axios.put(`${BASE_URL}/profile`, 
        {
            name
        }, {
        headers: {
            Authorization: `${token}`
        }
    })
    return res.data
}

export const changePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('token')

    const res = await axios.put(`${BASE_URL}/change-password`,
        {
            currentPassword,
            newPassword
        }, {
        headers: {
            Authorization: `${token}`
        }
    })
    return res.data
}