import axios from "axios";

const BASE_URL = 'http://localhost:5000/api/v1/notes'

// creating a new note
export const createNote = async (title, content) => {

    const token = localStorage.getItem('token')

    const res = await axios.post(`${BASE_URL}/create`, {
        title, content
    },
        {
            headers: {
                Authorization: `${token}`
            }
        }
    )
    return res.data
}

// fetch all notes
export const getAllNotes = async () => {
    const token = localStorage.getItem('token')
    const notes = await axios.get(`${BASE_URL}/`, {
        headers: {
            Authorization: `${token}`
        }
    })

    return notes.data
}



// updating a note
export const updateNote = async (id, title, content) => {
    const token = localStorage.getItem('token')
    // const id = localStorage.getItem('user._id')

    const res = await axios.patch(`${BASE_URL}/update/${id}`,
        {
            title, content
        },
        {
            headers: {
                Authorization: `${token}`
            }
        }
    )

    return res.data;
}

// get a single note by ID
export const getNoteById = async (id) => {
    const token = localStorage.getItem('token')

    const note = await axios.get(`${BASE_URL}/${id}`, {
        headers: {
            Authorization: `${token}`
        }

    })
    return note.data
}

//delete a note by id
// export const delNote = async (id) => {
//     const token = localStorage.getItem('token')
//     const del = await axios.delete(`${BASE_URL}/delete/${id}`,
//         {
//             headers: {
//                 Authorization: `${token}`
//             }
//         }
//     )
// }

export const togglePin = async (id) =>{
    const token = localStorage.getItem('token')
    const res = await axios.put(`${BASE_URL}/pin/${id}`, {}, {
        headers:{
            Authorization: `${token}`
        }
    })
    return res.data
}

export const getTrashNotes = async () =>{
    const token = localStorage.getItem('token')
    const res = await axios.get(`${BASE_URL}/trash`, {
        headers:{
            Authorization: `${token}`
        }
    })
    return res.data
}

export const moveToTrash = async (id) =>{
    const token = localStorage.getItem('token')
    const res = await axios.delete(`${BASE_URL}/trash/${id}`, {
        headers:{
            Authorization: `${token}`
        }
    })
    // return res.data
}

export const restoreNotes = async (id) =>{
    const token = localStorage.getItem('token')
    const res = await axios.put(`${BASE_URL}/restore/${id}`, {}, {
        headers:{
            Authorization: `${token}`
        }
    })
    return res.data
}

export const permanentDelNote = async (id) =>{
    const token = localStorage.getItem('token')

    console.log("FE permanen del is" ,id);
    
    const res = await axios.delete(`${BASE_URL}/permanent/${id}`, {
        headers:{
            Authorization: `${token}`
        }
    })
    return res.data
}