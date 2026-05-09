import { useEffect, useState } from "react"
import Quill from "./Quill.jsx";
import { createNote, getNoteById, updateNote } from "../api/note.api.js"
import { useNavigate, useParams } from "react-router-dom"


export default function TextEditor() {

    const { id } = useParams();
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('Note title...')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const isEditMode = !!id

    useEffect(() => {
        if (isEditMode) {
            const fetchNote = async () => {
                try {
                    const note = await getNoteById(id)
                    setTitle(note.title)
                    setContent(note.content)
                } catch (error) {
                    console.log(error);
                }
            }
            fetchNote()
        }
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            if (isEditMode) {
                await updateNote(id, title, content)
            }
            else {
                await createNote(title, content)
            }

            console.log(data);
            navigate('/dashboard')



        } catch (error) {
            console.log(error.response?.data);

        }
        finally {
            setLoading(false)

        }
    }


    return (
        <div className="p-6">

            {/* title  */}
            <label >Title</label>
            <input type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />


            {/* editor  */}
            <Quill value={content} onChange={setContent} />


            <div className="my-4 flex items-center justify-center">
                <button onClick={handleSubmit}
                    disabled={loading} className="text-(--color-heading) py-2 px-4 rounded border-1">
                    {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create'}</button>
            </div>
        </div>

    )
}